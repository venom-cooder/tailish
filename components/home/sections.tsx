import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardList,
  Coffee,
  FileText,
  Heart,
  Home,
  MapPin,
  MessageCircleQuestion,
  Quote,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Stethoscope,
  Store,
  Syringe,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Container, Eyebrow, Section, SectionHeading } from "@/components/shared/section";
import { Reveal } from "@/components/motion/reveal";
import { HealthPassportCard } from "@/components/shared/health-passport-card";
import { WhatsAppButton } from "@/components/whatsapp/whatsapp-button";
import { WhatsAppQR } from "@/components/whatsapp/whatsapp-qr";
import { samplePet, sampleVaccinations } from "@/lib/sample-passport";
import { siteConfig } from "@/lib/config";
import { getWhatsAppLink, whatsappMessages } from "@/lib/whatsapp";
import { cn, formatINR } from "@/lib/utils";

/* --------------------------------------------------------- service strip */

const entryPoints = [
  {
    icon: MessageCircleQuestion,
    title: "Ask Tailish",
    description: "Tell us what changed. The care team organises the right next step.",
    href: getWhatsAppLink({ text: whatsappMessages.askTailish }),
  },
  {
    icon: Home,
    title: "Home Care",
    description: `Vaccination, diagnostics and vet home visits in ${siteConfig.city}.`,
    href: getWhatsAppLink({ text: whatsappMessages.homeVisit }),
  },
  {
    icon: Stethoscope,
    title: "Online Vet",
    description: "Consult registered veterinarians from your home.",
    href: getWhatsAppLink({ text: whatsappMessages.videoConsult }),
  },
  {
    icon: FileText,
    title: "Health Passport",
    description: "Keep records, reports and reminders in one place.",
    href: "/health-passport",
  },
];

/**
 * The four ways in, raised on a card that overlaps the hero.
 *
 * Deliberately the first thing below the fold: most visitors arrive knowing
 * roughly what they want, and this spares them the nav.
 */
