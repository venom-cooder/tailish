"use client";

import { Suspense } from "react";
import { NearbyFinder } from "@/components/nearby/nearby-finder";
import { ErrorState, LoadingState } from "@/components/shared/states";
import { api } from "@/lib/api";
import { useAsync } from "@/lib/hooks/use-async";
import { useRouteParam } from "@/lib/hooks/use-route-param";
import type { NearbyPlace, NearbyType } from "@/lib/types";

const VALID_TYPES: readonly string[] = [
  "vet",
  "emergency",
  "pharmacy",
  "groomer",
  "store",
  "cafe",
  "boarding",
];

/**
 * The finder reads `?type=` and loads the directory in the browser.
 *
 * It used to be a server component that awaited `searchParams`, which a static
 * export cannot prerender. Doing both client-side keeps the deep links working
 * (/nearby/?type=emergency) while the surrounding page still ships as a static
 * shell.
 */
export function NearbyRoute() {
  return (
    <Suspense fallback={<LoadingState label="Finding places near you" rows={4} />}>
      <NearbyRouteBody />
    </Suspense>
  );
}

function NearbyRouteBody() {
  const type = useRouteParam("type");
  const places = useAsync<NearbyPlace[]>(() => api.services.nearby(), []);

  if (places.loading) return <LoadingState label="Finding places near you" rows={4} />;
  if (places.error) return <ErrorState message={places.error} onRetry={places.refresh} />;

  const initialType = VALID_TYPES.includes(type) ? (type as NearbyType) : ("all" as const);

  return <NearbyFinder places={places.data ?? []} initialType={initialType} />;
}
