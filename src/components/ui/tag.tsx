import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type TagVariant = "accent" | "neutral" | "solid" | "outline";

const VARIANT_CLASSES: Record<TagVariant, string> = {
  accent: "bg-accent-100 text-accent-800",
  neutral: "bg-neutral-100 text-neutral-800",
  solid: "bg-ink text-paper",
  outline: "border border-accent text-accent",
};

export function Tag({
  variant = "neutral",
  children,
  className,
}: {
  variant?: TagVariant;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 text-[11px] tracking-[0.02em] uppercase",
        VARIANT_CLASSES[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
