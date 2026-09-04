"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { IconArrowLeft, IconArrowRight } from "@/components/ui/icons";
import { MobileShell } from "@/components/layout/mobile-shell";
import { KeyProgress, StepLabelRow } from "@/components/layout/key-progress";
import { DesktopShell } from "@/components/layout/desktop-shell";
import { StepRail, type RailStep, type RailStepTone } from "@/components/layout/step-rail";
import { NationalityPicker } from "@/components/checkin/nationality-picker";
import { BookingAside } from "@/components/checkin/booking-aside";
import { StepStay } from "@/components/checkin/steps/step-stay";
import { StepAbout } from "@/components/checkin/steps/step-about";
import { StepId } from "@/components/checkin/steps/step-id";
import { StepOthers } from "@/components/checkin/steps/step-others";
import { StepReview } from "@/components/checkin/steps/step-review";
import { SubmittedScreen } from "@/components/checkin/screens/submitted-screen";
import { useCheckinWizard, type CheckinWizard as WizardState } from "@/hooks/use-checkin-wizard";
import { HOST, PROPERTY, STEP_NAMES } from "@/lib/constants";
import type { GuestBooking } from "@/lib/api";
import { formatDateRange } from "@/lib/utils";
import type { WizardStep } from "@/lib/types";

const TOTAL_STEPS = STEP_NAMES.length;

function StepContent({ wizard }: { wizard: WizardState }) {
  switch (wizard.step) {
    case 1:
      return <StepStay arrival={wizard.arrival} onArrivalChange={wizard.setArrival} />;
    case 2:
      return (
        <StepAbout
          primary={wizard.primary}
          onUpdate={wizard.updatePrimary}
          onOpenNationalityPicker={wizard.openNationalityPicker}
        />
      );
    case 3:
      return (
        <StepId
          primary={wizard.primary}
          onUpdate={wizard.updatePrimary}
          isForeign={wizard.isForeign}
          isAadhaar={wizard.isAadhaar}
          effectiveDocType={wizard.effectiveDocType}
          onSelectFile={wizard.selectPrimaryFile}
          onReplace={wizard.resetPrimaryUpload}
        />
      );
    case 4:
      return (
        <StepOthers
          guests={wizard.coGuests}
          maxGuests={wizard.maxGuests}
          enteredCount={wizard.enteredGuestCount}
          shortBy={wizard.shortBy}
          guestUploadsMissing={wizard.guestUploadsMissing}
          canAddGuest={wizard.canAddGuest}
          onAddGuest={wizard.addGuest}
          onUpdateGuest={wizard.updateGuest}
          onRemoveGuest={wizard.removeGuest}
          onSelectGuestFile={wizard.selectGuestFile}
          onReplaceGuest={wizard.resetGuestUpload}
        />
      );
    case 5:
      return (
        <StepReview
          arrival={wizard.arrival}
          primary={wizard.primary}
          coGuests={wizard.coGuests}
          isForeign={wizard.isForeign}
          isAadhaar={wizard.isAadhaar}
          effectiveDocType={wizard.effectiveDocType}
          consent={wizard.consent}
          onConsentChange={wizard.setConsent}
          onEditStep={(step: WizardStep) => wizard.goTo(step)}
        />
      );
    default:
      return null;
  }
}

function FooterButtons({ wizard }: { wizard: WizardState }) {
  const hostFirstName = HOST.name.split(" ")[0];
  const primaryLabel =
    wizard.step === 5
      ? wizard.submitting
        ? "Sending…"
        : `Submit to ${hostFirstName}`
      : "Continue";
  const onPrimary = wizard.step === 5 ? () => void wizard.submit() : wizard.advance;

  return (
    <>
      {wizard.step > 1 && (
        <Button
          variant="secondary"
          className="min-h-12.5 px-3.5"
          onClick={wizard.back}
          aria-label="Back"
        >
          <IconArrowLeft width={18} height={18} />
        </Button>
      )}
      <Button
        variant="primary"
        className="min-h-12.5 flex-1 justify-between text-[15px]"
        disabled={!wizard.canContinue}
        onClick={onPrimary}
      >
        <span>{primaryLabel}</span>
        <IconArrowRight width={18} height={18} />
      </Button>
    </>
  );
}

