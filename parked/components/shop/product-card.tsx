"use client";

import Image from "next/image";
import Link from "next/link";
import { Loader2, Plus, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/providers/cart-provider";
import type { Product } from "@/lib/types";
import { cn, formatINR } from "@/lib/utils";

const STOCK_LABEL: Record<Product["stockStatus"], { text: string; tone: string } | null> = {
  in_stock: null,
  low_stock: { text: "Only a few left", tone: "text-accent-600" },
  out_of_stock: { text: "Out of stock", tone: "text-muted" },
  preorder: { text: "Pre-order", tone: "text-brand-600" },
};

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const { addItem, pendingProductId } = useCart();
  const pending = pendingProductId === product.id;
  const soldOut = product.stockStatus === "out_of_stock";
  const stock = STOCK_LABEL[product.stockStatus];
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-3xl border border-hairline bg-white shadow-soft",
        "transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift",
        className,
      )}
    >
      <Link
        href={`/shop/product/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-cream"
        tabIndex={-1}
        aria-hidden="true"
      >
        <Image
          src={product.images[0]}
          alt=""
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={cn(
            "object-cover transition-transform duration-500 group-hover:scale-105",
            soldOut && "opacity-60 saturate-50",
          )}
        />

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {discount > 0 && !soldOut ? (
            <Badge variant="accent" className="shadow-soft">
              {discount}% off
            </Badge>
          ) : null}
          {product.prescriptionRequired ? (
            <Badge variant="outline" className="shadow-soft">
              Prescription
            </Badge>
          ) : null}
        </div>

        {/* Paid placements are always labelled — see commerce.listProducts. */}
        {product.sponsored ? (
          <Badge variant="outline" className="absolute right-3 top-3 shadow-soft">
            Sponsored
          </Badge>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-600">{product.brand}</p>

        <h3 className="mt-1.5 text-sm font-semibold leading-snug text-ink">
          <Link
            href={`/shop/product/${product.slug}`}
            className="transition-colors after:absolute hover:text-brand-700"
          >
            {product.name}
          </Link>
        </h3>

        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted">
          <Star className="size-3.5 fill-gold-500 text-gold-500" aria-hidden="true" />
          <span className="tabular font-medium text-ink">{product.rating}</span>
          <span>({product.reviewCount})</span>
          {product.weightLabel ? (
            <>
              <span aria-hidden="true">·</span>
              <span>{product.weightLabel}</span>
            </>
          ) : null}
        </div>

        <div className="mt-auto pt-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="tabular text-base font-bold text-ink">{formatINR(product.price)}</p>
              {product.compareAtPrice ? (
                <p className="tabular text-xs text-muted line-through">
                  {formatINR(product.compareAtPrice)}
                </p>
              ) : null}
            </div>

            <Button
              size="iconSm"
              variant={soldOut ? "subtle" : "primary"}
              disabled={soldOut || pending}
              onClick={() => void addItem(product.id)}
              aria-label={soldOut ? `${product.name} is out of stock` : `Add ${product.name} to cart`}
              className="relative z-10 size-9"
            >
              {pending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Plus className="size-4" aria-hidden="true" />
              )}
            </Button>
          </div>

          {stock ? <p className={cn("mt-2 text-xs font-medium", stock.tone)}>{stock.text}</p> : null}
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-hairline bg-white">
      <div className="aspect-square animate-pulse bg-brand-50" />
      <div className="space-y-2.5 p-4">
        <div className="h-3 w-16 animate-pulse rounded bg-brand-50" />
        <div className="h-4 w-full animate-pulse rounded bg-brand-50" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-brand-50" />
        <div className="h-5 w-20 animate-pulse rounded bg-brand-50" />
      </div>
    </div>
  );
}
