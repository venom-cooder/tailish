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

/** WhatsApp Business number in E.164 without the leading "+". */
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919876543210";

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
  phone: "+91 98765 43210",
  address: "Vijay Nagar, Indore, Madhya Pradesh 452010",
  supportHours: "8:00 AM – 10:00 PM, all days",
  social: {
    instagram: "https://instagram.com/tailish.care",
    facebook: "https://facebook.com/tailish.care",
    youtube: "https://youtube.com/@tailish",
    linkedin: "https://linkedin.com/company/tailish",
  },
  stats: {
    families: "5000+",
    rating: "4.8/5",
    cities: "50+",
  },
} as const;
