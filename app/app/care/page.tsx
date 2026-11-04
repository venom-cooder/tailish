"use client";

import * as React from "react";
import Link from "next/link";
import {
  BadgeCheck,
  CalendarCheck,
  CalendarClock,
  ClipboardList,
  Loader2,
  MapPin,
  Stethoscope,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortalHeader } from "@/components/portal/portal-shell";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/states";
import { WhatsAppButton } from "@/components/whatsapp/whatsapp-button";
import { api } from "@/lib/api";
import { useAsync, useMutation } from "@/lib/hooks/use-async";
import type { Booking, BookingStatus } from "@/lib/types";
import { cn, formatDateLong, formatINR } from "@/lib/utils";

const STATUS_META: Record<BookingStatus, { label: string; variant: "verified" | "accent" | "default" | "outline" }> = {
  pending: { label: "Awaiting confirmation", variant: "accent" },
  confirmed: { label: "Confirmed", variant: "verified" },
  on_the_way: { label: "Vet on the way", variant: "accent" },
  in_progress: { label: "In progress", variant: "accent" },
  completed: { label: "Completed", variant: "default" },
  cancelled: { label: "Cancelled", variant: "outline" },
};

const UPCOMING: BookingStatus[] = ["pending", "confirmed", "on_the_way", "in_progress"];

export default function CarePage() {
  const bookings = useAsync<Booking[]>(() => api.services.listBookings(), []);

  const upcoming = (bookings.data ?? [])
    .filter((booking) => UPCOMING.includes(booking.status))
    .sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor));

  const past = (bookings.data ?? [])
    .filter((booking) => !UPCOMING.includes(booking.status))
    .sort((a, b) => b.scheduledFor.localeCompare(a.scheduledFor));

  function replaceBooking(updated: Booking) {
    bookings.setData(
      (current) => current?.map((item) => (item.id === updated.id ? updated : item)) ?? null,
    );
  }

  return (
    <>
      <PortalHeader
        title="Care & bookings"
        description="Visits you've booked, and the summaries from the ones that have happened."
      >
        <Button asChild>
          <Link href="/vet-care/book-visit">
            <CalendarCheck className="size-4" aria-hidden="true" />
            Book a visit
          </Link>
        </Button>
      </PortalHeader>

      {bookings.loading ? (
        <LoadingState label="Loading your bookings" rows={3} />
      ) : bookings.error ? (
        <ErrorState message={bookings.error} onRetry={bookings.refresh} />
      ) : (
        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {upcoming.length === 0 ? (
              <EmptyState
                icon={CalendarClock}
                title="No visits booked"
                description="When you book a home visit, video consult or vaccination it'll show up here with everything you need."
                action={
                  <Button asChild>
                    <Link href="/vet-care/book-visit">Book a vet visit</Link>
                  </Button>
                }
              />
            ) : (
              <ul className="space-y-4">
                {upcoming.map((booking) => (
                  <li key={booking.id}>
                    <BookingCard booking={booking} onChange={replaceBooking} />
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="past">
            {past.length === 0 ? (
              <EmptyState icon={ClipboardList} title="No past visits yet" />
            ) : (
              <ul className="space-y-4">
                {past.map((booking) => (
                  <li key={booking.id}>
                    <BookingCard booking={booking} onChange={replaceBooking} />
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
        </Tabs>
      )}
    </>
  );
}

function BookingCard({
  booking,
  onChange,
}: {
  booking: Booking;
  onChange: (updated: Booking) => void;
}) {
  const [confirmingCancel, setConfirmingCancel] = React.useState(false);
  const meta = STATUS_META[booking.status];
  const canManage = UPCOMING.includes(booking.status);

  const cancel = useMutation(async () => {
    const updated = await api.services.updateBooking(booking.id, { status: "cancelled" });
    onChange(updated);
    setConfirmingCancel(false);
    return updated;
  });

  return (
    <article
      className={cn(
        "rounded-3xl border bg-white p-6 shadow-soft transition-all duration-300",
        booking.status === "cancelled"
          ? "border-hairline opacity-70"
          : "border-hairline hover:-translate-y-0.5 hover:shadow-lift",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={meta.variant}>{meta.label}</Badge>
            <span className="text-xs tabular text-muted">{booking.reference}</span>
          </div>

          <h2 className="mt-2.5 font-display text-lg font-semibold text-ink">
            {booking.serviceName} for {booking.petName}
          </h2>

          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
            <CalendarClock className="size-4 shrink-0" aria-hidden="true" />
            {formatDateLong(booking.scheduledFor)} · {booking.slotLabel}
          </p>

          {booking.providerName ? (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
              <Stethoscope className="size-4 shrink-0" aria-hidden="true" />
              {booking.providerName}
            </p>
          ) : null}

          {booking.addressSummary ? (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
              <MapPin className="size-4 shrink-0" aria-hidden="true" />
              {booking.addressSummary}
            </p>
          ) : null}

          {booking.notes ? (
            <p className="mt-3 rounded-xl bg-brand-50/60 p-3 text-sm italic leading-relaxed text-muted">
              {booking.notes}
            </p>
          ) : null}
        </div>

        <div className="shrink-0 text-right">
          <p className="tabular text-xl font-bold text-ink">{formatINR(booking.price)}</p>
          <p className="mt-0.5 text-xs capitalize text-muted">{booking.paymentStatus}</p>
        </div>
      </div>

      {booking.visitSummary ? (
        <div className="mt-5 rounded-2xl border border-hairline bg-brand-50/40 p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
            <ClipboardList className="size-4 text-brand-600" aria-hidden="true" />
            Visit summary
          </h3>

          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">
                Observations
              </h4>
              <ul className="mt-2 space-y-1.5">
                {booking.visitSummary.observations.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink/80">
                    <span
                      aria-hidden="true"
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-400"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">Care plan</h4>
              <ul className="mt-2 space-y-1.5">
                {booking.visitSummary.carePlan.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink/80">
                    <BadgeCheck
                      className="mt-0.5 size-4 shrink-0 text-emerald-600"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {booking.visitSummary.followUpOn ? (
            <p className="mt-4 border-t border-hairline pt-3 text-xs text-muted">
              Follow-up scheduled for{" "}
              <span className="font-medium text-ink">
                {formatDateLong(booking.visitSummary.followUpOn)}
              </span>
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2 border-t border-hairline pt-5">
        <Button asChild size="sm" variant="outline">
          <Link href={`/app/pets/${booking.petId}`}>View passport</Link>
        </Button>

        <WhatsAppButton
          size="sm"
          variant="ghost"
          text={`Hi Tailish! I have a question about booking ${booking.reference}.`}
          label="Message care team"
        />

        {canManage ? (
          confirmingCancel ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted">Cancel this visit?</span>
              <Button
                size="sm"
                variant="danger"
                disabled={cancel.pending}
                onClick={() => void cancel.run()}
              >
                {cancel.pending ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : null}
                Yes, cancel
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setConfirmingCancel(false)}>
                Keep it
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              className="text-red-600 hover:bg-red-50"
              onClick={() => setConfirmingCancel(true)}
            >
              <X className="size-4" aria-hidden="true" />
              Cancel visit
            </Button>
          )
        ) : null}
      </div>

      {cancel.error ? (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {cancel.error}
        </p>
      ) : null}

      {canManage ? (
        <p className="mt-3 text-xs text-muted">
          Free to cancel or reschedule up to two hours before the slot.
        </p>
      ) : null}
    </article>
  );
}
