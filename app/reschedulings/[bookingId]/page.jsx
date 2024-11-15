import { notFound } from "next/navigation";
import { getBookingDetails } from "@/actions/booking";
import { getEventAvailability } from "@/actions/availability";
import EventDetails from "@/app/[username]/[eventId]/_components/evnt-details";
import { Suspense } from "react";
import BookingForm from "@/app/[username]/[eventId]/_components/booking-form";

export async function generateMetadata({ params }) {
  const booking = await getBookingDetails(params?.bookingId);

  if (!booking) {
    return {
      title: "booking Not Found",
    };
  }
}

export default async function ReSchedulePage({ params }) {
  console.log(params?.bookingId, "params?.bookingId");
  const booking = await getBookingDetails(params?.bookingId);
  const userAvailability = await getEventAvailability(booking?.eventId);

  console.log(booking, "booking");
  if (!booking) {
    notFound();
  }

  return (
    <div className="flex flex-col justify-center lg:flex-row px-4 py-8">
      <EventDetails event={booking} reschedule />
      <Suspense fallback={<div>Loading booking form</div>}>
        <BookingForm
          reschedule
          event={booking}
          userAvailability={userAvailability}
        />
      </Suspense>
    </div>
  );
}
