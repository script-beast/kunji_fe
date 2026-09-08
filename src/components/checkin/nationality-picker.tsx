"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconArrowLeft } from "@/components/ui/icons";
import { COUNTRIES } from "@/lib/constants";

interface NationalityPickerProps {
  onPick: (country: string) => void;
  onClose: () => void;
  className?: string;
}

export function NationalityPicker({ onPick, onClose, className }: NationalityPickerProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(
    () =>
      COUNTRIES.filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase())),
    [query]
  );

  return (
    <div className={`absolute inset-0 flex flex-col bg-paper ${className || ""}`}>
      <div className="flex flex-none items-center gap-2.5 border-b-2 border-ink/40 px-4 py-3">
        <Button variant="ghost" className="p-1" onClick={onClose} aria-label="Back">
          <IconArrowLeft width={18} height={18} />
        </Button>
        <Input
          autoFocus
          aria-label="Search nationality"
          placeholder="Search nationality"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {results.map((country) => (
          <button
            key={country.name}
            type="button"
            onClick={() => onPick(country.name)}
            className="flex w-full items-center justify-between border-b border-ink/40 px-4 py-3.5 text-left text-sm cursor-pointer hover:bg-ink/5"
          >
            <span>{country.name}</span>
            {country.extraChecks && (
              <span className="text-[11px] text-accent-700">Extra checks</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
