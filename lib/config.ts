/**
 * Every externally-configurable value in the site lives here.
 *
 * Going live is a matter of setting environment variables — no code changes:
 *   NEXT_PUBLIC_API_BASE_URL        → swaps the mock adapter for real REST
 *   NEXT_PUBLIC_WHATSAPP_NUMBER     → repoints every WhatsApp link and QR code
 */

/** Base URL of the Tailish backend. Empty string → the mock adapter is used. */
export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

/** True when a real backend is configured. Drives the adapter selection. */
export const USE_REAL_API = API_BASE_URL.length > 0;

/** Simulated latency (ms) for the mock adapter, so loading states are real. */
export const MOCK_LATENCY_MS = Number(process.env.NEXT_PUBLIC_MOCK_LATENCY_MS ?? 320);

/**
 * WhatsApp Business number in E.164 without the leading "+".
 *
 * The real number is the default rather than something a `.env` has to supply:
 * for months the fallback here was the placeholder 919876543210, no `.env`
 * existed, and the published site sent every visitor on 94 pages to a number
 * nobody owns. A build that forgets its environment should still be correct.
 *
 * This is the Twilio-hosted "Tailish WhatsApp" sender. It carries WhatsApp
 * only — SMS and voice are off on the account — so it must never appear behind
 * a `tel:` link.
 */
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "18508055553";

export const WHATSAPP_DEFAULT_TEXT =
  process.env.NEXT_PUBLIC_WHATSAPP_DEFAULT_TEXT ??
  "Hi Tailish! I'd like help with my pet's care.";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://tailish.in"
).replace(/\/$/, "");

export const siteConfig = {
  name: "Tailish",
  tagline: "Care. Love. Wellness.",
  description:
    "Tailish connects you with trusted veterinarians who review, visit and care for your pet — wherever you are. Expert care, personal support, every step of the way.",
  url: SITE_URL,
  city: "Indore",
  email: "care@tailish.in",
  // No `phone`. Tailish has no voice line: the Twilio sender is WhatsApp-only,
  // and the number that used to sit here was the 98765 43210 placeholder,
  // published as if it were a support line. Reach-us routes through WhatsApp
  // until there is a number that actually answers.
  address: "Vijay Nagar, Indore, Madhya Pradesh 452010",
  supportHours: "8:00 AM – 10:00 PM, all days",

  /**
   * Details that appear in the Privacy Policy and Terms.
   *
   * Kept here so the two legal pages can never drift from each other. Replace
   * `entity`, `grievanceOfficer` and `jurisdiction` with the registered
   * particulars before publishing — these are the values a regulator, a carrier
   * reviewing an SMS campaign, or a user filing a complaint will rely on.
   */
  legal: {
    entity: "Tailish Pet Care Private Limited",
    /** Named contact required of Indian intermediaries. Must be a real person. */
    grievanceOfficer: "Grievance Officer",
    jurisdiction: "Indore, Madhya Pradesh, India",
    effectiveDate: "4 November 2026",
  },
  social: {
    instagram: "https://instagram.com/tailish.care",
    facebook: "https://facebook.com/tailish.care",
    youtube: "https://youtube.com/@tailish",
    linkedin: "https://linkedin.com/company/tailish",
  },
  // No `stats`. These read "5000+ families", "4.8/5 rating" and "50+ cities"
  // on the published homepage before a single customer existed. Traction
  // numbers go back only when they can be counted.
} as const;
