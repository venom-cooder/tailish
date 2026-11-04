"use client";

import { Suspense, use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  CalendarClock,
  Clock,
  FileText,
  Pill,
  ShieldCheck,
  Stethoscope,
  Syringe,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/section";
import { SourceBadge } from "@/components/shared/source-badge";
import { ErrorState, LoadingState } from "@/components/shared/states";
import { api } from "@/lib/api";
import { useAsync } from "@/lib/hooks/use-async";
import { TODAY_ISO } from "@/lib/mock/clock";
import type { SharedPassport } from "@/lib/types";
import { cn, daysBetween, formatDate, formatDateLong } from "@/lib/utils";

/**
 * Public, read-only view of a shared Health Passport.
 *
 * Deliberately outside the portal: no navigation into the account, no actions,
 * and no way to reach anything the owner didn't share. Sections the owner
 * excluded arrive empty from the API and simply aren't rendered.
 */
export default function SharedPassportPage({
  params,
}: {
  params: Promise<{ shareToken: string }>;
}) {
  return (
    <div className="min-h-dvh bg-cream/60">
      <header className="border-b border-hairline bg-white">
        <Container className="flex h-18 items-center justify-between gap-4">
          <Logo className="text-[1rem]" />
          <Badge variant="verified">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Shared securely
          </Badge>
        </Container>
      </header>

      <main id="main" className="py-10">
        <Container size="narrow">
          {/* The token is runtime-only URL data, so the record streams in
              while the page chrome prerenders. */}
          <Suspense fallback={<LoadingState label="Loading shared passport" rows={4} />}>
            <SharedPassportBody params={params} />
          </Suspense>
        </Container>
      </main>

      <footer className="border-t border-hairline bg-white py-8">
        <Container size="narrow">
          <p className="text-center text-xs leading-relaxed text-muted">
            This is a read-only view shared by a Tailish pet parent. It shows only the sections they
            chose, and the link expires on its own.{" "}
            <Link href="/" className="font-medium text-brand-700 underline-offset-4 hover:underline">
              What is Tailish?
            </Link>
          </p>
        </Container>
      </footer>
    </div>
  );
}

function SharedPassportBody({ params }: { params: Promise<{ shareToken: string }> }) {
  const { shareToken } = use(params);
  const shared = useAsync<SharedPassport>(
    () => api.passport.getSharedPassport(shareToken),
    [shareToken],
  );

  if (shared.loading) return <LoadingState label="Loading shared passport" rows={4} />;
  if (shared.error) return <ErrorState message={shared.error} onRetry={shared.refresh} />;
  if (!shared.data) return null;

  return <PassportView passport={shared.data} />;
}

function PassportView({ passport }: { passport: SharedPassport }) {
  const { pet } = passport;
  const daysLeft = daysBetween(TODAY_ISO, passport.expiresAt.slice(0, 10));
  const latestWeight = [...passport.weights].sort((a, b) =>
    b.measuredOn.localeCompare(a.measuredOn),
  )[0];

  return (
    <article className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-hairline bg-white p-4">
        <Clock className="size-4 shrink-0 text-brand-600" aria-hidden="true" />
        <p className="min-w-0 flex-1 text-xs leading-relaxed text-muted">
          Shared by <span className="font-medium text-ink">{passport.sharedBy}</span> · Access
          expires {formatDateLong(passport.expiresAt)}
          {daysLeft >= 0 ? ` (${daysLeft} day${daysLeft === 1 ? "" : "s"} left)` : ""}
        </p>
      </div>

      {/* Identity */}
      <section className="overflow-hidden rounded-3xl border border-hairline bg-white shadow-soft">
        <div className="paw-field bg-brand-900 px-6 py-5 sm:px-8">
          <p className="text-xs uppercase tracking-[0.18em] text-white/60">Health Passport</p>
          <p className="mt-1 font-display text-xl font-bold text-white">{pet.passportId}</p>
        </div>

        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-3xl ring-2 ring-brand-100">
            <Image
              src={pet.photoUrl ?? "/images/pets/bruno.svg"}
              alt={`${pet.name}, a ${pet.breed}`}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl font-bold text-ink">{pet.name}</h1>
              <SourceBadge source={pet.source} compact />
            </div>

            <p className="mt-1 text-sm text-muted">
              {pet.breed} ·{" "}
              {pet.sex === "male" ? "Male" : pet.sex === "female" ? "Female" : "Sex not recorded"}
              {pet.neutered ? " · Neutered" : ""}
            </p>

            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-xs sm:grid-cols-3">
              <div>
                <dt className="text-muted">Date of birth</dt>
                <dd className="mt-0.5 font-semibold text-ink">
                  {pet.birthDate ? formatDate(pet.birthDate) : "Not recorded"}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Weight</dt>
                <dd className="mt-0.5 font-semibold tabular text-ink">
                  {latestWeight?.weightKg ?? pet.weightKg} kg
                </dd>
              </div>
              <div>
                <dt className="text-muted">Microchip</dt>
                <dd className="mt-0.5 font-semibold tabular text-ink">
                  {pet.microchipId ?? "Not recorded"}
                </dd>
              </div>
            </dl>

            {pet.colorMarkings ? (
              <p className="mt-3 text-xs text-muted">Markings: {pet.colorMarkings}</p>
            ) : null}
          </div>
        </div>
      </section>

      {/* Vaccinations */}
      {passport.vaccinations.length > 0 ? (
        <SharedSection icon={Syringe} title="Vaccinations">
          <ul className="divide-y divide-hairline">
            {passport.vaccinations.map((vaccination) => {
              const days = vaccination.nextDueDate
                ? daysBetween(TODAY_ISO, vaccination.nextDueDate)
                : null;
              const overdue = days !== null && days < 0;

              return (
                <li key={vaccination.id} className="flex items-start justify-between gap-4 py-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-ink">{vaccination.vaccineName}</p>
                      {overdue ? (
                        <Badge variant="accent">Overdue</Badge>
                      ) : days !== null ? (
                        <Badge variant="verified">Current</Badge>
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-xs text-muted">
                      Given {formatDate(vaccination.dateGiven)}
                      {vaccination.administeredBy ? ` · ${vaccination.administeredBy}` : ""}
                    </p>
                    {vaccination.nextDueDate ? (
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
                        <CalendarClock className="size-3.5" aria-hidden="true" />
                        Next due {formatDate(vaccination.nextDueDate)}
                      </p>
                    ) : null}
                    {vaccination.batchNo ? (
                      <p className="mt-0.5 text-xs tabular text-muted">
                        Batch {vaccination.batchNo}
                      </p>
                    ) : null}
                  </div>
                  <SourceBadge source={vaccination.source} compact className="shrink-0" />
                </li>
              );
            })}
          </ul>
        </SharedSection>
      ) : null}

      {/* Conditions */}
      {passport.conditions.length > 0 ? (
        <SharedSection icon={Stethoscope} title="Conditions & allergies">
          <ul className="divide-y divide-hairline">
            {passport.conditions.map((condition) => (
              <li key={condition.id} className="flex items-start justify-between gap-4 py-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-ink">{condition.name}</p>
                    <Badge
                      variant={
                        condition.status === "active"
                          ? "accent"
                          : condition.status === "resolved"
                            ? "verified"
                            : "default"
                      }
                    >
                      {condition.status}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {condition.type}
                    </Badge>
                  </div>
                  {condition.notes ? (
                    <p className="mt-1 text-xs leading-relaxed text-muted">{condition.notes}</p>
                  ) : null}
                </div>
                <SourceBadge source={condition.source} compact className="shrink-0" />
              </li>
            ))}
          </ul>
        </SharedSection>
      ) : null}

      {/* Medications */}
      {passport.medications.length > 0 ? (
        <SharedSection icon={Pill} title="Current medications">
          <ul className="divide-y divide-hairline">
            {passport.medications.map((medication) => (
              <li key={medication.id} className="flex items-start justify-between gap-4 py-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">{medication.name}</p>
                  <p className="mt-0.5 text-xs text-ink/70">
                    {medication.dosage} · {medication.frequency}
                    {medication.route ? ` · ${medication.route}` : ""}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    Since {formatDate(medication.startDate)}
                    {medication.prescribedBy ? ` · ${medication.prescribedBy}` : ""}
                  </p>
                </div>
                <SourceBadge source={medication.source} compact className="shrink-0" />
              </li>
            ))}
          </ul>
        </SharedSection>
      ) : null}

      {/* Weight */}
      {passport.weights.length > 0 ? (
        <SharedSection icon={Activity} title="Weight history">
          <ul className="divide-y divide-hairline">
            {[...passport.weights]
              .sort((a, b) => b.measuredOn.localeCompare(a.measuredOn))
              .slice(0, 5)
              .map((weight) => (
                <li key={weight.id} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="text-sm font-semibold tabular text-ink">{weight.weightKg} kg</p>
                    <p className="text-xs text-muted">
                      {formatDate(weight.measuredOn)}
                      {weight.measuredBy ? ` · ${weight.measuredBy}` : ""}
                    </p>
                  </div>
                  <SourceBadge source={weight.source} compact className="shrink-0" />
                </li>
              ))}
          </ul>
        </SharedSection>
      ) : null}

      {/* Documents */}
      {passport.documents.length > 0 ? (
        <SharedSection icon={FileText} title="Documents">
          <ul className="divide-y divide-hairline">
            {passport.documents.map((document) => (
              <li key={document.id} className="flex items-center justify-between gap-4 py-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">{document.title}</p>
                  <p className="mt-0.5 text-xs capitalize text-muted">
                    {document.docType.replace(/_/g, " ")}
                    {document.issuedBy ? ` · ${document.issuedBy}` : ""}
                  </p>
                </div>
                <SourceBadge source={document.source} compact className="shrink-0" />
              </li>
            ))}
          </ul>
        </SharedSection>
      ) : null}

      <div className="rounded-3xl border border-hairline bg-white p-7 text-center shadow-soft">
        <p className="text-sm leading-relaxed text-muted">
          Want a Health Passport for your own pet? It&apos;s free, and it takes about a minute.
        </p>
        <Button asChild className="mt-5">
          <Link href="/health-passport">Learn about the Health Passport</Link>
        </Button>
      </div>
    </article>
  );
}

function SharedSection({
  icon: Icon,
  title,
  children,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-3xl border border-hairline bg-white p-6 shadow-soft sm:p-8", className)}>
      <h2 className="flex items-center gap-2.5 font-display text-lg font-semibold text-ink">
        <Icon className="size-5 text-brand-600" aria-hidden="true" />
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
