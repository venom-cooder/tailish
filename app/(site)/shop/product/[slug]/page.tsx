import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, FileWarning, RotateCcw, Star, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Container, Section } from "@/components/shared/section";
import { PageHero } from "@/components/shared/page-hero";
import { AddToCart } from "@/components/shop/add-to-cart";
import { ProductCard } from "@/components/shop/product-card";
import { Reveal } from "@/components/motion/reveal";
import { WhatsAppButton } from "@/components/whatsapp/whatsapp-button";
import { api } from "@/lib/api";
import { mockProducts } from "@/lib/mock/catalog";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/mock/store";
import { siteConfig } from "@/lib/config";
import { whatsappMessages } from "@/lib/whatsapp";
import { formatINR } from "@/lib/utils";

export function generateStaticParams() {
  return mockProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = mockProducts.find((p) => p.slug === slug);
  if (!product) return { title: "Product not found" };

  return {
    title: `${product.name} — ${product.brand}`,
    description: product.description.slice(0, 160),
    alternates: { canonical: `/shop/product/${product.slug}` },
    openGraph: { type: "website", title: product.name, description: product.description },
  };
}

const STOCK_COPY: Record<string, string> = {
  in_stock: "In stock — dispatched within 24 hours",
  low_stock: "Only a few left in stock",
  out_of_stock: "Out of stock",
  preorder: "Available to pre-order",
};

/** `params` is awaited inside Suspense — see the note in /guides/[slug]. */
export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense
      fallback={
        <Section>
          <Container>
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <Skeleton className="aspect-square rounded-3xl" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-2/3" />
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </Container>
        </Section>
      }
    >
      <ProductDetail params={params} />
    </Suspense>
  );
}

async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const product = await api.commerce.getProduct(slug).catch(() => null);
  if (!product) notFound();

  const related = (await api.commerce.listProducts({ category: product.categorySlug }))
    .filter((item) => item.id !== product.id)
    .slice(0, 4);

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    brand: { "@type": "Brand", name: product.brand },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      availability:
        product.stockStatus === "out_of_stock"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      url: `${siteConfig.url}/shop/product/${product.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <PageHero
        tone="white"
        crumbs={[
          { label: "Shop", href: "/shop" },
          { label: product.categoryName, href: `/shop/${product.categorySlug}` },
          { label: product.name },
        ]}
        title={<span className="sr-only">{product.name}</span>}
      />

      <Section className="pt-0">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-hairline bg-cream">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute left-5 top-5 flex flex-col items-start gap-2">
                {discount > 0 ? <Badge variant="accent">{discount}% off</Badge> : null}
                {product.sponsored ? <Badge variant="outline">Sponsored</Badge> : null}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-brand-600">
                {product.brand}
              </p>

              <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">{product.name}</h1>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                <span className="flex items-center gap-1.5">
                  <Star className="size-4 fill-gold-500 text-gold-500" aria-hidden="true" />
                  <span className="font-semibold tabular text-ink">{product.rating}</span>
                  <span className="text-muted">({product.reviewCount} reviews)</span>
                </span>
                <span className="text-muted">SKU {product.sku}</span>
                {product.weightLabel ? (
                  <span className="text-muted">{product.weightLabel}</span>
                ) : null}
              </div>

              <div className="mt-6 flex items-baseline gap-3">
                <span className="font-display text-3xl font-bold tabular text-ink">
                  {formatINR(product.price)}
                </span>
                {product.compareAtPrice ? (
                  <span className="tabular text-lg text-muted line-through">
                    {formatINR(product.compareAtPrice)}
                  </span>
                ) : null}
              </div>

              <p className="mt-1.5 text-sm text-muted">
                Inclusive of all taxes · Free delivery above {formatINR(FREE_DELIVERY_THRESHOLD)}
              </p>

              <p
                className={`mt-4 text-sm font-medium ${
                  product.stockStatus === "out_of_stock"
                    ? "text-muted"
                    : product.stockStatus === "low_stock"
                      ? "text-accent-600"
                      : "text-emerald-700"
                }`}
              >
                {STOCK_COPY[product.stockStatus]}
              </p>

              {product.prescriptionRequired ? (
                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-gold-400/35 bg-gold-400/5 p-4">
                  <FileWarning
                    className="mt-0.5 size-5 shrink-0 text-gold-600"
                    aria-hidden="true"
                  />
                  <p className="text-sm leading-relaxed text-muted">
                    <span className="font-semibold text-ink">Prescription required.</span> We verify
                    a valid prescription before dispatch. If you don&apos;t have one, a video
                    consult can sort it in about twenty minutes.
                  </p>
                </div>
              ) : null}

              <div className="mt-7">
                <AddToCart product={product} />
              </div>

              <div className="mt-4">
                <WhatsAppButton
                  variant="outline"
                  className="w-full sm:w-auto"
                  text={whatsappMessages.product(product.name)}
                  label="Continue on WhatsApp"
                />
              </div>

              <p className="mt-7 text-[0.9375rem] leading-relaxed text-muted">
                {product.description}
              </p>

              <ul className="mt-6 space-y-2.5">
                {product.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-3 text-sm text-ink/80">
                    <BadgeCheck
                      className="mt-0.5 size-5 shrink-0 text-emerald-600"
                      aria-hidden="true"
                    />
                    {highlight}
                  </li>
                ))}
              </ul>

              {product.allergenTags.length > 0 ? (
                <div className="mt-6">
                  <h2 className="text-sm font-semibold text-ink">Suitable for</h2>
                  <ul className="mt-2.5 flex flex-wrap gap-1.5">
                    {product.allergenTags.map((tag) => (
                      <li key={tag}>
                        <Badge variant="verified">{tag.replace(/-/g, " ")}</Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {product.ingredients ? (
                <div className="mt-6 rounded-2xl border border-hairline bg-brand-50/50 p-5">
                  <h2 className="text-sm font-semibold text-ink">Ingredients</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{product.ingredients}</p>
                </div>
              ) : null}

              <dl className="mt-6 grid gap-4 border-t border-hairline pt-6 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Truck className="mt-0.5 size-5 shrink-0 text-brand-600" aria-hidden="true" />
                  <div>
                    <dt className="text-sm font-semibold text-ink">Delivery</dt>
                    <dd className="mt-0.5 text-xs leading-relaxed text-muted">
                      Within 48 hours across Indore. 3–5 days elsewhere in India.
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RotateCcw className="mt-0.5 size-5 shrink-0 text-brand-600" aria-hidden="true" />
                  <div>
                    <dt className="text-sm font-semibold text-ink">Returns</dt>
                    <dd className="mt-0.5 text-xs leading-relaxed text-muted">
                      7 days if unopened. Opened food and medication can&apos;t be returned.
                    </dd>
                  </div>
                </div>
              </dl>
            </div>
          </div>
        </Container>
      </Section>

      {related.length > 0 ? (
        <Section tone="cream" className="py-14">
          <Container>
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-display text-2xl font-bold text-ink">More in {product.categoryName}</h2>
              <Link
                href={`/shop/${product.categorySlug}`}
                className="text-sm font-medium text-brand-700 underline-offset-4 hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item, index) => (
                <Reveal key={item.id} delayMs={index * 60}>
                  <ProductCard product={item} className="h-full" />
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
