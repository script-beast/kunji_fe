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
      <span className="size-4 shrink-0 rounded-full border-[1.5px] border-ink/40 peer-checked:border-accent peer-checked:bg-accent peer-checked:shadow-[inset_0_0_0_3px_var(--color-panel)] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-accent peer-focus-visible:outline-offset-2" />
      {label}
    </label>
  );
}
