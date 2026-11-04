"use client";

import * as React from "react";
import {
  Clock,
  Coffee,
  Hotel,
  MapPin,
  Navigation,
  Phone,
  Pill,
  Scissors,
  Search,
  ShieldPlus,
  Star,
  Stethoscope,
  Store,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/states";
import type { NearbyPlace, NearbyType } from "@/lib/types";
import { cn } from "@/lib/utils";

const TYPE_META: Record<
  NearbyType,
  { label: string; icon: React.ComponentType<{ className?: string }>; accent: boolean }
> = {
  vet: { label: "Vets & clinics", icon: Stethoscope, accent: false },
  emergency: { label: "24×7 emergency", icon: ShieldPlus, accent: true },
  pharmacy: { label: "Pharmacies", icon: Pill, accent: false },
  groomer: { label: "Groomers", icon: Scissors, accent: false },
  store: { label: "Pet stores", icon: Store, accent: false },
  cafe: { label: "Pet-friendly cafés", icon: Coffee, accent: false },
  boarding: { label: "Boarding", icon: Hotel, accent: false },
};

/**
 * A schematic map rather than an embedded tile service.
 *
 * Places are plotted from their real latitude and longitude, normalised to the
 * bounding box of the current result set. Swapping in Google Maps or Mapbox
 * later means replacing this one component — the data shape already carries
 * `geo`, so nothing upstream changes.
 */
function SchematicMap({
  places,
  activeId,
  onSelect,
}: {
  places: NearbyPlace[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  const bounds = React.useMemo(() => {
    if (places.length === 0) return null;
    const lats = places.map((p) => p.geo.lat);
    const lngs = places.map((p) => p.geo.lng);
    return {
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
      minLng: Math.min(...lngs),
      maxLng: Math.max(...lngs),
    };
  }, [places]);

  if (!bounds) {
    return (
      <div className="grid h-full min-h-72 place-items-center rounded-3xl border border-hairline bg-brand-50/50 text-sm text-muted">
        Nothing to plot
      </div>
    );
  }

  const latSpan = Math.max(0.0001, bounds.maxLat - bounds.minLat);
  const lngSpan = Math.max(0.0001, bounds.maxLng - bounds.minLng);

  return (
    <div className="paw-field relative h-full min-h-80 overflow-hidden rounded-3xl border border-hairline bg-brand-900">
      {/* Grid lines, purely decorative. */}
      <svg aria-hidden="true" className="absolute inset-0 size-full opacity-20">
        <defs>
          <pattern id="map-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0v48" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#map-grid)" />
      </svg>

      {places.map((place) => {
        const left = 8 + ((place.geo.lng - bounds.minLng) / lngSpan) * 84;
        const top = 8 + (1 - (place.geo.lat - bounds.minLat) / latSpan) * 84;
        const meta = TYPE_META[place.type];
        const active = activeId === place.id;

        return (
          <button
            key={place.id}
            type="button"
            onClick={() => onSelect(place.id)}
            style={{ left: `${left}%`, top: `${top}%` }}
            aria-label={`${place.name}, ${place.area}, ${place.distanceKm} km away`}
            aria-pressed={active}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-2 transition-all duration-300",
              active
                ? "z-10 scale-125 bg-accent-500 text-white shadow-lift"
                : meta.accent
                  ? "bg-white text-accent-600 shadow-soft hover:scale-110"
                  : "bg-white text-brand-700 shadow-soft hover:scale-110",
            )}
          >
            <meta.icon className="size-4" aria-hidden="true" />
          </button>
        );
      })}

      <p className="absolute bottom-3 left-4 text-[0.65rem] text-white/50">
        Schematic view · {places.length} place{places.length === 1 ? "" : "s"} plotted
      </p>
    </div>
  );
}

export function NearbyFinder({
  places,
  initialType = "all",
}: {
  places: NearbyPlace[];
  initialType?: NearbyType | "all";
}) {
  const [type, setType] = React.useState<NearbyType | "all">(initialType);
  const [area, setArea] = React.useState("all");
  const [query, setQuery] = React.useState("");
  const [openNowOnly, setOpenNowOnly] = React.useState(false);
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const areas = React.useMemo(
    () => Array.from(new Set(places.map((place) => place.area))).sort(),
    [places],
  );

  const filtered = React.useMemo(() => {
    const term = query.trim().toLowerCase();
    return places
      .filter((place) => {
        if (type !== "all" && place.type !== type) return false;
        if (area !== "all" && place.area !== area) return false;
        if (openNowOnly && !place.openNow) return false;
        if (term) {
          const haystack =
            `${place.name} ${place.area} ${place.address} ${place.tags.join(" ")}`.toLowerCase();
          if (!haystack.includes(term)) return false;
        }
        return true;
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [places, type, area, query, openNowOnly]);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
      <div>
        {/* Filters */}
        <div className="space-y-4">
          <div className="scrollbar-thin flex gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setType("all")}
              aria-pressed={type === "all"}
              className={cn(
                "shrink-0 rounded-xl border px-4 py-2 text-sm font-medium transition-all",
                type === "all"
                  ? "border-brand-700 bg-brand-700 text-white"
                  : "border-hairline bg-white text-muted hover:border-brand-300 hover:text-brand-700",
              )}
            >
              Everything
            </button>
            {(Object.keys(TYPE_META) as NearbyType[]).map((value) => {
              const meta = TYPE_META[value];
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setType(value)}
                  aria-pressed={type === value}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all",
                    type === value
                      ? meta.accent
                        ? "border-accent-500 bg-accent-500 text-white"
                        : "border-brand-700 bg-brand-700 text-white"
                      : "border-hairline bg-white text-muted hover:border-brand-300 hover:text-brand-700",
                  )}
                >
                  <meta.icon className="size-4" aria-hidden="true" />
                  {meta.label}
                </button>
              );
            })}
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <Input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name or service…"
                aria-label="Search nearby places"
                className="pl-11"
              />
            </div>

            <Select
              value={area}
              onChange={(event) => setArea(event.target.value)}
              aria-label="Filter by area"
              className="sm:w-44"
            >
              <option value="all">All areas</option>
              {areas.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Select>

            <Button
              variant={openNowOnly ? "brand" : "outline"}
              onClick={() => setOpenNowOnly((value) => !value)}
              aria-pressed={openNowOnly}
            >
              <Clock className="size-4" aria-hidden="true" />
              Open now
            </Button>
          </div>
        </div>

        <p className="mt-6 text-sm text-muted" aria-live="polite">
          {filtered.length} place{filtered.length === 1 ? "" : "s"} found
        </p>

        {/* Results */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="Nothing here yet"
            description="Try widening the area or clearing the filters. If somewhere's missing, tell us and we'll verify and add it."
            className="mt-6"
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setType("all");
                  setArea("all");
                  setQuery("");
                  setOpenNowOnly(false);
                }}
              >
                Clear filters
              </Button>
            }
          />
        ) : (
          <ul className="mt-6 space-y-3">
            {filtered.map((place) => {
              const meta = TYPE_META[place.type];
              const active = activeId === place.id;

              return (
                <li key={place.id}>
                  <article
                    onMouseEnter={() => setActiveId(place.id)}
                    onFocus={() => setActiveId(place.id)}
                    className={cn(
                      "rounded-2xl border bg-white p-5 shadow-soft transition-all duration-300",
                      active
                        ? "border-brand-400 shadow-lift"
                        : "border-hairline hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lift",
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className={cn(
                          "grid size-11 shrink-0 place-items-center rounded-xl",
                          meta.accent
                            ? "bg-accent-50 text-accent-600"
                            : "bg-brand-50 text-brand-600",
                        )}
                      >
                        <meta.icon className="size-5" aria-hidden="true" />
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-ink">{place.name}</h3>
                          {place.open24h ? <Badge variant="accent">24×7</Badge> : null}
                          {place.verified ? <Badge variant="verified">Verified</Badge> : null}
                          {!place.openNow && !place.open24h ? (
                            <Badge variant="outline">Closed now</Badge>
                          ) : null}
                        </div>

                        <p className="mt-1 text-sm text-muted">{place.address}</p>

                        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted">
                          <span className="flex items-center gap-1.5">
                            <Star className="size-3.5 fill-gold-500 text-gold-500" aria-hidden="true" />
                            <span className="font-medium tabular text-ink">{place.rating}</span>
                            <span>({place.reviewCount})</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Navigation className="size-3.5" aria-hidden="true" />
                            <span className="tabular">{place.distanceKm} km</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="size-3.5" aria-hidden="true" />
                            {place.hours}
                          </span>
                        </div>

                        <ul className="mt-3 flex flex-wrap gap-1.5">
                          {place.tags.slice(0, 4).map((tag) => (
                            <li key={tag}>
                              <Badge variant="outline">{tag}</Badge>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {place.phone ? (
                      <div className="mt-4 flex flex-wrap gap-2 border-t border-hairline pt-4">
                        <Button
                          asChild
                          size="sm"
                          variant={meta.accent ? "danger" : "outline"}
                        >
                          <a href={`tel:${place.phone.replace(/\s/g, "")}`}>
                            <Phone className="size-4" aria-hidden="true" />
                            {place.phone}
                          </a>
                        </Button>
                        <Button asChild size="sm" variant="ghost">
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${place.geo.lat},${place.geo.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Navigation className="size-4" aria-hidden="true" />
                            Directions
                          </a>
                        </Button>
                      </div>
                    ) : null}
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="lg:sticky lg:top-28">
        <SchematicMap places={filtered} activeId={activeId} onSelect={setActiveId} />

        <p className="mt-4 text-xs leading-relaxed text-muted">
          Listings marked <span className="font-medium text-ink">Verified</span> have been checked by
          the Tailish care desk — registration, phone number and hours confirmed within the last
          ninety days. Everything else is community-contributed. Always call ahead in an emergency.
        </p>
      </div>
    </div>
  );
}
