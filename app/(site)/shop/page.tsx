import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/shared/section";
import { PageHero } from "@/components/shared/page-hero";
import { ProductGrid } from "@/components/shop/product-grid";
import { Reveal } from "@/components/motion/reveal";
import { WhatsAppButton } from "@/components/whatsapp/whatsapp-button";
import { api, allBrands } from "@/lib/api";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/mock/store";
import { whatsappMessages } from "@/lib/whatsapp";
import { formatINR } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pet shop — vet-picked food, supplements and essentials",
  description:
    "Food, supplements, parasite control, grooming and accessories for dogs and cats — stocked around what Tailish vets actually recommend. Free delivery above ₹1,499.",
  alternates: { canonical: "/shop" },
};

const promises = [
  {
    icon: ShieldCheck,
    title: "Vet-picked range",
    body: "Stocked around what our vets recommend, including chicken-free and prescription diets.",
  },
  {
    icon: Truck,
    title: `Free delivery above ${formatINR(FREE_DELIVERY_THRESHOLD)}`,
    body: "Most Indore orders arrive within 48 hours. ₹49 below the threshold.",
  },
  {
    icon: ShoppingBag,
    title: "Honest labelling",
    body: "Paid placements are marked 'Sponsored' everywhere they appear. Advice never changes for them.",
  },
];

export default async function ShopPage() {
  const [categories, products] = await Promise.all([
    api.commerce.listCategories(),
    api.commerce.listProducts(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Shop"
        eyebrowIcon={ShoppingBag}
        crumbs={[{ label: "Shop" }]}
        title="Everything your pet needs, chosen by people who treat them."
        description="Our vets see what works and what causes problems. The shop is stocked accordingly — not by whoever paid the most for shelf space."
      >
        <WhatsAppButton size="lg" text={whatsappMessages.shop} label="Order on WhatsApp" />
      </PageHero>

      <div className="border-b border-hairline bg-brand-50/50">
        <Container>
          <ul className="grid divide-y divide-hairline sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {promises.map((promise) => (
              <li key={promise.title} className="flex items-start gap-3.5 px-2 py-5 sm:px-6">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-brand-600 shadow-soft">
                  <promise.icon className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink">{promise.title}</span>
                  <span className="block text-xs leading-relaxed text-muted">{promise.body}</span>
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </div>

      <Section className="pb-0">
        <Container>
          <SectionHeading eyebrow="Categories" title="Browse by what you need." />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category, index) => (
              <Reveal key={category.id} delayMs={index * 50}>
                <Link
                  href={`/shop/${category.slug}`}
                  className="group block overflow-hidden rounded-3xl border border-hairline bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-lift"
                >
                  <span className="relative block aspect-[3/2] overflow-hidden">
                    <Image
                      src={category.imageUrl}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </span>
                  <span className="block p-5">
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-ink">{category.name}</span>
                      <ArrowRight
                        className="size-4 text-brand-400 transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-muted">
                      {category.description}
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading eyebrow="All products" title="The full range." className="mb-10" />
          <ProductGrid products={products} brands={allBrands()} />
        </Container>
      </Section>
    </>
  );
}
