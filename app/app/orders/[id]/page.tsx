"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Download, Loader2, MapPin, Package, RotateCcw, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PortalHeader } from "@/components/portal/portal-shell";
import { ErrorState, LoadingState } from "@/components/shared/states";
import { useCart } from "@/components/providers/cart-provider";
import { WhatsAppButton } from "@/components/whatsapp/whatsapp-button";
import {
  ORDER_JOURNEY,
  ORDER_STATUS_META,
  paymentSummaryLabel,
} from "@/components/portal/order-status";
import { api } from "@/lib/api";
import { useAsync, useMutation } from "@/lib/hooks/use-async";
import type { Order } from "@/lib/types";
import { whatsappMessages } from "@/lib/whatsapp";
import { cn, formatDate, formatINR } from "@/lib/utils";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const order = useAsync<Order>(() => api.commerce.getOrder(id), [id]);
  const { setOpen } = useCart();

  const reorder = useMutation(async () => {
    const result = await api.commerce.reorder(id);
    setOpen(true);
    return result;
  });

  if (order.loading) return <LoadingState label="Loading order" rows={4} />;
  if (order.error) return <ErrorState message={order.error} onRetry={order.refresh} />;
  if (!order.data) return null;

  const placed = order.data;
  const meta = ORDER_STATUS_META[placed.status];
  const cancelled = placed.status === "cancelled";
  const currentStep = ORDER_JOURNEY.indexOf(placed.status);

  return (
    <>
      <PortalHeader title={`Order ${placed.reference}`} backHref="/app/orders">
        <Button variant="outline" disabled={reorder.pending} onClick={() => void reorder.run()}>
          {reorder.pending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <RotateCcw className="size-4" aria-hidden="true" />
          )}
          Reorder
        </Button>
      </PortalHeader>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          {/* Progress tracker */}
          <section className="rounded-3xl border border-hairline bg-white p-6 shadow-soft sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Badge variant={meta.variant}>{meta.label}</Badge>
              {placed.expectedBy && !cancelled ? (
                <p className="text-sm text-muted">
                  {placed.deliveredAt
                    ? `Delivered ${formatDate(placed.deliveredAt)}`
                    : `Expected by ${formatDate(placed.expectedBy)}`}
                </p>
              ) : null}
            </div>

            {cancelled ? (
              <p className="mt-5 rounded-2xl bg-brand-50/60 p-5 text-sm leading-relaxed text-muted">
                This order was cancelled. Any payment made has been refunded to the original payment
                method — allow 5–7 working days for it to appear.
              </p>
            ) : (
              <ol className="mt-7 space-y-0">
                {ORDER_JOURNEY.map((step, index) => {
                  const done = index <= currentStep;
                  const active = index === currentStep;
                  const isLast = index === ORDER_JOURNEY.length - 1;

                  return (
                    <li key={step} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <span
                          className={cn(
                            "grid size-8 shrink-0 place-items-center rounded-full border-2 transition-colors",
                            done
                              ? "border-brand-600 bg-brand-600 text-white"
                              : "border-hairline bg-white text-muted",
                            active && "ring-4 ring-brand-600/15",
                          )}
                        >
                          {done ? (
                            <Check className="size-4" strokeWidth={3} aria-hidden="true" />
                          ) : (
                            <span className="size-2 rounded-full bg-current" />
                          )}
                        </span>
                        {!isLast ? (
                          <span
                            aria-hidden="true"
                            className={cn(
                              "w-0.5 flex-1",
                              index < currentStep ? "bg-brand-600" : "bg-hairline",
                            )}
                          />
                        ) : null}
                      </div>

                      <div className={cn("pt-1", isLast ? "pb-0" : "pb-6")}>
                        <p
                          className={cn(
                            "text-sm font-medium",
                            done ? "text-ink" : "text-muted",
                          )}
                        >
                          {ORDER_STATUS_META[step].label}
                        </p>
                        {active ? (
                          <p className="mt-0.5 text-xs text-brand-600">Current status</p>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}

            {placed.trackingLink && !cancelled ? (
              <Button asChild variant="outline" className="mt-6 w-full sm:w-auto">
                <a href={placed.trackingLink} target="_blank" rel="noopener noreferrer">
                  <Truck className="size-4" aria-hidden="true" />
                  Track with courier
                </a>
              </Button>
            ) : null}
          </section>

          {/* Items */}
          <section className="rounded-3xl border border-hairline bg-white p-6 shadow-soft sm:p-8">
            <h2 className="flex items-center gap-2.5 font-display text-lg font-semibold text-ink">
              <Package className="size-5 text-brand-600" aria-hidden="true" />
              Items
            </h2>

            <ul className="mt-5 divide-y divide-hairline">
              {placed.lines.map((line) => (
                <li key={line.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <Link
                    href={`/shop/product/${line.slug}`}
                    className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-cream"
                  >
                    <Image src={line.image} alt="" fill sizes="64px" className="object-cover" />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/shop/product/${line.slug}`}
                      className="block text-sm font-semibold text-ink transition-colors hover:text-brand-700"
                    >
                      {line.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted">
                      {line.brand} · {formatINR(line.unitPrice)} × {line.quantity}
                    </p>
                  </div>

                  <span className="shrink-0 text-sm font-semibold tabular text-ink">
                    {formatINR(line.lineTotal)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-hairline bg-white p-6 shadow-soft">
            <h2 className="font-display text-lg font-semibold text-ink">Payment summary</h2>

            <dl className="mt-5 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="tabular text-ink">{formatINR(placed.itemsSubtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Delivery</dt>
                <dd className="tabular text-ink">
                  {placed.deliveryFee === 0 ? "Free" : formatINR(placed.deliveryFee)}
                </dd>
              </div>
              {placed.discount > 0 ? (
                <div className="flex justify-between text-emerald-700">
                  <dt>Discount</dt>
                  <dd className="tabular">−{formatINR(placed.discount)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between border-t border-hairline pt-3 text-base">
                <dt className="font-semibold text-ink">Total</dt>
                <dd className="font-bold tabular text-ink">{formatINR(placed.total)}</dd>
              </div>
            </dl>

            <p className="mt-4 text-xs text-muted">{paymentSummaryLabel(placed)}</p>

            {placed.invoiceUrl ? (
              <Button asChild variant="outline" className="mt-5 w-full">
                <a href={placed.invoiceUrl} download>
                  <Download className="size-4" aria-hidden="true" />
                  Download invoice
                </a>
              </Button>
            ) : null}
          </section>

          <section className="rounded-3xl border border-hairline bg-white p-6 shadow-soft">
            <h2 className="flex items-center gap-2.5 font-display text-lg font-semibold text-ink">
              <MapPin className="size-5 text-brand-600" aria-hidden="true" />
              Delivery address
            </h2>

            <address className="mt-4 text-sm not-italic leading-relaxed text-muted">
              <span className="block font-medium capitalize text-ink">{placed.address.label}</span>
              {placed.address.line1}
              {placed.address.line2 ? `, ${placed.address.line2}` : ""}
              <br />
              {placed.address.city}, {placed.address.state} {placed.address.pincode}
              {placed.address.contactPhone ? (
                <>
                  <br />
                  {placed.address.contactName} · {placed.address.contactPhone}
                </>
              ) : null}
            </address>
          </section>

          <WhatsAppButton
            className="w-full"
            text={whatsappMessages.order(placed.reference)}
            label="Question about this order?"
          />
        </div>
      </div>

      {reorder.error ? (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {reorder.error}
        </p>
      ) : null}
    </>
  );
}
