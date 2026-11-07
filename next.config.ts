import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // AxisIQ Sites serves the repository's files as-is — it runs no build step —
  // so the site ships as a static export and every page must be prerenderable.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  // Pin the workspace root: the parent directory has an unrelated
  // package-lock.json that Turbopack would otherwise try to infer from.
  turbopack: {
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
