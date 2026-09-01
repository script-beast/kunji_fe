import type { ReactNode } from "react";
import { MobileShell } from "@/components/layout/mobile-shell";

/**
 * Chrome for a one-off status page (booking confirmation, correction
 * request, expired link) reached outside the guided step flow â a full
 * mobile page below sm, a centered readable column at sm and up.
 */
export function StatusShell({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="sm:hidden">
        <MobileShell>{children}</MobileShell>
      </div>
      <div className="hidden sm:flex sm:min-h-dvh sm:flex-col sm:items-center sm:justify-center sm:bg-paper">
        <div className="w-full max-w-3xl px-8 py-14 lg:px-0">{children}</div>
      </div>
    </>
  );
}
