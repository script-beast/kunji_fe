import { cn } from "@/lib/utils";

export type RailStepTone = "done" | "current" | "upcoming";

export interface RailStep {
  name: string;
  tone: RailStepTone;
  locked: boolean;
  onGo: () => void;
}

const TONE_COLOR: Record<RailStepTone, string> = {
  done: "bg-accent",
  current: "bg-ink",
  upcoming: "bg-neutral-400",
};

const TONE_STATE: Record<RailStepTone, string> = {
  done: "Done",
  current: "You're here",
  upcoming: "Not started",
};

/**
 * Desktop/tablet left-hand step navigation. Mirrors the key-tooth motif from
 * the mobile progress bar â a small three-bar mark instead of one long strip.
 */
export function StepRail({ steps }: { steps: RailStep[] }) {
  return (
    <nav aria-label="Check-in steps" className="h-full border-r-2 border-ink/40 py-5">
      <div className="px-4.5 pb-3 text-[11px] tracking-widest uppercase text-ink/65 lg:px-5">
        Five steps · about 3 minutes
      </div>
      {steps.map((step, i) => {
        const tone = TONE_COLOR[step.tone];
        return (
          <button
            key={step.name}
            type="button"
            disabled={step.locked}
            onClick={step.onGo}
            className={cn(
              "flex w-full items-start gap-3 border-0 border-l-4 px-4.5 py-3 text-left font-sans disabled:cursor-not-allowed lg:px-5",
              step.tone === "current" ? "bg-panel border-l-accent" : "border-l-transparent",
              !step.locked && "cursor-pointer hover:bg-ink/5"
            )}
          >
            <span className="mt-0.5 flex h-4.5 w-5.5 flex-none items-end gap-0.5">
              <span className={cn("w-1.5", tone)} style={{ height: step.tone === "upcoming" ? 5 : 8 }} />
              <span className={cn("w-1.5", tone)} style={{ height: step.tone === "upcoming" ? 5 : 14 }} />
              <span className={cn("w-1.5", tone)} style={{ height: step.tone === "upcoming" ? 5 : 11 }} />
            </span>
            <span className="min-w-0">
              <span
                className={cn(
                  "block text-sm font-semibold",
                  step.tone === "upcoming" ? "text-neutral-700" : "text-ink"
                )}
              >
                {i + 1}. {step.name}
              </span>
              <span className="block text-[11.5px] text-neutral-700">{TONE_STATE[step.tone]}</span>
            </span>
          </button>
        );
      })}
      <div className="mx-4.5 mt-4 border-t-2 border-ink/40 pt-3 lg:mx-5">
        <p className="m-0 text-xs text-neutral-700">
          Your answers save as you go. Close the tab and the link picks up where you left it.
        </p>
      </div>
    </nav>
  );
}
