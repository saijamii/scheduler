"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { addMinutes, format, isBefore, parseISO } from "date-fns";

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

export async function getEventAvailability(eventId) {
  const event = await db.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      user: {
        include: {
          availablity: {
            // availablity of that user
            select: {
              days: true,
              timeGap: true,
            },
          },
          bookings: {
            // exixting bookings for that user
            select: {
              startTime: true,
              endTime: true,
            },
          },
        },
      },
    },
  });

  // No Event or No user Avaliablity
  if (!event || !event.user.availablity) {
    return [];
  }

  const { availabilty, bookings } = event.user; // User With respect to the Event
  const startDate = startOfDay(new Date()); // Return the start of a day for the given date 12AM
  const endDate = addDays(startDate, 30); // Adds 30 days

  const availableDates = [];

  for (let date = startDate; date <= endDate; date = addDays(startDate, 1)) {
    const dayOfWeek = format(date, "").toUpperCase(); // converts into Day (MONDAY)
    const dayAvaliable = availabilty.days.find((d) => d.day === dayOfWeek);

    if (dayAvaliable) {
      const dateStr = format(date, "yyyy-MM-dd");
      const slots = generateAvailableTimeSlots(
        dayAvaliable.startTime,
        dayAvaliable.endTime,
        event.duration,
        bookings,
        dateStr,
        availabilty.timeGap
      );
    }

    availableDates.push({
      date: dateStr,
      slots,
    });
  }

  return availableDates;
}

function generateAvailableTimeSlots(
  startTime,
  endTime,
  duration,
  bookings,
  dateStr,
  timeGap = 0
) {
  const slots = [];

  let currentTime = parseISO(
    `${dateStr}T${startTime.toISOString().slice(11, 16)}`
  );
  const slotEndTime = parseISO(
    `${dateStr}T${endTime.toISOString().slice(11, 16)}`
  );

  const now = new Date();

  if (format(now, "yyyy-MM-dd") === dateStr) {
    // if today === dateString

    currentTime = isBefore(currentTime, now) // Is CurrentTime before Now
      ? addMinutes(now, timeGap) // Add the time Gap
      : currentTime;
  }

  while (currentTime < slotEndTime) {
    const meetingEndTime = new Date(currentTime.getTime() + duration * 60000);

    const isSlotAvailable = bookings.every(({ startTime, endTime }) => {
      // Check if there's no overlap with existing bookings
      const noOverlap = meetingEndTime <= startTime || currentTime >= endTime;
      return noOverlap;
    });

    if (isSlotAvailable) {
      slots.push(format(currentTime, "HH:mm"));
    }

    // Move to the next time slot (if you need to, otherwise break)
    currentTime = meetingEndTime;
  }

  return slots;
}
