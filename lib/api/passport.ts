import { addDays, TODAY_ISO } from "@/lib/mock/clock";
import { getState, persist } from "@/lib/mock/store";
import { SITE_URL } from "@/lib/config";
import type {
  Condition,
  MedicalDocument,
  Medication,
  SharedPassport,
  ShareLink,
  TimelineEvent,
  Vaccination,
  VaccinationStatus,
  Weight,
} from "@/lib/types";
import { daysBetween, nextId } from "@/lib/utils";
import { badRequest, call, notFound } from "./client";

/** Derives vaccination status from the next-due date relative to today. */
export function deriveVaccinationStatus(nextDueDate?: string): VaccinationStatus {
  if (!nextDueDate) return "completed";
  const days = daysBetween(TODAY_ISO, nextDueDate);
  if (days < 0) return "overdue";
  if (days <= 30) return "due";
  return "upcoming";
}

/** Sorts newest-first on an ISO date field. */
const byDateDesc =
  <T,>(key: keyof T) =>
  (a: T, b: T) =>
    String(b[key]).localeCompare(String(a[key]));

export const passportApi = {
  /* --------------------------------------------------------- vaccinations */

  /** GET /pets/:id/vaccinations */
  listVaccinations: (petId: string) =>
    call<Vaccination[]>({
      method: "GET",
      path: `/pets/${petId}/vaccinations`,
      mock: () =>
        getState()
          .vaccinations.filter((v) => v.petId === petId)
          .map((v) => ({ ...v, status: deriveVaccinationStatus(v.nextDueDate) }))
          .sort(byDateDesc("dateGiven")),
    }),

  /** POST /pets/:id/vaccinations */
  addVaccination: (petId: string, input: Omit<Vaccination, "id" | "petId" | "status">) =>
    call<Vaccination>({
      method: "POST",
      path: `/pets/${petId}/vaccinations`,
      body: input,
      mock: () => {
        const state = getState();
        if (!input.vaccineName?.trim()) badRequest("Enter the vaccine name.", { field: "vaccineName" });
        const record: Vaccination = {
          ...input,
          id: nextId("vac"),
          petId,
          status: deriveVaccinationStatus(input.nextDueDate),
        };
        state.vaccinations = [...state.vaccinations, record];
        state.timeline = [
          {
            id: nextId("tl"),
            petId,
            eventDate: input.dateGiven,
            category: "vaccination",
            title: `${input.vaccineName} administered`,
            details: input.nextDueDate ? `Next dose due ${input.nextDueDate}.` : undefined,
            source: input.source,
          },
          ...state.timeline,
        ];
        return record;
      },
    }),

  /* -------------------------------------------------------------- weights */

  /** GET /pets/:id/weights */
  listWeights: (petId: string) =>
    call<Weight[]>({
      method: "GET",
      path: `/pets/${petId}/weights`,
      mock: () =>
        getState()
          .weights.filter((w) => w.petId === petId)
          .sort((a, b) => a.measuredOn.localeCompare(b.measuredOn)),
    }),

  /** POST /pets/:id/weights */
  addWeight: (petId: string, input: Omit<Weight, "id" | "petId">) =>
    call<Weight>({
      method: "POST",
      path: `/pets/${petId}/weights`,
      body: input,
      mock: () => {
        const state = getState();
        if (!(input.weightKg > 0)) badRequest("Enter a weight greater than zero.", { field: "weightKg" });
        const record: Weight = { ...input, id: nextId("wt"), petId };
        state.weights = [...state.weights, record];
        // The pet's headline weight always reflects the latest measurement.
        state.pets = state.pets.map((p) =>
          p.id === petId ? { ...p, weightKg: input.weightKg } : p,
        );
        state.timeline = [
          {
            id: nextId("tl"),
            petId,
            eventDate: input.measuredOn,
            category: "weight",
            title: `Weight recorded — ${input.weightKg} kg`,
            source: input.source,
          },
          ...state.timeline,
        ];
        persist();
        return record;
      },
    }),

  /* ----------------------------------------------------------- conditions */

  /** GET /pets/:id/conditions */
  listConditions: (petId: string) =>
    call<Condition[]>({
      method: "GET",
      path: `/pets/${petId}/conditions`,
      mock: () => getState().conditions.filter((c) => c.petId === petId),
    }),

  /** POST /pets/:id/conditions */
  addCondition: (petId: string, input: Omit<Condition, "id" | "petId">) =>
    call<Condition>({
      method: "POST",
      path: `/pets/${petId}/conditions`,
      body: input,
      mock: () => {
        const state = getState();
        if (!input.name?.trim()) badRequest("Enter the condition name.", { field: "name" });
        const record: Condition = { ...input, id: nextId("cnd"), petId };
        state.conditions = [...state.conditions, record];
        return record;
      },
    }),

  /* ---------------------------------------------------------- medications */

  /** GET /pets/:id/medications */
  listMedications: (petId: string) =>
    call<Medication[]>({
      method: "GET",
      path: `/pets/${petId}/medications`,
      mock: () =>
        getState()
          .medications.filter((m) => m.petId === petId)
          .sort((a, b) => Number(b.active) - Number(a.active)),
    }),

  /** POST /pets/:id/medications */
  addMedication: (petId: string, input: Omit<Medication, "id" | "petId">) =>
    call<Medication>({
      method: "POST",
      path: `/pets/${petId}/medications`,
      body: input,
      mock: () => {
        const state = getState();
        if (!input.name?.trim()) badRequest("Enter the medicine name.", { field: "name" });
        const record: Medication = { ...input, id: nextId("med"), petId };
        state.medications = [...state.medications, record];
        return record;
      },
    }),

  /* ------------------------------------------------------------ documents */

  /** GET /pets/:id/documents */
  listDocuments: (petId: string) =>
    call<MedicalDocument[]>({
      method: "GET",
      path: `/pets/${petId}/documents`,
      mock: () =>
        getState()
          .documents.filter((d) => d.petId === petId)
          .sort(byDateDesc("uploadedAt")),
    }),

  /**
   * POST /pets/:id/documents (multipart/form-data)
   *
   * The real endpoint accepts the file and runs OCR extraction, returning a
   * record in `processing` status that becomes `needs_review` or `verified`.
   */
  uploadDocument: (
    petId: string,
    file: File,
    meta: { docType: MedicalDocument["docType"]; title?: string; issuedBy?: string },
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("docType", meta.docType);
    if (meta.title) formData.append("title", meta.title);
    if (meta.issuedBy) formData.append("issuedBy", meta.issuedBy);

    return call<MedicalDocument>({
      method: "POST",
      path: `/pets/${petId}/documents`,
      formData,
      mockLatencyMs: 900,
      mock: () => {
        const state = getState();
        const record: MedicalDocument = {
          id: nextId("doc"),
          petId,
          docType: meta.docType,
          title: meta.title?.trim() || file.name.replace(/\.[^.]+$/, ""),
          fileUrl: "#",
          fileName: file.name,
          fileSizeKb: Math.max(1, Math.round(file.size / 1024)),
          mimeType: file.type || "application/octet-stream",
          uploadedAt: new Date().toISOString(),
          issuedBy: meta.issuedBy,
          status: "processing",
          source: "ai_extracted_draft",
        };
        state.documents = [record, ...state.documents];
        return record;
      },
    });
  },

  /* ------------------------------------------------------------- timeline */

  /** GET /pets/:id/timeline */
  listTimeline: (petId: string) =>
    call<TimelineEvent[]>({
      method: "GET",
      path: `/pets/${petId}/timeline`,
      mock: () =>
        getState()
          .timeline.filter((t) => t.petId === petId)
          .sort(byDateDesc("eventDate")),
    }),

  /* ---------------------------------------------------------------- share */

  /** POST /pets/:id/share */
  createShareLink: (petId: string, scope: ShareLink["scope"], expiresInDays = 7) =>
    call<ShareLink>({
      method: "POST",
      path: `/pets/${petId}/share`,
      body: { scope, expiresInDays },
      mock: () => {
        const state = getState();
        const pet = state.pets.find((p) => p.id === petId);
        if (!pet) notFound("We couldn't find that pet in your account.");
        const shareToken = `${pet.passportId.toLowerCase().replace("-", "")}${nextId("s")}`;
        const link: ShareLink = {
          shareToken,
          url: `${SITE_URL}/p/${shareToken}`,
          petId,
          expiresAt: `${addDays(expiresInDays)}T23:59:59.000Z`,
          scope,
          createdAt: new Date().toISOString(),
        };
        state.shareLinks = [link, ...state.shareLinks];
        return link;
      },
    }),

  /** DELETE /pets/:id/share/:token */
  revokeShareLink: (petId: string, shareToken: string) =>
    call<{ ok: true }>({
      method: "DELETE",
      path: `/pets/${petId}/share/${shareToken}`,
      mock: () => {
        const state = getState();
        state.shareLinks = state.shareLinks.filter((l) => l.shareToken !== shareToken);
        return { ok: true as const };
      },
    }),

  /**
   * GET /p/:shareToken — public, unauthenticated.
   *
   * The demo resolves any unknown token to the sample passport so a shared
   * link is always walkable; the real endpoint 404s on an invalid token.
   */
  getSharedPassport: (shareToken: string) =>
    call<SharedPassport>({
      method: "GET",
      path: `/p/${shareToken}`,
      mock: () => {
        const state = getState();
        const link = state.shareLinks.find((l) => l.shareToken === shareToken);
        const petId = link?.petId ?? state.pets[0]?.id;
        const pet = state.pets.find((p) => p.id === petId);
        if (!pet) notFound("This shared passport link is no longer valid.");

        const scope = link?.scope ?? {
          identity: true,
          vaccinations: true,
          conditions: true,
          medications: true,
          documents: false,
        };

        return {
          pet,
          vaccinations: scope.vaccinations
            ? state.vaccinations
                .filter((v) => v.petId === pet.id)
                .map((v) => ({ ...v, status: deriveVaccinationStatus(v.nextDueDate) }))
            : [],
          conditions: scope.conditions ? state.conditions.filter((c) => c.petId === pet.id) : [],
          medications: scope.medications
            ? state.medications.filter((m) => m.petId === pet.id && m.active)
            : [],
          weights: state.weights.filter((w) => w.petId === pet.id),
          documents: scope.documents ? state.documents.filter((d) => d.petId === pet.id) : [],
          sharedBy: state.parent.name,
          expiresAt: link?.expiresAt ?? `${addDays(7)}T23:59:59.000Z`,
        };
      },
    }),
};
