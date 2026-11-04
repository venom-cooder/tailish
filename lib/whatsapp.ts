import { WHATSAPP_DEFAULT_TEXT, WHATSAPP_NUMBER } from "./config";

/**
 * Every WhatsApp link and QR code on the site resolves through here.
 *
 * Pointing the site at the real WhatsApp Business number is a single
 * environment change (NEXT_PUBLIC_WHATSAPP_NUMBER) — buttons, QR codes and
 * the floating action button all follow automatically.
 */

export interface WhatsAppLinkOptions {
  /** Prefilled message. Falls back to NEXT_PUBLIC_WHATSAPP_DEFAULT_TEXT. */
  text?: string;
  /** Overrides the configured number for a specific destination. */
  number?: string;
}

export function getWhatsAppLink(options: WhatsAppLinkOptions = {}): string {
  const number = (options.number ?? WHATSAPP_NUMBER).replace(/\D/g, "");
  const text = options.text ?? WHATSAPP_DEFAULT_TEXT;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

/** Display form of the configured number, e.g. "+91 98765 43210". */
export function whatsappDisplayNumber(): string {
  const digits = WHATSAPP_NUMBER.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return `+${digits}`;
}

/**
 * Prefilled messages, kept in one place so the tone stays consistent and the
 * backend can route on them once a real WhatsApp agent is connected.
 */
export const whatsappMessages = {
  general: WHATSAPP_DEFAULT_TEXT,
  home: "Hi Tailish! I'd like to get started with care for my pet.",
  bookVisit: "Hi Tailish! I'd like to book a vet visit for my pet.",
  homeVisit: "Hi Tailish! I'd like to book a home visit for my pet.",
  videoConsult: "Hi Tailish! I'd like to start a video consult with a vet.",
  vaccination: "Hi Tailish! I'd like to schedule a vaccination for my pet.",
  diagnostics: "Hi Tailish! I'd like to book a diagnostic test with home sample collection.",
  askTailish: "Hi Tailish! I have a question about my pet's health.",
  healthPassport: "Hi Tailish! I'd like to set up a Health Passport for my pet.",
  nearby: "Hi Tailish! I'm looking for a vet near me.",
  emergency: "Hi Tailish! I need urgent help with my pet.",
  pricing: "Hi Tailish! I'd like to know more about CarePass membership.",
  contact: "Hi Tailish! I have a question I'd like help with.",
  partner: "Hi Tailish! I'd like to partner with Tailish.",
  shop: "Hi Tailish! I'd like help choosing products for my pet.",
  cart: "Hi Tailish! I need help completing my order.",
  checkout: "Hi Tailish! I'd like to complete my order on WhatsApp.",

  /** Product enquiry, with the item name filled in. */
  product: (name: string) => `Hi Tailish! I'd like to know more about "${name}".`,

  /** Order support, with the reference filled in. */
  order: (reference: string) => `Hi Tailish! I need help with my order ${reference}.`,

  /** Guide follow-up, with the article title filled in. */
  guide: (title: string) => `Hi Tailish! I read "${title}" and have a follow-up question.`,
} as const;

/**
 * Picks the prefilled message for a route.
 *
 * Shared by the desktop float and the mobile tab bar's Ask action so a
 * conversation started from the shop arrives with shop context, and one from
 * /nearby arrives asking about vets nearby — whichever control was used.
 */
export function whatsappMessageForPath(pathname: string): string {
  if (pathname.startsWith("/shop")) return whatsappMessages.shop;
  if (pathname.startsWith("/cart")) return whatsappMessages.cart;
  if (pathname.startsWith("/checkout")) return whatsappMessages.checkout;
  if (pathname.startsWith("/vet-care/home-visit")) return whatsappMessages.homeVisit;
  if (pathname.startsWith("/vet-care/video-consult")) return whatsappMessages.videoConsult;
  if (pathname.startsWith("/vet-care/vaccination")) return whatsappMessages.vaccination;
  if (pathname.startsWith("/vet-care/diagnostics")) return whatsappMessages.diagnostics;
  if (pathname.startsWith("/vet-care")) return whatsappMessages.bookVisit;
  if (pathname.startsWith("/health-passport")) return whatsappMessages.healthPassport;
  if (pathname.startsWith("/nearby")) return whatsappMessages.nearby;
  if (pathname.startsWith("/pricing")) return whatsappMessages.pricing;
  if (pathname.startsWith("/contact")) return whatsappMessages.contact;
  if (pathname.startsWith("/app/ask")) return whatsappMessages.askTailish;
  return whatsappMessages.general;
}
