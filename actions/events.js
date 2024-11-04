"use server";
import { eventSchema } from "@/app/lib/validators";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { addDays, format, startOfDay } from "date-fns";

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

export async function getUserEvents() {
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

export async function deleteEvent(eventId) {
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

  const event = await db.event.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!event || event.userId !== user.id) {
    throw new Error("Event not found or unauthorized");
  }

  await db.event.delete({
    where: { id: eventId },
  });

  return { success: true };
}

export async function getEventDetails(username, eventId) {
  const event = await db.event.findFirst({
    where: {
      id: eventId,
      user: {
        username: username,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          imageUrl: true,
          username: true,
        },
      },
    },
  });

  return event;
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


function generateAvailableTimeSlots () {
  
}