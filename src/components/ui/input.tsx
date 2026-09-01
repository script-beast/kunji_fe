import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const FIELD_CLASSES =
  "w-full min-h-9 px-2.5 py-1.5 font-sans text-sm text-ink caret-accent bg-panel " +
  "border border-ink/40 hover:border-ink/60 focus-visible:border-accent focus-visible:outline-none";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(FIELD_CLASSES, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(FIELD_CLASSES, "min-h-[70px] resize-y", className)}
      {...props}
    />
  );
}
