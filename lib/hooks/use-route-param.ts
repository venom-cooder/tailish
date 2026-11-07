"use client";

import { useSearchParams } from "next/navigation";

/**
 * Reads a record id out of the query string.
 *
 * The site ships as a static export (AxisIQ Sites serves files as-is and runs
 * no build step), and a static export cannot prerender `[id]` path segments.
 * So record pages carry their id in the query string — `/app/pet/?id=pet_01`
 * rather than `/app/pets/pet_01`.
 *
 * Callers must sit inside a Suspense boundary: `useSearchParams` suspends
 * while the shell is being prerendered.
 */
export function useRouteParam(name: string): string {
  return useSearchParams().get(name) ?? "";
}
