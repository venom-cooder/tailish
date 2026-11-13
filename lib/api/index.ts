import { contentApi } from "./content";

/**
 * The Tailish API client.
 *
 * Import this, never `fetch` directly:
 *
 *   import { api } from "@/lib/api";
 *   const guides = await api.content.listGuides();
 *
 * Only `content` is left. The auth, pets, passport, account, services,
 * commerce, reminders, ai and leads clients are in parked/ with the pages that
 * called them: each was a mock adapter running in the visitor's browser, with
 * nothing behind it. `leads` is worth singling out — its contact, waitlist and
 * partner endpoints validated the form, answered "message received", and threw
 * the submission away.
 *
 * Content is different: it reads the guides written for the site, which are
 * real, and serves them from `lib/mock/content.ts` without pretending to
 * persist anything.
 *
 * Restoring a client means restoring its real backend first — an AxisIQ
 * Function behind Sites → Sign-in & API, with NEXT_PUBLIC_API_BASE_URL set so
 * `call()` goes to REST rather than the mock branch. See parked/README.md.
 */
export const api = {
  content: contentApi,
};

export { ApiError, toErrorMessage, setAuthToken, getAuthToken } from "./client";
export { guideCategories } from "./content";
