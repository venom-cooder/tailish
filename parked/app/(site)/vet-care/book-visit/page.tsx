import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, CalendarCheck, Phone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/shared/section";
import { PageHero } from "@/components/shared/page-hero";
import { BookingFlow } from "@/components/vet-care/booking-flow";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Book a vet visit — home visits, video consults and vaccination",
  description:
    "Tell us the concern and the Tailish care desk routes you to the right care: a home visit, a video consult, or straight to an emergency hospital if that's what's needed.",
  alternates: { canonical: "/vet-care/book-visit" },
};

export default function BookVisitPage() {
  return (
    <>
      <PageHero
        eyebrow="Book a vet visit"
        eyebrowIcon={CalendarCheck}
        crumbs={[{ label: "Vet Care", href: "/vet-care" }, { label: "Book a Vet Visit" }]}
        title="Tell us what's wrong. We'll handle the rest."
        description="Five short steps. A registered veterinarian reviews what you've described before anything is booked, so you end up with the right kind of care rather than the first one you clicked."
      />

      <Section className="pt-10 sm:pt-12">
        <Container size="narrow">
          {/* Emergency escape hatch, above the form rather than buried in it. */}
          <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50/70 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-red-600" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-red-900">Is this an emergency?</p>
                <p className="mt-0.5 text-sm leading-relaxed text-red-800/80">
                  Difficulty breathing, collapse, seizures, a swollen hard belly, suspected
                  poisoning, or a cat straining to urinate — don&apos;t fill in a form. Go now.
                </p>
              </div>
            </div>
            <Button asChild variant="danger" className="shrink-0">
              <Link href="/nearby?type=emergency">
                <Phone className="size-4" aria-hidden="true" />
                Emergency vets
              </Link>
            </Button>
          </div>

          <BookingFlow />

          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-hairline bg-brand-50/50 p-5">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand-600" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-muted">
              Every vet on Tailish is registered with a state veterinary council and verified before
              their first appointment. Support hours are {siteConfig.supportHours}. Prefer to talk to
              a person? Call{" "}
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="font-medium text-brand-700 underline-offset-4 hover:underline"
              >
                {siteConfig.phone}
              </a>
              .
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
