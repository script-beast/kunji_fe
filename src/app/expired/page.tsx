import type { Metadata } from "next";
import { ExpiredScreen } from "@/components/expired/expired-screen";
import { StatusShell } from "@/components/layout/status-shell";

export const metadata: Metadata = { title: "Link closed · Kunji" };

export default function ExpiredPage() {
  return (
    <main className="flex flex-1 flex-col">
      <StatusShell>
        <ExpiredScreen />
      </StatusShell>
    </main>
  );
}
