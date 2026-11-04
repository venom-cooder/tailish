"use client";

import * as React from "react";
import Link from "next/link";
import { Filter, PackageSearch, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input, Select } from "@/components/ui/input";
import { Dialog, DialogTitle, SheetContent } from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/states";
import { ProductCard } from "@/components/shop/product-card";
import { Reveal } from "@/components/motion/reveal";
import type { LifeStage, Product, Species } from "@/lib/types";
import { cn, formatINR } from "@/lib/utils";

type SortKey = "popular" | "price_asc" | "price_desc" | "rating";

const LIFE_STAGES: { value: LifeStage; label: string }[] = [
  { value: "puppy_kitten", label: "Puppy / kitten" },
  { value: "adult", label: "Adult" },
  { value: "senior", label: "Senior" },
];

const SPECIES: { value: Species; label: string }[] = [
  { value: "dog", label: "Dogs" },
  { value: "cat", label: "Cats" },
];

/**
 * Client-side filtering over a server-rendered catalogue.
 *
 * The full product list is in the initial HTML, so the shop is crawlable and
 * filter changes are instant. When the catalogue outgrows a single payload,
 * swap the `products` prop for `api.commerce.listProducts(query)` — the filter
 * shape here already matches that endpoint's `ProductQuery`.
 */
