import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { DateInput, Input } from "@/components/ui/input";
import { UploadField } from "@/components/checkin/upload-field";
import { DOC_TYPES } from "@/lib/constants";
import type { CoGuest } from "@/lib/types";
import { useState } from "react";
import { todayDateInputValue } from "@/lib/utils";

interface GuestCardProps {
  guest: CoGuest;
  index: number;
  onUpdate: (patch: Partial<CoGuest>) => void;
  onRemove: () => void;
  onSelectFile: (file: File) => void;
  onReplace: () => void;
}

export function GuestCard({
  guest,
  index,
  onUpdate,
  onRemove,
  onSelectFile,
  onReplace,
}: GuestCardProps) {
  const [documentTypeOpen, setDocumentTypeOpen] = useState(false);

  return (
    <div className="grid gap-3 border border-ink/40 bg-panel p-3.5 lg:grid-cols-2">
      <div className="flex items-baseline justify-between border-b-2 border-ink/40 pb-2 lg:col-span-2">
        <div className="text-[11px] tracking-widest uppercase text-ink/65">
          Guest {index + 2}
        </div>
        <Button variant="ghost" className="text-xs" onClick={onRemove}>
          Remove
        </Button>
      </div>

      <Field label="Full name" className="lg:col-span-2">
        <Input
          value={guest.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder="As printed on their ID"
        />
      </Field>

      <Field label="Date of birth" className="min-w-0">
        <DateInput
          max={todayDateInputValue()}
          value={guest.dob}
          onChange={(e) => onUpdate({ dob: e.target.value })}
        />
      </Field>

      <Field label="Document type" className="min-w-0">
        <div className="relative">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={documentTypeOpen}
            onClick={() => setDocumentTypeOpen((open) => !open)}
            className="flex min-h-9 w-full min-w-0 items-center justify-between border border-ink/40 bg-panel px-2.5 py-1.5 text-left text-sm hover:border-ink/60"
          >
            <span className="truncate">{guest.docType}</span>
            <span aria-hidden="true" className="ml-2 shrink-0 text-xs">⌄</span>
          </button>
          {documentTypeOpen && (
            <div
              role="listbox"
              aria-label="Document type"
              className="absolute inset-x-0 top-full z-20 mt-1 max-h-52 overflow-y-auto border border-ink/40 bg-paper shadow-lg"
            >
              {DOC_TYPES.map((documentType) => (
                <button
                  key={documentType}
                  type="button"
                  role="option"
                  aria-selected={guest.docType === documentType}
                  onClick={() => {
                    onUpdate({ docType: documentType });
                    setDocumentTypeOpen(false);
                  }}
                  className="block w-full truncate px-2.5 py-2 text-left text-sm hover:bg-ink/5"
                >
                  {documentType}
                </button>
              ))}
            </div>
          )}
        </div>
      </Field>

      <div className="lg:col-span-2">
        <UploadField
          label={`${guest.docType} photo`}
          upload={guest.upload}
          onSelectFile={onSelectFile}
          onReplace={onReplace}
        />
      </div>
      <p className="m-0 border-t-2 border-ink/40 pt-2 text-xs leading-normal lg:col-span-2">
        <strong>Kept for 3 months, then deleted.</strong> Used only for the register the host must
        keep by law.
      </p>
    </div>
  );
}
