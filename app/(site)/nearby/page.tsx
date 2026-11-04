import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { MapPin, Phone, ShieldPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/shared/section";
import { PageHero } from "@/components/shared/page-hero";
import { LoadingState } from "@/components/shared/states";
import { NearbyFinder } from "@/components/nearby/nearby-finder";
import { FinalCta } from "@/components/home/sections";
import { WhatsAppButton } from "@/components/whatsapp/whatsapp-button";
import { api } from "@/lib/api";
import { siteConfig } from "@/lib/config";
import { whatsappMessages } from "@/lib/whatsapp";
import type { NearbyType } from "@/lib/types";

export const metadata: Metadata = {
  title: "Vets, emergency hospitals and pet-friendly places near you",
  description:
    "A verified directory of veterinary clinics, 24-hour emergency hospitals, pharmacies, groomers, pet stores and pet-friendly cafés in Indore — with live phone numbers.",
  alternates: { canonical: "/nearby" },
};

const VALID_TYPES: readonly string[] = [
  "vet",
  "emergency",
  "pharmacy",
  "groomer",
  "store",
  "cafe",
  "boarding",
];

/**
 * Reading searchParams makes this subtree request-time, so it sits behind a
 * Suspense boundary and the page still ships a static shell.
 */
async function Finder({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const places = await api.services.nearby();
  const initialType =
    type && VALID_TYPES.includes(type) ? (type as NearbyType) : ("all" as const);

  return <NearbyFinder places={places} initialType={initialType} />;
}

export default function NearbyPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  return (
    <>
      <PageHero
        eyebrow="Nearby"
        eyebrowIcon={MapPin}
        crumbs={[{ label: "Nearby" }]}
        title={`Everything your pet needs in ${siteConfig.city}.`}
        description="Clinics, 24-hour emergency hospitals, pharmacies, groomers, stores, boarding and pet-friendly cafés — verified, with the phone numbers that actually work."
      >
        <Button asChild size="lg" variant="danger">
          <Link href="/nearby?type=emergency">
            <ShieldPlus className="size-5" aria-hidden="true" />
            Emergency vets
          </Link>
        </Button>
        <WhatsAppButton
          size="lg"
          variant="outline"
          text={whatsappMessages.nearby}
          label="Ask on WhatsApp"
        />
      </PageHero>

      <Section className="pt-10 sm:pt-12">
        <Container>
          <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50/70 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 size-5 shrink-0 text-red-600" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-red-900">
                <span className="font-semibold">In an emergency, call before you drive.</span> A
                hospital that knows you&apos;re coming can have the right things ready — and can
                tell you if they&apos;re at capacity.
              </p>
            </div>
            <Button asChild variant="danger" className="shrink-0">
              <a href="tel:+917314001122">Indore Veterinary Hospital</a>
            </Button>
          </div>

          <Suspense fallback={<LoadingState label="Finding places near you" rows={4} />}>
            <Finder searchParams={searchParams} />
          </Suspense>
        </Container>
      </Section>

      <FinalCta />
    </>
  );
}
