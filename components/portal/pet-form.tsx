"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/label";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { api } from "@/lib/api";
import { useMutation } from "@/lib/hooks/use-async";
import { TODAY_ISO } from "@/lib/mock/clock";
import { mockBreeds } from "@/lib/mock/content";
import type { Pet, PetInput, Sex, Species } from "@/lib/types";
import { cn } from "@/lib/utils";

const SPECIES: { value: Species; label: string; emoji: string }[] = [
  { value: "dog", label: "Dog", emoji: "🐕" },
  { value: "cat", label: "Cat", emoji: "🐈" },
  { value: "rabbit", label: "Rabbit", emoji: "🐇" },
  { value: "bird", label: "Bird", emoji: "🦜" },
  { value: "other", label: "Other", emoji: "🐾" },
];

/** Shared by /app/pets/new and /app/pets/[id]/edit. */
export function PetForm({ pet }: { pet?: Pet }) {
  const router = useRouter();
  const editing = Boolean(pet);

  const [form, setForm] = React.useState<PetInput>({
    name: pet?.name ?? "",
    species: pet?.species ?? "dog",
    breed: pet?.breed ?? "",
    birthDate: pet?.birthDate ?? "",
    sex: pet?.sex ?? "unknown",
    neutered: pet?.neutered ?? false,
    weightKg: pet?.weightKg ?? 0,
    microchipId: pet?.microchipId ?? "",
    colorMarkings: pet?.colorMarkings ?? "",
    photoUrl: pet?.photoUrl,
  });

  const breedOptions = React.useMemo(
    () => mockBreeds.filter((breed) => breed.species === form.species).map((breed) => breed.name),
    [form.species],
  );

  const save = useMutation(async () => {
    const payload: PetInput = {
      ...form,
      breed: form.breed.trim(),
      name: form.name.trim(),
      birthDate: form.birthDate || undefined,
      microchipId: form.microchipId?.trim() || undefined,
      colorMarkings: form.colorMarkings?.trim() || undefined,
    };

    const saved = pet ? await api.pets.update(pet.id, payload) : await api.pets.create(payload);
    router.push(`/app/pets/${saved.id}`);
    return saved;
  });

  function update<K extends keyof PetInput>(key: K, value: PetInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void save.run();
      }}
      className="space-y-8"
    >
      <fieldset className="rounded-3xl border border-hairline bg-white p-6 shadow-soft sm:p-8">
        <legend className="px-2 font-display text-lg font-semibold text-ink">
          Who are we caring for?
        </legend>

        <div className="mt-5 flex flex-wrap gap-2.5">
          {SPECIES.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                update("species", option.value);
                update("breed", "");
              }}
              aria-pressed={form.species === option.value}
              className={cn(
                "flex min-w-24 flex-col items-center gap-1.5 rounded-2xl border px-5 py-4 transition-all",
                form.species === option.value
                  ? "border-brand-600 bg-brand-50/60 ring-2 ring-brand-600/15"
                  : "border-hairline hover:border-brand-300 hover:bg-brand-50/30",
              )}
            >
              <span aria-hidden="true" className="text-2xl">
                {option.emoji}
              </span>
              <span className="text-sm font-medium text-ink">{option.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <Field label="Pet's name" htmlFor="pet-name" required>
            <Input
              id="pet-name"
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
              placeholder="Bruno"
            />
          </Field>

          <Field
            label="Breed"
            htmlFor="pet-breed"
            required
            hint="Not sure? 'Mixed / Indie' is a perfectly good answer."
          >
            <Input
              id="pet-breed"
              list="breed-options"
              value={form.breed}
              onChange={(event) => update("breed", event.target.value)}
              placeholder="Golden Retriever"
            />
            <datalist id="breed-options">
              {breedOptions.map((breed) => (
                <option key={breed} value={breed} />
              ))}
              <option value="Mixed / Indie" />
            </datalist>
          </Field>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <Field label="Date of birth" htmlFor="pet-dob" hint="Approximate is fine.">
            <Input
              id="pet-dob"
              type="date"
              max={TODAY_ISO}
              value={form.birthDate}
              onChange={(event) => update("birthDate", event.target.value)}
            />
          </Field>

          <Field label="Sex" htmlFor="pet-sex">
            <Select
              id="pet-sex"
              value={form.sex}
              onChange={(event) => update("sex", event.target.value as Sex)}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="unknown">Not sure</option>
            </Select>
          </Field>

          <Field label="Weight (kg)" htmlFor="pet-weight" required>
            <Input
              id="pet-weight"
              type="number"
              min={0.1}
              step={0.1}
              inputMode="decimal"
              value={form.weightKg || ""}
              onChange={(event) => update("weightKg", Number(event.target.value))}
              placeholder="28.6"
            />
          </Field>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-hairline bg-brand-50/40 p-5">
          <div>
            <p className="text-sm font-medium text-ink">Neutered or spayed</p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted">
              Affects nutrition and screening recommendations.
            </p>
          </div>
          <Switch
            checked={form.neutered}
            onCheckedChange={(checked) => update("neutered", checked)}
            aria-label="Neutered or spayed"
          />
        </div>
      </fieldset>

      <fieldset className="rounded-3xl border border-hairline bg-white p-6 shadow-soft sm:p-8">
        <legend className="px-2 font-display text-lg font-semibold text-ink">
          Identifying details
          <span className="ml-2 text-sm font-normal text-muted">(optional)</span>
        </legend>

        <div className="mt-5 space-y-5">
          <Field
            label="Microchip number"
            htmlFor="pet-chip"
            hint="The 15-digit number on the microchip certificate."
          >
            <Input
              id="pet-chip"
              inputMode="numeric"
              value={form.microchipId}
              onChange={(event) => update("microchipId", event.target.value)}
              placeholder="900215000123456"
            />
          </Field>

          <Field
            label="Colour and markings"
            htmlFor="pet-marks"
            hint="Useful on a lost-pet poster, and for identification at a boarding facility."
          >
            <Textarea
              id="pet-marks"
              rows={3}
              value={form.colorMarkings}
              onChange={(event) => update("colorMarkings", event.target.value)}
              placeholder="Golden, white blaze on chest"
            />
          </Field>
        </div>
      </fieldset>

      {save.error ? (
        <p role="alert" className="text-sm text-red-600">
          {save.error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" size="lg" disabled={save.pending}>
          {save.pending ? (
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="size-5" aria-hidden="true" />
          )}
          {editing ? "Save changes" : "Create Health Passport"}
        </Button>
        <Button type="button" size="lg" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <p className="text-xs leading-relaxed text-muted">
        Everything you enter here is recorded as{" "}
        <span className="font-medium text-ink">parent entered</span>. A vet can verify it during
        your first visit, or you can upload a document and we&apos;ll extract the details.
      </p>
    </form>
  );
}
