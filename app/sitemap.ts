import type { MetadataRoute } from "next";
import { mockGuides } from "@/lib/mock/content";
import { siteConfig } from "@/lib/config";

/**
 * Every public route, and only routes that exist.
 *
 * This file previously advertised the whole /vet-care section, /pricing,
 * /nearby, /shop and a generated URL for every mock product and category —
 * all of which are now parked. A sitemap entry is a promise to a crawler that
 * the page is there; listing parked routes earns soft-404s and teaches search
 * engines the site is unreliable. Entries go back when the routes do.
 *
 * The portal (/app/*), sign-in and shared passports (/p/*) were already
 * excluded as personal, and remain so.
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;

  const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/how-it-works", priority: 0.7, changeFrequency: "monthly" },
    { path: "/health-passport", priority: 0.9, changeFrequency: "monthly" },
    { path: "/guides", priority: 0.8, changeFrequency: "weekly" },
    { path: "/about", priority: 0.5, changeFrequency: "yearly" },
    { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route.path}`,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...mockGuides.map((guide) => ({
      url: `${base}/guides/${guide.slug}`,
      lastModified: guide.updatedAt ?? guide.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
