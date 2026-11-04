"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  Check,
  Clock,
  Loader2,
  MapPin,
  PawPrint,
  Phone,
  Stethoscope,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/label";
import { Select, Textarea } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ErrorState, LoadingState } from "@/components/shared/states";
import { WhatsAppButton } from "@/components/whatsapp/whatsapp-button";
import { api, bookableDates } from "@/lib/api";
import { useAsync, useMutation } from "@/lib/hooks/use-async";
import type {
  Address,
  Booking,
  Pet,
  Service,
  ServiceSlug,
  SymptomIntakeResult,
  Urgency,
} from "@/lib/types";
import { whatsappMessages } from "@/lib/whatsapp";
import { cn, formatDateLong, formatINR } from "@/lib/utils";

const STEPS = ["Your pet", "The concern", "Care type", "Date & time", "Confirm"] as const;
type StepIndex = 0 | 1 | 2 | 3 | 4;

const URGENCY_META: Record<
  Urgency,
  { label: string; tone: "verified" | "accent" | "danger" | "default"; blurb: string }
> = {
  routine: {
    label: "Routine",
    tone: "verified",
    blurb: "This can be handled as a scheduled consultation.",
  },
  soon: {
    label: "Needs a vet soon",
    tone: "accent",
    blurb: "Worth a vet's eyes within the next day or so.",
  },
  urgent: {
    label: "Urgent",
    tone: "danger",
    blurb: "This should be seen today.",
  },
  emergency: {
    label: "Emergency",
    tone: "danger",
    blurb: "Go to a 24-hour hospital now.",
  },
};

