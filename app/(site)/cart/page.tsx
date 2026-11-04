"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Tag, Trash2, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Container, Section } from "@/components/shared/section";
import { PageHero } from "@/components/shared/page-hero";
import { EmptyState, LoadingState } from "@/components/shared/states";
import { useCart } from "@/components/providers/cart-provider";
import { WhatsAppButton } from "@/components/whatsapp/whatsapp-button";
import { whatsappMessages } from "@/lib/whatsapp";
import { formatINR } from "@/lib/utils";

export default function CartPage() {
  const { cart, loading, updateLine, removeLine, applyCoupon } = useCart();
  const [coupon, setCoupon] = React.useState("");
  const [couponError, setCouponError] = React.useState<string | null>(null);
  const [couponPending, setCouponPending] = React.useState(false);

  const remainingForFreeDelivery = Math.max(0, cart.freeDeliveryThreshold - cart.itemsSubtotal);

  async function handleCoupon(event: React.FormEvent) {
    event.preventDefault();
    setCouponPending(true);
    setCouponError(await applyCoupon(coupon));
    setCouponPending(false);
  }

  return (
    <>
      <PageHero
        eyebrow="Your cart"
        eyebrowIcon={ShoppingBag}
        crumbs={[{ label: "Shop", href: "/shop" }, { label: "Cart" }]}
        title="Your cart"
        description={
          cart.itemCount > 0
            ? `${cart.itemCount} item${cart.itemCount === 1 ? "" : "s"} ready to go.`
            : undefined
        }
      />

      <Section className="pt-12">
        <Container>
          {loading ? (
            <LoadingState label="Loading your cart" rows={3} />
          ) : cart.lines.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="Your cart is empty"
              description="Food, supplements, parasite control and everything else your pet needs — delivered across Indore within 48 hours."
              action={
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild>
                    <Link href="/shop">Browse the shop</Link>
                  </Button>
                  <WhatsAppButton
                    variant="outline"
                    text={whatsappMessages.shop}
                    label="Ask a vet what to buy"
                  />
                </div>
              }
            />
          ) : (
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
              <div>
                {remainingForFreeDelivery > 0 ? (
                  <div className="mb-6 rounded-2xl border border-hairline bg-brand-50/60 p-5">
                    <p className="flex items-center gap-2 text-sm text-muted">
                      <Truck className="size-4 text-brand-600" aria-hidden="true" />
                      Add{" "}
                      <span className="font-semibold tabular text-ink">
                        {formatINR(remainingForFreeDelivery)}
                      </span>{" "}
                      more for free delivery
                    </p>
                    <Progress
                      value={(cart.itemsSubtotal / cart.freeDeliveryThreshold) * 100}
                      className="mt-3"
                      label="Progress towards free delivery"
                    />
                  </div>
                ) : (
                  <p className="mb-6 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-medium text-emerald-800">
                    <Truck className="size-4" aria-hidden="true" />
                    Free delivery unlocked on this order.
                  </p>
                )}

                <ul className="divide-y divide-hairline rounded-3xl border border-hairline bg-white">
                  {cart.lines.map((line) => (
                    <li key={line.id} className="flex gap-4 p-5 sm:p-6">
                      <Link
                        href={`/shop/product/${line.slug}`}
                        className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-cream sm:size-28"
                      >
                        <Image
                          src={line.image}
                          alt={line.name}
                          fill
                          sizes="112px"
                          className="object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </Link>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium uppercase tracking-wide text-brand-600">
                          {line.brand}
                        </p>
                        <h2 className="mt-1 text-sm font-semibold leading-snug text-ink sm:text-base">
                          <Link
                            href={`/shop/product/${line.slug}`}
                            className="transition-colors hover:text-brand-700"
                          >
                            {line.name}
                          </Link>
                        </h2>
                        {line.weightLabel ? (
                          <p className="mt-0.5 text-xs text-muted">{line.weightLabel}</p>
                        ) : null}
                        <p className="mt-1 text-sm tabular text-muted">
                          {formatINR(line.unitPrice)} each
                        </p>

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                          <div className="inline-flex items-center rounded-xl border border-hairline">
                            <button
                              type="button"
                              onClick={() => void updateLine(line.id, line.quantity - 1)}
                              aria-label={`Reduce quantity of ${line.name}`}
                              className="grid size-9 place-items-center rounded-lg text-muted transition-colors hover:bg-brand-50 hover:text-ink"
                            >
                              <Minus className="size-4" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold tabular text-ink">
                              {line.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => void updateLine(line.id, line.quantity + 1)}
                              disabled={line.quantity >= 10}
                              aria-label={`Increase quantity of ${line.name}`}
                              className="grid size-9 place-items-center rounded-lg text-muted transition-colors hover:bg-brand-50 hover:text-ink disabled:opacity-40"
                            >
                              <Plus className="size-4" />
                            </button>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-bold tabular text-ink">
                              {formatINR(line.lineTotal)}
                            </span>
                            <button
                              type="button"
                              onClick={() => void removeLine(line.id)}
                              aria-label={`Remove ${line.name} from cart`}
                              className="grid size-9 place-items-center rounded-lg text-muted transition-colors hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  <Button asChild variant="ghost">
                    <Link href="/shop">
                      <ArrowRight className="size-4 rotate-180" aria-hidden="true" />
                      Continue shopping
                    </Link>
                  </Button>
                </div>
              </div>

              <aside className="lg:sticky lg:top-28 lg:self-start">
                <div className="rounded-3xl border border-hairline bg-white p-6 shadow-soft">
                  <h2 className="font-display text-lg font-semibold text-ink">Order summary</h2>

                  <form onSubmit={handleCoupon} className="mt-5">
                    <label htmlFor="coupon" className="text-sm font-medium text-ink">
                      Have a coupon?
                    </label>
                    <div className="mt-2 flex gap-2">
                      <Input
                        id="coupon"
                        value={coupon}
                        onChange={(event) => setCoupon(event.target.value)}
                        placeholder="TAILISH10"
                        aria-describedby={couponError ? "coupon-error" : undefined}
                      />
                      <Button type="submit" variant="outline" disabled={couponPending}>
                        <Tag className="size-4" aria-hidden="true" />
                        Apply
                      </Button>
                    </div>
                    {couponError ? (
                      <p id="coupon-error" role="alert" className="mt-2 text-xs text-red-600">
                        {couponError}
                      </p>
                    ) : null}
                  </form>

                  <dl className="mt-6 space-y-2.5 border-t border-hairline pt-5 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted">Subtotal</dt>
                      <dd className="font-medium tabular text-ink">
                        {formatINR(cart.itemsSubtotal)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted">Delivery</dt>
                      <dd className="font-medium tabular text-ink">
                        {cart.deliveryFee === 0 ? "Free" : formatINR(cart.deliveryFee)}
                      </dd>
                    </div>
                    {cart.discount > 0 ? (
                      <div className="flex justify-between text-emerald-700">
                        <dt>Discount {cart.appliedCoupon ? `(${cart.appliedCoupon})` : ""}</dt>
                        <dd className="font-medium tabular">−{formatINR(cart.discount)}</dd>
                      </div>
                    ) : null}
                    <div className="flex justify-between border-t border-hairline pt-3 text-base">
                      <dt className="font-semibold text-ink">Total</dt>
                      <dd className="font-bold tabular text-ink">{formatINR(cart.total)}</dd>
                    </div>
                  </dl>

                  <Button asChild size="lg" className="mt-6 w-full">
                    <Link href="/checkout">
                      Proceed to checkout
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </Button>

                  <div className="mt-3">
                    <WhatsAppButton
                      variant="outline"
                      className="w-full"
                      text={whatsappMessages.cart}
                      label="Order on WhatsApp"
                    />
                  </div>

                  <p className="mt-5 text-xs leading-relaxed text-muted">
                    Payments are processed securely by Razorpay. We never see or store your card
                    details.
                  </p>
                </div>
              </aside>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
