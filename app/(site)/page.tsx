import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import {
  Faq,
  Features,
  FinalCta,
  HowItWorks,
  PassportPreview,
  ServiceStrip,
  WhatsAppSection,
} from "@/components/home/sections";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Tailish — Guided vet care for happier, healthier pets",
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

/** Structured data so search and AI answers can describe Tailish accurately. */
const organisationJsonLd = {
  "@context": "https://schema.org",
  "@type": "VeterinaryCare",
  name: "Tailish",
  description: siteConfig.description,
  url: siteConfig.url,
  email: siteConfig.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Vijay Nagar",
    addressLocality: "Indore",
    addressRegion: "Madhya Pradesh",
    postalCode: "452010",
    addressCountry: "IN",
  },
  areaServed: { "@type": "City", name: "Indore" },
  // No aggregateRating. It declared 4.8 from 5000 reviews, which search engines
  // are entitled to render as stars next to the result — a rating no customer
  // ever gave. It goes back when real reviews exist to aggregate.
  sameAs: Object.values(siteConfig.social),
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Structured data is author-controlled, not user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationJsonLd) }}
      />

      <Hero />
      <ServiceStrip />
      <Features />
      <HowItWorks />
      <PassportPreview />
      <WhatsAppSection />
      {/* ShopPreview, NearbyTeaser, Testimonials and PlansTeaser are gone:
          they advertised a shop with no checkout, clinics nobody partnered
          with, reviews nobody wrote, and plans with unconfirmed prices. Their
          code is kept — see parked/ — for when those things are real. */}
      <Faq />
      <FinalCta />
    </>
  );
}
