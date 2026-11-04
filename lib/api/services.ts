import { addDays, TODAY_ISO } from "@/lib/mock/clock";
import { mockNearby, mockProviders, mockServices } from "@/lib/mock/services";
import { getState, persist } from "@/lib/mock/store";
import type {
  Booking,
  BookingInput,
  BookingStatus,
  NearbyPlace,
  NearbyType,
  Provider,
  Service,
  ServiceSlug,
} from "@/lib/types";
import { nextId } from "@/lib/utils";
import { badRequest, call, notFound } from "./client";

export const servicesApi = {
  /** GET /services */
  list: () =>
    call<Service[]>({
      method: "GET",
      path: "/services",
      mock: () => mockServices,
    }),

  /** GET /services/:slug */
  get: (slug: ServiceSlug) =>
    call<Service>({
      method: "GET",
      path: `/services/${slug}`,
      mock: () => {
        const service = mockServices.find((s) => s.slug === slug);
        if (!service) notFound("That service isn't available.");
        return service;
      },
    }),

  /** GET /providers?type=&area= */
  listProviders: (filters?: { type?: string; area?: string; service?: ServiceSlug }) =>
    call<Provider[]>({
      method: "GET",
      path: "/providers",
      query: { type: filters?.type, area: filters?.area, service: filters?.service },
      mock: () =>
        mockProviders.filter((p) => {
          if (filters?.type && p.type !== filters.type) return false;
          if (filters?.area && p.area !== filters.area) return false;
          if (filters?.service && !p.servicesOffered.includes(filters.service)) return false;
          return true;
        }),
    }),

  /** GET /bookings */
  listBookings: () =>
    call<Booking[]>({
      method: "GET",
      path: "/bookings",
      mock: () =>
        [...getState().bookings].sort((a, b) => b.scheduledFor.localeCompare(a.scheduledFor)),
    }),

  /** GET /bookings/:id */
  getBooking: (id: string) =>
    call<Booking>({
      method: "GET",
      path: `/bookings/${id}`,
      mock: () => {
        const booking = getState().bookings.find((b) => b.id === id);
        if (!booking) notFound("We couldn't find that booking.");
        return booking;
      },
    }),

  /** POST /bookings */
  createBooking: (input: BookingInput) =>
    call<Booking>({
      method: "POST",
      path: "/bookings",
      body: input,
      mock: () => {
        const state = getState();
        const pet = state.pets.find((p) => p.id === input.petId);
        if (!pet) badRequest("Choose which pet this visit is for.", { field: "petId" });

        const service = mockServices.find((s) => s.slug === input.serviceSlug);
        if (!service) badRequest("Choose a service.", { field: "serviceSlug" });

        const provider = mockProviders.find((p) => p.id === input.providerId);
        const address = state.addresses.find((a) => a.id === input.addressId);
        const needsAddress = input.serviceSlug !== "video-consult";
        if (needsAddress && !address) {
          badRequest("Choose where the vet should come.", { field: "addressId" });
        }

        const booking: Booking = {
          id: nextId("bkg"),
          reference: `TL-CARE-${11000 + state.bookings.length}`,
          petId: pet.id,
          petName: pet.name,
          serviceSlug: service.slug,
          serviceName: service.name,
          providerId: provider?.id,
          providerName: provider?.name,
          scheduledFor: input.scheduledFor,
          slotLabel: input.slotLabel,
          status: "confirmed",
          addressId: address?.id,
          addressSummary: address
            ? `${address.line1}, ${address.city} ${address.pincode}`
            : undefined,
          price: service.priceFrom || 899,
          paymentStatus: "pending",
          notes: input.notes,
          createdAt: new Date().toISOString(),
        };

        state.bookings = [booking, ...state.bookings];
        state.timeline = [
          {
            id: nextId("tl"),
            petId: pet.id,
            eventDate: input.scheduledFor.slice(0, 10),
            category: "visit",
            title: `${service.name} booked`,
            details: provider ? `With ${provider.name}, ${input.slotLabel}.` : input.slotLabel,
            source: "parent_entered",
            href: "/app/care",
          },
          ...state.timeline,
        ];
        persist();
        return booking;
      },
    }),

  /** PATCH /bookings/:id — cancel or reschedule */
  updateBooking: (
    id: string,
    patch: { status?: BookingStatus; scheduledFor?: string; slotLabel?: string; notes?: string },
  ) =>
    call<Booking>({
      method: "PATCH",
      path: `/bookings/${id}`,
      body: patch,
      mock: () => {
        const state = getState();
        const existing = state.bookings.find((b) => b.id === id);
        if (!existing) notFound("We couldn't find that booking.");
        if (existing.status === "completed") {
          badRequest("This visit is already complete and can't be changed.");
        }
        const updated: Booking = {
          ...existing,
          ...patch,
          paymentStatus:
            patch.status === "cancelled" && existing.paymentStatus === "paid"
              ? "refunded"
              : existing.paymentStatus,
        };
        state.bookings = state.bookings.map((b) => (b.id === id ? updated : b));
        persist();
        return updated;
      },
    }),

  /**
   * GET /slots?service=&date= — bookable time slots.
   *
   * Not in the original endpoint list but needed by the booking flow; the
   * backend can serve real availability here without any frontend change.
   */
  listSlots: (serviceSlug: ServiceSlug, date: string) =>
    call<{ date: string; slots: { label: string; startsAt: string; available: boolean }[] }>({
      method: "GET",
      path: "/slots",
      query: { service: serviceSlug, date },
      mockLatencyMs: 200,
      mock: () => {
        const windows = [
          { label: "9:00 AM – 10:00 AM", hour: 9 },
          { label: "10:30 AM – 11:30 AM", hour: 10 },
          { label: "12:00 PM – 1:00 PM", hour: 12 },
          { label: "3:00 PM – 4:00 PM", hour: 15 },
          { label: "5:00 PM – 6:00 PM", hour: 17 },
          { label: "7:00 PM – 8:00 PM", hour: 19 },
        ];
        // Deterministic "already booked" pattern derived from the date digits,
        // so the same date always shows the same availability.
        const seed = Number(date.replace(/-/g, "").slice(-3));
        return {
          date,
          slots: windows.map((w, index) => ({
            label: w.label,
            startsAt: `${date}T${String(w.hour).padStart(2, "0")}:00:00.000Z`,
            available: (seed + index * 5) % 7 !== 0,
          })),
        };
      },
    }),

  /** GET /nearby?type=&area= */
  nearby: (filters?: { type?: NearbyType | "all"; area?: string; query?: string }) =>
    call<NearbyPlace[]>({
      method: "GET",
      path: "/nearby",
      query: { type: filters?.type, area: filters?.area, q: filters?.query },
      mock: () => {
        const query = filters?.query?.trim().toLowerCase();
        return mockNearby
          .filter((place) => {
            if (filters?.type && filters.type !== "all" && place.type !== filters.type) return false;
            if (filters?.area && filters.area !== "all" && place.area !== filters.area) return false;
            if (query) {
              const haystack =
                `${place.name} ${place.area} ${place.address} ${place.tags.join(" ")}`.toLowerCase();
              if (!haystack.includes(query)) return false;
            }
            return true;
          })
          .sort((a, b) => a.distanceKm - b.distanceKm);
      },
    }),
};

/** The next seven selectable dates, derived from the fixed demo clock. */
export function bookableDates(count = 7) {
  return Array.from({ length: count }, (_, index) => addDays(index, TODAY_ISO));
}
