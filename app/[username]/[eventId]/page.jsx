import { notFound } from "next/navigation";
import { getEventDetails } from "@/actions/events";
import { Suspense } from "react";
import EventDetails from "./_components/evnt-details";
import BookingForm from "./_components/booking-form";

export async function generateMetadata({ params }) {
  const event = await getEventDetails(params?.username, params?.eventId);

  if (!event) {
    return {
      title: "Event Not Found",
    };
  }

  return {
    title: `Book ${event.title} with ${event.user.name} | Scheduler`,
    description: `Schedule a ${event.duration}-minute ${event.title} event with ${event.user.name}.`,
  };
}

export default async function EventPage({ params }) {
  const event = await getEventDetails(params?.username, params?.eventId);

  if (!event) {
    notFound();
  }

  return (
    <div className="flex flex-col justify-center lg:flex-row px-4 py-8">
      <EventDetails event={event} />
      <Suspense fallback={<div>Loading booking form</div>}>
        <BookingForm />
      </Suspense>
    </div>
  );
}
