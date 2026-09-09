import { cn } from "@/lib/utils";

interface RadioOptionProps {
  name: string;
  label: string;
  checked: boolean;
  onSelect: () => void;
}

export function RadioOption({ name, label, checked, onSelect }: RadioOptionProps) {
  return (
    <label className="flex items-center gap-2.5 border border-ink/40 bg-panel px-3 py-2.5 text-sm cursor-pointer">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onSelect}
        className="sr-only peer"
      />
      <span
        className={cn(
          "size-4 shrink-0 rounded-full border-[1.5px] border-ink/40",
          checked &&
            "border-accent bg-accent shadow-[inset_0_0_0_3px_var(--color-panel)]",
        )}
      />
      {label}
    </label>
  );
}
