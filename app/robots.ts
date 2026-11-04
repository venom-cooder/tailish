import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Personal surfaces: the account portal, sign-in, checkout flow and
        // shared passport links. None of these belong in an index.
        disallow: ["/app/", "/login", "/p/", "/cart", "/checkout"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
