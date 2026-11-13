"use client";

import { PortalHeader } from "@/components/portal/portal-shell";
import { PetForm } from "@/components/portal/pet-form";

export default function NewPetPage() {
  return (
    <>
      <PortalHeader
        title="Add a pet"
        description="Create a free Health Passport. You can fill in medical history later — or upload a vaccination card and we'll do it for you."
        backHref="/app/pets"
      />
      <div className="max-w-3xl">
        <PetForm />
      </div>
    </>
  );
}
