import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FieldProps {
  label: string;
  htmlFor?: string;
  children: ReactNode;
  hint?: string;
  className?: string;
}

export function Field({ label, htmlFor, children, hint, className }: FieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-xs text-ink/70"
      >
        {label}
      </label>
      {children}
      {hint ? <p className="mt-1.5 text-xs text-ink/70">{hint}</p> : null}
    </div>
  );
}

export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("text-[11px] tracking-widest uppercase text-ink/65", className)}>
      {children}
    </div>
  );
}
