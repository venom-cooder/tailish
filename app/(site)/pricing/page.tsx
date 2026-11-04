import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, IndianRupee, Minus, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container, Section, SectionHeading } from "@/components/shared/section";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { Faq, FinalCta } from "@/components/home/sections";
import { WhatsAppButton } from "@/components/whatsapp/whatsapp-button";
import { mockPlans } from "@/lib/mock/content";
import { mockServices } from "@/lib/mock/services";
import { whatsappMessages } from "@/lib/whatsapp";
import { cn, formatINR } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing & CarePass membership — transparent pet care costs",
  description:
    "Pay per visit with no commitment, or take a CarePass membership for included consults, member pricing on home visits and an annual wellness panel. Every price listed upfront.",
  alternates: { canonical: "/pricing" },
};

/** Every feature label across plans, for the comparison table. */
const allFeatures = Array.from(
  new Set(mockPlans.flatMap((plan) => plan.features.map((feature) => feature.label))),
);

const faqs = [
  {
    question: "Do I need a membership to use Tailish?",
    answer:
      "No. The Health Passport, reminders and Ask Tailish are free for everyone, and you can book any visit at the per-visit price without a membership. CarePass makes sense if you expect more than two or three consultations a year, or if you have more than one pet.",
  },
  {
    question: "What exactly does 'member pricing' mean on home visits?",
    answer:
      "Members pay ₹699 for a home visit instead of ₹899, on top of any free visits included in their plan. The discount applies to the consultation fee — vaccines, tests and medicines are charged at the same rate for everyone, and always quoted before they happen.",
  },
  {
    question: "Can I cancel a membership?",
    answer:
      "Any time, from your profile. You keep access until the end of the period you've paid for, and your pet's records stay exactly where they are. We don't gate the Health Passport behind a subscription.",
  },
  {
    question: "Are there hidden charges on a visit?",
    answer:
      "No. The consultation fee is what you see here. Anything additional — a vaccine, a test, a medication — is quoted to you before it's administered, and you can say no. If a visit turns out to need less than expected, you're charged less.",
  },
  {
    question: "What about emergencies?",
    answer:
      "Emergencies go to a 24-hour hospital, and those are independent facilities with their own pricing — we don't take a cut and we don't mark it up. CarePass+ includes priority routing and a care manager who coordinates with the hospital on your behalf.",
  },
  {
    question: "Is delivery on shop orders free?",
    answer:
      "Free above ₹1,499, ₹49 below that. Members get a standing discount on everything in the shop — 5% on Essential, 12% on CarePass and 18% on CarePass+ — which for most households covers a good part of the membership on food alone.",
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        eyebrowIcon={IndianRupee}
        crumbs={[{ label: "Pricing" }]}
        title="Honest prices. Nothing added at the door."
        description="Pay per visit, or join CarePass and have consultations included. Either way, you see the number before anything happens — and we'd rather tell you a visit isn't needed than sell you one."
      />

      <Section className="pt-12 sm:pt-14">
        <Container>
          <div className="grid gap-6 lg:grid-cols-3">
            {mockPlans.map((plan, index) => (
              <Reveal key={plan.id} delayMs={index * 90}>
                <article
                  className={cn(
                    "relative flex h-full flex-col rounded-3xl border bg-white p-8 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift",
                    plan.popular ? "border-brand-600 ring-2 ring-brand-600/15" : "border-hairline",
                  )}
                >
                  {plan.popular ? (
                    <Badge variant="accent" className="absolute -top-3 left-8 shadow-soft">
                      Most popular
                    </Badge>
                  ) : null}

                  <h2 className="font-display text-2xl font-bold text-ink">{plan.name}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{plan.tagline}</p>

                  <p className="mt-7">
                    <span className="font-display text-4xl font-bold tabular text-ink">
                      {formatINR(plan.pricePerYear)}
                    </span>
                    <span className="text-sm text-muted"> / year</span>
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    or {formatINR(plan.pricePerMonth)} a month
                  </p>

                  {plan.savingsNote ? (
                    <p className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                      {plan.savingsNote}
                    </p>
                  ) : null}

                  <ul className="mt-7 flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature.label}
                        className={cn(
                          "flex items-start gap-3 text-sm",
                          feature.included ? "text-ink/80" : "text-muted/55",
                        )}
                      >
                        {feature.included ? (
                          <BadgeCheck className="mt-0.5 size-5 shrink-0 text-emerald-600" aria-hidden="true" />
                        ) : (
                          <Minus className="mt-0.5 size-5 shrink-0 text-muted/35" aria-hidden="true" />
                        )}
                        {feature.label}
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    size="lg"
                    variant={plan.popular ? "primary" : "outline"}
                    className="mt-8 w-full"
                  >
                    <Link href="/vet-care/book-visit">{plan.ctaLabel}</Link>
                  </Button>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-8 flex flex-col items-center gap-3 text-center" delayMs={200}>
            <p className="text-sm text-muted">
              Not sure which fits? Tell us how many pets you have and we&apos;ll do the maths with you.
            </p>
            <WhatsAppButton
              variant="outline"
              text={whatsappMessages.pricing}
              label="Ask about CarePass"
            />
          </Reveal>
        </Container>
      </Section>

      <Section tone="tint">
        <Container>
          <SectionHeading
            eyebrow="Compare"
            align="center"
            title="Side by side."
          />

          <Reveal className="mt-10 overflow-x-auto rounded-3xl border border-hairline bg-white">
            <table className="w-full min-w-[42rem] border-collapse text-left">
              <caption className="sr-only">Comparison of Tailish membership plans</caption>
              <thead>
                <tr className="border-b border-hairline">
                  <th scope="col" className="px-6 py-5 text-sm font-semibold text-ink">
                    Feature
                  </th>
                  {mockPlans.map((plan) => (
                    <th
                      key={plan.id}
                      scope="col"
                      className="px-6 py-5 text-center text-sm font-semibold text-ink"
                    >
                      {plan.name}
                      <span className="mt-0.5 block text-xs font-normal tabular text-muted">
                        {formatINR(plan.pricePerYear)}/yr
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {allFeatures.map((label) => (
                  <tr key={label} className="transition-colors hover:bg-brand-50/40">
                    <th scope="row" className="px-6 py-4 text-sm font-normal text-ink/80">
                      {label}
                    </th>
                    {mockPlans.map((plan) => {
                      const feature = plan.features.find((f) => f.label === label);
                      return (
                        <td key={plan.id} className="px-6 py-4 text-center">
                          {feature?.included ? (
                            <BadgeCheck
                              className="mx-auto size-5 text-emerald-600"
                              aria-label="Included"
                            />
                          ) : (
                            <Minus className="mx-auto size-5 text-muted/35" aria-label="Not included" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            eyebrow="Pay per visit"
            eyebrowIcon={ShieldCheck}
            align="center"
            title="No membership? These are the prices."
            description="The same vets, the same records, the same written summary. You just pay as you go."
          />

          <Reveal className="mx-auto mt-12 max-w-3xl divide-y divide-hairline overflow-hidden rounded-3xl border border-hairline bg-white">
            {mockServices
              .filter((service) => service.priceFrom > 0)
              .map((service) => (
                <div
                  key={service.id}
                  className="flex flex-col gap-2 p-6 transition-colors hover:bg-brand-50/40 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-ink">{service.name}</p>
                    <p className="mt-0.5 text-sm text-muted">{service.shortDescription}</p>
                  </div>
                  <div className="shrink-0 sm:text-right">
                    <p className="tabular text-xl font-bold text-ink">
                      {formatINR(service.priceFrom)}
                    </p>
                    <p className="text-xs text-muted">{service.durationMin} minutes</p>
                  </div>
                </div>
              ))}
          </Reveal>
        </Container>
      </Section>

      <Faq items={faqs} />
      <FinalCta />
    </>
  );
}