function buildRailSteps(wizard: WizardState): RailStep[] {
  return STEP_NAMES.map((name, i) => {
    const n = (i + 1) as WizardStep;
    const tone: RailStepTone = n < wizard.step ? "done" : n === wizard.step ? "current" : "upcoming";
    return {
      name,
      tone,
      locked: n > wizard.step,
      onGo: () => {
        if (n <= wizard.step) wizard.goTo(n);
      },
    };
  });
}

interface CheckinWizardProps {
  formToken: string;
  booking?: GuestBooking;
  objectionReason?: string;
}

export function CheckinWizard({ formToken, booking, objectionReason }: CheckinWizardProps) {
  const wizard = useCheckinWizard({ formToken, booking });
  const natPicker: ReactNode = wizard.natPickerOpen ? (
    <NationalityPicker onPick={wizard.setNationality} onClose={wizard.closeNationalityPicker} />
  ) : null;
  const dateRange = formatDateRange(booking?.checkInDate, booking?.checkOutDate);

  if (wizard.submitted) {
    const doneRail = STEP_NAMES.map((name) => ({
      name,
      tone: "done" as RailStepTone,
      locked: true,
      onGo: () => {},
    }));

    return (
      <>
        <div className="sm:hidden">
          <MobileShell>
            <SubmittedScreen reference={booking?.bookingMyId} />
          </MobileShell>
        </div>
        <div className="hidden sm:block">
          <DesktopShell
            stepCounter={booking?.bookingMyId ? `Reference ${booking.bookingMyId}` : "Submitted"}
            rail={<StepRail steps={doneRail} />}
            aside={<BookingAside dates={dateRange} guests={wizard.maxGuests} />}
          >
            <SubmittedScreen reference={booking?.bookingMyId} />
          </DesktopShell>
        </div>
      </>
    );
  }

  const stepIndex = wizard.step - 1;
  const objectionBanner = objectionReason ? (
    <div className="mx-4 mb-4 border-l-2 border-accent bg-panel px-3.5 py-3 sm:mx-0">
      <div className="mb-1 text-[11px] tracking-widest uppercase text-ink/65">
        {HOST.name} asked for a change
      </div>
      <p className="m-0 text-[13.5px] sm:text-sm">{objectionReason}</p>
    </div>
  ) : null;
  const errorBanner = wizard.submitError ? (
    <div className="mx-4 mb-4 border-2 border-accent p-3 text-sm sm:mx-0">
      {wizard.submitError}
    </div>
  ) : null;

  return (
    <>
      <div className="sm:hidden">
        <MobileShell
          header={
            <div className="flex-none border-b-2 border-ink/40 bg-paper px-4 pt-3 pb-2.5">
              <div className="mb-2.5 flex items-baseline justify-between gap-2">
                <div className="font-heading text-[15px] font-extrabold tracking-widest">
                  KUNJI
                </div>
                <div className="text-right text-[11px] text-neutral-700">
                  {PROPERTY.name}
                  {dateRange ? ` · ${dateRange}` : ""}
                </div>
              </div>
              <KeyProgress completed={stepIndex} current={stepIndex} total={TOTAL_STEPS} />
              <StepLabelRow
                label={STEP_NAMES[stepIndex]}
                detail={`Step ${wizard.step} of ${TOTAL_STEPS}`}
              />
            </div>
          }
          footer={<FooterButtons wizard={wizard} />}
        >
          {objectionBanner}
          {errorBanner}
          <StepContent wizard={wizard} />
          {natPicker}
        </MobileShell>
      </div>

      <div className="hidden sm:block">
        <DesktopShell
          stepCounter={`Step ${wizard.step} of ${TOTAL_STEPS} · ${STEP_NAMES[stepIndex]}`}
          rail={<StepRail steps={buildRailSteps(wizard)} />}
          aside={<BookingAside dates={dateRange} guests={wizard.maxGuests} />}
          footer={<FooterButtons wizard={wizard} />}
        >
          {objectionBanner}
          {errorBanner}
          <StepContent wizard={wizard} />
        </DesktopShell>
        {wizard.natPickerOpen && (
          <div className="fixed inset-0 z-50">{natPicker}</div>
        )}
      </div>
    </>
  );
}
