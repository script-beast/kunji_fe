import { HOST, PROPERTY } from "@/lib/constants";

interface BookingAsideProps {
  dates?: string;
  guests?: number;
}

/** Persistent context panel shown alongside the form on wide screens only. */
export function BookingAside({ dates, guests }: BookingAsideProps = {}) {
  const hostFirstName = HOST.name.split(" ")[0];

  const facts: [string, string][] = [
    ["Flat", PROPERTY.name],
    ["Dates", dates || "Not set"],
    ["Guests", guests ? `${guests} guests` : "Not set"],
    ["Host", HOST.name],
  ];

  return (
    <aside className="h-full border-l-2 border-ink/40 px-6 pt-6">
      <div className="border-b-2 border-ink/40 pb-2 text-[11px] tracking-widest uppercase text-ink/65">
        This booking
      </div>
      {facts.map(([label, value]) => (
        <div key={label} className="flex justify-between gap-2.5 border-b border-ink/40 py-2.5">
          <span className="text-xs text-neutral-700">{label}</span>
          <span className="text-right text-[13px]">{value}</span>
        </div>
      ))}

      <div className="mt-6 border-b-2 border-ink/40 pb-2 text-[11px] tracking-widest uppercase text-ink/65">
        Why we ask
      </div>
      <p className="mt-2.5 text-[12.5px] leading-relaxed text-pretty">
        Section 8 of the Haryana guest-house rules requires the host to keep a register of every
        person staying, with one photo ID each.
      </p>
      <p className="mt-2.5 text-[12.5px] leading-relaxed">
        IDs are kept 3 months from check-out, then deleted. Nothing is shared with anyone else.
      </p>

      <div className="mt-6 border-b-2 border-ink/40 pb-2 text-[11px] tracking-widest uppercase text-ink/65">
        Stuck?
      </div>
      <p className="mt-2.5 text-[12.5px]">
        Message {hostFirstName} on WhatsApp at {HOST.phone}. She answers within the hour.
      </p>
    </aside>
  );
}
