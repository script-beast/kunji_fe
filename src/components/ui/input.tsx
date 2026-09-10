import { useRef } from "react";
import type { InputHTMLAttributes, MouseEvent, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { IconCalendar } from "@/components/ui/icons";

const FIELD_CLASSES =
  "w-full min-h-9 px-2.5 py-1.5 font-sans text-sm text-ink caret-accent bg-panel " +
  "border border-ink/40 hover:border-ink/60 focus-visible:border-accent focus-visible:outline-none";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(FIELD_CLASSES, className)} {...props} />;
}

export function DateInput({ className, onClick, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = (event: MouseEvent<HTMLElement>) => {
    if (event.currentTarget !== inputRef.current) event.preventDefault();
    onClick?.(event as MouseEvent<HTMLInputElement>);
    inputRef.current?.showPicker?.();
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="date"
        className={cn(FIELD_CLASSES, "date-input pr-10", className)}
        {...props}
        onClick={openPicker}
      />
      <button
        type="button"
        aria-label="Open calendar"
        onClick={openPicker}
        className="absolute right-1.5 top-1/2 grid size-7 -translate-y-1/2 place-items-center border-0 bg-transparent text-ink/60 hover:text-ink"
      >
        <IconCalendar aria-hidden="true" width={15} height={15} />
      </button>
    </div>
  );
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
