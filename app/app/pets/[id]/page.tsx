"use client";

import * as React from "react";
import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  CalendarClock,
  FileText,
  Loader2,
  Pencil,
  Pill,
  Share2,
  Stethoscope,
  Syringe,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortalHeader } from "@/components/portal/portal-shell";
import { WeightChart } from "@/components/portal/weight-chart";
import { SourceBadge } from "@/components/shared/source-badge";
import { CopyButton } from "@/components/shared/copy-button";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/states";
import { api } from "@/lib/api";
import { useAsync, useMutation } from "@/lib/hooks/use-async";
import { TODAY_ISO } from "@/lib/mock/clock";
import type {
  Condition,
  MedicalDocument,
  Medication,
  Pet,
  TimelineEvent,
  Vaccination,
  Weight,
} from "@/lib/types";
import { cn, daysBetween, formatDate } from "@/lib/utils";

const CATEGORY_ICON: Record<TimelineEvent["category"], React.ComponentType<{ className?: string }>> = {
  visit: Stethoscope,
  vaccination: Syringe,
  medication: Pill,
  document: FileText,
  weight: Activity,
  order: FileText,
  note: FileText,
};

export default function PetPassportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const pet = useAsync<Pet>(() => api.pets.get(id), [id]);
  const vaccinations = useAsync<Vaccination[]>(() => api.passport.listVaccinations(id), [id]);
  const weights = useAsync<Weight[]>(() => api.passport.listWeights(id), [id]);
  const conditions = useAsync<Condition[]>(() => api.passport.listConditions(id), [id]);
  const medications = useAsync<Medication[]>(() => api.passport.listMedications(id), [id]);
  const documents = useAsync<MedicalDocument[]>(() => api.passport.listDocuments(id), [id]);
  const timeline = useAsync<TimelineEvent[]>(() => api.passport.listTimeline(id), [id]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const upload = useMutation(async (file: File) => {
    const record = await api.passport.uploadDocument(id, file, { docType: "other" });
    documents.setData((current) => [record, ...(current ?? [])]);
    return record;
  });

  if (pet.loading) return <LoadingState label="Loading Health Passport" rows={4} />;
  if (pet.error) return <ErrorState message={pet.error} onRetry={pet.refresh} />;
  if (!pet.data) return null;

  const animal = pet.data;
  const activeMedications = (medications.data ?? []).filter((m) => m.active);

  return (
    <>
      <PortalHeader title={`${animal.name}'s Health Passport`} backHref="/app/pets">
        <Button asChild variant="outline" size="sm">
          <Link href={`/app/pets/${id}/edit`}>
            <Pencil className="size-4" aria-hidden="true" />
            Edit
          </Link>
        </Button>
        <Button asChild size="sm">
          <Link href={`/app/pets/${id}/share`}>
            <Share2 className="size-4" aria-hidden="true" />
            Share
          </Link>
        </Button>
      </PortalHeader>

      {/* Identity */}
      <section className="overflow-hidden rounded-3xl border border-hairline bg-white shadow-soft">
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-3xl ring-2 ring-brand-100 sm:size-28">
            <Image
              src={animal.photoUrl ?? "/images/pets/bruno.svg"}
              alt={`${animal.name}, a ${animal.breed}`}
              fill
              sizes="112px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-2xl font-bold text-ink">{animal.name}</h2>
              <SourceBadge source={animal.source} />
            </div>

            <p className="mt-1 text-sm text-muted">
              {animal.breed} · {animal.sex === "male" ? "Male" : animal.sex === "female" ? "Female" : "Sex not set"}
              {animal.neutered ? " · Neutered" : ""}
              {animal.colorMarkings ? ` · ${animal.colorMarkings}` : ""}
            </p>

            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-xs sm:grid-cols-4">
              <div>
                <dt className="text-muted">Passport ID</dt>
                <dd className="mt-0.5 flex items-center gap-1 font-semibold tabular text-ink">
                  {animal.passportId}
                  <CopyButton value={animal.passportId} label="Copy passport ID" />
                </dd>
              </div>
              <div>
                <dt className="text-muted">Date of birth</dt>
                <dd className="mt-0.5 font-semibold text-ink">
                  {animal.birthDate ? formatDate(animal.birthDate) : "Not recorded"}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Weight</dt>
                <dd className="mt-0.5 font-semibold tabular text-ink">{animal.weightKg} kg</dd>
              </div>
              <div>
                <dt className="text-muted">Microchip</dt>
                <dd className="mt-0.5 font-semibold tabular text-ink">
                  {animal.microchipId ?? "Not recorded"}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {activeMedications.length > 0 || (conditions.data ?? []).some((c) => c.type === "allergy") ? (
          <div className="flex flex-wrap gap-2 border-t border-hairline bg-accent-50/40 px-6 py-4 sm:px-8">
            {(conditions.data ?? [])
              .filter((c) => c.type === "allergy" && c.status === "active")
              .map((allergy) => (
                <Badge key={allergy.id} variant="accent">
                  Allergy: {allergy.name}
                </Badge>
              ))}
            {activeMedications.map((medication) => (
              <Badge key={medication.id} variant="default">
                On {medication.name.split(" (")[0]}
              </Badge>
            ))}
          </div>
        ) : null}
      </section>

      <Tabs defaultValue="vaccinations" className="mt-8">
        <TabsList>
          <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="conditions">Conditions</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        {/* ------------------------------------------------ vaccinations */}
        <TabsContent value="vaccinations">
          {vaccinations.loading ? (
            <LoadingState label="Loading vaccinations" rows={3} />
          ) : (vaccinations.data ?? []).length === 0 ? (
            <EmptyState
              icon={Syringe}
              title="No vaccinations recorded"
              description="Upload a vaccination card and we'll extract the doses, dates and batch numbers for you."
            />
          ) : (
            <ul className="space-y-3">
              {vaccinations.data?.map((vaccination) => {
                const days = vaccination.nextDueDate
                  ? daysBetween(TODAY_ISO, vaccination.nextDueDate)
                  : null;
                const overdue = days !== null && days < 0;
                const dueSoon = days !== null && days >= 0 && days <= 30;

                return (
                  <li
                    key={vaccination.id}
                    className={cn(
                      "rounded-2xl border bg-white p-5 shadow-soft transition-all duration-300 hover:shadow-lift",
                      overdue ? "border-accent-200 bg-accent-50/30" : "border-hairline",
                    )}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-ink">{vaccination.vaccineName}</h3>
                          {overdue ? (
                            <Badge variant="accent">{Math.abs(days!)} days overdue</Badge>
                          ) : dueSoon ? (
                            <Badge variant="accent">Due in {days} days</Badge>
                          ) : days !== null ? (
                            <Badge variant="verified">Up to date</Badge>
                          ) : null}
                        </div>

                        <p className="mt-1 text-sm text-muted">
                          Given {formatDate(vaccination.dateGiven)}
                          {vaccination.administeredBy ? ` by ${vaccination.administeredBy}` : ""}
                        </p>

                        {vaccination.nextDueDate ? (
                          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted">
                            <CalendarClock className="size-3.5" aria-hidden="true" />
                            Next due {formatDate(vaccination.nextDueDate)}
                          </p>
                        ) : null}

                        {vaccination.brand || vaccination.batchNo ? (
                          <p className="mt-1.5 text-xs text-muted">
                            {vaccination.brand}
                            {vaccination.batchNo ? ` · Batch ${vaccination.batchNo}` : ""}
                          </p>
                        ) : null}

                        {vaccination.notes ? (
                          <p className="mt-2 text-sm italic leading-relaxed text-muted">
                            {vaccination.notes}
                          </p>
                        ) : null}
                      </div>

                      <SourceBadge source={vaccination.source} compact className="shrink-0" />
                    </div>

                    {(overdue || dueSoon) ? (
                      <div className="mt-4 border-t border-hairline pt-4">
                        <Button asChild size="sm">
                          <Link href="/vet-care/vaccination">Book this vaccination</Link>
                        </Button>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </TabsContent>

        {/* ------------------------------------------------------- weight */}
        <TabsContent value="weight">
          <div className="rounded-3xl border border-hairline bg-white p-6 shadow-soft sm:p-8">
            {weights.loading ? (
              <LoadingState label="Loading weight history" rows={2} />
            ) : (
              <WeightChart weights={weights.data ?? []} />
            )}
          </div>
        </TabsContent>

        {/* --------------------------------------------------- conditions */}
        <TabsContent value="conditions">
          {conditions.loading ? (
            <LoadingState label="Loading conditions" rows={2} />
          ) : (conditions.data ?? []).length === 0 ? (
            <EmptyState
              icon={Stethoscope}
              title="No conditions recorded"
              description="Allergies, chronic conditions and past surgeries appear here once recorded."
            />
          ) : (
            <ul className="space-y-3">
              {conditions.data?.map((condition) => (
                <li
                  key={condition.id}
                  className="rounded-2xl border border-hairline bg-white p-5 shadow-soft transition-shadow hover:shadow-lift"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-ink">{condition.name}</h3>
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

                      {condition.diagnosedOn ? (
                        <p className="mt-1 text-sm text-muted">
                          Diagnosed {formatDate(condition.diagnosedOn)}
                        </p>
                      ) : null}

                      {condition.notes ? (
                        <p className="mt-2 text-sm leading-relaxed text-muted">{condition.notes}</p>
                      ) : null}
                    </div>

                    <SourceBadge source={condition.source} compact className="shrink-0" />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        {/* -------------------------------------------------- medications */}
        <TabsContent value="medications">
          {medications.loading ? (
            <LoadingState label="Loading medications" rows={2} />
          ) : (medications.data ?? []).length === 0 ? (
            <EmptyState
              icon={Pill}
              title="No medications recorded"
              description="Prescriptions issued during a Tailish visit appear here automatically."
            />
          ) : (
            <ul className="space-y-3">
              {medications.data?.map((medication) => (
                <li
                  key={medication.id}
                  className={cn(
                    "rounded-2xl border bg-white p-5 shadow-soft transition-shadow hover:shadow-lift",
                    medication.active ? "border-brand-200" : "border-hairline opacity-70",
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-ink">{medication.name}</h3>
                        <Badge variant={medication.active ? "verified" : "outline"}>
                          {medication.active ? "Active" : "Completed"}
                        </Badge>
                      </div>

                      <p className="mt-1.5 text-sm text-ink/80">
                        {medication.dosage} · {medication.frequency}
                        {medication.route ? ` · ${medication.route}` : ""}
                      </p>

                      <p className="mt-1 text-xs text-muted">
                        From {formatDate(medication.startDate)}
                        {medication.endDate ? ` to ${formatDate(medication.endDate)}` : " — ongoing"}
                        {medication.prescribedBy ? ` · ${medication.prescribedBy}` : ""}
                      </p>

                      {medication.notes ? (
                        <p className="mt-2 text-sm leading-relaxed text-muted">{medication.notes}</p>
                      ) : null}
                    </div>

                    <SourceBadge source={medication.source} compact className="shrink-0" />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        {/* ---------------------------------------------------- documents */}
        <TabsContent value="documents">
          <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-dashed border-brand-200 bg-brand-50/40 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-ink">Upload a report or prescription</p>
              <p className="mt-0.5 text-sm leading-relaxed text-muted">
                A photo works. We extract the details and flag them for a human to verify.
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void upload.run(file);
                event.target.value = "";
              }}
            />
            <Button
              className="shrink-0"
              disabled={upload.pending}
              onClick={() => fileInputRef.current?.click()}
            >
              {upload.pending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Upload className="size-4" aria-hidden="true" />
              )}
              Choose a file
            </Button>
          </div>

          {upload.error ? (
            <p role="alert" className="mb-4 text-sm text-red-600">
              {upload.error}
            </p>
          ) : null}

          {documents.loading ? (
            <LoadingState label="Loading documents" rows={3} />
          ) : (documents.data ?? []).length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No documents yet"
              description="Vaccination cards, prescriptions, lab reports and discharge summaries all live here."
            />
          ) : (
            <ul className="space-y-3">
              {documents.data?.map((document) => (
                <li
                  key={document.id}
                  className="flex items-start gap-4 rounded-2xl border border-hairline bg-white p-5 shadow-soft transition-shadow hover:shadow-lift"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                    <FileText className="size-5" aria-hidden="true" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-ink">{document.title}</h3>
                      <Badge
                        variant={
                          document.status === "verified"
                            ? "verified"
                            : document.status === "processing"
                              ? "default"
                              : "draft"
                        }
                      >
                        {document.status.replace(/_/g, " ")}
                      </Badge>
                    </div>

                    <p className="mt-1 text-xs capitalize text-muted">
                      {document.docType.replace(/_/g, " ")} · {document.fileSizeKb} KB
                      {document.issuedBy ? ` · ${document.issuedBy}` : ""}
                    </p>

                    <p className="mt-0.5 text-xs text-muted">
                      Uploaded {formatDate(document.uploadedAt)}
                      {document.issuedOn ? ` · Issued ${formatDate(document.issuedOn)}` : ""}
                    </p>
                  </div>

                  <SourceBadge source={document.source} compact className="shrink-0" />
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        {/* ----------------------------------------------------- timeline */}
        <TabsContent value="timeline">
          {timeline.loading ? (
            <LoadingState label="Loading timeline" rows={4} />
          ) : (timeline.data ?? []).length === 0 ? (
            <EmptyState
              icon={CalendarClock}
              title="Nothing on the timeline yet"
              description="Visits, vaccinations, weights and orders appear here in date order."
            />
          ) : (
            <ol className="space-y-0">
              {timeline.data?.map((event, index) => {
                const Icon = CATEGORY_ICON[event.category];
                const isLast = index === (timeline.data?.length ?? 0) - 1;

                return (
                  <li key={event.id} className="flex gap-5">
                    <div className="flex flex-col items-center">
                      <span className="grid size-10 shrink-0 place-items-center rounded-full border border-hairline bg-white text-brand-600 shadow-soft">
                        <Icon className="size-4.5" aria-hidden="true" />
                      </span>
                      {!isLast ? (
                        <span aria-hidden="true" className="w-px flex-1 bg-hairline" />
                      ) : null}
                    </div>

                    <div className={cn("min-w-0 flex-1", isLast ? "pb-0" : "pb-7")}>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-ink">{event.title}</h3>
                        <SourceBadge source={event.source} compact />
                      </div>

                      <p className="mt-0.5 text-xs text-muted">{formatDate(event.eventDate)}</p>

                      {event.details ? (
                        <p className="mt-1.5 text-sm leading-relaxed text-muted">{event.details}</p>
                      ) : null}

                      {event.href ? (
                        <Link
                          href={event.href}
                          className="mt-2 inline-block text-sm font-medium text-brand-700 underline-offset-4 hover:underline"
                        >
                          View details
                        </Link>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}
