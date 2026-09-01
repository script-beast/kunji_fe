interface ContactCardProps {
  name: string;
  role: string;
  phone: string;
  actionLabel: string;
}

export function ContactCard({ name, role, phone, actionLabel }: ContactCardProps) {
  return (
    <div className="flex items-center justify-between gap-2.5 border-b border-ink/40 py-3">
      <div>
        <div className="text-sm font-semibold">{name}</div>
        <div className="text-xs text-neutral-700">{role}</div>
        <div className="mt-0.5 text-[13px]">{phone}</div>
      </div>
      <a
        href="#"
        className="flex-none border border-ink/40 px-4 py-2.5 text-center font-heading text-sm font-extrabold no-underline text-ink hover:bg-ink/5"
      >
        {actionLabel}
      </a>
    </div>
  );
}
