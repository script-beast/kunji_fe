import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { BOOKING, HOST } from "@/lib/constants";
import { maskPhone } from "@/lib/utils";

export function SubmittedScreen() {
  const hostFirstName = HOST.name.split(" ")[0];

  const rows: [string, string][] = [
    ["Door code", `On WhatsApp to ${maskPhone("98765 43210")}`],
    ["Reference", BOOKING.reference],
    ["Submitted", BOOKING.submittedAt],
  ];

  return (
    <div className="grid max-w-140 gap-4 px-4 pt-5.5 pb-6 sm:px-0 sm:py-0">
      <Tag variant="accent" className="w-fit">
        With the host for review
      </Tag>
      <h3 className="m-0 text-[26px] sm:text-[32px]">Sent to {hostFirstName}</h3>
      <p className="m-0 text-[13.5px] text-pretty sm:text-[14.5px]">
        Three guests on the register, three IDs attached. {hostFirstName} usually reviews within
        2 hours, and always before 6 pm the day before check-in.
      </p>

      <div className="border-t-2 border-ink/40">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between border-b border-ink/40 py-2.5">
            <span className="text-[11px] tracking-widest uppercase text-ink/65">{label}</span>
            <span className="text-[13px] sm:text-sm">{value}</span>
          </div>
        ))}
      </div>

      <p className="m-0 text-[12.5px] text-neutral-700 sm:text-[13px]">
        Nothing left to do. Once {hostFirstName} accepts the register, this same link becomes
        Your booking — door code, Wi-Fi and who to call.
      </p>

      <Link href="/booking" className="sm:w-fit">
        <Button variant="secondary" block className="min-h-11.5">
          Preview Your booking
        </Button>
      </Link>
    </div>
  );
}
