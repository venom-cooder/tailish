"use client";

import { use } from "react";
import { PortalHeader } from "@/components/portal/portal-shell";
import { PetForm } from "@/components/portal/pet-form";
import { ErrorState, LoadingState } from "@/components/shared/states";
import { api } from "@/lib/api";
import { useAsync } from "@/lib/hooks/use-async";
import type { Pet } from "@/lib/types";

export default function EditPetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const pet = useAsync<Pet>(() => api.pets.get(id), [id]);

  return (
    <>
      <PortalHeader
        title={pet.data ? `Edit ${pet.data.name}` : "Edit pet"}
        description="Changes are recorded as parent entered until a vet verifies them."
        backHref={`/app/pets/${id}`}
      />

      <div className="max-w-3xl">
        {pet.loading ? (
          <LoadingState label="Loading pet details" rows={4} />
        ) : pet.error ? (
          <ErrorState message={pet.error} onRetry={pet.refresh} />
        ) : pet.data ? (
          <PetForm pet={pet.data} />
        ) : null}
      </div>
    </>
  );
}
