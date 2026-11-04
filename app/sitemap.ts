import type { MetadataRoute } from "next";
import { mockCategories, mockProducts } from "@/lib/mock/catalog";
import { mockGuides } from "@/lib/mock/content";
import { siteConfig } from "@/lib/config";

/**
 * Public routes only.
 *
 * The portal (/app/*), sign-in and shared passports (/p/*) are deliberately
 * excluded — they're personal and marked noindex in their own metadata.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;

  const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/vet-care", priority: 0.9, changeFrequency: "monthly" },
    { path: "/vet-care/book-visit", priority: 0.9, changeFrequency: "monthly" },
    { path: "/vet-care/home-visit", priority: 0.8, changeFrequency: "monthly" },
    { path: "/vet-care/video-consult", priority: 0.8, changeFrequency: "monthly" },
    { path: "/vet-care/vaccination", priority: 0.8, changeFrequency: "monthly" },
    { path: "/vet-care/diagnostics", priority: 0.8, changeFrequency: "monthly" },
    { path: "/how-it-works", priority: 0.7, changeFrequency: "monthly" },
    { path: "/health-passport", priority: 0.9, changeFrequency: "monthly" },
    { path: "/pricing", priority: 0.8, changeFrequency: "monthly" },
    { path: "/nearby", priority: 0.7, changeFrequency: "weekly" },
    { path: "/guides", priority: 0.8, changeFrequency: "weekly" },
    { path: "/shop", priority: 0.9, changeFrequency: "daily" },
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
    ...mockCategories.map((category) => ({
      url: `${base}/shop/${category.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...mockProducts.map((product) => ({
      url: `${base}/shop/product/${product.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...mockGuides.map((guide) => ({
      url: `${base}/guides/${guide.slug}`,
      lastModified: guide.updatedAt ?? guide.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
