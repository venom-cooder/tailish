import type { Pet, Vaccination } from "@/lib/types";

/**
 * The illustration used by the Health Passport marketing sections.
 *
 * This exists so those pages stop importing `lib/mock`. The mock store was
 * never a marketing prop — it was a working fake backend whose two dogs,
 * Bruno and Misty, loaded into every visitor's browser as if they owned them.
 * That is now parked, and what a landing page needs is only this: one made-up
 * pet, labelled as made up, to show the shape of a record.
 *
 * Everything here is deliberately generic. "Simba" is not a customer, the
 * passport number is not in any sequence, and nothing is presented as a real
 * animal's medical history. If you add fields, keep them plainly illustrative.
 */

export const samplePet: Pet = {
  id: "sample",
  name: "Simba",
  species: "dog",
  breed: "Indie (Desi)",
  ageMonths: 36,
  sex: "male",
  neutered: true,
  weightKg: 18.4,
  source: "vet_verified",
  passportId: "TL-SAMPLE",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

export const sampleVaccinations: Vaccination[] = [
  {
    id: "sample-vax-1",
    petId: "sample",
    vaccineName: "Rabies",
    dateGiven: "2026-02-14",
    nextDueDate: "2027-02-14",
    status: "completed",
    source: "vet_verified",
  },
  {
    id: "sample-vax-2",
    petId: "sample",
    vaccineName: "DHPPi",
    dateGiven: "2026-02-14",
    nextDueDate: "2027-02-14",
    status: "completed",
    source: "vet_verified",
  },
];
