"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ARRIVAL_WINDOWS,
  COUNTRY_CODES,
  PORTS_OF_ENTRY,
  VISA_TYPES,
} from "@/lib/constants";
import type { ArrivalWindow, CoGuest, PrimaryGuest, Upload, WizardStep } from "@/lib/types";

const EMPTY_UPLOAD: Upload = { status: "empty", pct: 0 };

let guestSeq = 1;
function makeCoGuest(): CoGuest {
  guestSeq += 1;
  return {
    id: `guest-${guestSeq}`,
    name: "",
    dob: "",
    docType: "Passport",
    docNumber: "",
    upload: { ...EMPTY_UPLOAD },
  };
}

function makePrimaryGuest(): PrimaryGuest {
  return {
    fullName: "",
    dob: "",
    countryCode: COUNTRY_CODES[0],
    phone: "",
    email: "",
    nationality: "India",
    docType: "Passport",
    docNumber: "",
    upload: { ...EMPTY_UPLOAD },
    visaNumber: "",
    visaType: VISA_TYPES[0],
    arrivedOn: "",
    portOfEntry: PORTS_OF_ENTRY[0],
    homeAddress: "",
  };
}

/**
 * Drives the five-step guest check-in wizard: field state, the simulated ID
 * upload "network" (progress ticks, occasional drop at ~60% so the retry UI
 * is reachable), and the per-step validation that gates the footer button.
 */
export function useCheckinWizard(maxGuests: number) {
  const [step, setStep] = useState<WizardStep>(1);
  const [submitted, setSubmitted] = useState(false);
  const [arrival, setArrival] = useState<ArrivalWindow>(ARRIVAL_WINDOWS[2]);
  const [primary, setPrimary] = useState<PrimaryGuest>(makePrimaryGuest);
  const [natPickerOpen, setNatPickerOpen] = useState(false);
  const [coGuests, setCoGuests] = useState<CoGuest[]>(() => [makeCoGuest()]);
  const [consent, setConsent] = useState(false);

  const timers = useRef<Record<string, ReturnType<typeof setInterval>>>({});
  useEffect(() => {
    const active = timers.current;
    return () => {
      Object.values(active).forEach(clearInterval);
    };
  }, []);

  const runUpload = useCallback((key: string, apply: (upload: Upload) => void) => {
    clearInterval(timers.current[key]);
    let pct = 0;
    const willDrop = Math.random() < 0.12;
    apply({ status: "uploading", pct: 0 });
    timers.current[key] = setInterval(() => {
      pct += 14;
      if (willDrop && pct >= 60) {
        clearInterval(timers.current[key]);
        apply({ status: "failed", pct: 60 });
        return;
      }
      if (pct >= 100) {
        clearInterval(timers.current[key]);
        apply({ status: "done", pct: 100, fileName: "id-page.jpg" });
        return;
      }
      apply({ status: "uploading", pct });
    }, 260);
  }, []);

  const updatePrimary = useCallback((patch: Partial<PrimaryGuest>) => {
    setPrimary((prev) => ({ ...prev, ...patch }));
  }, []);

  const uploadPrimary = useCallback(() => {
    runUpload("primary", (upload) => setPrimary((prev) => ({ ...prev, upload })));
  }, [runUpload]);

  const resetPrimaryUpload = useCallback(() => {
    clearInterval(timers.current.primary);
    setPrimary((prev) => ({ ...prev, upload: { ...EMPTY_UPLOAD } }));
  }, []);

  const addGuest = useCallback(() => {
    setCoGuests((prev) => (prev.length < maxGuests - 1 ? [...prev, makeCoGuest()] : prev));
  }, [maxGuests]);

  const removeGuest = useCallback((id: string) => {
    clearInterval(timers.current[id]);
    setCoGuests((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const updateGuest = useCallback((id: string, patch: Partial<CoGuest>) => {
    setCoGuests((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  }, []);

  const uploadGuest = useCallback(
    (id: string) => {
      runUpload(id, (upload) =>
        setCoGuests((prev) => prev.map((g) => (g.id === id ? { ...g, upload } : g)))
      );
    },
    [runUpload]
  );

  const resetGuestUpload = useCallback((id: string) => {
    clearInterval(timers.current[id]);
    setCoGuests((prev) =>
      prev.map((g) => (g.id === id ? { ...g, upload: { ...EMPTY_UPLOAD } } : g))
    );
  }, []);

  const goTo = useCallback((next: WizardStep) => setStep(next), []);
  const back = useCallback(() => setStep((s) => (s > 1 ? ((s - 1) as WizardStep) : s)), []);
  const advance = useCallback(() => setStep((s) => (s < 5 ? ((s + 1) as WizardStep) : s)), []);

  const isForeign = primary.nationality !== "India";
  const effectiveDocType = isForeign ? "Passport" : primary.docType;
  const isAadhaar = effectiveDocType === "Aadhaar";

  const enteredGuestCount = 1 + coGuests.filter((g) => g.name.trim().length > 0).length;
  const shortBy = Math.max(0, maxGuests - enteredGuestCount);
  const guestUploadsMissing = coGuests.filter((g) => g.upload.status !== "done").length;

  const canContinue = useMemo(() => {
    switch (step) {
      case 3:
        return primary.upload.status === "done";
      case 4:
        return shortBy === 0 && guestUploadsMissing === 0;
      case 5:
        return consent;
      default:
        return true;
    }
  }, [step, primary.upload.status, shortBy, guestUploadsMissing, consent]);

  const submit = useCallback(() => setSubmitted(true), []);

  return {
    step,
    submitted,
    arrival,
    setArrival,
    primary,
    updatePrimary,
    uploadPrimary,
    resetPrimaryUpload,
    natPickerOpen,
    openNationalityPicker: () => setNatPickerOpen(true),
    closeNationalityPicker: () => setNatPickerOpen(false),
    setNationality: (name: string) => {
      updatePrimary({ nationality: name });
      setNatPickerOpen(false);
    },
    coGuests,
    addGuest,
    removeGuest,
    updateGuest,
    uploadGuest,
    resetGuestUpload,
    consent,
    setConsent,
    goTo,
    back,
    advance,
    submit,
    isForeign,
    effectiveDocType,
    isAadhaar,
    enteredGuestCount,
    shortBy,
    guestUploadsMissing,
    canContinue,
    canAddGuest: coGuests.length < maxGuests - 1,
  };
}

export type CheckinWizard = ReturnType<typeof useCheckinWizard>;
