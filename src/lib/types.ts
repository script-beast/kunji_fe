export type DocType =
  | "Passport"
  | "Driving Licence"
  | "Voter ID"
  | "PAN"
  | "Aadhaar";

export type UploadStatus = "empty" | "uploading" | "done" | "failed";

export type ArrivalWindow =
  | "Before 2 pm"
  | "2 pm – 5 pm"
  | "5 pm – 8 pm"
  | "8 pm – 11 pm"
  | "After 11 pm";

export type VisaType =
  | "Tourist (e-Visa)"
  | "Tourist (sticker)"
  | "Business"
  | "Employment"
  | "Student"
  | "OCI / PIO card";

export type WizardStep = 1 | 2 | 3 | 4 | 5;

export interface Upload {
  status: UploadStatus;
  pct: number;
  fileName?: string;
  documentFileId?: string;
}

export interface PrimaryGuest {
  fullName: string;
  dob: string;
  countryCode: string;
  phone: string;
  email: string;
  nationality: string;
  docType: DocType;
  docNumber: string;
  upload: Upload;
  visaNumber: string;
  visaType: VisaType;
  arrivedOn: string;
  portOfEntry: string;
  homeAddress: string;
}

export interface CoGuest {
  id: string;
  name: string;
  dob: string;
  docType: DocType;
  docNumber: string;
  upload: Upload;
}

export interface Country {
  name: string;
  extraChecks: boolean;
}
