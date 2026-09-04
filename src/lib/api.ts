const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export type ViewState = "form" | "pending_review" | "approved" | "expired";

export interface GuestBooking {
  _id: string;
  bookingMyId: string;
  name: string;
  email?: string;
  phone?: string;
  dob?: string;
  nationality?: string;
  checkInDate?: string;
  checkOutDate?: string;
  documentType?: string;
  noOfGuests?: number;
}

export interface GuestRoom {
  _id: string;
  name: string;
  location: string;
}

export interface GuestFormResponse {
  viewState: ViewState;
  booking?: GuestBooking;
  room?: GuestRoom;
  objectionReason?: string;
  gateCode?: string;
}

class ApiRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiRequestError";
  }
}

async function unwrap<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiRequestError(body?.error || "Something went wrong. Please try again.");
  }
  return body.data as T;
}

export async function getBookingByToken(formToken: string): Promise<GuestFormResponse> {
  const response = await fetch(`${API_BASE_URL}/api/guest-form/${formToken}`, {
    cache: "no-store",
  });
  return unwrap<GuestFormResponse>(response);
}

export async function uploadGuestDocument(
  formToken: string,
  file: File,
): Promise<{ documentFileId: string; url: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${API_BASE_URL}/api/guest-form/${formToken}/upload`, {
    method: "POST",
    body: formData,
  });
  return unwrap<{ documentFileId: string; url: string }>(response);
}

export interface SubmitGuestFormPayload {
  name: string;
  email?: string;
  phone?: string;
  dob?: string;
  nationality?: string;
  documentType?: string;
  documentFile?: string;
  guestDetails?: {
    name: string;
    dob: string;
    documentType: string;
    documentFile: string;
  }[];
}

export async function submitGuestForm(formToken: string, payload: SubmitGuestFormPayload) {
  const response = await fetch(`${API_BASE_URL}/api/guest-form/${formToken}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return unwrap<{ formToken: string }>(response);
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong. Please try again.") {
  return error instanceof Error ? error.message : fallback;
}
