import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { HOST } from "@/lib/constants";
import type { ArrivalWindow, CoGuest, DocType, PrimaryGuest, WizardStep } from "@/lib/types";
import type { GuestBooking, GuestRoom } from "@/lib/api";
import { formatDateRange } from "@/lib/utils";

interface ReviewRow {
  k: string;
  v: string;
}

interface ReviewSection {
  title: string;
  rows: ReviewRow[];
  step: WizardStep;
  wide?: boolean;
}

interface StepReviewProps {
  arrival: ArrivalWindow;
  primary: PrimaryGuest;
  coGuests: CoGuest[];
  room?: GuestRoom;
  booking?: GuestBooking;
  // isForeign: boolean;
  // isAadhaar: boolean;
  effectiveDocType: DocType;
  consent: boolean;
  onConsentChange: (checked: boolean) => void;
  onEditStep: (step: WizardStep) => void;
}

export function StepReview({
  arrival,
  primary,
  coGuests,
  room,
  booking,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for when Form C is re-enabled
  // isForeign,
  // isAadhaar,
  effectiveDocType,
  consent,
  onConsentChange,
  onEditStep,
}: StepReviewProps) {
  const idRows: ReviewRow[] = [
    { k: "Type", v: effectiveDocType },
    // { k: "Number", v: primary.docNumber || "Not entered" },
    {
      k: "Photo",
      v:
        primary.upload.status === "done"
          ? "Attached"
          : "Not attached",
    },
  ];
  // Form C (foreign nationals) — disabled on the frontend for now.
  // if (isForeign) {
  //   idRows.push(
  //     { k: "Visa", v: `${primary.visaNumber || "Not entered"} · ${primary.visaType}` },
  //     { k: "Entered India", v: primary.arrivedOn || "Not entered" },
  //     { k: "Port", v: primary.portOfEntry }
  //   );
  // }

  const sections: ReviewSection[] = [
    {
      title: "Your stay",
      step: 1,
      rows: [
        { k: "Flat", v: room?.name || "Not set" },
        {
          k: "Dates",
          v: formatDateRange(booking?.checkInDate, booking?.checkOutDate) || "Not set",
        },
        { k: "Arriving", v: arrival },
      ],
    },
    {
      title: "About you",
      step: 2,
      rows: [
        { k: "Name", v: primary.fullName || "Not entered" },
        { k: "DOB", v: primary.dob || "Not entered" },
        { k: "Phone", v: primary.phone ? `${primary.countryCode} ${primary.phone}` : "Not entered" },
        { k: "Email", v: primary.email || "Not entered" },
        { k: "Nationality", v: primary.nationality },
      ],
    },
    { title: "Your ID", step: 3, rows: idRows },
    {
      title: "Others staying",
      step: 4,
      rows: [],
      wide: true,
    },
  ];

  return (
    <div className="grid gap-4.5 px-4 pt-4.5 pb-6 sm:px-0 sm:py-0 sm:gap-5.5">
      <div>
        <h3 className="mb-1.5 text-2xl sm:text-[28px] lg:text-[30px]">Review and confirm</h3>
        <p className="m-0 text-[13px] text-neutral-700 sm:text-sm">
          Check the spelling against your ID — a mismatch is the one thing that sends this back.
        </p>
      </div>

      <div className="grid gap-4.5 lg:grid-cols-2 lg:gap-6">
        {sections.map((section) => (
          <div key={section.title} className={section.wide ? "lg:col-span-2" : "h-full"}>
            <div className="flex items-baseline justify-between border-b-2 border-ink/40 pb-1.5">
              <div className="text-[11px] tracking-widest uppercase text-ink/65">
                {section.title}
              </div>
              <Button variant="ghost" className="text-xs" onClick={() => onEditStep(section.step)}>
                Edit
              </Button>
            </div>
            {section.wide ? (
              <div className="grid gap-4 pt-3 sm:grid-cols-2">
                {coGuests.map((guest, index) => (
                  <div key={guest.id} className="border border-ink/40 bg-panel">
                    <div className="border-b border-ink/40 px-3 py-2 text-xs font-semibold">
                      Guest {index + 2}
                    </div>
                    {[
                      { k: "Name", v: guest.name || "Not entered" },
                      { k: "DOB", v: guest.dob || "Not entered" },
                      { k: "Document", v: guest.docType },
                      { k: "Photo", v: guest.upload.status === "done" ? "Attached" : "Not attached" },
                    ].map((row) => (
                      <div key={row.k} className="flex justify-between gap-3 border-b border-ink/40 px-3 py-2 last:border-b-0">
                        <span className="text-xs text-neutral-700">{row.k}</span>
                        <span className="text-right text-[13px]">{row.v}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              section.rows.map((row, rowIndex) => (
                <div
                  key={`${section.title}-${rowIndex}`}
                  className="flex justify-between gap-3 border-b border-ink/40 py-2"
                >
                  <span className="text-xs text-neutral-700">{row.k}</span>
                  <span className="text-right text-[13px]">{row.v}</span>
                </div>
              ))
            )}
          </div>
        ))}
      </div>

      <div className="border-2 border-ink p-3.5 sm:p-4.5">
        <div className="mb-2.5 font-heading text-base font-extrabold sm:text-[17px]">
          Before you submit
        </div>
        <div className="grid gap-3">
          <InfoRow label="Collected">
            Names, dates of birth, ID type and number, one photo of each ID, your phone and
            email.
          </InfoRow>
          {/* <InfoRow label="Why">
            The guest register {HOST.name} must keep, and the Form C filing for foreign guests.
          </InfoRow> */}
          <InfoRow label="Kept">
            3 months from check-out, then deleted. ID photos are never shared with anyone else.
          </InfoRow>
          <InfoRow label="Contact">
            {HOST.name} on WhatsApp, or privacy@kunji.in to ask for deletion after 3 months.
          </InfoRow>
        </div>
        <div className="mt-3.5 border-t-2 border-ink/40 pt-3">
          <Checkbox checked={consent} onChange={onConsentChange}>
            I confirm these details are mine and correct, and I agree to them being kept for the
            guest register.
          </Checkbox>
        </div>
      </div>

      {!consent && (
        <p className="m-0 text-[12.5px] text-accent-700">
          Tick the box above to submit. We won&apos;t tick it for you.
        </p>
      )}
    </div>
  );
}

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex gap-2.5">
      <span className="w-18.5 flex-none text-[11px] tracking-widest uppercase text-ink/65">
        {label}
      </span>
      <span className="flex-1 text-[12.5px]">{children}</span>
    </div>
  );
}
