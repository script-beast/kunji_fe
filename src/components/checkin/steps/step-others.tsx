import { Button } from "@/components/ui/button";
import { IconPlus } from "@/components/ui/icons";
import { GuestCard } from "@/components/checkin/guest-card";
import { BOOKING } from "@/lib/constants";
import type { CoGuest } from "@/lib/types";

interface StepOthersProps {
  guests: CoGuest[];
  maxGuests: number;
  enteredCount: number;
  shortBy: number;
  guestUploadsMissing: number;
  canAddGuest: boolean;
  onAddGuest: () => void;
  onUpdateGuest: (id: string, patch: Partial<CoGuest>) => void;
  onRemoveGuest: (id: string) => void;
  onCaptureGuest: (id: string) => void;
  onRetryGuest: (id: string) => void;
  onReplaceGuest: (id: string) => void;
}

export function StepOthers({
  guests,
  maxGuests,
  enteredCount,
  shortBy,
  guestUploadsMissing,
  canAddGuest,
  onAddGuest,
  onUpdateGuest,
  onRemoveGuest,
  onCaptureGuest,
  onRetryGuest,
  onReplaceGuest,
}: StepOthersProps) {
  const countHeadline =
    shortBy === 0
      ? `All ${maxGuests} guests on the register`
      : `${enteredCount} of ${maxGuests} guests added`;

  const countHint =
    shortBy === 0
      ? guestUploadsMissing > 0
        ? `Names match the booking. ${guestUploadsMissing} ID photo${guestUploadsMissing === 1 ? " is" : "s are"} still missing — every guest needs one.`
        : "Matches the booking. You can still edit anyone before you submit."
      : `${shortBy} more ${shortBy === 1 ? "person" : "people"} to add — you, plus ${maxGuests - 1} others. The register has to match the booking before it can go to the host.`;

  return (
    <div className="grid gap-4 px-4 pt-4.5 pb-6 sm:px-0 sm:py-0 sm:gap-5">
      <div>
        <h3 className="mb-1.5 text-2xl sm:text-[28px] lg:text-[30px]">Others staying with you</h3>
        <p className="m-0 text-[13px] text-neutral-700 sm:text-sm">
          Every adult and child sleeping at the flat goes on the register.
        </p>
      </div>

      <div className="flex flex-col gap-2.5 border-2 border-ink px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:px-4 sm:py-3.5">
        <div className="sm:flex-1">
          <div className="flex items-baseline justify-between sm:block">
            <div className="font-heading text-[15px] font-extrabold sm:text-base">
              {countHeadline}
            </div>
            <div className="text-xs text-neutral-700 sm:mt-1">
              {BOOKING.guestCount} guests booked
            </div>
          </div>
          <div className="mt-2 text-[12.5px] text-neutral-800 sm:mt-2.5 sm:text-[13px]">
            {countHint}
          </div>
        </div>
        <div className="flex gap-[3px] sm:w-45 sm:flex-none">
          {Array.from({ length: maxGuests }, (_, i) => (
            <div
              key={i}
              className={`h-2.5 flex-1 sm:h-3 ${i < enteredCount ? "bg-accent" : "bg-neutral-400"}`}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        {guests.map((guest, index) => (
          <GuestCard
            key={guest.id}
            guest={guest}
            index={index}
            onUpdate={(patch) => onUpdateGuest(guest.id, patch)}
            onRemove={() => onRemoveGuest(guest.id)}
            onCapture={() => onCaptureGuest(guest.id)}
            onRetry={() => onRetryGuest(guest.id)}
            onReplace={() => onReplaceGuest(guest.id)}
          />
        ))}

        {canAddGuest && (
          <Button
            variant="secondary"
            block
            className="mt-0 min-h-12 lg:min-h-30 lg:items-center lg:justify-center lg:border-dashed"
            onClick={onAddGuest}
          >
            <IconPlus />
            Add guest {guests.length + 2}
          </Button>
        )}
      </div>
    </div>
  );
}
