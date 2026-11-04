import Image from "next/image";
import Link from "next/link";
import { CalendarClock, ChevronRight, Scale, Stethoscope, Syringe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SourceBadge } from "@/components/shared/source-badge";
import { CopyButton } from "@/components/shared/copy-button";
import type { Pet, Vaccination } from "@/lib/types";
import { TODAY_ISO } from "@/lib/mock/clock";
import { cn, daysBetween, formatDate } from "@/lib/utils";

/**
 * The Health Passport summary card.
 *
 * Shared by the marketing homepage, /health-passport, the portal dashboard and
 * the public shared-passport page, so the thing a visitor is sold is literally
 * the thing they get.
 */

export interface PassportSummary {
  pet: Pet;
  vaccinations: Vaccination[];
  lastVisitDate?: string;
  /** Hides the action button on read-only surfaces. */
  href?: string | null;
}

function Stat({
  icon: Icon,
  label,
  value,
  tone = "default",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone?: "default" | "warn" | "good";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-3 text-center transition-colors sm:p-4",
        tone === "warn" ? "border-accent-200 bg-accent-50/60" : "border-hairline bg-brand-50/50",
      )}
    >
      <Icon
        className={cn(
          "mx-auto size-5",
          tone === "warn" ? "text-accent-600" : tone === "good" ? "text-emerald-600" : "text-brand-600",
        )}
        aria-hidden="true"
      />
      <p className="mt-2 text-[0.7rem] font-medium uppercase tracking-wide text-muted text-balance">
        {label}
      </p>
      <p
        className={cn(
          "mt-0.5 text-sm font-semibold tabular",
          tone === "warn" ? "text-accent-700" : "text-ink",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function ageLabel(pet: Pet) {
  if (pet.birthDate) {
    const months = Math.max(0, Math.round(daysBetween(pet.birthDate, TODAY_ISO) / 30.44));
    if (months < 12) return `${months} mo`;
    const years = Math.floor(months / 12);
    return `${years} yr${years === 1 ? "" : "s"}`;
  }
  if (pet.ageMonths) {
    return pet.ageMonths < 12 ? `${pet.ageMonths} mo` : `${Math.floor(pet.ageMonths / 12)} yrs`;
  }
  return "Age not set";
}

export function HealthPassportCard({
  pet,
  vaccinations,
  lastVisitDate,
  href = "/app/pets/pet_01",
  className,
}: PassportSummary & { className?: string }) {
  const upcoming = vaccinations
    .filter((v) => v.nextDueDate)
    .sort((a, b) => (a.nextDueDate ?? "").localeCompare(b.nextDueDate ?? ""));

  const overdue = upcoming.filter((v) => daysBetween(TODAY_ISO, v.nextDueDate!) < 0);
  const nextDue = upcoming.find((v) => daysBetween(TODAY_ISO, v.nextDueDate!) >= 0);

  const vaccinationState =
    overdue.length > 0
      ? { value: `${overdue.length} overdue`, tone: "warn" as const }
      : { value: "Up to date", tone: "good" as const };

  return (
    <div
      // A container query, not a viewport one: this card sits full-width in the
      // marketing hero and in a ~20rem portal sidebar, and the stat row has to
      // reflow on its own width rather than the window's.
      className={cn(
        "@container overflow-hidden rounded-3xl border border-hairline bg-white shadow-soft transition-shadow duration-300 hover:shadow-lift",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4 border-b border-hairline bg-brand-50/40 px-5 py-4 sm:px-6">
        <h3 className="font-display text-base font-semibold text-ink">Health Passport</h3>
        {href ? (
          <Link
            href={href}
            className="inline-flex items-center gap-1 rounded-lg text-sm font-medium text-brand-700 transition-colors hover:text-accent-600"
          >
            View all
            <ChevronRight className="size-4" aria-hidden="true" />
          </Link>
        ) : (
          <Badge variant="verified">Shared securely</Badge>
        )}
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl ring-2 ring-brand-100 sm:size-[4.5rem]">
            <Image
              src={pet.photoUrl ?? "/images/pets/bruno.svg"}
              alt={`${pet.name}, a ${pet.breed}`}
              fill
              sizes="72px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-display text-lg font-bold text-ink">{pet.name}</p>
              <SourceBadge source={pet.source} compact />
            </div>
            <p className="mt-0.5 text-sm text-muted">
              {pet.breed} · {ageLabel(pet)} ·{" "}
              {pet.sex === "male" ? "Male" : pet.sex === "female" ? "Female" : "Sex not set"}
            </p>
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="text-xs text-muted">
                Passport ID <span className="tabular font-medium text-ink">{pet.passportId}</span>
              </span>
              <CopyButton value={pet.passportId} label="Copy passport ID" />
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2.5 @md:grid-cols-4 @md:gap-3">
          <Stat
            icon={Syringe}
            label="Vaccinations"
            value={vaccinationState.value}
            tone={vaccinationState.tone}
          />
          <Stat
            icon={CalendarClock}
            label="Next due"
            value={nextDue?.nextDueDate ? formatDate(nextDue.nextDueDate) : "Nothing due"}
            tone={
              nextDue?.nextDueDate && daysBetween(TODAY_ISO, nextDue.nextDueDate) <= 14
                ? "warn"
                : "default"
            }
          />
          <Stat
            icon={Stethoscope}
            label="Last visit"
            value={lastVisitDate ? formatDate(lastVisitDate) : "No visits yet"}
          />
          <Stat icon={Scale} label="Weight" value={`${pet.weightKg} kg`} />
        </div>

        {href ? (
          <Button asChild variant="brand" className="mt-5 w-full">
            <Link href={href}>View full passport</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
