import { Button } from "@/components/ui/button";
import { IconPlus } from "@/components/ui/icons";
import { GuestCard } from "@/components/checkin/guest-card";
import type { CoGuest } from "@/lib/types";

interface StepOthersProps {
  guests: CoGuest[];
  maxGuests: number;
  enteredCount: number;
  shortBy: number;
  guestUploadsMissing: number;
  incompleteGuests: number;
  extraGuestCount: number;
  canAddGuest: boolean;
  onAddGuest: () => void;
  onUpdateGuest: (id: string, patch: Partial<CoGuest>) => void;
  onRemoveGuest: (id: string) => void;
  onSelectGuestFile: (id: string, file: File) => void;
  onReplaceGuest: (id: string) => void;
}

export function StepOthers({
  guests,
  maxGuests,
  enteredCount,
  shortBy,
  guestUploadsMissing,
  incompleteGuests,
  extraGuestCount,
  canAddGuest,
  onAddGuest,
  onUpdateGuest,
  onRemoveGuest,
  onSelectGuestFile,
  onReplaceGuest,
}: StepOthersProps) {
  const countHeadline =
    shortBy === 0
      ? `${enteredCount} guest${enteredCount === 1 ? "" : "s"} on the register`
      : `${enteredCount} of ${maxGuests} mandatory guests added`;

  const countHint =
    shortBy === 0
      ? incompleteGuests > 0
        ? `${incompleteGuests} guest${incompleteGuests === 1 ? "" : "s"} still need${incompleteGuests === 1 ? "s" : ""} a name, date of birth, or ID photo.`
        : extraGuestCount > 0
          ? `${extraGuestCount} additional guest${extraGuestCount === 1 ? "" : "s"} added. You can still edit anyone before you submit.`
          : "All mandatory guests are complete. You can still add or edit guests before you submit."
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
              {maxGuests} guests booked
            </div>
          </div>
          <div className="mt-2 text-[12.5px] text-neutral-800 sm:mt-2.5 sm:text-[13px]">
            {countHint}
          </div>
        </div>
        <div className="flex h-3 flex-1 gap-[3px] bg-neutral-300 sm:w-45 sm:flex-none">
          <div
            className="h-3 bg-green-600 transition-[width]"
            style={{ width: `${Math.min(100, (enteredCount / maxGuests) * 100)}%` }}
          />
          {extraGuestCount > 0 && <div className="h-3 min-w-1 flex-1 bg-red-500" />}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-1 lg:items-start">
        {guests.map((guest, index) => (
          <GuestCard
            key={guest.id}
            guest={guest}
            index={index}
            onUpdate={(patch) => onUpdateGuest(guest.id, patch)}
            onRemove={() => onRemoveGuest(guest.id)}
            onSelectFile={(file) => onSelectGuestFile(guest.id, file)}
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
