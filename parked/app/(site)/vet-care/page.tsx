import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Clock,
  FlaskConical,
  Home,
  ShieldCheck,
  Star,
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
import { mockProviders, mockServices } from "@/lib/mock/services";
import { whatsappMessages } from "@/lib/whatsapp";
import { formatINR } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Vet care services — home visits, consults, vaccination & diagnostics",
  description:
    "Home visits from ₹899, video consults from ₹299, vaccination and home diagnostics. Registered veterinarians across Indore, with every record saved to your pet's Health Passport.",
  alternates: { canonical: "/vet-care" },
};

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  CalendarCheck,
  Home,
  Video,
  Syringe,
  FlaskConical,
};

const vetCareFaqs = [
  {
    question: "How quickly can a vet get to me?",
    answer:
      "Most home visits in Indore are booked within 24 hours, and same-day slots are usually available if you book before noon. Video consults typically connect within fifteen minutes during support hours. If the situation is urgent, we don't put you in a queue — we route you straight to the nearest 24-hour hospital.",
  },
  {
    question: "What does the vet bring to a home visit?",
    answer:
      "A full travelling kit: examination equipment, a thermometer, otoscope and stethoscope, sample collection supplies, common medications, and cold-chain storage for vaccines. Most of what happens in a consulting room happens in yours. Anything requiring imaging or surgery is referred, with a specific recommendation rather than a vague one.",
  },
  {
    question: "Can you handle an aggressive or very anxious pet?",
    answer:
      "Often better than a clinic can, because the animal is on home ground. Tell us beforehand and we'll send a vet experienced in low-stress handling and allow extra time. For cats especially, home visits avoid the carrier and the car — the two things that make most of the anxiety.",
  },
  {
    question: "Do I get something in writing afterwards?",
    answer:
      "Always. Every visit produces a written summary with observations, the care plan, medications and the follow-up date. It lands in your pet's Health Passport, and you can share it with any other vet in one tap.",
  },
  {
    question: "What if my pet needs treatment you can't give at home?",
    answer:
      "You'll be told plainly, along with where to go and why. We maintain relationships with hospitals across Indore for imaging, surgery and intensive care, and your vet will share the case history ahead of your arrival so you aren't starting from scratch.",
  },
];

export default function VetCarePage() {
  return (
    <>
      <PageHero
        eyebrow="Vet care"
        eyebrowIcon={Stethoscope}
        crumbs={[{ label: "Vet Care" }]}
        title="Veterinary care that comes to you."
        description="Registered veterinarians for home visits, video consults, vaccination and diagnostics — with every observation, dose and report recorded in your pet's Health Passport."
      >
        <Button asChild size="lg">
          <Link href="/vet-care/book-visit">Book a Vet Visit</Link>
        </Button>
        <WhatsAppButton
          size="lg"
          variant="outline"
          text={whatsappMessages.bookVisit}
          label="Continue on WhatsApp"
        />
      </PageHero>

      <Section>
        <Container>
          <SectionHeading
            eyebrow="Services"
            title="Pick the kind of care the situation needs."
            description="Not sure which? Start with Book a Vet Visit — answer a few questions and the care desk routes you to the right one."
          />

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {mockServices.map((service, index) => {
              const Icon = ICONS[service.icon] ?? Stethoscope;
              return (
                <Reveal key={service.id} delayMs={index * 70}>
                  <article className="group flex h-full flex-col rounded-3xl border border-hairline bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-lift">
                    <div className="flex items-start justify-between gap-3">
                      <span className="grid size-12 place-items-center rounded-2xl bg-brand-700 text-white transition-colors duration-300 group-hover:bg-accent-500">
                        <Icon className="size-6" aria-hidden="true" />
                      </span>
                      {service.popular ? <Badge variant="accent">Popular</Badge> : null}
                    </div>

                    <h3 className="mt-5 font-display text-lg font-semibold text-ink">{service.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{service.shortDescription}</p>

                    <ul className="mt-5 space-y-2">
                      {service.inclusions.slice(0, 3).map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-ink/75">
                          <BadgeCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-6">
                      <div className="flex items-end justify-between gap-3 border-t border-hairline pt-5">
                        <div>
                          <p className="text-xs text-muted">
                            {service.priceFrom > 0 ? "From" : "Free to start"}
                          </p>
                          {service.priceFrom > 0 ? (
                            <p className="tabular text-xl font-bold text-ink">
                              {formatINR(service.priceFrom)}
                            </p>
                          ) : (
                            <p className="text-xl font-bold text-ink">₹0</p>
                          )}
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                            <Clock className="size-3.5" aria-hidden="true" />
                            {service.durationMin} min
                          </p>
                        </div>
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/vet-care/${service.slug}`}>
                            Details
                            <ArrowRight className="size-4" aria-hidden="true" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section tone="tint">
        <Container>
          <SectionHeading
            eyebrow="Our vets"
            eyebrowIcon={ShieldCheck}
            title="Every vet on Tailish is registered and verified."
            description="We check the degree, the state council registration and the references before anyone takes a single appointment. Registration numbers are on every profile — you can verify them yourself."
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {mockProviders.map((provider, index) => (
              <Reveal key={provider.id} delayMs={index * 70}>
                <article className="flex h-full flex-col rounded-3xl border border-hairline bg-white p-6 text-center shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                  <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-brand-100 font-display text-lg font-bold text-brand-800">
                    {provider.name
                      .replace(/^Dr\.\s*/, "")
                      .split(" ")
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join("")}
                  </span>

                  <h3 className="mt-4 text-base font-semibold text-ink">{provider.name}</h3>
                  <p className="mt-1 text-xs text-muted">{provider.qualifications}</p>

                  <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted">
                    <Star className="size-3.5 fill-gold-500 text-gold-500" aria-hidden="true" />
                    <span className="font-medium tabular text-ink">{provider.rating}</span>
                    <span>({provider.reviewCount})</span>
                  </p>

                  <p className="mt-3 text-xs text-muted">
                    {provider.experienceYears} years · {provider.area}
                  </p>

                  <ul className="mt-4 flex flex-wrap justify-center gap-1.5">
                    {provider.specialities.slice(0, 2).map((speciality) => (
                      <li key={speciality}>
                        <Badge>{speciality}</Badge>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-auto pt-5 text-[0.7rem] text-muted">
                    Reg. {provider.registrationNo}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Faq items={vetCareFaqs} />
      <FinalCta />
    </>
  );
}
