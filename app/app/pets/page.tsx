"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PawPrint, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PortalHeader } from "@/components/portal/portal-shell";
import { SourceBadge } from "@/components/shared/source-badge";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/states";
import { api } from "@/lib/api";
import { useAsync } from "@/lib/hooks/use-async";
import { TODAY_ISO } from "@/lib/mock/clock";
import type { Pet } from "@/lib/types";
import { daysBetween } from "@/lib/utils";

function ageLabel(pet: Pet) {
  if (pet.birthDate) {
    const months = Math.max(0, Math.round(daysBetween(pet.birthDate, TODAY_ISO) / 30.44));
    if (months < 12) return `${months} month${months === 1 ? "" : "s"}`;
    const years = Math.floor(months / 12);
    return `${years} year${years === 1 ? "" : "s"}`;
  }
  if (pet.ageMonths) return `${Math.floor(pet.ageMonths / 12)} years`;
  return "Age not recorded";
}

export default function PetsPage() {
  const pets = useAsync<Pet[]>(() => api.pets.list(), []);

  return (
    <>
      <PortalHeader
        title="My pets"
        description="Every pet in your household, each with their own Health Passport."
      >
        <Button asChild>
          <Link href="/app/pets/new">
            <Plus className="size-4" aria-hidden="true" />
            Add a pet
          </Link>
        </Button>
      </PortalHeader>

      {pets.loading ? (
        <LoadingState label="Loading your pets" rows={2} />
      ) : pets.error ? (
        <ErrorState message={pets.error} onRetry={pets.refresh} />
      ) : (pets.data ?? []).length === 0 ? (
        <EmptyState
          icon={PawPrint}
          title="No pets yet"
          description="Create a Health Passport and we'll keep every vaccination, prescription and visit in one place — free, whether or not you ever book with us."
          action={
            <Button asChild>
              <Link href="/app/pets/new">Create a Health Passport</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {pets.data?.map((pet) => (
            <Link
              key={pet.id}
              href={`/app/pets/${pet.id}`}
              className="group overflow-hidden rounded-3xl border border-hairline bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-lift"
            >
              <div className="relative aspect-[5/3] overflow-hidden bg-brand-50">
                <Image
                  src={pet.photoUrl ?? "/images/pets/bruno.svg"}
                  alt={`${pet.name}, a ${pet.breed}`}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-lg font-bold text-ink">{pet.name}</h2>
                  <SourceBadge source={pet.source} compact />
                </div>

                <p className="mt-1 text-sm text-muted">
                  {pet.breed} · {ageLabel(pet)} ·{" "}
                  {pet.sex === "male" ? "Male" : pet.sex === "female" ? "Female" : "Sex not set"}
                </p>

                <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs">
                  <div>
                    <dt className="text-muted">Weight</dt>
                    <dd className="mt-0.5 font-semibold tabular text-ink">{pet.weightKg} kg</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Passport ID</dt>
                    <dd className="mt-0.5 font-semibold tabular text-ink">{pet.passportId}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Neutered</dt>
                    <dd className="mt-0.5 font-semibold text-ink">{pet.neutered ? "Yes" : "No"}</dd>
                  </div>
                </dl>

                {pet.microchipId ? (
                  <Badge variant="verified" className="mt-4">
                    Microchipped
                  </Badge>
                ) : null}

                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 transition-colors group-hover:text-accent-600">
                  Open Health Passport
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </Link>
          ))}

          <Link
            href="/app/pets/new"
            className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-brand-200 bg-brand-50/40 p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand-400 hover:bg-brand-50"
          >
            <span className="grid size-12 place-items-center rounded-2xl bg-white text-brand-600 shadow-soft">
              <Plus className="size-6" aria-hidden="true" />
            </span>
            <span className="font-display text-base font-semibold text-ink">Add another pet</span>
            <span className="max-w-xs text-sm text-muted">
              Takes about a minute. You can fill in the medical history later.
            </span>
          </Link>
        </div>
      )}
    </>
  );
}
