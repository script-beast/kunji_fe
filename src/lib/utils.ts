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
