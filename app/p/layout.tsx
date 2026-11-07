import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shared Health Passport",
  description: "A read-only Tailish Health Passport shared by a pet parent.",
  // Shared passports contain personal health data — never index them.
  robots: { index: false, follow: false, nocache: true },
};

export default function SharedPassportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
