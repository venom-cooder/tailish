import Link from "next/link";
import {
  BadgeCheck,
  Clock,
  FlaskConical,
  Home,
  IndianRupee,
  ShieldCheck,
  Stethoscope,
  Syringe,
  Video,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container, Section, SectionHeading } from "@/components/shared/section";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { Faq, FinalCta } from "@/components/home/sections";
import { WhatsAppButton } from "@/components/whatsapp/whatsapp-button";
import type { Service } from "@/lib/types";
import { formatINR } from "@/lib/utils";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Video,
  Syringe,
  FlaskConical,
  Stethoscope,
};

export interface ServiceDetailProps {
  service: Service;
  /** Prefilled WhatsApp message for the "Continue on WhatsApp" action. */
  whatsappText: string;
  /** Three-to-five step walkthrough of how this service runs. */
  steps: { title: string; body: string }[];
  /** What's included at each price point. */
  pricing: { label: string; price: number; note: string; highlight?: boolean }[];
  faqs: { question: string; answer: string }[];
  /** Short, honest note on what this service does not cover. */
  limitations?: string[];
}

export function ServiceDetail({
  service,
  whatsappText,
  steps,
  pricing,
  faqs,
  limitations,
}: ServiceDetailProps) {
  const Icon = ICONS[service.icon] ?? Stethoscope;

  return (
    <>
      <PageHero
        eyebrow={service.name}
        eyebrowIcon={Icon}
        crumbs={[{ label: "Vet Care", href: "/vet-care" }, { label: service.name }]}
        title={service.shortDescription}
        description={service.description}
        aside={
          <div className="rounded-3xl border border-hairline bg-white p-7 shadow-lift">
            <span className="grid size-12 place-items-center rounded-2xl bg-brand-700 text-white">
              <Icon className="size-6" aria-hidden="true" />
            </span>

            <p className="mt-5 text-xs uppercase tracking-wide text-muted">Starting at</p>
            <p className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold tabular text-ink">
                {formatINR(service.priceFrom)}
              </span>
              <span className="text-sm text-muted">/ visit</span>
            </p>

            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
              <Clock className="size-4" aria-hidden="true" />
              About {service.durationMin} minutes
            </p>

            <div className="mt-6 space-y-2.5">
              <Button asChild size="lg" className="w-full">
                <Link href="/vet-care/book-visit">Book now</Link>
              </Button>
              <WhatsAppButton
                size="lg"
                variant="outline"
                className="w-full"
                text={whatsappText}
                label="Continue on WhatsApp"
              />
            </div>

            <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden="true" />
              Pay after the vet confirms the slot. Free cancellation up to 2 hours before.
            </p>
          </div>
        }
      >
        <Button asChild size="lg">
          <Link href="/vet-care/book-visit">Book a Vet Visit</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/pricing">See membership pricing</Link>
        </Button>
      </PageHero>

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="How it runs"
                title={`What happens in a ${service.name.toLowerCase()}`}
              />

              <ol className="mt-10 space-y-6">
                {steps.map((step, index) => (
                  <Reveal as="li" key={step.title} delayMs={index * 80} className="flex gap-5">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-700 font-display text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <div className="pt-1">
                      <h3 className="text-base font-semibold text-ink">{step.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.body}</p>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>

            <Reveal delayMs={120}>
              <div className="rounded-3xl border border-hairline bg-brand-50/50 p-7">
                <h3 className="font-display text-lg font-semibold text-ink">What&apos;s included</h3>
                <ul className="mt-5 space-y-3">
                  {service.inclusions.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-ink/80">
                      <BadgeCheck className="mt-0.5 size-5 shrink-0 text-emerald-600" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>

                {limitations?.length ? (
                  <>
                    <h3 className="mt-8 font-display text-lg font-semibold text-ink">
                      What it doesn&apos;t cover
                    </h3>
                    <ul className="mt-4 space-y-2.5">
                      {limitations.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-muted">
                          <span
                            aria-hidden="true"
                            className="mt-2 size-1.5 shrink-0 rounded-full bg-muted/50"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}

                <ul className="mt-7 flex flex-wrap gap-1.5 border-t border-hairline pt-5">
                  {service.forSpecies.map((species) => (
                    <li key={species}>
                      <Badge className="capitalize">{species}s</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section tone="tint">
        <Container>
          <SectionHeading
            eyebrow="Pricing"
            eyebrowIcon={IndianRupee}
            align="center"
            title="Clear prices, quoted before anything happens."
            description="Anything beyond the consultation is priced and agreed with you first. No surprise line items."
          />

          <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
            {pricing.map((tier, index) => (
              <Reveal key={tier.label} delayMs={index * 80}>
                <div
                  className={`flex h-full flex-col rounded-3xl border bg-white p-6 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift ${
                    tier.highlight ? "border-brand-600 ring-2 ring-brand-600/15" : "border-hairline"
                  }`}
                >
                  <p className="text-sm font-semibold text-ink">{tier.label}</p>
                  <p className="mt-3 font-display text-2xl font-bold tabular text-ink">
                    {formatINR(tier.price)}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-muted">{tier.note}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-8 text-center" delayMs={160}>
            <p className="text-sm text-muted">
              CarePass members pay less on every visit.{" "}
              <Link href="/pricing" className="font-medium text-brand-700 underline-offset-4 hover:underline">
                Compare plans
              </Link>
              .
            </p>
          </Reveal>
        </Container>
      </Section>

      <Faq items={faqs} />
      <FinalCta />
    </>
  );
}
