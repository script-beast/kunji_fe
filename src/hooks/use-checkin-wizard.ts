"use client";

import { useCallback, useMemo, useState } from "react";
import { ARRIVAL_WINDOWS, COUNTRY_CODES, PORTS_OF_ENTRY, VISA_TYPES } from "@/lib/constants";
import { getErrorMessage, saveGuestForm, submitGuestForm, uploadGuestDocument } from "@/lib/api";
import type { GuestBooking, GuestCoGuestDetail, GuestRoom } from "@/lib/api";
import type { ArrivalWindow, CoGuest, DocType, PrimaryGuest, Upload, WizardStep } from "@/lib/types";

const EMPTY_UPLOAD: Upload = { status: "empty", pct: 0 };

function uploadFromDocumentFile(documentFile?: GuestCoGuestDetail["documentFile"]): Upload {
  return documentFile
    ? {
        status: "done",
        pct: 100,
        fileName: documentFile.fileName,
        documentFileId: documentFile._id,
      }
    : { ...EMPTY_UPLOAD };
}

let guestSeq = 0;
function makeGuestId() {
  guestSeq += 1;
  return `guest-new-${Date.now()}-${guestSeq}`;
}

function makeCoGuest(): CoGuest {
  return {
    id: makeGuestId(),
    name: "",
    dob: "",
    docType: "Passport",
    docNumber: "",
    upload: { ...EMPTY_UPLOAD },
  };
}

function makeCoGuestFromDetail(detail: GuestCoGuestDetail, index: number): CoGuest {
  return {
    id: `guest-${detail._id}-${index}`,
    name: detail.name || "",
    dob: detail.dob ? detail.dob.slice(0, 10) : "",
    docType: (detail.documentType as DocType) || "Passport",
    docNumber: "",
    upload: uploadFromDocumentFile(detail.documentFile ?? undefined),
  };
}

function makePrimaryGuest(initial?: GuestBooking): PrimaryGuest {
  const storedPhone = initial?.phone || "";
  const parsedCountryCode = storedPhone.match(/^(\+\d+)\s+/)?.[1];
  const countryCode = initial?.countryCode || parsedCountryCode || COUNTRY_CODES[0];
  const phone = (parsedCountryCode ? storedPhone.replace(/^\+\d+\s+/, "") : storedPhone).replace(
    /\D/g,
    "",
  ).slice(0, 10);

  return {
    fullName: initial?.name || "",
    dob: initial?.dob ? initial.dob.slice(0, 10) : "",
    countryCode,
    phone,
    email: initial?.email || "",
    nationality: initial?.nationality || "India",
    docType: (initial?.documentType as DocType) || "Passport",
    docNumber: "",
    upload: uploadFromDocumentFile(initial?.documentFile ?? undefined),
    visaNumber: "",
    visaType: VISA_TYPES[0],
    arrivedOn: "",
    portOfEntry: PORTS_OF_ENTRY[0],
    homeAddress: "",
  };
}

interface UseCheckinWizardOptions {
  formToken: string;
  booking?: GuestBooking;
  room?: GuestRoom;
}

/**
 * Drives the five-step guest check-in wizard: field state, the real ID-photo
 * upload (proxied through the token-scoped public API), and the per-step
 * validation that gates the footer button.
 */
