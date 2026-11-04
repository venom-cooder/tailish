import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { Container, Section } from "@/components/shared/section";
import { LoadingState } from "@/components/shared/states";
import { PageHero } from "@/components/shared/page-hero";
import { ProductGrid } from "@/components/shop/product-grid";
import { WhatsAppButton } from "@/components/whatsapp/whatsapp-button";
import { api, allBrands } from "@/lib/api";
import { mockCategories } from "@/lib/mock/catalog";

export function generateStaticParams() {
  return mockCategories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = mockCategories.find((c) => c.slug === slug);
  if (!category) return { title: "Category not found" };

  return {
    title: `${category.name} — vet-picked, delivered`,
    description: category.description,
    alternates: { canonical: `/shop/${category.slug}` },
  };
}

/** `params` is awaited inside Suspense — see the note in /guides/[slug]. */
export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  return (
    <Suspense
      fallback={
        <Section className="pt-12">
          <Container>
            <LoadingState label="Loading products" rows={4} />
          </Container>
        </Section>
      }
    >
      <CategoryContent params={params} />
    </Suspense>
  );
}

async function CategoryContent({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;

  const category = await api.commerce.getCategory(slug).catch(() => null);
  if (!category) notFound();

  const products = await api.commerce.listProducts({ category: slug });
  const brands = Array.from(new Set(products.map((product) => product.brand))).sort();

  return (
    <>
      <PageHero
        eyebrow="Shop"
        eyebrowIcon={ShoppingBag}
        crumbs={[{ label: "Shop", href: "/shop" }, { label: category.name }]}
        title={category.name}
        description={category.description}
      >
        <WhatsAppButton
          size="lg"
          variant="outline"
          text={`Hi Tailish! I'd like help choosing ${category.name.toLowerCase()} for my pet.`}
          label="Ask a vet what to pick"
        />
      </PageHero>

      <Section className="pt-12">
        <Container>
          <ProductGrid
            products={products}
            brands={brands.length > 1 ? brands : allBrands()}
            lockedCategory={category.name}
          />

          <nav aria-label="Other categories" className="mt-16 border-t border-hairline pt-10">
            <h2 className="font-display text-lg font-semibold text-ink">Other categories</h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {mockCategories
                .filter((item) => item.slug !== category.slug)
                .map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/shop/${item.slug}`}
                      className="inline-flex rounded-xl border border-hairline bg-white px-4 py-2 text-sm font-medium text-muted transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-700"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>
        </Container>
      </Section>
    </>
  );
}
