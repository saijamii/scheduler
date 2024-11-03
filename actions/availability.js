"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getUserAvailability() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
        availabilty: {
        include: { days: true },
      },
    },
  });

  if (!user || !user.availability) {
    return null;
  }

  const availabilityData = {
    timeGap: user.availability.timeGap,
  };

  [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ].forEach((day) => {
    const dayAvaliability = user.availability.days.find(
      (d) => d.day === day.toUpperCase()
    );

    availabilityData[day] = {
      isAvailable: !!dayAvaliability,
      startTime: dayAvaliability
        ? dayAvaliability.startTime.toISOString().slice(11, 16)
        : "09:00",
      endTime: dayAvaliability
        ? dayAvaliability.endTime.toISOString().slice(11, 16)
        : "17:00",
    };
  });

  return availabilityData;
}

export async function updateAvailability(data) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      availabilty: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const availabilityData = Object.entries(data).flatMap(
    ([day, { isAvailable, startTime, endTime }]) => {
      if (isAvailable) {
        const baseDate = new Date().toISOString().split("T")[0];
        return [
          {
            day: day.toUpperCase(),
            startTime: new Date(`${baseDate}T${startTime}:00Z`),
            endTime: new Date(`${baseDate}T${endTime}:00Z`),
          },
        ];
      }
      return [];
    }
  );

  if (user.availability) {
    await db.availability.update({
      where: { id: user.availability.id },
      data: {
        timeGap: data.timeGap,
        days: {
          deleteMany: {},
          create: availabilityData,
        },
      },
    });
  } else {
    await db.availability.create({
      data: {
        userId: user.id,
        timeGap: data.timeGap,
        days: {
          create: availabilityData,
        },
      },
    });
  }

  return { success: true };
}
