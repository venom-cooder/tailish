"use client";

import * as React from "react";
import { Check, Loader2, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/providers/cart-provider";
import type { Product } from "@/lib/types";

/** Quantity stepper plus add-to-cart, used on the product detail page. */
export function AddToCart({ product }: { product: Product }) {
  const { addItem, pendingProductId } = useCart();
  const [quantity, setQuantity] = React.useState(1);
  const [added, setAdded] = React.useState(false);

  const pending = pendingProductId === product.id;
  const soldOut = product.stockStatus === "out_of_stock";

  React.useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 2500);
    return () => clearTimeout(timer);
  }, [added]);

  async function handleAdd() {
    const ok = await addItem(product.id, quantity);
    if (ok) setAdded(true);
  }

  if (soldOut) {
    return (
      <div className="rounded-2xl border border-hairline bg-brand-50/60 p-5">
        <p className="text-sm font-semibold text-ink">Out of stock</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          We&apos;ll have this back shortly. Message the care team on WhatsApp and we&apos;ll tell
          you the moment it lands — or suggest an equivalent.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="inline-flex items-center rounded-xl border border-hairline">
        <button
          type="button"
          onClick={() => setQuantity((value) => Math.max(1, value - 1))}
          disabled={quantity <= 1}
          aria-label="Reduce quantity"
          className="grid size-11 place-items-center rounded-lg text-muted transition-colors hover:bg-brand-50 hover:text-ink disabled:opacity-40"
        >
          <Minus className="size-4" />
        </button>
        <span className="w-10 text-center font-semibold tabular text-ink" aria-live="polite">
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => setQuantity((value) => Math.min(10, value + 1))}
          disabled={quantity >= 10}
          aria-label="Increase quantity"
          className="grid size-11 place-items-center rounded-lg text-muted transition-colors hover:bg-brand-50 hover:text-ink disabled:opacity-40"
        >
          <Plus className="size-4" />
        </button>
      </div>

      <Button size="lg" className="flex-1" disabled={pending} onClick={() => void handleAdd()}>
        {pending ? (
          <Loader2 className="size-5 animate-spin" aria-hidden="true" />
        ) : added ? (
          <Check className="size-5" aria-hidden="true" />
        ) : (
          <ShoppingBag className="size-5" aria-hidden="true" />
        )}
        {added ? "Added to cart" : "Add to cart"}
      </Button>
    </div>
  );
}
