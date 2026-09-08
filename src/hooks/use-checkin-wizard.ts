"use client";

import { useCallback, useMemo, useState } from "react";
import { ARRIVAL_WINDOWS, COUNTRY_CODES, PORTS_OF_ENTRY, VISA_TYPES } from "@/lib/constants";
import { getErrorMessage, submitGuestForm, uploadGuestDocument } from "@/lib/api";
import type { GuestBooking, GuestCoGuestDetail } from "@/lib/api";
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

function makeCoGuestFromDetail(detail: GuestCoGuestDetail): CoGuest {
  guestSeq += 1;
  return {
    id: `guest-${guestSeq}`,
    name: detail.name || "",
    dob: detail.dob ? detail.dob.slice(0, 10) : "",
    docType: (detail.documentType as DocType) || "Passport",
    docNumber: "",
    upload: uploadFromDocumentFile(detail.documentFile ?? undefined),
  };
}

function makePrimaryGuest(initial?: GuestBooking): PrimaryGuest {
  return {
    fullName: initial?.name || "",
    dob: initial?.dob ? initial.dob.slice(0, 10) : "",
    countryCode: COUNTRY_CODES[0],
    phone: initial?.phone || "",
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
}

/**
 * Drives the five-step guest check-in wizard: field state, the real ID-photo
 * upload (proxied through the token-scoped public API), and the per-step
 * validation that gates the footer button.
 */
export function useCheckinWizard({ formToken, booking }: UseCheckinWizardOptions) {
  const maxGuests = booking?.noOfGuests || 1;

  const [step, setStep] = useState<WizardStep>(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);
  const [arrival, setArrival] = useState<ArrivalWindow>(ARRIVAL_WINDOWS[2]);
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
    setCoGuests((prev) => (prev.length < maxGuests - 1 ? [...prev, makeCoGuest()] : prev));
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
        return consent && !submitting;
      default:
        return true;
    }
  }, [step, primary.upload.status, shortBy, guestUploadsMissing, consent, submitting]);

  const submit = useCallback(async () => {
    setSubmitError(undefined);
    setSubmitting(true);
    try {
      await submitGuestForm(formToken, {
        name: primary.fullName,
        email: primary.email || undefined,
        phone: primary.phone ? `${primary.countryCode} ${primary.phone}` : undefined,
        dob: primary.dob || undefined,
        nationality: primary.nationality,
        documentType: effectiveDocType,
        documentFile: primary.upload.documentFileId,
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
    submitError,
    booking,
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