export function BookingFlow() {
  const [step, setStep] = React.useState<StepIndex>(0);

  // Selections. Pet and address default to the first/default entry once the
  // lists load — derived below rather than copied into state by an effect.
  const [chosenPetId, setChosenPetId] = React.useState<string | null>(null);
  const [concern, setConcern] = React.useState("");
  const [durationHours, setDurationHours] = React.useState(24);
  const [appetite, setAppetite] = React.useState("normal");
  const [energy, setEnergy] = React.useState("normal");
  const [serviceSlug, setServiceSlug] = React.useState<ServiceSlug | "">("");
  const [providerId, setProviderId] = React.useState<string>("");
  const [date, setDate] = React.useState(bookableDates()[1]);
  const [slotLabel, setSlotLabel] = React.useState("");
  const [slotStartsAt, setSlotStartsAt] = React.useState("");
  const [chosenAddressId, setChosenAddressId] = React.useState<string | null>(null);
  const [notes, setNotes] = React.useState("");

  const [intake, setIntake] = React.useState<SymptomIntakeResult | null>(null);
  const [booking, setBooking] = React.useState<Booking | null>(null);

  const pets = useAsync<Pet[]>(() => api.pets.list(), []);
  const services = useAsync<Service[]>(() => api.services.list(), []);
  const addresses = useAsync<Address[]>(() => api.account.listAddresses(), []);

  const petId = chosenPetId ?? pets.data?.[0]?.id ?? "";
  const setPetId = setChosenPetId;

  const addressId =
    chosenAddressId ??
    (addresses.data?.find((address) => address.isDefault) ?? addresses.data?.[0])?.id ??
    "";
  const setAddressId = setChosenAddressId;

  const selectedPet = pets.data?.find((p) => p.id === petId) ?? null;
  const selectedService = services.data?.find((s) => s.slug === serviceSlug) ?? null;
  const needsAddress = serviceSlug !== "video-consult";

  const slots = useAsync(
    () =>
      serviceSlug
        ? api.services.listSlots(serviceSlug as ServiceSlug, date)
        : Promise.resolve({ date, slots: [] }),
    [serviceSlug, date],
  );

  const providers = useAsync(
    () =>
      serviceSlug
        ? api.services.listProviders({ service: serviceSlug as ServiceSlug })
        : Promise.resolve([]),
    [serviceSlug],
  );

  const runIntake = useMutation(async () => {
    const result = await api.ai.symptomIntake({
      petId,
      primaryConcern: concern,
      durationHours,
      answers: { appetite, energy },
    });
    setIntake(result);
    // Pre-select the service the triage recommends, so the common path is one tap.
    if (result.recommendedServiceSlugs[0]) {
      setServiceSlug(result.recommendedServiceSlugs[0] as ServiceSlug);
    }
    return result;
  });

  const submitBooking = useMutation(async () => {
    const result = await api.services.createBooking({
      petId,
      serviceSlug: serviceSlug as ServiceSlug,
      providerId: providerId || undefined,
      scheduledFor: slotStartsAt,
      slotLabel,
      addressId: needsAddress ? addressId : undefined,
      notes: notes.trim() || undefined,
    });
    setBooking(result);
    return result;
  });

  async function handleNext() {
    if (step === 1) {
      const result = await runIntake.run();
      if (!result) return;
    }
    if (step === 4) {
      await submitBooking.run();
      return;
    }
    setStep((current) => Math.min(4, current + 1) as StepIndex);
  }

  const canAdvance = (() => {
    switch (step) {
      case 0:
        return Boolean(petId);
      case 1:
        return concern.trim().length >= 3;
      case 2:
        return Boolean(serviceSlug);
      case 3:
        return Boolean(slotLabel) && (!needsAddress || Boolean(addressId));
      case 4:
        return true;
      default:
        return false;
    }
  })();

  if (booking) return <BookingConfirmation booking={booking} />;

  if (pets.loading || services.loading) {
    return <LoadingState label="Loading the booking form" rows={4} />;
  }

  if (pets.error) {
    return <ErrorState message={pets.error} onRetry={pets.refresh} />;
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-hairline bg-white shadow-soft">
      {/* Progress */}
      <div className="border-b border-hairline bg-brand-50/40 px-6 py-5 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-ink">
            Step {step + 1} of {STEPS.length}
            <span className="ml-2 font-normal text-muted">{STEPS[step]}</span>
          </p>
          <ol className="hidden items-center gap-1.5 sm:flex">
            {STEPS.map((label, index) => (
              <li key={label}>
                <span
                  className={cn(
                    "grid size-7 place-items-center rounded-full text-xs font-semibold transition-colors",
                    index < step
                      ? "bg-brand-600 text-white"
                      : index === step
                        ? "bg-accent-500 text-white"
                        : "bg-white text-muted ring-1 ring-hairline",
                  )}
                  aria-label={`${label}${index < step ? " — done" : index === step ? " — current" : ""}`}
                >
                  {index < step ? <Check className="size-3.5" aria-hidden="true" /> : index + 1}
                </span>
              </li>
            ))}
          </ol>
        </div>
        <Progress
          value={((step + 1) / STEPS.length) * 100}
          className="mt-3 h-1.5"
          label="Booking progress"
        />
      </div>

      <div className="px-6 py-7 sm:px-8 sm:py-8">
        {/* ---------------------------------------------------- step 0 */}
        {step === 0 ? (
          <fieldset>
            <legend className="font-display text-xl font-semibold text-ink">
              Who are we seeing?
            </legend>
            <p className="mt-1.5 text-sm text-muted">
              The vet reads this pet&apos;s Health Passport before the visit.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {pets.data?.map((pet) => (
                <label
                  key={pet.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-all",
                    petId === pet.id
                      ? "border-brand-600 bg-brand-50/60 ring-2 ring-brand-600/15"
                      : "border-hairline hover:border-brand-300 hover:bg-brand-50/30",
                  )}
                >
                  <input
                    type="radio"
                    name="pet"
                    value={pet.id}
                    checked={petId === pet.id}
                    onChange={() => setPetId(pet.id)}
                    className="sr-only"
                  />
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-700">
                    <PawPrint className="size-6" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-ink">{pet.name}</span>
                    <span className="block text-xs text-muted">
                      {pet.breed} · {pet.weightKg} kg
                    </span>
                  </span>
                  {petId === pet.id ? (
                    <Check className="ml-auto size-5 shrink-0 text-brand-600" aria-hidden="true" />
                  ) : null}
                </label>
              ))}

              <Link
                href="/app/pets/new"
                className="flex items-center gap-4 rounded-2xl border border-dashed border-brand-200 p-4 transition-colors hover:border-brand-400 hover:bg-brand-50/30"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <PawPrint className="size-6" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink">Add another pet</span>
                  <span className="block text-xs text-muted">Takes about a minute</span>
                </span>
              </Link>
            </div>
          </fieldset>
        ) : null}

        {/* ---------------------------------------------------- step 1 */}
        {step === 1 ? (
          <fieldset>
            <legend className="font-display text-xl font-semibold text-ink">
              What&apos;s going on with {selectedPet?.name}?
            </legend>
            <p className="mt-1.5 text-sm text-muted">
              Plain language is fine — a vet reads this, not a form parser.
            </p>

            <div className="mt-6 space-y-5">
              <Field
                label="The main concern"
                htmlFor="concern"
                required
                hint="For example: scratching more than usual for the last few days, mostly at night."
              >
                <Textarea
                  id="concern"
                  value={concern}
                  onChange={(event) => setConcern(event.target.value)}
                  placeholder="Describe what you've noticed…"
                  rows={4}
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-3">
                <Field label="How long has this been going on?" htmlFor="duration">
                  <Select
                    id="duration"
                    value={durationHours}
                    onChange={(event) => setDurationHours(Number(event.target.value))}
                  >
                    <option value={2}>A few hours</option>
                    <option value={24}>About a day</option>
                    <option value={72}>Two to three days</option>
                    <option value={168}>About a week</option>
                    <option value={720}>Longer than a month</option>
                  </Select>
                </Field>

                <Field label="Appetite" htmlFor="appetite">
                  <Select
                    id="appetite"
                    value={appetite}
                    onChange={(event) => setAppetite(event.target.value)}
                  >
                    <option value="normal">Eating normally</option>
                    <option value="reduced">Eating less</option>
                    <option value="none">Not eating</option>
                    <option value="increased">Eating more than usual</option>
                  </Select>
                </Field>

                <Field label="Energy level" htmlFor="energy">
                  <Select id="energy" value={energy} onChange={(event) => setEnergy(event.target.value)}>
                    <option value="normal">Normal</option>
                    <option value="low">A bit low</option>
                    <option value="very_low">Very lethargic</option>
                    <option value="restless">Restless</option>
                  </Select>
                </Field>
              </div>
            </div>

            {runIntake.error ? (
              <p role="alert" className="mt-4 text-sm text-red-600">
                {runIntake.error}
              </p>
            ) : null}
          </fieldset>
        ) : null}

        {/* ---------------------------------------------------- step 2 */}
        {step === 2 ? (
          <div>
            {intake ? <IntakeSummary intake={intake} /> : null}

            <fieldset className="mt-7">
              <legend className="font-display text-xl font-semibold text-ink">
                Choose the kind of care
              </legend>

              <div className="mt-5 space-y-3">
                {services.data
                  ?.filter((service) => service.slug !== "book-visit")
                  .map((service) => {
                    const recommended = intake?.recommendedServiceSlugs[0] === service.slug;
                    return (
                      <label
                        key={service.slug}
                        className={cn(
                          "flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition-all",
                          serviceSlug === service.slug
                            ? "border-brand-600 bg-brand-50/60 ring-2 ring-brand-600/15"
                            : "border-hairline hover:border-brand-300 hover:bg-brand-50/30",
                        )}
                      >
                        <input
                          type="radio"
                          name="service"
                          value={service.slug}
                          checked={serviceSlug === service.slug}
                          onChange={() => {
                            setServiceSlug(service.slug);
                            setSlotLabel("");
                          }}
                          className="sr-only"
                        />
                        <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-700">
                          <Stethoscope className="size-5" aria-hidden="true" />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-ink">{service.name}</span>
                            {recommended ? <Badge variant="accent">Recommended</Badge> : null}
                          </span>
                          <span className="mt-1 block text-sm leading-relaxed text-muted">
                            {service.shortDescription}
                          </span>
                        </span>

                        <span className="shrink-0 text-right">
                          <span className="block tabular font-bold text-ink">
                            {formatINR(service.priceFrom)}
                          </span>
                          <span className="block text-xs text-muted">{service.durationMin} min</span>
                        </span>
                      </label>
                    );
                  })}
              </div>
            </fieldset>
          </div>
        ) : null}

        {/* ---------------------------------------------------- step 3 */}
        {step === 3 ? (
          <div className="space-y-8">
            <fieldset>
              <legend className="font-display text-xl font-semibold text-ink">Pick a date</legend>
              <div className="scrollbar-thin mt-5 flex gap-2 overflow-x-auto pb-2">
                {bookableDates(7).map((value, index) => {
                  const dayDate = new Date(`${value}T00:00:00Z`);
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setDate(value);
                        setSlotLabel("");
                      }}
                      className={cn(
                        "flex min-w-[4.5rem] shrink-0 flex-col items-center gap-0.5 rounded-2xl border px-3 py-3 transition-all",
                        date === value
                          ? "border-brand-600 bg-brand-600 text-white"
                          : "border-hairline hover:border-brand-300 hover:bg-brand-50",
                      )}
                    >
                      <span className="text-[0.65rem] uppercase tracking-wide opacity-80">
                        {index === 0
                          ? "Today"
                          : index === 1
                            ? "Tomorrow"
                            : dayDate.toLocaleDateString("en-IN", {
                                weekday: "short",
                                timeZone: "UTC",
                              })}
                      </span>
                      <span className="text-lg font-bold tabular">{dayDate.getUTCDate()}</span>
                      <span className="text-[0.65rem] opacity-80">
                        {dayDate.toLocaleDateString("en-IN", { month: "short", timeZone: "UTC" })}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset>
              <legend className="font-display text-xl font-semibold text-ink">Pick a time</legend>
              {slots.loading ? (
                <div className="mt-5 grid gap-2 sm:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="h-12 animate-pulse rounded-2xl bg-brand-50" />
                  ))}
                </div>
              ) : (
                <div className="mt-5 grid gap-2 sm:grid-cols-3">
                  {slots.data?.slots.map((slot) => (
                    <button
                      key={slot.label}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => {
                        setSlotLabel(slot.label);
                        setSlotStartsAt(slot.startsAt);
                      }}
                      className={cn(
                        "rounded-2xl border px-4 py-3 text-sm font-medium transition-all",
                        slotLabel === slot.label
                          ? "border-brand-600 bg-brand-600 text-white"
                          : slot.available
                            ? "border-hairline text-ink hover:border-brand-300 hover:bg-brand-50"
                            : "cursor-not-allowed border-hairline bg-brand-50/50 text-muted/50 line-through",
                      )}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              )}
            </fieldset>

            <fieldset>
              <legend className="font-display text-xl font-semibold text-ink">
                Preferred vet <span className="text-sm font-normal text-muted">(optional)</span>
              </legend>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                <label
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-all",
                    providerId === ""
                      ? "border-brand-600 bg-brand-50/60"
                      : "border-hairline hover:border-brand-300",
                  )}
                >
                  <input
                    type="radio"
                    name="provider"
                    checked={providerId === ""}
                    onChange={() => setProviderId("")}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium text-ink">
                    Any available vet
                    <span className="block text-xs font-normal text-muted">Usually fastest</span>
                  </span>
                </label>

                {providers.data?.map((provider) => (
                  <label
                    key={provider.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-all",
                      providerId === provider.id
                        ? "border-brand-600 bg-brand-50/60"
                        : "border-hairline hover:border-brand-300",
                    )}
                  >
                    <input
                      type="radio"
                      name="provider"
                      checked={providerId === provider.id}
                      onChange={() => setProviderId(provider.id)}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium text-ink">
                      {provider.name}
                      <span className="block text-xs font-normal text-muted">
                        {provider.specialities[0]} · {provider.area}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {needsAddress ? (
              <fieldset>
                <legend className="font-display text-xl font-semibold text-ink">
                  Where should the vet come?
                </legend>
                <div className="mt-5 space-y-2">
                  {addresses.data?.map((address) => (
                    <label
                      key={address.id}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all",
                        addressId === address.id
                          ? "border-brand-600 bg-brand-50/60 ring-2 ring-brand-600/15"
                          : "border-hairline hover:border-brand-300",
                      )}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={addressId === address.id}
                        onChange={() => setAddressId(address.id)}
                        className="sr-only"
                      />
                      <MapPin className="mt-0.5 size-5 shrink-0 text-brand-500" aria-hidden="true" />
                      <span className="min-w-0">
                        <span className="flex items-center gap-2 text-sm font-semibold capitalize text-ink">
                          {address.label}
                          {address.isDefault ? <Badge>Default</Badge> : null}
                        </span>
                        <span className="mt-0.5 block text-xs text-muted">
                          {address.line1}
                          {address.line2 ? `, ${address.line2}` : ""}, {address.city}{" "}
                          {address.pincode}
                        </span>
                      </span>
                    </label>
                  ))}

                  <Link
                    href="/app/addresses"
                    className="block rounded-2xl border border-dashed border-brand-200 p-4 text-sm font-medium text-brand-700 transition-colors hover:border-brand-400 hover:bg-brand-50/30"
                  >
                    + Add a new address
                  </Link>
                </div>
              </fieldset>
            ) : null}
          </div>
        ) : null}

        {/* ---------------------------------------------------- step 4 */}
        {step === 4 ? (
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">Review and confirm</h2>
            <p className="mt-1.5 text-sm text-muted">
              You can reschedule or cancel free up to two hours before.
            </p>

            <dl className="mt-6 divide-y divide-hairline rounded-2xl border border-hairline">
              <Row label="Pet" value={`${selectedPet?.name} · ${selectedPet?.breed}`} />
              <Row label="Service" value={selectedService?.name ?? "—"} />
              <Row label="When" value={`${formatDateLong(date)}, ${slotLabel}`} />
              {needsAddress ? (
                <Row
                  label="Where"
                  value={(() => {
                    const address = addresses.data?.find((a) => a.id === addressId);
                    return address
                      ? `${address.line1}, ${address.city} ${address.pincode}`
                      : "Not selected";
                  })()}
                />
              ) : (
                <Row label="Where" value="Video call — link sent before the slot" />
              )}
              <Row
                label="Vet"
                value={
                  providers.data?.find((p) => p.id === providerId)?.name ?? "Any available vet"
                }
              />
              <Row
                label="Price"
                value={selectedService ? formatINR(selectedService.priceFrom) : "—"}
                emphasis
              />
            </dl>

            <div className="mt-6">
              <Field
                label="Anything the vet should know?"
                htmlFor="notes"
                hint="Access instructions, temperament, or anything else useful."
              >
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Optional"
                  rows={3}
                />
              </Field>
            </div>

            {submitBooking.error ? (
              <p role="alert" className="mt-4 text-sm text-red-600">
                {submitBooking.error}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Footer actions */}
      <div className="flex flex-col gap-3 border-t border-hairline bg-brand-50/40 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-2">
          {step > 0 ? (
            <Button
              variant="ghost"
              onClick={() => setStep((current) => Math.max(0, current - 1) as StepIndex)}
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back
            </Button>
          ) : null}
          <WhatsAppButton
            variant="ghost"
            size="sm"
            text={whatsappMessages.bookVisit}
            label="Continue on WhatsApp"
          />
        </div>

        <Button
          size="lg"
          disabled={!canAdvance || runIntake.pending || submitBooking.pending}
          onClick={() => void handleNext()}
        >
          {runIntake.pending || submitBooking.pending ? (
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
          ) : null}
          {step === 4 ? "Confirm booking" : step === 1 ? "Review with a vet" : "Continue"}
          {!runIntake.pending && !submitBooking.pending && step !== 4 ? (
            <ArrowRight className="size-4" aria-hidden="true" />
          ) : null}
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value, emphasis }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-3.5">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className={cn("text-right text-sm text-ink", emphasis && "font-bold tabular")}>{value}</dd>
    </div>
  );
}

