import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** ₹ formatting. Prices are stored in rupees (not paise) throughout. */
export function formatINR(amount: number, opts?: { decimals?: boolean }) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: opts?.decimals ? 2 : 0,
    maximumFractionDigits: opts?.decimals ? 2 : 0,
  }).format(amount);
}

/**
 * Formats an ISO date as "12 Mar 2026".
 *
 * Always uses the en-IN locale and UTC so server prerender and client hydration
 * produce identical strings regardless of the viewer's timezone.
 */
export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

export function formatDateLong(iso: string) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

export function formatTime(iso: string) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(new Date(iso));
}

/**
 * Whole days between two ISO dates (b - a). Positive means `b` is later.
 * Both sides are floored to UTC midnight so DST and clock time never leak in.
 */
export function daysBetween(a: string, b: string) {
  const day = 86_400_000;
  const floor = (iso: string) => Math.floor(new Date(iso).getTime() / day);
  return floor(b) - floor(a);
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Monotonic client-side id generator.
 *
 * Deliberately avoids `crypto.randomUUID()` / `Math.random()`: those are
 * synchronous-IO calls that fail the Cache Components prerender, and
 * non-deterministic values cause hydration mismatches.
 */
let idCounter = 0;
export function nextId(prefix = "id") {
  idCounter += 1;
  return `${prefix}_${idCounter.toString(36).padStart(4, "0")}`;
}
