import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { UploadField } from "@/components/checkin/upload-field";
import { DOC_TYPES } from "@/lib/constants";
import type { CoGuest } from "@/lib/types";

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

  return (
    <div className="grid gap-3 border border-ink/40 bg-panel p-3.5">
      <div className="flex items-baseline justify-between border-b-2 border-ink/40 pb-2">
        <div className="text-[11px] tracking-widest uppercase text-ink/65">
          Guest {index + 2}
        </div>
        <Button variant="ghost" className="text-xs" onClick={onRemove}>
          Remove
        </Button>
      </div>

      <Field label="Full name">
        <Input
          value={guest.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder="As printed on their ID"
        />
      </Field>

      <Field label="Date of birth">
        <Input type="date" value={guest.dob} onChange={(e) => onUpdate({ dob: e.target.value })} />
      </Field>

      <Field label="Document type">
        <Select
          value={guest.docType}
          onChange={(e) => onUpdate({ docType: e.target.value as CoGuest["docType"] })}
        >
          {DOC_TYPES.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </Select>
      </Field>

      <UploadField
        label={`${guest.docType} photo`}
        upload={guest.upload}
        onSelectFile={onSelectFile}
        onReplace={onReplace}
      />
      <p className="m-0 border-t-2 border-ink/40 pt-2 text-xs leading-normal">
        <strong>Kept 12 months, then deleted.</strong> Used only for the register the host must
        keep by law.
      </p>
    </div>
  );
}
