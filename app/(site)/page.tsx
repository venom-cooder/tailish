import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import {
  Faq,
  Features,
  FinalCta,
  HowItWorks,
  NearbyTeaser,
  PassportPreview,
  PlansTeaser,
  ServiceStrip,
  ShopPreview,
  Testimonials,
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
  telephone: siteConfig.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Vijay Nagar",
    addressLocality: "Indore",
    addressRegion: "Madhya Pradesh",
    postalCode: "452010",
    addressCountry: "IN",
  },
  areaServed: { "@type": "City", name: "Indore" },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "5000",
    bestRating: "5",
  },
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
      <ShopPreview />
      <NearbyTeaser />
      <Testimonials />
      <PlansTeaser />
      <Faq />
      <FinalCta />
    </>
  );
}
