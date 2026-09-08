import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { ARRIVAL_WINDOWS, HOST, PROPERTY } from "@/lib/constants";
import type { GuestBooking } from "@/lib/api";
import type { ArrivalWindow } from "@/lib/types";
import { formatTime, formatWeekdayDate } from "@/lib/utils";

interface StepStayProps {
  booking?: GuestBooking;
  arrival: ArrivalWindow;
  onArrivalChange: (value: ArrivalWindow) => void;
}

export function StepStay({ booking, arrival, onArrivalChange }: StepStayProps) {
  const hostFirstName = HOST.name.split(" ")[0];

  const checkInDay = formatWeekdayDate(booking?.checkInDate);
  const checkOutDay = formatWeekdayDate(booking?.checkOutDate);
  const checkInTime = formatTime(booking?.checkInDate);
  const checkOutTime = formatTime(booking?.checkOutDate);
  const guestCount = booking?.noOfGuests || 1;

  const rows: [string, string][] = [
    ["Flat", PROPERTY.name],
    [
      "Check in",
      checkInDay ? `${checkInDay}${checkInTime ? `, after ${checkInTime}` : ""}` : "Not set",
    ],
    [
      "Check out",
      checkOutDay ? `${checkOutDay}${checkOutTime ? `, by ${checkOutTime}` : ""}` : "Not set",
    ],
    ["Booked for", `${guestCount} guest${guestCount === 1 ? "" : "s"}`],
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
