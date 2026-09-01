import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  block?: boolean;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-accent text-paper hover:bg-accent-600 active:bg-accent-700",
  secondary:
    "border border-ink/40 text-ink hover:bg-ink/5 active:bg-ink/10",
  ghost: "text-accent px-1 hover:bg-accent/10 active:bg-accent/15",
};

export function Button({
  variant = "primary",
  block = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-1.5 font-heading font-extrabold text-sm leading-none",
        "px-4 py-2.5 disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer",
        VARIANT_CLASSES[variant],
        block && "w-full justify-start",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
