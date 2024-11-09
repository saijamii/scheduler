"use server";
import { db } from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { google } from "googleapis";

export async function createBooking(bookingData) {
  try {
    // Fetch the event and its creator
    const event = await db.event.findUnique({
      where: { id: bookingData.eventId },
      include: { user: true },
    });

    if (!event) {
      throw new Error("Event not found");
    }

    // Google Calender
    // Take token from clerk
    const userId = event.user.clerkUserId;
    const provider = "oauth_google";
    const response = await (
      await clerkClient()
    ).users.getUserOauthAccessToken(userId, provider);
    const token = response.data[0]?.token;

    if (!token) {
      throw new Error("Event creator has not connected Google Calendar");
    }

    // Set up Google OAuth client
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token }); // verfy with google

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // Create Google Meet link
    const meetResponse = await calendar.events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1,
      sendNotifications: true,
      sendUpdates: "all",
      requestBody: {
        summary: `${bookingData.name} - ${event.title}`,
        description: bookingData.additionalInfo,
        start: { dateTime: bookingData.startTime },
        end: { dateTime: bookingData.endTime },
        creator: {
          id: bookingData.eventId,
          email: bookingData.email,
          displayName: bookingData.name,
          self: true,
          sendNotifications: true,
        },
        organizer: {
          id: event.user.id,
          email: event.user.email,
          displayName: event.user.name,
          sendNotifications: true,
        },
        attendees: [
          {
            id: bookingData.eventId,
            email: bookingData.email,
          },
          { id: event.user.id, email: event.user.email },
        ],
        // reminders: {
        //   useDefault: true,
        //   overrides: [
        //     {
        //       method: "popup",
        //       minutes: 30,
        //     },
        //   ],
        // },
        conferenceData: {
          createRequest: { requestId: `${event.id}-${Date.now()}` },
        },
      },
    });

    const meetLink = meetResponse.data.hangoutLink;
    const googleEventId = meetResponse.data.id;

    // Create booking in database
    const booking = await db.booking.create({
      data: {
        eventId: event.id,
        userId: event.userId,
        name: bookingData.name,
        email: bookingData.email,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        additionalInfo: bookingData.additionalInfo,
        meetLink,
        googleEventId,
      },
    });
    return { success: true, booking, meetLink };
  } catch (error) {
    console.error("Error creating booking:", error);
    return { success: false, error: error.message };
  }
}
