import { accountApi } from "./account";
import { aiApi } from "./ai";
import { authApi } from "./auth";
import { commerceApi } from "./commerce";
import { contentApi } from "./content";
import { leadsApi } from "./leads";
import { passportApi } from "./passport";
import { petsApi } from "./pets";
import { remindersApi } from "./reminders";
import { servicesApi } from "./services";

/**
 * The Tailish API client.
 *
 * Import this, never `fetch` directly:
 *
 *   import { api } from "@/lib/api";
 *   const pets = await api.pets.list();
 *
 * Backed by mock data until NEXT_PUBLIC_API_BASE_URL is set, at which point
 * every call below switches to REST against that origin. See lib/api/client.ts.
 */
export const api = {
  auth: authApi,
  account: accountApi,
  pets: petsApi,
  passport: passportApi,
  ai: aiApi,
  services: servicesApi,
  commerce: commerceApi,
  reminders: remindersApi,
  content: contentApi,
  leads: leadsApi,
};

export { ApiError, toErrorMessage, setAuthToken, getAuthToken } from "./client";
export { DEMO_OTP } from "./auth";
export { allBrands } from "./commerce";
export { guideCategories } from "./content";
export { bookableDates } from "./services";
export { deriveVaccinationStatus } from "./passport";
export type { ProductQuery } from "./commerce";
