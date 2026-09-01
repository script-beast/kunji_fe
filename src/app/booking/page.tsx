import type { Metadata } from "next";
import { BookingScreen } from "@/components/booking/booking-screen";
import { StatusShell } from "@/components/layout/status-shell";

export const metadata: Metadata = { title: "Your booking · Kunji" };

export default function BookingPage() {
  return (
    <main className="flex flex-1 flex-col">
      <StatusShell>
        <BookingScreen />
      </StatusShell>
    </main>
  );
}