export function useCheckinWizard({ formToken, booking, room }: UseCheckinWizardOptions) {
  const maxGuests = booking?.noOfGuests || 1;
  const initialArrival = ARRIVAL_WINDOWS.find((window) => window === booking?.expectedCheckInTime)
    ?? ARRIVAL_WINDOWS[2];

  const [step, setStep] = useState<WizardStep>(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);
  const [arrival, setArrival] = useState<ArrivalWindow>(initialArrival);
  const [primary, setPrimary] = useState<PrimaryGuest>(() => makePrimaryGuest(booking));
  const [natPickerOpen, setNatPickerOpen] = useState(false);
  const [coGuests, setCoGuests] = useState<CoGuest[]>(() =>
    booking?.guestDetails?.length
      ? booking.guestDetails.map(makeCoGuestFromDetail)
      : [makeCoGuest()],
  );
  const [consent, setConsent] = useState(false);

  const runUpload = useCallback(
    (key: string, file: File, apply: (upload: Upload) => void) => {
      let pct = 10;
      apply({ status: "uploading", pct });
      const ticker = setInterval(() => {
        pct = Math.min(90, pct + 12);
        apply({ status: "uploading", pct });
      }, 260);

      uploadGuestDocument(formToken, file)
        .then(({ documentFileId }) => {
          clearInterval(ticker);
          apply({ status: "done", pct: 100, fileName: file.name, documentFileId });
        })
        .catch(() => {
          clearInterval(ticker);
          apply({ status: "failed", pct });
        });
    },
    [formToken],
  );

  const updatePrimary = useCallback((patch: Partial<PrimaryGuest>) => {
    setPrimary((prev) => ({ ...prev, ...patch }));
  }, []);

  const selectPrimaryFile = useCallback(
    (file: File) => {
      runUpload("primary", file, (upload) => setPrimary((prev) => ({ ...prev, upload })));
    },
    [runUpload],
  );

  const resetPrimaryUpload = useCallback(() => {
    setPrimary((prev) => ({ ...prev, upload: { ...EMPTY_UPLOAD } }));
  }, []);

  const addGuest = useCallback(() => {
    setCoGuests((prev) => [...prev, makeCoGuest()]);
  }, [maxGuests]);

  const removeGuest = useCallback((id: string) => {
    setCoGuests((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const updateGuest = useCallback((id: string, patch: Partial<CoGuest>) => {
    setCoGuests((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  }, []);

  const selectGuestFile = useCallback(
    (id: string, file: File) => {
      runUpload(id, file, (upload) =>
        setCoGuests((prev) => prev.map((g) => (g.id === id ? { ...g, upload } : g))),
      );
    },
    [runUpload],
  );

  const resetGuestUpload = useCallback((id: string) => {
    setCoGuests((prev) =>
      prev.map((g) => (g.id === id ? { ...g, upload: { ...EMPTY_UPLOAD } } : g)),
    );
  }, []);

  const goTo = useCallback((next: WizardStep) => setStep(next), []);
  const back = useCallback(() => setStep((s) => (s > 1 ? ((s - 1) as WizardStep) : s)), []);
  // const isForeign = primary.nationality !== "India";
  // const isForeign = false; // TODO: temporarily disable foreigner flow until we have a better UX for it
  const effectiveDocType = primary.docType;
  // const isAadhaar = effectiveDocType === "Aadhaar";

  const enteredGuestCount = 1 + coGuests.filter((g) => g.name.trim().length > 0).length;
  const addedGuests = coGuests.filter((guest) => guest.name.trim().length > 0);
  const shortBy = Math.max(0, maxGuests - enteredGuestCount);
  const incompleteGuests = addedGuests.filter(
    (guest) =>
      !guest.dob ||
      !guest.name.trim() ||
      guest.upload.status !== "done",
  ).length;
  const guestUploadsMissing = addedGuests.filter((guest) => guest.upload.status !== "done").length;
  const extraGuestCount = Math.max(0, enteredGuestCount - maxGuests);
  const validEmail = !primary.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(primary.email);
  const validPhone = !primary.phone || /^\d{10}$/.test(primary.phone);
  const aboutStepValid =
    primary.fullName.trim().length > 0 && Boolean(primary.dob) && validEmail && validPhone;

  const canContinue = useMemo(() => {
    switch (step) {
      case 3:
        return aboutStepValid && primary.upload.status === "done";
      case 4:
        return shortBy === 0 && incompleteGuests === 0;
      case 5:
        return consent && !submitting && !saving;
      default:
        return step === 1 || aboutStepValid;
    }
  }, [step, aboutStepValid, primary.upload.status, shortBy, guestUploadsMissing, consent, submitting, saving]);

  const draftPayload = useCallback(
    () => ({
      name: primary.fullName || undefined,
      email: primary.email || undefined,
      countryCode: primary.countryCode,
      phone: primary.phone || undefined,
      dob: primary.dob || undefined,
      nationality: primary.nationality || undefined,
      documentType: effectiveDocType,
      documentFile: primary.upload.documentFileId,
      expectedCheckInTime: arrival,
      guestDetails: coGuests.map((guest) => ({
        name: guest.name || undefined,
        dob: guest.dob || undefined,
        documentType: guest.docType || undefined,
        documentFile: guest.upload.documentFileId,
      })),
    }),
    [primary, effectiveDocType, arrival, coGuests],
  );

  const advance = useCallback(async () => {
    if (!canContinue || step >= 5) return;
    setSubmitError(undefined);
    setSaving(true);
    try {
      await saveGuestForm(formToken, draftPayload());
      setStep((current) => (current + 1) as WizardStep);
    } catch (error) {
      setSubmitError(getErrorMessage(error, "Could not save your progress. Please try again."));
    } finally {
      setSaving(false);
    }
  }, [canContinue, step, formToken, draftPayload]);

  const submit = useCallback(async () => {
    setSubmitError(undefined);
    setSubmitting(true);
    try {
      await submitGuestForm(formToken, {
        name: primary.fullName,
        email: primary.email || undefined,
        countryCode: primary.countryCode,
        phone: primary.phone || undefined,
        dob: primary.dob || undefined,
        nationality: primary.nationality,
        documentType: effectiveDocType,
        documentFile: primary.upload.documentFileId,
        expectedCheckInTime: arrival,
        guestDetails: coGuests
          .filter((g) => g.name.trim())
          .map((g) => ({
            name: g.name,
            dob: g.dob,
            documentType: g.docType,
            documentFile: g.upload.documentFileId as string,
          })),
      });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(getErrorMessage(error, "Could not submit your details. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }, [formToken, primary, effectiveDocType, coGuests]);

  return {
    step,
    submitted,
    submitting,
    saving,
    submitError,
    booking,
    room,
    maxGuests,
    arrival,
    setArrival,
    primary,
    updatePrimary,
    selectPrimaryFile,
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
    selectGuestFile,
    resetGuestUpload,
    consent,
    setConsent,
    goTo,
    back,
    advance,
    submit,
    // isForeign,
    effectiveDocType,
    // isAadhaar,
    enteredGuestCount,
    shortBy,
    guestUploadsMissing,
    canContinue,
    canAddGuest: true,
    incompleteGuests,
    extraGuestCount,
  };
}

export type CheckinWizard = ReturnType<typeof useCheckinWizard>;
