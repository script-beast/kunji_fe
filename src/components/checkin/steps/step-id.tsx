import { Field } from "@/components/ui/field";
import { DateInput } from "@/components/ui/input";
import { RadioOption } from "@/components/ui/radio-option";
// import { IconLock, IconShield } from "@/components/ui/icons";
import { UploadField } from "@/components/checkin/upload-field";
import { DOC_TYPES } from "@/lib/constants";
import type { DocType, PrimaryGuest } from "@/lib/types";
// Form C (foreign nationals) is disabled on the frontend for now — see the
// commented-out blocks below. Re-add these imports if it's turned back on:
// import { Textarea } from "@/components/ui/input";
// import { Select } from "@/components/ui/select";
// import { PORTS_OF_ENTRY, VISA_TYPES } from "@/lib/constants";
// import type { VisaType } from "@/lib/types";

interface StepIdProps {
  primary: PrimaryGuest;
  onUpdate: (patch: Partial<PrimaryGuest>) => void;
  /** True when the host flagged this booking as a foreign guest. */
  isForeigner: boolean;
  // isAadhaar: boolean;
  effectiveDocType: DocType;
  onSelectFile: (file: File) => void;
  onReplace: () => void;
  onSelectVisaFile: (file: File) => void;
  onReplaceVisa: () => void;
}

export function StepId({
  primary,
  onUpdate,
  isForeigner,
  // isAadhaar,
  effectiveDocType,
  onSelectFile,
  onReplace,
  onSelectVisaFile,
  onReplaceVisa,
}: StepIdProps) {
  const departureBeforeArrival =
    Boolean(primary.arrivalDate) &&
    Boolean(primary.departureDate) &&
    primary.departureDate < primary.arrivalDate;

  return (
    <div className="grid gap-4 px-4 pt-4.5 pb-6 sm:px-0 sm:py-0">
      <div>
        <h3 className="mb-1.5 text-2xl sm:text-[28px] lg:text-[30px]">
          Your ID
        </h3>
        <p className="m-0 text-[13px] text-neutral-700 sm:text-sm">
          One government ID per guest. Yours first.
        </p>
      </div>

      {/* Form C (foreign nationals) — disabled on the frontend for now.
      {isForeign && (
        <div className="border-l-2 border-accent bg-accent-100 px-3.5 py-3">
          <div className="mb-1 text-[11px] tracking-widest uppercase text-accent-700">
            Form C · foreign nationals
          </div>
          <p className="m-0 text-sm text-pretty">
            You&apos;ve told us your passport is from {primary.nationality}, so {hostFirstName}{" "}
            has to file a Form C with the Bureau of Immigration within 24 hours of your arrival.
            The five extra fields below are exactly what that form asks for — nothing more.
          </p>
        </div>
      )}
      */}

      <div>
        <div className="mb-2 text-[11px] tracking-widest uppercase text-ink/65">
          Document type
        </div>
        {
          <div
            role="radiogroup"
            aria-label="Document type"
            className="grid gap-0.5 lg:grid-cols-2 lg:gap-1.5"
          >
            {DOC_TYPES.map((d) => (
              <RadioOption
                key={d}
                name="doc-type"
                label={d}
                checked={primary.docType === d}
                onSelect={() => onUpdate({ docType: d })}
              />
            ))}
          </div>
        }
      </div>

      <UploadField
        label={`Photo of your ${effectiveDocType.toLowerCase()} — required`}
        upload={primary.upload}
        onSelectFile={onSelectFile}
        onReplace={onReplace}
      />
      <p className="m-0 flex gap-2 border-t-2 border-ink/40 pt-2.5 text-xs leading-normal">
        <strong className="whitespace-nowrap">
          Kept for 3 months, then deleted.
        </strong>
        {/* <span>
          Used only for the guest register {hostFirstName} must keep by law, and
          shown to the police only if they ask. Never sent to anyone else, never
          used for marketing.
        </span> */}
      </p>

      {isForeigner && (
        <div className="grid gap-3.5 border-t-2 border-ink/40 pt-4 sm:gap-4">
          <div className="text-[11px] tracking-widest uppercase text-ink/65">
            Foreign guest details
          </div>
          <UploadField
            label="Photo of your visa — required"
            badge="VISA"
            upload={primary.visaUpload}
            onSelectFile={onSelectVisaFile}
            onReplace={onReplaceVisa}
          />
          <div className="grid gap-3.5 sm:gap-4 lg:grid-cols-2">
            <Field label="Arrival date in India" htmlFor="arrivalDate">
              <DateInput
                id="arrivalDate"
                value={primary.arrivalDate}
                onChange={(e) => onUpdate({ arrivalDate: e.target.value })}
              />
            </Field>
            <Field
              label="Departure date from India"
              htmlFor="departureDate"
              hint={
                departureBeforeArrival
                  ? "Departure can't be before your arrival date."
                  : undefined
              }
            >
              <DateInput
                id="departureDate"
                min={primary.arrivalDate || undefined}
                value={primary.departureDate}
                onChange={(e) => onUpdate({ departureDate: e.target.value })}
              />
            </Field>
          </div>
        </div>
      )}

      {/* Older Form C block (visa number / type / port of entry / home address) — still disabled.
      {false && (
        <div className="grid gap-3.5 border-t-2 border-ink/40 pt-4 sm:gap-4">
          <div className="text-[11px] tracking-widest uppercase text-ink/65">
            From your visa
          </div>
          <div className="grid gap-3.5 sm:grid-cols-1 sm:gap-4 lg:grid-cols-2">
            <Field label="Visa number" htmlFor="visaNumber">
              <Input
                id="visaNumber"
                value={primary.visaNumber}
                onChange={(e) => onUpdate({ visaNumber: e.target.value })}
                placeholder="As printed on the visa sticker"
              />
            </Field>
            <Field label="Visa type" htmlFor="visaType">
              <Select
                id="visaType"
                value={primary.visaType}
                onChange={(e) => onUpdate({ visaType: e.target.value as VisaType })}
              >
                {VISA_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Date you arrived in India" htmlFor="arrivedOn">
              <Input
                id="arrivedOn"
                type="date"
                value={primary.arrivedOn}
                onChange={(e) => onUpdate({ arrivedOn: e.target.value })}
              />
            </Field>
            <Field label="Port of entry" htmlFor="portOfEntry">
              <Select
                id="portOfEntry"
                value={primary.portOfEntry}
                onChange={(e) => onUpdate({ portOfEntry: e.target.value })}
              >
                {PORTS_OF_ENTRY.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Address in your home country" htmlFor="homeAddress" className="lg:col-span-2">
              <Textarea
                id="homeAddress"
                rows={3}
                value={primary.homeAddress}
                onChange={(e) => onUpdate({ homeAddress: e.target.value })}
                placeholder="Street, city, postcode, country"
              />
            </Field>
          </div>
        </div>
      )}
      */}
    </div>
  );
}
