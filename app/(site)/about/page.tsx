import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck,
  Building2,
  Handshake,
  Heart,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Section, SectionHeading } from "@/components/shared/section";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { PartnerForm, WaitlistForm } from "@/components/forms/lead-forms";
import { FinalCta } from "@/components/home/sections";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "About Tailish — guided pet care, built in Indore",
  description:
    "Why we built Tailish, how we work with veterinarians, and what we will and won't do with your pet's health data. Partner applications welcome.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    icon: ShieldCheck,
    title: "Clinical judgement stays with clinicians",
    body: "Software is good at remembering, organising and reminding. It is not good at deciding whether your dog's abdomen is painful. We built Tailish around that division of labour and we don't blur it to look more impressive.",
  },
  {
    icon: BadgeCheck,
    title: "Say where a fact came from",
    body: "Pet health records are full of half-remembered dates and photographed cards. Rather than pretend otherwise, we label every record with its source — and we'd rather show you an honest 'needs review' than a confident wrong answer.",
  },
  {
    icon: Heart,
    title: "Prevention beats emergency",
    body: "The worst nights in veterinary medicine are mostly preventable. Reminders that arrive before a date lapses, screening that catches a value drifting, and advice that's free to ask for — all of it is cheaper than the alternative.",
  },
  {
    icon: Users,
    title: "Pet parents aren't the problem",
    body: "Nobody forgets a booster because they don't care. They forget because the card is in a drawer and the date was eleven months ago. Design around real life rather than blaming people for it.",
  },
];

const milestones = [
  {
    period: "Early 2025",
    title: "The problem, up close",
    body: "A founder's dog needed an emergency hospital at 2 AM, and nobody could find the vaccination card, the previous prescription, or which hospital was actually open. All three of those are solvable problems.",
  },
  {
    period: "Mid 2025",
    title: "First vets on board",
    body: "We started with four registered veterinarians in Indore and a single rule: every visit produces a written summary, in the pet parent's hands, the same day.",
  },
  {
    period: "Late 2025",
    title: "The Health Passport",
    body: "Record-keeping turned out to matter more than booking. We rebuilt around the passport — structured records with provenance, portable by QR code, free for everyone.",
  },
  {
    period: "2026",
    title: "Care that reaches further",
    body: "WhatsApp-first access, home diagnostics, and a shop stocked around what our vets actually recommend. Indore first, then the cities our pet parents keep asking about.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        eyebrowIcon={Sparkles}
        crumbs={[{ label: "About" }]}
        title="We started because nobody could find the vaccination card."
        description={`Tailish is a pet care company built in ${siteConfig.city} around a simple idea: the care is only as good as the record it leaves behind. We connect pet parents with registered veterinarians, and we keep the history so the next vet doesn't start from zero.`}
      >
        <Button asChild size="lg">
          <Link href="/vet-care/book-visit">Book a Vet Visit</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="#partners">Partner with us</Link>
        </Button>
      </PageHero>

      <Section>
        <Container>
          <SectionHeading
            eyebrow="What we believe"
            align="center"
            title="Four things that shape every decision here."
          />

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {values.map((value, index) => (
              <Reveal key={value.title} delayMs={index * 80}>
                <article className="flex h-full gap-5 rounded-3xl border border-hairline bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                    <value.icon className="size-6" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-ink">{value.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{value.body}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="tint">
        <Container>
          <SectionHeading eyebrow="How we got here" title="A short history." />

          <ol className="mt-12 space-y-0">
            {milestones.map((milestone, index) => (
              <Reveal as="li" key={milestone.period} delayMs={index * 80}>
                <div className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <span className="grid size-4 shrink-0 place-items-center rounded-full border-4 border-brand-200 bg-brand-600" />
                    {index < milestones.length - 1 ? (
                      <span aria-hidden="true" className="w-px flex-1 bg-brand-200" />
                    ) : null}
                  </div>

                  <div className="pb-10">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
                      {milestone.period}
                    </p>
                    <h3 className="mt-1.5 font-display text-lg font-semibold text-ink">
                      {milestone.title}
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                      {milestone.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <SectionHeading
                eyebrow="Where we work"
                eyebrowIcon={MapPin}
                title={`Indore first — properly, not thinly.`}
                description="Home visits run across Vijay Nagar, Palasia, Scheme 54, Scheme 78, Bhawarkua, Rajwada and Rau. Video consults, the Health Passport and the shop work across India."
              />

              <div className="mt-8 rounded-3xl border border-hairline bg-brand-50/50 p-7">
                <h3 className="font-display text-lg font-semibold text-ink">
                  Not in your city yet?
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Tell us where you are. We open cities in the order pet parents ask for them, and
                  we&apos;ll message you on WhatsApp the week we arrive.
                </p>
                <div className="mt-6">
                  <WaitlistForm compact />
                </div>
              </div>
            </Reveal>

            <Reveal delayMs={120} id="partners" className="scroll-mt-28">
              <SectionHeading
                eyebrow="Partners"
                eyebrowIcon={Handshake}
                title="Work with Tailish."
                description="We're looking for registered veterinarians, clinics, groomers and brands who care about doing this properly. Applications are reviewed within two working days."
              />

              <div className="mt-8 rounded-3xl border border-hairline bg-white p-7 shadow-soft">
                <PartnerForm />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section tone="deep">
        <Container size="narrow" className="text-center">
          <Reveal>
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white/10 text-white">
              <Building2 className="size-7" aria-hidden="true" />
            </span>
            <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl">
              Tailish Pet Care Private Limited
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/75">
              {siteConfig.address} · {siteConfig.email} · {siteConfig.phone}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Tailish provides guided pet care and connects pet parents with independently
              registered veterinarians. We do not practise veterinary medicine ourselves, and
              nothing on this site replaces an in-person examination.
            </p>
          </Reveal>
        </Container>
      </Section>

      <FinalCta />
    </>
  );
}
