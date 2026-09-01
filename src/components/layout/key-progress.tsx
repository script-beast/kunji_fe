import { cn } from "@/lib/utils";

interface KeyProgressProps {
  /** Number of teeth completed (fully red, short). */
  completed: number;
  /** Index (0-based) of the tooth currently in progress (tall, ink). -1 if none. */
  current: number;
  total: number;
}

/**
 * The flow's signature progress indicator: five teeth of a key, cut left to
 * right. No numbered circles, no connecting line â it reads at a glance
 * one-handed, and "done" vs "here" vs "left" is legible from height alone.
 */
export function KeyProgress({ completed, current, total }: KeyProgressProps) {
  return (
    <div className="flex h-[26px] items-end gap-[3px]">
      {Array.from({ length: total }, (_, i) => {
        if (i < completed) {
          return <div key={i} className="h-3.5 flex-1 bg-accent" />;
        }
        if (i === current) {
          return (
            <div
              key={i}
              className="h-[26px] flex-1 bg-ink motion-safe:animate-[key-tooth_.25s_ease-out]"
            />
          );
        }
        return <div key={i} className="h-1.5 flex-1 bg-neutral-400" />;
      })}
    </div>
  );
}

export function StepLabelRow({
  label,
  detail,
  className,
}: {
  label: string;
  detail: string;
  className?: string;
}) {
  return (
    <div className={cn("mt-1.5 flex items-baseline justify-between", className)}>
      <div className="text-[11px] tracking-widest uppercase text-neutral-700">
        {label}
      </div>
      <div className="text-[11px] text-neutral-700">{detail}</div>
    </div>
  );
}