export function ServiceStrip() {
  return (
    <div className="relative z-10 bg-gradient-to-b from-cream to-white pb-4">
      <Container>
        <Reveal className="rounded-3xl border border-hairline bg-white p-2 shadow-lift sm:p-3">
          <ul className="grid sm:grid-cols-2 lg:grid-cols-4">
            {entryPoints.map((entry, index) => (
              <li
                key={entry.href}
                className={cn(
                  "border-hairline",
                  index > 0 && "border-t sm:border-t-0",
                  index % 2 === 1 && "sm:border-l",
                  "lg:border-l lg:first:border-l-0",
                  index === 2 && "sm:border-t lg:border-t-0",
                  index === 3 && "sm:border-t lg:border-t-0",
                )}
              >
                <Link
                  href={entry.href}
                  className="group flex h-full gap-4 rounded-2xl p-5 transition-colors hover:bg-brand-50/60"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-white">
                    <entry.icon className="size-6" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-base font-semibold text-ink">
                      {entry.title}
                    </span>
                    <span className="mt-1 block text-[0.8125rem] leading-relaxed text-muted">
                      {entry.description}
                    </span>
                    <span className="mt-3 grid size-8 place-items-center rounded-xl bg-gold-400/15 text-gold-600 transition-all duration-200 group-hover:bg-gold-400 group-hover:text-brand-900">
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </div>
  );
}

/* --------------------------------------------------------- feature cards */

const features = [
  {
    icon: Stethoscope,
    title: "Vet Review",
    description: "Share concerns and medical history. Get an expert review from trusted vets.",
    href: getWhatsAppLink({ text: whatsappMessages.videoConsult }),
  },
  {
    icon: Home,
    title: "Home Visits",
    description: "Vets come to you for stress-free care in your pet's own surroundings.",
    href: getWhatsAppLink({ text: whatsappMessages.homeVisit }),
  },
  {
    icon: Syringe,
    title: "Vaccination",
    description: "Timely vaccines with batch records, reminders and easy scheduling.",
    href: getWhatsAppLink({ text: whatsappMessages.vaccination }),
  },
  {
    icon: FileText,
    title: "Health Records",
    description: "Every record in one secure place — accessible and shareable anytime.",
    href: "/health-passport",
  },
  {
    icon: MessageCircleQuestion,
    title: "Daily Support",
    description: "Talk to vets for doubts, advice and ongoing care support.",
    href: getWhatsAppLink({ text: whatsappMessages.askTailish }),
  },
];

export function Features() {
  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="What Tailish does"
          eyebrowIcon={Sparkles}
          align="center"
          title="Everything your pet needs. Just ask Tailish."
          description="Five services that cover the whole arc of pet care — from a worry at 11 PM to the annual booster you'd otherwise forget."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {features.map((feature, index) => (
            <Reveal key={feature.title} delayMs={index * 70}>
              <Link
                href={feature.href}
                className="group flex h-full flex-col rounded-3xl border border-hairline bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-lift"
              >
                <span className="grid size-12 place-items-center rounded-2xl bg-brand-700 text-white transition-all duration-300 group-hover:scale-110 group-hover:bg-accent-500">
                  <feature.icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-base font-semibold text-ink">{feature.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{feature.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-700 transition-colors group-hover:text-accent-600">
                  Learn more
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* -------------------------------------------------------- how it works */

export const howItWorksSteps = [
  {
    number: "1",
    icon: MessageCircleQuestion,
    title: "Ask Tailish",
    description: "Tell us about your pet's concern or need, in your own words.",
  },
  {
    number: "2",
    icon: Stethoscope,
    title: "Vet Review",
    description: "Our vets review and recommend the right care plan for your pet.",
  },
  {
    number: "3",
    icon: Home,
    title: "Home Visit",
    description: "A vet visits your home and provides expert care, calmly.",
  },
  {
    number: "4",
    icon: ClipboardList,
    title: "Care Record",
    description: "Visit summary and next steps are added to your pet's passport.",
  },
];

export function HowItWorks({ tone = "tint" }: { tone?: "tint" | "white" }) {
  return (
    <Section tone={tone}>
      <Container>
        <SectionHeading
          eyebrow="How Tailish works"
          eyebrowIcon={Sparkles}
          title={
            <>
              Care that&apos;s simple,
              <br className="hidden sm:block" /> thoughtful, and personal.
            </>
          }
          description="Four steps from a worry to a written care plan — no clinic waiting room involved."
        >
          <Button asChild variant="outline">
            <Link href="/how-it-works">
              See it in detail
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </SectionHeading>

        <ol className="relative mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Connector line, desktop only. */}
          <li
            aria-hidden="true"
            className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-7 hidden border-t-2 border-dashed border-brand-200 lg:block"
          />

          {howItWorksSteps.map((step, index) => (
            <Reveal as="li" key={step.number} delayMs={index * 110} className="relative">
              <div className="group h-full rounded-3xl border border-hairline bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                <span className="relative z-10 grid size-14 place-items-center rounded-full border-4 border-brand-50 bg-brand-700 font-display text-lg font-bold text-white transition-colors duration-300 group-hover:bg-accent-500">
                  {step.number}
                </span>
                <span className="mt-5 inline-grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <step.icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-3 text-base font-semibold text-ink">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

/* ---------------------------------------------------- health passport */

export function PassportPreview() {
  const points = [
    {
      icon: BadgeCheck,
      title: "Every record, provenance included",
      body: "Each entry shows whether a vet recorded it, a document verified it, or you typed it in. No guessing which facts are solid.",
    },
    {
      icon: Syringe,
      title: "Vaccinations that never lapse quietly",
      body: "Batch numbers and due dates are tracked automatically, with reminders before the date — not after it.",
    },
    {
      icon: ShieldCheck,
      title: "Share it in one tap, revoke it in one more",
      body: "A QR code and expiring link for boarding, a new vet or a family member. You choose what's visible.",
    },
  ];

  return (
    <Section>
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <Eyebrow icon={FileText}>Health Passport</Eyebrow>
            <h2 className="mt-3 text-3xl font-bold leading-[1.15] sm:text-4xl">
              One place your pet&apos;s whole health story actually lives.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
              Vaccination cards get lost. Prescriptions end up in a drawer. The Health Passport keeps
              it all together — and makes it portable the day you need it most.
            </p>

            <ul className="mt-8 space-y-5">
              {points.map((point) => (
                <li key={point.title} className="flex gap-4">
                  <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                    <point.icon className="size-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">{point.title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted">{point.body}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/health-passport">Explore the Health Passport</Link>
              </Button>
            </div>
          </Reveal>

          <Reveal delayMs={120}>
            {/* Labelled, and deliberately not a link. It used to read "See a
                live example" and open a real-looking record for a dog the
                visitor did not own. */}
            <figure>
              <HealthPassportCard
                pet={samplePet}
                vaccinations={sampleVaccinations}
                lastVisitDate="2026-02-14"
                href=""
              />
              <figcaption className="mt-3 text-center text-xs text-muted">
                Example passport — not a real pet&apos;s record.
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

/* ----------------------------------------------------- whatsapp section */

export function WhatsAppSection() {
  const points = [
    "Pet Passport — records, vaccinations and reports, on chat",
    "Reminders for vaccines, deworming and medicines",
    "Shop food and supplies without leaving the conversation",
    "Find vets, emergency hospitals and pet-friendly places nearby",
  ];

  return (
    <Section tone="deep">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <Reveal>
            <Eyebrow tone="light">On WhatsApp</Eyebrow>
            <h2 className="mt-3 text-3xl font-bold leading-[1.15] text-white sm:text-4xl">
              Start your pet&apos;s care on WhatsApp.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
              No app to install, no password to remember. Scan the code and the whole of Tailish —
              bookings, records, reminders and the shop — happens in a chat you already use every day.
            </p>

            <ul className="mt-8 space-y-3">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-white/80">
                  <BadgeCheck className="mt-0.5 size-5 shrink-0 text-whatsapp" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-9">
              <WhatsAppButton size="lg" text={whatsappMessages.home} label="Start on WhatsApp" />
            </div>
          </Reveal>

          <Reveal delayMs={120} className="flex justify-center lg:justify-end">
            <div className="rounded-[2rem] border border-white/15 bg-white/5 p-8 backdrop-blur">
              <WhatsAppQR tone="dark" size={200} text={whatsappMessages.home} />
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

/* --------------------------------------------------------------- FAQ */

export const homeFaqs = [
  {
    question: "Which areas do you cover right now?",
    answer:
      "Home visits currently run across Indore — Vijay Nagar, Palasia, Scheme 78, Bhawarkua, Rau and the surrounding areas. Video consults and the Health Passport work anywhere in India, and the shop delivers to most pin codes. If we're not in your area yet, join the waitlist and we'll message you the week we arrive.",
  },
  {
    question: "Are Tailish vets actually registered?",
    answer:
      "Yes. Every veterinarian on Tailish holds a BVSc & AH degree and a current state veterinary council registration, which we verify before they take a single appointment. Their registration number is shown on their profile. Technicians who handle sample collection are separately qualified and supervised.",
  },
  {
    question: "What does a home visit cost?",
    answer:
      "Home visits start at ₹899 for a full consultation, including the examination and a written visit summary. Vaccinations start at ₹699 and video consults at ₹299. Anything additional — a vaccine, a test, a procedure — is quoted before it happens. You'll never get a bill with a surprise on it.",
  },
  {
    question: "Does Tailish diagnose my pet over chat?",
    answer:
      "No, and deliberately so. Ask Tailish helps you describe what's happening, pulls the relevant history from your pet's passport, and tells you what kind of care the situation needs. A diagnosis comes from a registered veterinarian who has examined your pet. If what you describe sounds like an emergency, we stop and route you to the nearest 24-hour hospital.",
  },
  {
    question: "Who can see my pet's health records?",
    answer:
      "Only you, unless you decide otherwise. Records are encrypted in transit and at rest. Sharing produces a link and QR code that expires, covers only the sections you choose, and can be revoked at any moment. Family members and delegates get exactly the access you grant them, no more.",
  },
  {
    question: "Can I use Tailish entirely on WhatsApp?",
    answer:
      "Yes. Bookings, reminders, record uploads, the shop and nearby search all work through WhatsApp — scan the code on this page and start there. The website and portal are for when you want the fuller view, not a requirement.",
  },
];

export function Faq({ items = homeFaqs }: { items?: { question: string; answer: string }[] }) {
  return (
    <Section tone="cream">
      <Container size="narrow">
        <SectionHeading
          eyebrow="Questions"
          align="center"
          title="Things pet parents ask us first."
        />

        <Reveal className="mt-10">
          <Accordion type="single" collapsible className="space-y-3">
            {items.map((faq, index) => (
              <AccordionItem key={faq.question} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>

        <Reveal className="mt-8 text-center" delayMs={100}>
          <p className="text-sm text-muted">
            Still unsure about something?{" "}
            <Link href="/contact" className="font-medium text-brand-700 underline-offset-4 hover:underline">
              Talk to our care team
            </Link>
            .
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}

/* ---------------------------------------------------------- final CTA */

export function FinalCta() {
  return (
    <Section tone="deep" className="py-0">
      <Container className="py-16 lg:py-20">
        <Reveal className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-3xl font-bold leading-[1.15] text-white sm:text-4xl">
              Your pet&apos;s health journey starts with Tailish.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/75">
              Book a vet visit today and give your pet the care they deserve — at home, on your
              schedule, recorded properly.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
            <WhatsAppButton
              size="lg"
              variant="onDark"
              text={whatsappMessages.bookVisit}
              label="Book a Vet Visit"
            />
            <WhatsAppButton
              size="lg"
              variant="onDark"
              text={whatsappMessages.home}
              label="Chat with our care team"
            />
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
