"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckinWizard } from "@/components/checkin/checkin-wizard";
import { BookingScreen } from "@/components/booking/booking-screen";
import { SubmittedScreen } from "@/components/checkin/screens/submitted-screen";
import { ExpiredScreen } from "@/components/expired/expired-screen";
import { StatusShell } from "@/components/layout/status-shell";
import { getBookingByToken, getErrorMessage } from "@/lib/api";
import type { GuestFormResponse } from "@/lib/api";

export default function GuestFormPage() {
  const params = useParams<{ token: string }>();
  const formToken = params.token;

  const [data, setData] = useState<GuestFormResponse | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(undefined);
      try {
        const response = await getBookingByToken(formToken);
        if (!cancelled) setData(response);
      } catch (requestError) {
        if (!cancelled) setError(getErrorMessage(requestError, "This link is invalid."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [formToken]);

  if (loading) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-10 text-sm text-neutral-700">
        Loading your check-in form…
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="flex flex-1 flex-col">
        <StatusShell>
          <ExpiredScreen />
        </StatusShell>
      </main>
    );
  }

  if (data.viewState === "expired") {
    return (
      <main className="flex flex-1 flex-col">
        <StatusShell>
          <ExpiredScreen />
        </StatusShell>
      </main>
    );
  }

  if (data.viewState === "approved") {
    return (
      <main className="flex flex-1 flex-col">
        <StatusShell>
          <BookingScreen
            gateCode={data.gateCode}
            bookingReference={data.booking?.bookingMyId}
            booking={data.booking}
          />
        </StatusShell>
      </main>
    );
  }

  if (data.viewState === "pending_review") {
    return (
      <main className="flex flex-1 flex-col">
        <StatusShell>
          <SubmittedScreen reference={data.booking?.bookingMyId} />
        </StatusShell>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col">
      <CheckinWizard
        formToken={formToken}
        booking={data.booking}
        objectionReason={data.objectionReason}
      />
    </main>
  );
}
