import { Suspense } from "react";

export default function AvailabiltyLayout({ children }) {
  return (
    <div className="mx-auto">
      <Suspense fallback={<div>Loading availabilty...</div>}>{children}</Suspense>
    </div>
  );
}
