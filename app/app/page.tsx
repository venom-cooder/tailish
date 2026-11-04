"use client";

import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  CalendarCheck,
  MapPin,
  Package,
  PawPrint,
  Plus,
  Sparkles,
  Stethoscope,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PortalHeader } from "@/components/portal/portal-shell";
import { ReminderList } from "@/components/portal/reminder-list";
import { HealthPassportCard } from "@/components/shared/health-passport-card";
import { ErrorState, LoadingState } from "@/components/shared/states";
import { useSession } from "@/components/providers/session-provider";
import { api } from "@/lib/api";
import { useAsync } from "@/lib/hooks/use-async";
import type { Booking, Order, Pet, Reminder, Vaccination } from "@/lib/types";
import { formatDate, formatDateLong, formatINR } from "@/lib/utils";

const quickActions = [
  { icon: CalendarCheck, label: "Book a visit", href: "/vet-care/book-visit" },
  { icon: Sparkles, label: "Ask Tailish", href: "/app/ask" },
  { icon: Upload, label: "Upload a report", href: "/app/pets/pet_01" },
  { icon: MapPin, label: "Vets nearby", href: "/nearby" },
];

export default function DashboardPage() {
  const { parent, loading: sessionLoading } = useSession();

  const pets = useAsync<Pet[]>(() => api.pets.list(), []);
  const reminders = useAsync<Reminder[]>(() => api.reminders.list(), []);
  const bookings = useAsync<Booking[]>(() => api.services.listBookings(), []);
  const orders = useAsync<Order[]>(() => api.commerce.listOrders(), []);

  const activePet = pets.data?.[0] ?? null;
  const vaccinations = useAsync<Vaccination[]>(
    () => (activePet ? api.passport.listVaccinations(activePet.id) : Promise.resolve([])),
    [activePet?.id],
  );

  const upcomingBooking = bookings.data
    ?.filter((booking) => booking.status === "confirmed" || booking.status === "pending")
    .sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor))[0];

  const lastVisit = bookings.data
    ?.filter((booking) => booking.status === "completed")
    .sort((a, b) => b.scheduledFor.localeCompare(a.scheduledFor))[0];

  const activeOrder = orders.data?.find(
    (order) => order.status !== "delivered" && order.status !== "cancelled",
  );

  const firstName = parent?.name.split(" ")[0] ?? "there";

  return (
    <>
      <PortalHeader
        title={sessionLoading ? "Welcome back" : `Hello, ${firstName}`}
        description="Here's what needs your attention today."
      >
        <Button asChild>
          <Link href="/vet-care/book-visit">
            <CalendarCheck className="size-4" aria-hidden="true" />
            Book a visit
          </Link>
        </Button>
      </PortalHeader>

      {/* Quick actions */}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {quickActions.map((action) => (
          <li key={action.label}>
            <Link
              href={action.href}
              className="group flex h-full flex-col items-center gap-2.5 rounded-2xl border border-hairline bg-white p-5 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-700 group-hover:text-white">
                <action.icon className="size-5" aria-hidden="true" />
              </span>
              <span className="text-sm font-medium text-ink">{action.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          {/* Reminders */}
          <section aria-labelledby="reminders-heading">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2
                id="reminders-heading"
                className="flex items-center gap-2.5 font-display text-lg font-semibold text-ink"
              >
                <BellRing className="size-5 text-brand-600" aria-hidden="true" />
                Reminders
                {reminders.data ? (
                  <Badge variant={reminders.data.some((r) => r.status === "overdue") ? "accent" : "default"}>
                    {reminders.data.length}
                  </Badge>
                ) : null}
              </h2>
              <Link
                href="/app/notifications"
                className="text-sm font-medium text-brand-700 underline-offset-4 hover:underline"
              >
                See all
              </Link>
            </div>

            {reminders.loading ? (
              <LoadingState label="Loading reminders" rows={3} />
            ) : reminders.error ? (
              <ErrorState message={reminders.error} onRetry={reminders.refresh} />
            ) : (
              <ReminderList
                reminders={reminders.data ?? []}
                limit={4}
                onChange={(updated) =>
                  reminders.setData(
                    (current) =>
                      current?.map((item) => (item.id === updated.id ? updated : item)) ?? null,
                  )
                }
              />
            )}
          </section>

          {/* Upcoming visit */}
          <section aria-labelledby="visit-heading">
            <h2
              id="visit-heading"
              className="mb-4 flex items-center gap-2.5 font-display text-lg font-semibold text-ink"
            >
              <Stethoscope className="size-5 text-brand-600" aria-hidden="true" />
              Upcoming care
            </h2>

            {bookings.loading ? (
              <LoadingState label="Loading bookings" rows={1} />
            ) : upcomingBooking ? (
              <article className="rounded-3xl border border-hairline bg-white p-6 shadow-soft transition-shadow hover:shadow-lift">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Badge variant="verified">Confirmed</Badge>
                    <h3 className="mt-2.5 font-display text-lg font-semibold text-ink">
                      {upcomingBooking.serviceName} for {upcomingBooking.petName}
                    </h3>
                    <p className="mt-1 text-sm text-muted">
                      {formatDateLong(upcomingBooking.scheduledFor)} · {upcomingBooking.slotLabel}
                    </p>
                    {upcomingBooking.providerName ? (
                      <p className="mt-0.5 text-sm text-muted">
                        With {upcomingBooking.providerName}
                      </p>
                    ) : null}
                    {upcomingBooking.addressSummary ? (
                      <p className="mt-0.5 text-xs text-muted">{upcomingBooking.addressSummary}</p>
                    ) : null}
                  </div>
                  <span className="tabular text-lg font-bold text-ink">
                    {formatINR(upcomingBooking.price)}
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-2 border-t border-hairline pt-5">
                  <Button asChild size="sm" variant="outline">
                    <Link href="/app/care">Manage booking</Link>
                  </Button>
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/app/pets/${upcomingBooking.petId}`}>View passport</Link>
                  </Button>
                </div>
              </article>
            ) : (
              <div className="rounded-3xl border border-dashed border-brand-200 bg-brand-50/40 p-7 text-center">
                <p className="text-sm text-muted">No visits booked right now.</p>
                <Button asChild size="sm" className="mt-4">
                  <Link href="/vet-care/book-visit">Book a vet visit</Link>
                </Button>
              </div>
            )}
          </section>

          {/* Active order */}
          {activeOrder ? (
            <section aria-labelledby="order-heading">
              <h2
                id="order-heading"
                className="mb-4 flex items-center gap-2.5 font-display text-lg font-semibold text-ink"
              >
                <Package className="size-5 text-brand-600" aria-hidden="true" />
                Order on the way
              </h2>

              <Link
                href={`/app/orders/${activeOrder.reference}`}
                className="flex items-center gap-4 rounded-3xl border border-hairline bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                  <Package className="size-6" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-ink">
                    {activeOrder.reference} ·{" "}
                    {activeOrder.status.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase())}
                  </span>
                  <span className="block text-xs text-muted">
                    {activeOrder.lines.length} item{activeOrder.lines.length === 1 ? "" : "s"} ·{" "}
                    {formatINR(activeOrder.total)}
                    {activeOrder.expectedBy ? ` · arriving ${formatDate(activeOrder.expectedBy)}` : ""}
                  </span>
                </span>
                <ArrowRight className="size-5 shrink-0 text-brand-400" aria-hidden="true" />
              </Link>
            </section>
          ) : null}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <section aria-labelledby="passport-heading">
            <h2
              id="passport-heading"
              className="mb-4 flex items-center gap-2.5 font-display text-lg font-semibold text-ink"
            >
              <PawPrint className="size-5 text-brand-600" aria-hidden="true" />
              Your pets
            </h2>

            {pets.loading || vaccinations.loading ? (
              <LoadingState label="Loading your pets" rows={2} />
            ) : pets.error ? (
              <ErrorState message={pets.error} onRetry={pets.refresh} />
            ) : activePet ? (
              <div className="space-y-4">
                <HealthPassportCard
                  pet={activePet}
                  vaccinations={vaccinations.data ?? []}
                  lastVisitDate={lastVisit?.scheduledFor}
                  href={`/app/pets/${activePet.id}`}
                />

                {(pets.data ?? []).slice(1).map((pet) => (
                  <Link
                    key={pet.id}
                    href={`/app/pets/${pet.id}`}
                    className="flex items-center gap-4 rounded-2xl border border-hairline bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-700">
                      <PawPrint className="size-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-ink">{pet.name}</span>
                      <span className="block text-xs text-muted">
                        {pet.breed} · {pet.weightKg} kg
                      </span>
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-brand-400" aria-hidden="true" />
                  </Link>
                ))}

                <Button asChild variant="outline" className="w-full">
                  <Link href="/app/pets/new">
                    <Plus className="size-4" aria-hidden="true" />
                    Add a pet
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-brand-200 bg-brand-50/40 p-7 text-center">
                <p className="text-sm text-muted">No pets added yet.</p>
                <Button asChild size="sm" className="mt-4">
                  <Link href="/app/pets/new">Create a Health Passport</Link>
                </Button>
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-hairline bg-brand-900 p-7 text-white">
            <Sparkles className="size-7 text-brand-300" aria-hidden="true" />
            <h2 className="mt-4 font-display text-lg font-semibold text-white">Ask Tailish</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              Questions about food, behaviour, a symptom you&apos;ve noticed — ask anything. Your
              pet&apos;s records are already attached.
            </p>
            <Button asChild className="mt-5 w-full">
              <Link href="/app/ask">Start a conversation</Link>
            </Button>
          </section>
        </div>
      </div>
    </>
  );
}
