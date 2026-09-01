import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { ARRIVAL_WINDOWS, BOOKING, HOST, PROPERTY } from "@/lib/constants";
import type { ArrivalWindow } from "@/lib/types";

interface StepStayProps {
  arrival: ArrivalWindow;
  onArrivalChange: (value: ArrivalWindow) => void;
}

export function StepStay({ arrival, onArrivalChange }: StepStayProps) {
  const hostFirstName = HOST.name.split(" ")[0];

  const rows: [string, string][] = [
    ["Flat", PROPERTY.name],
    ["Check in", `${BOOKING.checkInDate}, after ${BOOKING.checkInTime}`],
    ["Check out", `${BOOKING.checkOutDate}, by ${BOOKING.checkOutTime}`],
    ["Booked for", `${BOOKING.guestCount} guests`],
  ];

  return (
    <div className="px-4 pt-4.5 pb-6 sm:px-0 sm:py-0">
      <h3 className="mb-1.5 text-2xl sm:text-[28px] lg:text-[30px]">Your stay</h3>
      <p className="mb-4 max-w-[52ch] text-[13px] text-neutral-700 text-pretty sm:mb-5.5 sm:text-sm">
        Haryana Police require your host to keep a register of everyone staying. Two minutes,
        then you&apos;re done.
      </p>

      <div className="border-t-2 border-ink/40">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex justify-between gap-3 border-b border-ink/40 py-2.5 sm:py-3"
          >
            <span className="text-[11px] tracking-widest uppercase text-ink/65">{label}</span>
            <span className="text-right text-[13px] font-semibold sm:text-sm">{value}</span>
          </div>
        ))}
      </div>

      <Field
        label="What time do you expect to arrive?"
        htmlFor="arrival"
        className="mt-5 max-w-70 sm:mt-6"
      >
        <Select
          id="arrival"
          value={arrival}
          onChange={(e) => onArrivalChange(e.target.value as ArrivalWindow)}
        >
          {ARRIVAL_WINDOWS.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </Select>
      </Field>
      <p className="mt-2 text-xs text-neutral-700 sm:mt-2.5">
        Someone is at the gate until 10 pm. Later is fine — {hostFirstName} just needs to know.
      </p>
    </div>
  );
}
