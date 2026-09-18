import type { ArrivalWindow, Country, DocType, VisaType } from "./types";

export const PROPERTY_TIME_ZONE = "Asia/Kolkata";

/** All dummy data below stands in for a real booking/host backend. */

export const PROPERTY = {
  name: "",
  flatLine: "",
  addressLine: "",
};

export const HOST = {
  name: "",
  phone: "",
};

export const CARETAKER = {
  name: "",
  role: "Caretaker · on site until 10 pm",
  phone: "+91 99715 20884",
};

export const BOOKING = {
  reference: "KJ-8F2A-4D",
  guestCount: 3,
  checkInDate: "Fri 4 Sep",
  checkInTime: "2:00 pm",
  checkOutDate: "Mon 7 Sep",
  checkOutTime: "11:00 am",
  submittedAt: "Wed 2 Sep, 9:14 pm",
  linkOpenedOn: "Wed 26 Aug",
};

export const ACCESS = {
  doorCode: "0000",
  wifiName: "--",
  wifiPassword: "--",
};

export const STEP_NAMES = [
  "Your stay",
  "About you",
  "Your ID",
  "Others staying",
  "Review and confirm",
] as const;

export const ARRIVAL_WINDOWS: ArrivalWindow[] = [
  "Before 10 am",
  "10 am - 12 am",
  "12 pm - 2 pm",
  "2 pm – 5 pm",
  "5 pm – 8 pm",
  "8 pm – 11 pm",
  "After 11 pm",
];

export const DOC_TYPES: DocType[] = [
  "Passport",
  "Driving Licence",
  "Voter ID",
  "PAN",
  "Aadhaar",
];

export const VISA_TYPES: VisaType[] = [
  "Tourist (e-Visa)",
  "Tourist (sticker)",
  "Business",
  "Employment",
  "Student",
  "OCI / PIO card",
];

export const PORTS_OF_ENTRY = [
  "Delhi (DEL)",
  "Mumbai (BOM)",
  "Bengaluru (BLR)",
  "Chennai (MAA)",
  "Hyderabad (HYD)",
  "Kolkata (CCU)",
  "Land border",
];

export const COUNTRY_CODES = ["+91", "+44", "+1", "+61", "+65", "+971", "+49"];

const EXTRA_CHECK_COUNTRIES = new Set([
  "Pakistan",
  "Afghanistan",
  "China",
  "Bangladesh",
  "Sri Lanka",
  "Nepal",
  "Russia",
]);

const COUNTRY_NAMES = [
  "India",
  "United Kingdom",
  "United States",
  "Germany",
  "France",
  "Australia",
  "Canada",
  "Singapore",
  "United Arab Emirates",
  "Japan",
  "South Korea",
  "Netherlands",
  "Spain",
  "Italy",
  "Israel",
  "Nepal",
  "Sri Lanka",
  "Bangladesh",
  "Brazil",
  "South Africa",
  "Russia",
  "China",
  "Pakistan",
  "Afghanistan",
];

export const COUNTRIES: Country[] = COUNTRY_NAMES.map((name) => ({
  name,
  extraChecks: EXTRA_CHECK_COUNTRIES.has(name),
}));
