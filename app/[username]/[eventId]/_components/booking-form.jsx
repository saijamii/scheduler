"use client";
import { bookingSchema } from "@/app/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { useForm } from "react-hook-form";
import "react-day-picker/style.css";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

const BookingForm = ({ userAvailability, event }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const availableDays = userAvailability.map((day) => new Date(day.date));
  const timeSlots = selectedDate
    ? userAvailability.find(
        (day) => day.date === format(selectedDate, "yyyy-MM-dd")
      )?.slots || []
    : [];

  console.log(timeSlots, "timeSlots");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingSchema),
  });
  return (
    <div>
      <div>
        <div>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              setSelectedTime(null);
            }}
            disabled={[{ before: new Date() }]}
            modifiers={{
              available: availableDays,
            }}
            modifiersStyles={{
              available: {
                background: "lightblue",
                borderRadius: 100,
              },
            }}
          />
        </div>
        <div>
          {selectedDate && (
            <div>
              <h3>Avaliable Time Slots</h3>
              {timeSlots.map((slot) => (
                <Button
                  key={slot}
                  variant={selectedTime === slot ? "default" : "outline"}
                  onClick={() => setSelectedTime(slot)}
                >
                  {slot}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default BookingForm;
