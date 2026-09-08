type ClassValue = string | false | null | undefined;

/** Joins truthy class names with a space. No merging/dedupe â keep call sites conflict-free. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}

/** Masks all but the last 3 digits of a phone number, e.g. "98765 43210" -> "98•••• ••210". */
export function maskPhone(phone: string): string {
  const digits = phone.replace(/\s/g, "");
  if (digits.length <= 3) return phone;
  const visible = digits.slice(0, 2);
  const last = digits.slice(-3);
  return `${visible}••• ••${last}`;
}

/** Formats an ISO date string as e.g. "4 Sep". Returns undefined for missing/invalid input. */
export function formatShortDate(value?: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

/** Formats a check-in/check-out date range as e.g. "4 – 7 Sep". */
export function formatDateRange(checkIn?: string, checkOut?: string): string | undefined {
  const from = formatShortDate(checkIn);
  const to = formatShortDate(checkOut);
  if (from && to) return `${from} – ${to}`;
  return from || to;
}

/** Formats an ISO date string as e.g. "Fri 4 Sep". Returns undefined for missing/invalid input. */
export function formatWeekdayDate(value?: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

/** Formats the time portion of an ISO date string as e.g. "2:00 pm". Returns undefined for missing/invalid input. */
export function formatTime(value?: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit" }).toLowerCase();
}
