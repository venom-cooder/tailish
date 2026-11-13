import { TODAY_ISO } from "@/lib/mock/clock";
import { getState, persist } from "@/lib/mock/store";
import type { Pet, PetInput } from "@/lib/types";
import { nextId } from "@/lib/utils";
import { badRequest, call, notFound } from "./client";

/** Passport ids are human-readable and shown on the shared card. */
function makePassportId(seed: number) {
  return `TL-${(100000 + ((seed * 7919) % 899999)).toString()}`;
}

export const petsApi = {
  /** GET /pets */
  list: () =>
    call<Pet[]>({
      method: "GET",
      path: "/pets",
      mock: () => getState().pets,
    }),

  /** GET /pets/:id */
  get: (id: string) =>
    call<Pet>({
      method: "GET",
      path: `/pets/${id}`,
      mock: () => {
        const pet = getState().pets.find((p) => p.id === id);
        if (!pet) notFound("We couldn't find that pet in your account.");
        return pet;
      },
    }),

  /** POST /pets */
  create: (input: PetInput) =>
    call<Pet>({
      method: "POST",
      path: "/pets",
      body: input,
      mock: () => {
        const state = getState();
        if (!input.name?.trim()) badRequest("Your pet needs a name.", { field: "name" });
        if (!input.breed?.trim()) badRequest("Select a breed, or choose 'Mixed / Indie'.", { field: "breed" });
        if (!(input.weightKg > 0)) badRequest("Enter a weight greater than zero.", { field: "weightKg" });

        const pet: Pet = {
          ...input,
          id: nextId("pet"),
          source: "parent_entered",
          passportId: makePassportId(state.pets.length + 3),
          createdAt: `${TODAY_ISO}T00:00:00.000Z`,
          updatedAt: `${TODAY_ISO}T00:00:00.000Z`,
        };
        state.pets = [...state.pets, pet];
        persist();
        return pet;
      },
    }),

  /** PATCH /pets/:id */
  update: (id: string, patch: Partial<PetInput>) =>
    call<Pet>({
      method: "PATCH",
      path: `/pets/${id}`,
      body: patch,
      mock: () => {
        const state = getState();
        const existing = state.pets.find((p) => p.id === id);
        if (!existing) notFound("We couldn't find that pet in your account.");
        const updated: Pet = {
          ...existing,
          ...patch,
          updatedAt: new Date().toISOString(),
        };
        state.pets = state.pets.map((p) => (p.id === id ? updated : p));
        persist();
        return updated;
      },
    }),
};
