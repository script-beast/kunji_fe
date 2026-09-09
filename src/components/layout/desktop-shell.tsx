import type { ReactNode } from "react";
import { PROPERTY } from "@/lib/constants";
import type { GuestRoom } from "@/lib/api";

interface DesktopShellProps {
  stepCounter: string;
  rail: ReactNode;
  aside?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  room?: GuestRoom;
}

/**
 * Tablet/desktop chrome for the check-in flow: a fixed-width step rail, a
 * capped-width form column, and (at lg+) a persistent context aside. Fills
 * the browser window edge to edge â no device mock-up, no floating card.
 */
export function DesktopShell({ stepCounter, rail, aside, footer, children, room }: DesktopShellProps) {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-paper">
      <div className="flex items-baseline gap-4 border-b-2 border-ink/40 px-6 py-3.5 lg:px-9">
        <div className="font-heading text-[17px] font-extrabold tracking-widest">KUNJI</div>
        <div className="text-[13px] text-neutral-700">{room?.name || PROPERTY.name} · 4–7 Sep</div>
        <div className="ml-auto text-[11px] tracking-widest uppercase text-ink/65">
          {stepCounter}
        </div>
      </div>

      <div className="grid flex-1 grid-cols-[180px_minmax(0,1fr)] lg:grid-cols-[232px_minmax(0,1fr)_320px]">
        {rail}

        <main className="flex min-w-0 flex-col">
          <div className="w-full max-w-140 flex-1 px-6 pt-7 lg:px-9">{children}</div>
          {footer && (
            <div className="sticky bottom-0 mt-7 border-t-2 border-ink/40 bg-paper px-6 py-4 lg:px-9">
              <div className="flex w-full max-w-140 items-center gap-3">{footer}</div>
            </div>
          )}
        </main>

        {aside && <div className="hidden h-full lg:block">{aside}</div>}
      </div>
    </div>
  );
}
