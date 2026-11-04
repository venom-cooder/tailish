"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Loader2, MapPin, Package, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/shared/section";
import { ErrorState, LoadingState } from "@/components/shared/states";
import { WhatsAppButton } from "@/components/whatsapp/whatsapp-button";
import { api } from "@/lib/api";
import { useAsync } from "@/lib/hooks/use-async";
import type { Order } from "@/lib/types";
import { whatsappMessages } from "@/lib/whatsapp";
import { formatDate, formatINR } from "@/lib/utils";

/**
 * Post-payment landing page.
 *
 * Razorpay redirects here with the order reference. We confirm the payment
 * status against the backend rather than trusting the redirect — the real
 * gateway can land a user here before the webhook has settled.
 */
function SuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("order");

  const order = useAsync<Order | null>(
    async () => (reference ? api.commerce.getOrder(reference) : null),
    [reference],
  );

  const [paymentConfirmed, setPaymentConfirmed] = React.useState(false);

  React.useEffect(() => {
    if (!order.data || paymentConfirmed) return;
    let active = true;
    void api.commerce
      .paymentStatus("pay_redirect", order.data.reference)
      .then(() => {
        if (active) setPaymentConfirmed(true);
      })
      .catch(() => {
        // A failed status check isn't fatal — the order exists either way,
        // and the user can see its state on the orders page.
        if (active) setPaymentConfirmed(true);
      });
    return () => {
      active = false;
    };
  }, [order.data, paymentConfirmed]);

  if (order.loading) return <LoadingState label="Confirming your order" rows={3} />;
  if (order.error) return <ErrorState message={order.error} onRetry={order.refresh} />;

  if (!order.data) {
    return (
      <ErrorState message="We couldn't find that order. Check your orders page, or message the care team." />
    );
  }

  const placed = order.data;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="overflow-hidden rounded-3xl border border-hairline bg-white shadow-soft">
        <div className="border-b border-hairline bg-emerald-50 px-6 py-10 text-center sm:px-8">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-600 text-white">
            {paymentConfirmed ? (
              <Check className="size-8" strokeWidth={3} aria-hidden="true" />
            ) : (
              <Loader2 className="size-8 animate-spin" aria-hidden="true" />
            )}
          </span>

          <h1 className="mt-5 font-display text-2xl font-bold text-ink sm:text-3xl">
            {placed.paymentMethod === "cod" ? "Order placed" : "Payment received"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            Order <span className="font-semibold tabular text-ink">{placed.reference}</span>
            {placed.expectedBy ? ` · arriving by ${formatDate(placed.expectedBy)}` : ""}
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Badge variant="verified">
              {placed.paymentStatus === "cod" ? "Pay on delivery" : "Paid"}
            </Badge>
            <Badge>{placed.lines.length} item{placed.lines.length === 1 ? "" : "s"}</Badge>
          </div>
        </div>

        <div className="px-6 py-7 sm:px-8">
          <ul className="space-y-4">
            {placed.lines.map((line) => (
              <li key={line.id} className="flex items-center gap-4">
                <span className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-cream">
                  <Image src={line.image} alt="" fill sizes="64px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-ink">{line.name}</span>
                  <span className="block text-xs text-muted">
                    {line.brand} · Qty {line.quantity}
                  </span>
                </span>
                <span className="shrink-0 text-sm font-semibold tabular text-ink">
                  {formatINR(line.lineTotal)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-2.5 border-t border-hairline pt-5 text-sm">
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

          <div className="mt-6 flex items-start gap-3 rounded-2xl bg-brand-50/60 p-5">
            <MapPin className="mt-0.5 size-5 shrink-0 text-brand-600" aria-hidden="true" />
            <div className="text-sm leading-relaxed text-muted">
              <span className="font-medium capitalize text-ink">{placed.address.label}</span>
              <br />
              {placed.address.line1}
              {placed.address.line2 ? `, ${placed.address.line2}` : ""}
              <br />
              {placed.address.city}, {placed.address.state} {placed.address.pincode}
            </div>
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-2xl bg-brand-50/60 p-5">
            <Truck className="mt-0.5 size-5 shrink-0 text-brand-600" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-muted">
              We&apos;ve sent the confirmation to your WhatsApp. You&apos;ll get a message when the
              order ships and again when it&apos;s out for delivery.
            </p>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href={`/app/orders/${placed.reference}`}>
                <Package className="size-5" aria-hidden="true" />
                Track this order
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/shop">Keep shopping</Link>
            </Button>
          </div>

          <div className="mt-3">
            <WhatsAppButton
              variant="ghost"
              className="w-full"
              text={whatsappMessages.order(placed.reference)}
              label="Question about this order?"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Section>
      <Container>
        {/* useSearchParams needs a Suspense boundary so the route keeps a
            static shell under Cache Components. */}
        <React.Suspense fallback={<LoadingState label="Loading your order" rows={3} />}>
          <SuccessContent />
        </React.Suspense>
      </Container>
    </Section>
  );
}
