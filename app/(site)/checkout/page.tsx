"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Banknote,
  CreditCard,
  Landmark,
  Loader2,
  Lock,
  MapPin,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/label";
import { Textarea } from "@/components/ui/input";
import { Container, Section } from "@/components/shared/section";
import { PageHero } from "@/components/shared/page-hero";
import { EmptyState, LoadingState } from "@/components/shared/states";
import { useCart } from "@/components/providers/cart-provider";
import { WhatsAppButton } from "@/components/whatsapp/whatsapp-button";
import { api } from "@/lib/api";
import { useAsync, useMutation } from "@/lib/hooks/use-async";
import type { Address, CheckoutRequest } from "@/lib/types";
import { whatsappMessages } from "@/lib/whatsapp";
import { cn, formatINR } from "@/lib/utils";

type PaymentMethod = CheckoutRequest["paymentMethod"];

const PAYMENT_METHODS: {
  value: PaymentMethod;
  label: string;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { value: "upi", label: "UPI", detail: "GPay, PhonePe, Paytm or any UPI app", icon: Smartphone },
  { value: "card", label: "Card", detail: "Credit or debit card", icon: CreditCard },
  { value: "netbanking", label: "Net banking", detail: "All major Indian banks", icon: Landmark },
  { value: "cod", label: "Cash on delivery", detail: "Pay when it arrives", icon: Banknote },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, loading, refresh } = useCart();

  const addresses = useAsync<Address[]>(() => api.account.listAddresses(), []);
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>("upi");
  const [notes, setNotes] = React.useState("");

  // `null` means "the user hasn't chosen yet", so the default address is
  // derived from the loaded list rather than copied into state by an effect.
  const [chosenAddressId, setChosenAddressId] = React.useState<string | null>(null);
  const defaultAddressId =
    (addresses.data?.find((address) => address.isDefault) ?? addresses.data?.[0])?.id ?? "";
  const addressId = chosenAddressId ?? defaultAddressId;
  const setAddressId = setChosenAddressId;

  const placeOrder = useMutation(async () => {
    const result = await api.commerce.checkout({ addressId, paymentMethod, notes: notes.trim() });
    await refresh();
    // The mock gateway resolves to an in-app confirmation; the real adapter
    // returns a Razorpay hosted page URL and this navigation leaves the site.
    router.push(result.payment.paymentLink);
    return result;
  });

  if (loading || addresses.loading) {
    return (
      <Section>
        <Container size="narrow">
          <LoadingState label="Loading checkout" rows={4} />
        </Container>
      </Section>
    );
  }

  if (cart.lines.length === 0 && !placeOrder.pending) {
    return (
      <>
        <PageHero
          eyebrow="Checkout"
          crumbs={[{ label: "Shop", href: "/shop" }, { label: "Checkout" }]}
          title="Checkout"
        />
        <Section className="pt-12">
          <Container size="narrow">
            <EmptyState
              icon={ShieldCheck}
              title="There's nothing to check out"
              description="Your cart is empty. Add something first and we'll be right here."
              action={
                <Button asChild>
                  <Link href="/shop">Browse the shop</Link>
                </Button>
              }
            />
          </Container>
        </Section>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Checkout"
        eyebrowIcon={Lock}
        crumbs={[{ label: "Shop", href: "/shop" }, { label: "Checkout" }]}
        title="Checkout"
        description="Delivery across Indore within 48 hours. Payments are processed by Razorpay — we never see your card details."
      />

      <Section className="pt-12">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
            <div className="space-y-10">
              <fieldset>
                <legend className="font-display text-xl font-semibold text-ink">
                  Delivery address
                </legend>

                <div className="mt-5 space-y-2.5">
                  {addresses.data?.map((address) => (
                    <label
                      key={address.id}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-2xl border p-5 transition-all",
                        addressId === address.id
                          ? "border-brand-600 bg-brand-50/60 ring-2 ring-brand-600/15"
                          : "border-hairline bg-white hover:border-brand-300",
                      )}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={addressId === address.id}
                        onChange={() => setAddressId(address.id)}
                        className="sr-only"
                      />
                      <MapPin className="mt-0.5 size-5 shrink-0 text-brand-500" aria-hidden="true" />
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-2 text-sm font-semibold capitalize text-ink">
                          {address.label}
                          {address.isDefault ? <Badge>Default</Badge> : null}
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-muted">
                          {address.line1}
                          {address.line2 ? `, ${address.line2}` : ""}
                          {address.landmark ? `, ${address.landmark}` : ""}
                          <br />
                          {address.city}, {address.state} {address.pincode}
                        </span>
                        {address.contactPhone ? (
                          <span className="mt-1 block text-xs text-muted">
                            {address.contactName} · {address.contactPhone}
                          </span>
                        ) : null}
                      </span>
                    </label>
                  ))}

                  <Link
                    href="/app/addresses"
                    className="block rounded-2xl border border-dashed border-brand-200 p-5 text-sm font-medium text-brand-700 transition-colors hover:border-brand-400 hover:bg-brand-50/30"
                  >
                    + Add a new address
                  </Link>
                </div>
              </fieldset>

              <fieldset>
                <legend className="font-display text-xl font-semibold text-ink">Payment</legend>

                <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {PAYMENT_METHODS.map((method) => (
                    <label
                      key={method.value}
                      className={cn(
                        "flex cursor-pointer items-center gap-3.5 rounded-2xl border p-5 transition-all",
                        paymentMethod === method.value
                          ? "border-brand-600 bg-brand-50/60 ring-2 ring-brand-600/15"
                          : "border-hairline bg-white hover:border-brand-300",
                      )}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === method.value}
                        onChange={() => setPaymentMethod(method.value)}
                        className="sr-only"
                      />
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-700">
                        <method.icon className="size-5" aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-ink">{method.label}</span>
                        <span className="block text-xs text-muted">{method.detail}</span>
                      </span>
                    </label>
                  ))}
                </div>

                <p className="mt-4 flex items-start gap-2.5 text-xs leading-relaxed text-muted">
                  <Lock className="mt-0.5 size-4 shrink-0 text-brand-500" aria-hidden="true" />
                  You&apos;ll be taken to Razorpay&apos;s secure payment page to complete the
                  transaction. Card details never touch Tailish servers.
                </p>
              </fieldset>

              <fieldset>
                <legend className="font-display text-xl font-semibold text-ink">
                  Delivery notes <span className="text-sm font-normal text-muted">(optional)</span>
                </legend>
                <div className="mt-5">
                  <Field label="Anything our courier should know?" htmlFor="checkout-notes">
                    <Textarea
                      id="checkout-notes"
                      rows={3}
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      placeholder="Gate code, preferred time, where to leave the parcel…"
                    />
                  </Field>
                </div>
              </fieldset>
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-3xl border border-hairline bg-white p-6 shadow-soft">
                <h2 className="font-display text-lg font-semibold text-ink">
                  Order summary
                  <span className="ml-2 text-sm font-normal text-muted">
                    ({cart.itemCount} item{cart.itemCount === 1 ? "" : "s"})
                  </span>
                </h2>

                <ul className="mt-5 max-h-64 space-y-3 overflow-y-auto">
                  {cart.lines.map((line) => (
                    <li key={line.id} className="flex items-center gap-3">
                      <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-cream">
                        <Image src={line.image} alt="" fill sizes="56px" className="object-cover" />
                        <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-brand-700 text-[0.65rem] font-bold text-white">
                          {line.quantity}
                        </span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-ink">
                          {line.name}
                        </span>
                        <span className="block text-xs text-muted">{line.brand}</span>
                      </span>
                      <span className="shrink-0 text-sm font-semibold tabular text-ink">
                        {formatINR(line.lineTotal)}
                      </span>
                    </li>
                  ))}
                </ul>

                <dl className="mt-5 space-y-2.5 border-t border-hairline pt-5 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted">Subtotal</dt>
                    <dd className="font-medium tabular text-ink">{formatINR(cart.itemsSubtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted">Delivery</dt>
                    <dd className="font-medium tabular text-ink">
                      {cart.deliveryFee === 0 ? "Free" : formatINR(cart.deliveryFee)}
                    </dd>
                  </div>
                  {cart.discount > 0 ? (
                    <div className="flex justify-between text-emerald-700">
                      <dt>Discount</dt>
                      <dd className="font-medium tabular">−{formatINR(cart.discount)}</dd>
                    </div>
                  ) : null}
                  <div className="flex justify-between border-t border-hairline pt-3 text-base">
                    <dt className="font-semibold text-ink">Total</dt>
                    <dd className="font-bold tabular text-ink">{formatINR(cart.total)}</dd>
                  </div>
                </dl>

                {placeOrder.error ? (
                  <p role="alert" className="mt-4 text-sm text-red-600">
                    {placeOrder.error}
                  </p>
                ) : null}

                <Button
                  size="lg"
                  className="mt-6 w-full"
                  disabled={!addressId || placeOrder.pending}
                  onClick={() => void placeOrder.run()}
                >
                  {placeOrder.pending ? (
                    <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                  ) : (
                    <Lock className="size-5" aria-hidden="true" />
                  )}
                  {paymentMethod === "cod"
                    ? `Place order · ${formatINR(cart.total)}`
                    : `Pay ${formatINR(cart.total)}`}
                </Button>

                <div className="mt-3">
                  <WhatsAppButton
                    variant="outline"
                    className="w-full"
                    text={whatsappMessages.checkout}
                    label="Continue on WhatsApp"
                  />
                </div>

                <p className="mt-5 text-xs leading-relaxed text-muted">
                  By placing this order you agree to our{" "}
                  <Link href="/terms" className="font-medium text-brand-700 underline-offset-4 hover:underline">
                    terms of service
                  </Link>
                  . Prescription items are verified before dispatch.
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