export function ProductGrid({
  products,
  brands,
  heading,
  lockedCategory,
}: {
  products: Product[];
  brands: string[];
  heading?: string;
  /** Set on a category page, where the category filter is fixed. */
  lockedCategory?: string;
}) {
  const [query, setQuery] = React.useState("");
  const [species, setSpecies] = React.useState<Species | "all">("all");
  const [lifeStage, setLifeStage] = React.useState<LifeStage | "all">("all");
  const [selectedBrands, setSelectedBrands] = React.useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = React.useState(false);
  const [sort, setSort] = React.useState<SortKey>("popular");
  const [filtersOpen, setFiltersOpen] = React.useState(false);

  const priceCeiling = React.useMemo(
    () => Math.max(1000, ...products.map((product) => product.price)),
    [products],
  );

  // `null` means "untouched", so the slider tracks the catalogue's ceiling
  // until the shopper actually moves it.
  const [chosenMaxPrice, setMaxPrice] = React.useState<number | null>(null);
  const maxPrice = chosenMaxPrice ?? priceCeiling;

  const filtered = React.useMemo(() => {
    const term = query.trim().toLowerCase();

    const matched = products.filter((product) => {
      if (species !== "all" && !product.forSpecies.includes(species)) return false;
      if (
        lifeStage !== "all" &&
        !product.lifeStage.includes(lifeStage) &&
        !product.lifeStage.includes("all")
      ) {
        return false;
      }
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;
      if (inStockOnly && product.stockStatus === "out_of_stock") return false;
      if (product.price > maxPrice) return false;
      if (term) {
        const haystack =
          `${product.name} ${product.brand} ${product.categoryName} ${product.tags.join(" ")}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });

    switch (sort) {
      case "price_asc":
        return matched.sort((a, b) => a.price - b.price);
      case "price_desc":
        return matched.sort((a, b) => b.price - a.price);
      case "rating":
        return matched.sort((a, b) => b.rating - a.rating);
      default:
        return matched.sort(
          (a, b) => Number(b.sponsored) - Number(a.sponsored) || b.reviewCount - a.reviewCount,
        );
    }
  }, [products, query, species, lifeStage, selectedBrands, inStockOnly, maxPrice, sort]);

  const activeFilterCount =
    (species !== "all" ? 1 : 0) +
    (lifeStage !== "all" ? 1 : 0) +
    selectedBrands.length +
    (inStockOnly ? 1 : 0) +
    (maxPrice < priceCeiling ? 1 : 0);

  function clearFilters() {
    setSpecies("all");
    setLifeStage("all");
    setSelectedBrands([]);
    setInStockOnly(false);
    setMaxPrice(null);
    setQuery("");
  }

  const filterPanel = (
    <div className="space-y-7">
      {!lockedCategory ? null : (
        <p className="rounded-xl bg-brand-50 px-4 py-3 text-xs text-muted">
          Showing <span className="font-semibold text-ink">{lockedCategory}</span>.{" "}
          <Link href="/shop" className="font-medium text-brand-700 underline-offset-4 hover:underline">
            Browse everything
          </Link>
        </p>
      )}

      <fieldset>
        <legend className="text-sm font-semibold text-ink">For</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {[{ value: "all" as const, label: "All pets" }, ...SPECIES].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSpecies(option.value)}
              aria-pressed={species === option.value}
              className={cn(
                "rounded-xl border px-4 py-2 text-sm font-medium transition-all",
                species === option.value
                  ? "border-brand-700 bg-brand-700 text-white"
                  : "border-hairline text-muted hover:border-brand-300 hover:text-brand-700",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold text-ink">Life stage</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {[{ value: "all" as const, label: "Any age" }, ...LIFE_STAGES].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setLifeStage(option.value)}
              aria-pressed={lifeStage === option.value}
              className={cn(
                "rounded-xl border px-4 py-2 text-sm font-medium transition-all",
                lifeStage === option.value
                  ? "border-brand-700 bg-brand-700 text-white"
                  : "border-hairline text-muted hover:border-brand-300 hover:text-brand-700",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold text-ink">Brand</legend>
        <div className="mt-3 space-y-2.5">
          {brands.map((brand) => {
            const id = `brand-${brand.replace(/\s+/g, "-").toLowerCase()}`;
            return (
              <div key={brand} className="flex items-center gap-3">
                <Checkbox
                  id={id}
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={(checked) =>
                    setSelectedBrands((current) =>
                      checked ? [...current, brand] : current.filter((b) => b !== brand),
                    )
                  }
                />
                <label htmlFor={id} className="cursor-pointer text-sm text-ink/80">
                  {brand}
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold text-ink">
          Maximum price:{" "}
          <span className="tabular font-bold text-brand-700">{formatINR(maxPrice)}</span>
        </legend>
        <input
          type="range"
          min={200}
          max={priceCeiling}
          step={100}
          value={maxPrice}
          onChange={(event) => setMaxPrice(Number(event.target.value))}
          aria-label="Maximum price"
          className="mt-4 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-brand-100 accent-brand-600"
        />
        <div className="mt-1.5 flex justify-between text-xs tabular text-muted">
          <span>{formatINR(200)}</span>
          <span>{formatINR(priceCeiling)}</span>
        </div>
      </fieldset>

      <div className="flex items-center gap-3 border-t border-hairline pt-5">
        <Checkbox
          id="in-stock"
          checked={inStockOnly}
          onCheckedChange={(checked) => setInStockOnly(checked === true)}
        />
        <label htmlFor="in-stock" className="cursor-pointer text-sm text-ink/80">
          In stock only
        </label>
      </div>

      {activeFilterCount > 0 ? (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full">
          <X className="size-4" aria-hidden="true" />
          Clear {activeFilterCount} filter{activeFilterCount === 1 ? "" : "s"}
        </Button>
      ) : null}
    </div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-28">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
            <Filter className="size-5 text-brand-600" aria-hidden="true" />
            Filters
          </h2>
          <div className="mt-6">{filterPanel}</div>
        </div>
      </aside>

      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search food, supplements, toys…"
              aria-label="Search products"
              className="pl-11"
            />
          </div>

          <Select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
            aria-label="Sort products"
            className="sm:w-52"
          >
            <option value="popular">Most popular</option>
            <option value="rating">Highest rated</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
          </Select>

          <Button variant="outline" onClick={() => setFiltersOpen(true)} className="lg:hidden">
            <Filter className="size-4" aria-hidden="true" />
            Filters
            {activeFilterCount > 0 ? (
              <span className="ml-1 grid size-5 place-items-center rounded-full bg-accent-500 text-[0.65rem] font-bold text-white">
                {activeFilterCount}
              </span>
            ) : null}
          </Button>
        </div>

        <div className="mt-5 flex items-baseline justify-between gap-4">
          {heading ? <h2 className="font-display text-lg font-semibold text-ink">{heading}</h2> : <span />}
          <p className="text-sm text-muted" aria-live="polite">
            {filtered.length} product{filtered.length === 1 ? "" : "s"}
          </p>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="Nothing matches those filters"
            description="Try widening the price range or clearing a filter or two."
            className="mt-8"
            action={
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((product, index) => (
              <Reveal key={product.id} delayMs={Math.min(index, 6) * 50}>
                <ProductCard product={product} className="h-full" />
              </Reveal>
            ))}
          </div>
        )}
      </div>

      {/* Mobile filter sheet */}
      <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="left" aria-describedby={undefined} className="lg:hidden">
          <header className="flex items-center justify-between border-b border-hairline px-5 py-4">
            <DialogTitle className="font-display text-lg font-semibold text-ink">Filters</DialogTitle>
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              aria-label="Close filters"
              className="grid size-9 place-items-center rounded-lg text-muted transition-colors hover:bg-brand-50 hover:text-ink"
            >
              <X className="size-5" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-5 py-6">{filterPanel}</div>

          <footer className="border-t border-hairline px-5 py-4">
            <Button size="lg" className="w-full" onClick={() => setFiltersOpen(false)}>
              Show {filtered.length} product{filtered.length === 1 ? "" : "s"}
            </Button>
          </footer>
        </SheetContent>
      </Dialog>
    </div>
  );
}
