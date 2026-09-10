import { Field } from "@/components/ui/field";
import { DateInput, Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { IconSearch } from "@/components/ui/icons";
import { COUNTRY_CODES } from "@/lib/constants";
import type { PrimaryGuest } from "@/lib/types";
import { todayDateInputValue } from "@/lib/utils";

interface StepAboutProps {
  primary: PrimaryGuest;
  onUpdate: (patch: Partial<PrimaryGuest>) => void;
  onOpenNationalityPicker: () => void;
}

export function StepAbout({ primary, onUpdate, onOpenNationalityPicker }: StepAboutProps) {
  return (
    <div className="grid gap-3.5 px-4 pt-4.5 pb-6 sm:gap-0 sm:px-0 sm:py-0">
      <div className="sm:mb-5.5">
        <h3 className="mb-1.5 text-2xl sm:text-[28px] lg:text-[30px]">About you</h3>
        <p className="m-0 text-[13px] text-neutral-700 sm:text-sm">
          As printed on the ID you&apos;ll upload next.
        </p>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-1 sm:gap-4 lg:grid-cols-2">
        <Field label="Full name" htmlFor="fullName" className="lg:col-span-2">
          <Input
            id="fullName"
            autoComplete="name"
            value={primary.fullName}
            onChange={(e) => onUpdate({ fullName: e.target.value })}
            placeholder="e.g. Ananya Krishnan"
          />
        </Field>

        <Field label="Date of birth" htmlFor="dob">
          <DateInput
            id="dob"
            max={todayDateInputValue()}
            value={primary.dob}
            onChange={(e) => onUpdate({ dob: e.target.value })}
          />
        </Field>

        <Field label="Phone number" htmlFor="phone">
          <div className="flex gap-1">
            <div className="w-20 flex-none">
              <Select
                className="w-full"
                aria-label="Country code"
                value={primary.countryCode}
                onChange={(e) => onUpdate({ countryCode: e.target.value })}
              >
                {COUNTRY_CODES.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </Select>
            </div>
            <Input
              id="phone"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              autoComplete="tel"
              value={primary.phone}
              onChange={(e) =>
                onUpdate({ phone: e.target.value.replace(/\D/g, "").slice(0, 10) })
              }
              placeholder="98765 43210"
            />
          </div>
        </Field>

        <Field label="Email" htmlFor="email">
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={primary.email}
            onChange={(e) => onUpdate({ email: e.target.value })}
            placeholder="you@example.com"
          />
        </Field>

        <Field
          label="Nationality"
          htmlFor="nationality"
        >
          <button
            type="button"
            id="nationality"
            onClick={onOpenNationalityPicker}
            className="flex min-h-9 w-full cursor-pointer items-center justify-between border border-ink/40 bg-panel px-2.5 py-1.5 text-left text-sm hover:border-ink/60"
          >
            <span>{primary.nationality}</span>
            <IconSearch width={14} height={14} />
          </button>
        </Field>
      </div>
    </div>
  );
}
