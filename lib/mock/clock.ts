/**
 * A fixed "today" for the demo dataset.
 *
 * Mock data must be deterministic: Cache Components fails the prerender on
 * synchronous IO like `new Date()`, and a moving clock would also desync the
 * server shell from client hydration. Every relative date in /lib/mock is
 * derived from this constant instead.
 *
 * The real backend supplies live timestamps, so this file disappears from the
 * critical path the moment NEXT_PUBLIC_API_BASE_URL is set.
 */
export const TODAY_ISO = "2026-10-22";

const DAY_MS = 86_400_000;

/** Returns `TODAY_ISO + days` as a plain ISO date (YYYY-MM-DD). */
export function addDays(days: number, from: string = TODAY_ISO): string {
  const date = new Date(`${from}T00:00:00.000Z`);
  return new Date(date.getTime() + days * DAY_MS).toISOString().slice(0, 10);
}

/** Same as `addDays` but returns a full ISO timestamp at the given UTC hour. */
export function at(days: number, hour: number, minute = 0): string {
  const date = new Date(`${addDays(days)}T00:00:00.000Z`);
  return new Date(date.getTime() + hour * 3_600_000 + minute * 60_000).toISOString();
}

export function monthsAgo(months: number): string {
  const date = new Date(`${TODAY_ISO}T00:00:00.000Z`);
  date.setUTCMonth(date.getUTCMonth() - months);
  return date.toISOString().slice(0, 10);
}

export function yearsAgo(years: number): string {
  const date = new Date(`${TODAY_ISO}T00:00:00.000Z`);
  date.setUTCFullYear(date.getUTCFullYear() - years);
  return date.toISOString().slice(0, 10);
}
