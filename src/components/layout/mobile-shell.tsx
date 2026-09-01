import type { ReactNode } from "react";

interface MobileShellProps {
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

/**
 * The guest-facing page on narrow viewports â fills the browser window
 * itself rather than a device mock-up. Everything is designed for one
 * thumb: the primary action always sits in the footer, within easy reach.
 */
export function MobileShell({ header, footer, children }: MobileShellProps) {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-paper">
      {header}

      <div className="relative flex-1 [-webkit-overflow-scrolling:touch]">{children}</div>

      {footer ? (
        <div className="sticky bottom-0 flex flex-none items-center gap-2.5 border-t-2 border-ink/40 bg-paper px-4 pt-3 pb-4">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