function IntakeSummary({ intake }: { intake: SymptomIntakeResult }) {
  const meta = URGENCY_META[intake.urgency];
  const isEmergency = intake.urgency === "emergency";

  return (
    <div
      className={cn(
        "rounded-2xl border p-6",
        isEmergency ? "border-red-200 bg-red-50/70" : "border-brand-200 bg-brand-50/60",
      )}
    >
      <div className="flex flex-wrap items-center gap-3">
        {isEmergency ? (
          <AlertTriangle className="size-5 text-red-600" aria-hidden="true" />
        ) : (
          <Stethoscope className="size-5 text-brand-600" aria-hidden="true" />
        )}
        <h3 className="font-display text-base font-semibold text-ink">Reviewed by the care desk</h3>
        <Badge variant={meta.tone}>{meta.label}</Badge>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-ink/80">{intake.summary}</p>

      <ul className="mt-4 space-y-1.5">
        {intake.observations.map((observation) => (
          <li key={observation} className="flex items-start gap-2.5 text-sm text-muted">
            <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-400" />
            {observation}
          </li>
        ))}
      </ul>

      {isEmergency ? (
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button asChild variant="danger">
            <Link href="/nearby?type=emergency">
              <Phone className="size-4" aria-hidden="true" />
              Emergency vets near me
            </Link>
          </Button>
        </div>
      ) : null}

      <p className="mt-5 border-t border-current/10 pt-4 text-xs leading-relaxed text-muted">
        {intake.disclaimer}
      </p>
    </div>
  );
}

