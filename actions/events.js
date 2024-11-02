"use server";
import { eventSchema } from "@/app/lib/validators";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function createEvent(data) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const validatedData = eventSchema.parse(data);

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const event = await db.event.create({
    data: {
      ...validatedData,
      userId: user.id,
    },
  });

  return event;
}

export async function getUserEvents(params) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const events = await db.event.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { bookings: true },
      },
    },
  });

  return { events, username: user.username };
}
