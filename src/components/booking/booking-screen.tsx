"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { IconCopy } from "@/components/ui/icons";
import { ContactCard } from "@/components/booking/contact-card";
import { ACCESS, CARETAKER, HOST, PROPERTY } from "@/lib/constants";
import type { GuestBooking, GuestRoom } from "@/lib/api";
import { formatShortDate } from "@/lib/utils";

interface BookingScreenProps {
  gateCode?: string;
  bookingReference?: string;
  booking?: GuestBooking;
  room?: GuestRoom;
}

export function BookingScreen({ gateCode, bookingReference, booking, room }: BookingScreenProps = {}) {
  const [copied, setCopied] = useState<"code" | "wifi" | null>(null);
  const hostName = room?.hostName || HOST.name;
  const hostPhone = room?.hostPhone || HOST.phone;
  const caretakerName = room?.caretakerName || CARETAKER.name;
  const caretakerPhone = room?.caretakerPhone || CARETAKER.phone;
  const whatsappPhone = hostPhone.replace(/\D/g, "");
  const wifiName = room?.wifiName || ACCESS.wifiName;
  const wifiPassword = room?.wifiPassword || ACCESS.wifiPassword;
  const hostFirstName = hostName.split(" ")[0];
  const doorCode = gateCode || ACCESS.doorCode;

  const copy = (which: "code" | "wifi", text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopied(which);
    setTimeout(() => setCopied((c) => (c === which ? null : c)), 2000);
  };

  const stayRows: [string, string][] = [
    ["Check in", formatShortDate(booking?.checkInDate) || "Not set"],
    ["Check out", formatShortDate(booking?.checkOutDate) || "Not set"],
    [
      "Guests",
      booking?.noOfGuests ? `${booking.noOfGuests} guests · register accepted` : "Register accepted",
    ],
    ["Flat", room?.address || room?.location || PROPERTY.flatLine],
  ];

  return (
    <div className="grid max-w-180 gap-4.5 px-4 pt-5 pb-6 sm:px-0 sm:py-0 sm:gap-6">
      <div>
        <div className="mb-2 flex items-baseline justify-between gap-2.5">
          <Tag variant="accent">Approved by {hostFirstName}</Tag>
          <span className="text-[11px] text-neutral-700">{bookingReference || ""}</span>
        </div>
        <h3 className="mb-1 text-[26px] sm:text-[32px]">Your booking</h3>
        <p className="m-0 text-[13px] text-neutral-700 sm:text-sm">
          {room?.name || PROPERTY.name} · {room?.location || PROPERTY.addressLine}
        </p>
      </div>

      <div className="grid gap-4.5 sm:grid-cols-2 sm:gap-6 sm:items-start">
        <div className="border-2 border-ink">
          <div className="px-4 pt-3.5 pb-4">
            <div className="mb-2 text-[11px] tracking-widest uppercase text-ink/65">
              Door code
            </div>
            <div className="font-heading text-[44px] font-extrabold leading-none tracking-[0.16em] sm:text-[52px]">
              {doorCode}
            </div>
            <p className="mt-2.5 text-[12.5px] text-pretty">
              Press the code on the keypad, then <strong>#</strong>. Live until check-out.
            </p>
          </div>
          <Button
            variant="primary"
            block
            className="m-0 min-h-12"
            onClick={() => copy("code", doorCode)}
          >
            <IconCopy />
            {copied === "code" ? "Copied to clipboard" : "Copy the code"}
          </Button>
        </div>

        <div>
          <div className="border-b-2 border-ink/40 pb-1.5 text-[11px] tracking-widest uppercase text-ink/65">
            Wi-Fi
          </div>
          <div className="flex justify-between gap-3 border-b border-ink/40 py-2.5">
            <span className="text-xs text-neutral-700">Network</span>
            <span className="text-[13px]">{wifiName}</span>
          </div>
          <div className="flex items-center justify-between gap-3 border-b border-ink/40 py-2.5">
            <span className="text-xs text-neutral-700">Password</span>
            <span className="flex items-center gap-2.5">
              <span className="text-sm tracking-wide">{wifiPassword}</span>
              <button
                type="button"
                onClick={() => copy("wifi", wifiPassword)}
                className="cursor-pointer border-0 bg-transparent p-0 font-heading text-xs font-extrabold text-accent hover:bg-accent/10"
              >
                {copied === "wifi" ? "Copied" : "Copy"}
              </button>
            </span>
          </div>
          <p className="mt-2 text-xs text-neutral-700">
            The 5 GHz network reaches the bedroom; the 2.4 GHz one is better on the balcony.
          </p>
        </div>
      </div>

      <div className="grid gap-4.5 sm:grid-cols-2 sm:gap-6 sm:items-start">
        <div>
          <div className="border-b-2 border-ink/40 pb-1.5 text-[11px] tracking-widest uppercase text-ink/65">
            Your stay
          </div>
          {stayRows.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-3 border-b border-ink/40 py-2.5">
              <span className="text-xs text-neutral-700">{label}</span>
              <span className="text-right text-[13px]">{value}</span>
            </div>
          ))}
        </div>

        <div>
          <div className="border-b-2 border-ink/40 pb-1.5 text-[11px] tracking-widest uppercase text-ink/65">
            Who to call
          </div>
          <ContactCard
            name={hostName}
            role="Host · replies fastest on WhatsApp"
            phone={hostPhone}
            actionLabel="WhatsApp"
            actionHref={`https://wa.me/${whatsappPhone}`}
          />
          <ContactCard
            name={caretakerName}
            role={CARETAKER.role}
            phone={caretakerPhone}
            actionLabel="Call"
            actionHref={`tel:${caretakerPhone.replace(/[^\d+]/g, "")}`}
          />
          <p className="mt-2.5 text-[12.5px] text-pretty">
            Gate security will not let anyone up without the flat number. Say{" "}
            <strong>{room?.address || room?.location || PROPERTY.flatLine}, guest of {hostName}</strong>.
          </p>
        </div>
      </div>

      <p className="m-0 border-t-2 border-ink/40 pt-2.5 text-xs text-neutral-700">
        Your ID copies are deleted 3 months after check-out. Nothing else on this page is
        stored on your device.
      </p>
    </div>
  );
}
