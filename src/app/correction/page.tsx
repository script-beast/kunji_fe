import type { Metadata } from "next";
import { CorrectionScreen } from "@/components/correction/correction-screen";
import { StatusShell } from "@/components/layout/status-shell";

export const metadata: Metadata = { title: "Correction requested · Kunji" };

export default function CorrectionPage() {
  return (
    <main className="flex flex-1 flex-col">
      <StatusShell>
        <CorrectionScreen />
      </StatusShell>
    </main>
  );
}
