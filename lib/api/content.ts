import { mockBreeds, mockGuides, mockPlans } from "@/lib/mock/content";
import type { Breed, Guide, Plan } from "@/lib/types";
import { call, notFound } from "./client";

export const contentApi = {
  /** GET /guides */
  listGuides: (filters?: { category?: string; tag?: string; q?: string; limit?: number }) =>
    call<Guide[]>({
      method: "GET",
      path: "/guides",
      query: {
        category: filters?.category,
        tag: filters?.tag,
        q: filters?.q,
        limit: filters?.limit,
      },
      mock: () => {
        const term = filters?.q?.trim().toLowerCase();
        const items = mockGuides
          .filter((guide) => {
            if (filters?.category && filters.category !== "all" && guide.category !== filters.category) {
              return false;
            }
            if (filters?.tag && !guide.tags.includes(filters.tag)) return false;
            if (term) {
              const haystack = `${guide.title} ${guide.excerpt} ${guide.tags.join(" ")}`.toLowerCase();
              if (!haystack.includes(term)) return false;
            }
            return true;
          })
          .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
        return filters?.limit ? items.slice(0, filters.limit) : items;
      },
    }),

  /** GET /guides/:slug */
  getGuide: (slug: string) =>
    call<Guide>({
      method: "GET",
      path: `/guides/${slug}`,
      mock: () => {
        const guide = mockGuides.find((g) => g.slug === slug);
        if (!guide) notFound("That guide doesn't exist.");
        return guide;
      },
    }),

  /** GET /breeds */
  listBreeds: (filters?: { species?: string; q?: string }) =>
    call<Breed[]>({
      method: "GET",
      path: "/breeds",
      query: { species: filters?.species, q: filters?.q },
      mock: () => {
        const term = filters?.q?.trim().toLowerCase();
        return mockBreeds.filter((breed) => {
          if (filters?.species && filters.species !== "all" && breed.species !== filters.species) {
            return false;
          }
          if (term && !breed.name.toLowerCase().includes(term)) return false;
          return true;
        });
      },
    }),

  /** GET /breeds/:id */
  getBreed: (id: string) =>
    call<Breed>({
      method: "GET",
      path: `/breeds/${id}`,
      mock: () => {
        const breed = mockBreeds.find((b) => b.id === id || b.name.toLowerCase() === id.toLowerCase());
        if (!breed) notFound("We don't have a profile for that breed yet.");
        return breed;
      },
    }),

  /** GET /plans */
  listPlans: () =>
    call<Plan[]>({
      method: "GET",
      path: "/plans",
      mock: () => mockPlans,
    }),
};

/** Distinct guide categories, for the filter row on /guides. */
export function guideCategories() {
  return Array.from(new Set(mockGuides.map((g) => g.category))).sort();
}
