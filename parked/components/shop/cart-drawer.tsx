"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTitle, SheetContent } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/shared/states";
import { useCart } from "@/components/providers/cart-provider";
import { WhatsAppButton } from "@/components/whatsapp/whatsapp-button";
import { whatsappMessages } from "@/lib/whatsapp";
import { formatINR } from "@/lib/utils";

/** Slide-out cart, opened from the header and after every add-to-cart. */
export function CartDrawer() {
  const { cart, open, setOpen, updateLine, removeLine, error } = useCart();

  const remainingForFreeDelivery = Math.max(0, cart.freeDeliveryThreshold - cart.itemsSubtotal);
  const freeDeliveryProgress =
    cart.itemsSubtotal === 0 ? 0 : (cart.itemsSubtotal / cart.freeDeliveryThreshold) * 100;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <SheetContent aria-describedby={undefined}>
        <header className="flex items-center justify-between border-b border-hairline px-5 py-4">
          <DialogTitle className="font-display text-lg font-semibold text-ink">
            Your cart
            {cart.itemCount > 0 ? (
              <span className="ml-2 text-sm font-normal text-muted">
                ({cart.itemCount} item{cart.itemCount === 1 ? "" : "s"})
              </span>
            ) : null}
          </DialogTitle>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close cart"
            className="grid size-9 place-items-center rounded-lg text-muted transition-colors hover:bg-brand-50 hover:text-ink"
          >
            <X className="size-5" />
          </button>
        </header>

        {cart.lines.length === 0 ? (
          <div className="flex flex-1 items-center px-5">
            <EmptyState
              icon={ShoppingBag}
              title="Your cart is empty"
              description="Food, supplements, parasite control and everything else your pet needs — delivered."
              action={
                <Button asChild onClick={() => setOpen(false)}>
                  <Link href="/shop">Browse the shop</Link>
                </Button>
              }
              className="w-full"
            />
          </div>
        ) : (
          <>
            {remainingForFreeDelivery > 0 ? (
              <div className="border-b border-hairline bg-brand-50/60 px-5 py-3">
                <p className="text-xs text-muted">
                  Add{" "}
                  <span className="font-semibold text-ink tabular">
                    {formatINR(remainingForFreeDelivery)}
                  </span>{" "}
                  more for free delivery
                </p>
                <Progress
                  value={freeDeliveryProgress}
                  className="mt-2 h-1.5"
                  label="Progress towards free delivery"
                />
              </div>
            ) : (
              <p className="border-b border-hairline bg-emerald-50 px-5 py-3 text-xs font-medium text-emerald-800">
                Free delivery unlocked on this order.
              </p>
            )}

            <ul className="flex-1 divide-y divide-hairline overflow-y-auto px-5">
              {cart.lines.map((line) => (
                <li key={line.id} className="flex gap-3 py-4">
                  <Link
                    href={`/shop/product/${line.slug}`}
                    onClick={() => setOpen(false)}
                    className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-cream"
                  >
                    <Image src={line.image} alt={line.name} fill sizes="80px" className="object-cover" />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-brand-600">{line.brand}</p>
                    <Link
                      href={`/shop/product/${line.slug}`}
                      onClick={() => setOpen(false)}
                      className="mt-0.5 block text-sm font-medium leading-snug text-ink transition-colors hover:text-brand-700"
                    >
                      {line.name}
                    </Link>
                    {line.weightLabel ? (
                      <p className="mt-0.5 text-xs text-muted">{line.weightLabel}</p>
                    ) : null}

                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <div className="inline-flex items-center rounded-xl border border-hairline">
                        <button
                          type="button"
                          onClick={() => void updateLine(line.id, line.quantity - 1)}
                          aria-label={`Reduce quantity of ${line.name}`}
                          className="grid size-8 place-items-center rounded-lg text-muted transition-colors hover:bg-brand-50 hover:text-ink"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm font-semibold tabular text-ink">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => void updateLine(line.id, line.quantity + 1)}
                          disabled={line.quantity >= 10}
                          aria-label={`Increase quantity of ${line.name}`}
                          className="grid size-8 place-items-center rounded-lg text-muted transition-colors hover:bg-brand-50 hover:text-ink disabled:opacity-40"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold tabular text-ink">
                          {formatINR(line.lineTotal)}
                        </span>
                        <button
                          type="button"
                          onClick={() => void removeLine(line.id)}
                          aria-label={`Remove ${line.name} from cart`}
                          className="grid size-8 place-items-center rounded-lg text-muted transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="space-y-4 border-t border-hairline px-5 py-5">
              {error ? (
                <p role="alert" className="text-sm text-red-600">
                  {error}
                </p>
              ) : null}

              <dl className="space-y-1.5 text-sm">
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
                    <dt>Discount {cart.appliedCoupon ? `(${cart.appliedCoupon})` : ""}</dt>
                    <dd className="font-medium tabular">−{formatINR(cart.discount)}</dd>
                  </div>
                ) : null}
                <div className="flex justify-between border-t border-hairline pt-2.5 text-base">
                  <dt className="font-semibold text-ink">Total</dt>
                  <dd className="font-bold tabular text-ink">{formatINR(cart.total)}</dd>
                </div>
              </dl>

              <Button asChild size="lg" className="w-full" onClick={() => setOpen(false)}>
                <Link href="/checkout">Checkout</Link>
              </Button>

              <div className="flex gap-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setOpen(false)}
                >
                  <Link href="/cart">View full cart</Link>
                </Button>
                <WhatsAppButton
                  size="sm"
                  variant="outline"
                  text={whatsappMessages.cart}
                  label="Order on WhatsApp"
                  className="flex-1"
                />
              </div>
            </footer>
          </>
        )}
      </SheetContent>
    </Dialog>
  );
}
