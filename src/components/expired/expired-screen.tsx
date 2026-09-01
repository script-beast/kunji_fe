import { IconClock } from "@/components/ui/icons";
import { BOOKING, HOST } from "@/lib/constants";

/** Shown once a 7-day check-in link has closed. */
export function ExpiredScreen() {
  const hostFirstName = HOST.name.split(" ")[0];

  return (
    <div className="grid max-w-125 gap-3.5 px-4 pt-5.5 pb-6 sm:px-0 sm:py-0">
      <div className="grid size-8.5 place-items-center bg-neutral-400 text-neutral-900">
        <IconClock width={18} height={18} />
      </div>
      <h3 className="m-0 text-2xl sm:text-[30px]">This link has closed</h3>
      <p className="m-0 text-[13.5px] text-pretty sm:text-[14.5px]">
        Check-in links stay open for 7 days. Nothing has gone wrong, and nothing you entered
        was lost — {hostFirstName} can send a fresh link on WhatsApp in a few seconds.
      </p>
      <div className="border-t-2 border-ink/40 pt-3 text-[12.5px] text-neutral-700">
        Reference {BOOKING.reference} · opened {BOOKING.linkOpenedOn}
      </div>
    </div>
  );
}
