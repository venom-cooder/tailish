import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shared Health Passport",
  description: "A read-only Tailish Health Passport shared by a pet parent.",
  // Shared passports contain personal health data — never index them.
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Same reasoning as the portal layout: every one of these pages is reached by
 * a private token, is noindex, and renders data fetched after mount, so a
 * static shell buys nothing — and opting out lets the site-wide chrome read
 * the current route without a Suspense boundary around it.
 */
export const instant = false;

export default function SharedPassportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
