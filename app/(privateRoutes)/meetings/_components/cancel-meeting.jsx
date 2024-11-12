"use client";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/useFetch";

export default function CancelMeetingButton({ meetingId }) {
  const { loading, error, fn: fnCancelMeeting } = useFetch();

  const handleCancel = async () => {
    if (window.confirm("Are you sure you want to cancel this meeting?")) {
      await fnCancelMeeting(meetingId);
      router.refresh();
    }
  };

  return (
    <div>
      <Button variant="destructive" onClick={handleCancel}>
        {loading ? "Canceling..." : "Cancel Meeting"}
      </Button>
      {error && <span className="text-red-500 text-sm">{error.message}</span>}
    </div>
  );
}