function BookingConfirmation({ booking }: { booking: Booking }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-hairline bg-white shadow-soft">
      <div className="border-b border-hairline bg-emerald-50 px-6 py-8 text-center sm:px-8">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-600 text-white">
          <Check className="size-7" strokeWidth={3} aria-hidden="true" />
        </span>
        <h2 className="mt-4 font-display text-2xl font-bold text-ink">Visit confirmed</h2>
        <p className="mt-2 text-sm text-muted">
          Reference <span className="font-semibold tabular text-ink">{booking.reference}</span>
        </p>
      </div>

      <div className="px-6 py-7 sm:px-8">
        <dl className="divide-y divide-hairline rounded-2xl border border-hairline">
          <Row label="Pet" value={booking.petName} />
          <Row label="Service" value={booking.serviceName} />
          <Row label="When" value={booking.slotLabel} />
          <Row label="Vet" value={booking.providerName ?? "Assigned shortly"} />
          {booking.addressSummary ? <Row label="Where" value={booking.addressSummary} /> : null}
          <Row label="Price" value={formatINR(booking.price)} emphasis />
        </dl>

        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-brand-50/60 p-5">
          <Clock className="mt-0.5 size-5 shrink-0 text-brand-600" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-muted">
            We&apos;ve sent the details to your WhatsApp. The vet will message you on the day with
            an arrival window, and you can reschedule or cancel free up to two hours before.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/app/care">
              <CalendarCheck className="size-5" aria-hidden="true" />
              View my bookings
            </Link>
          </Button>
          <WhatsAppButton
            size="lg"
            variant="outline"
            text={`Hi Tailish! I have a question about booking ${booking.reference}.`}
            label="Message the care team"
          />
        </div>
      </div>
    </div>
  );
}
