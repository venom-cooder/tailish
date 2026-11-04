import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardList,
  Home,
  MessageCircleQuestion,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Section, SectionHeading } from "@/components/shared/section";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { Faq, FinalCta, WhatsAppSection } from "@/components/home/sections";
import { WhatsAppButton } from "@/components/whatsapp/whatsapp-button";
import { whatsappMessages } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "How Tailish works — from a worry to a written care plan",
  description:
    "Four steps: tell us what's wrong, a registered vet reviews it, care happens at home, and everything lands in your pet's Health Passport. Here's what each one actually involves.",
  alternates: { canonical: "/how-it-works" },
};

const detailedSteps = [
  {
    number: "01",
    icon: MessageCircleQuestion,
    title: "Ask Tailish",
    summary: "Describe the concern in your own words — no medical vocabulary required.",
    details: [
      "Type what you've noticed, when it started, and whether eating, drinking or energy have changed.",
      "Add a photo or a short video if it's easier to show than describe.",
      "Your pet's existing records — medications, allergies, recent visits — are attached automatically.",
      "If what you describe sounds urgent, we stop and send you to an emergency hospital instead of scheduling anything.",
    ],
  },
  {
    number: "02",
    icon: Stethoscope,
    title: "Vet review",
    summary: "A registered veterinarian reads it and recommends the right kind of care.",
    details: [
      "A real vet reviews the intake — not a decision tree that sells you the most expensive option.",
      "You get a recommendation with reasoning: home visit, video consult, or something you can manage yourself.",
      "Pricing is shown before you commit, including anything that might be added on the day.",
      "You choose the vet, the date and the time slot. Same-day is usually available.",
    ],
  },
  {
    number: "03",
    icon: Home,
    title: "Care at home",
    summary: "A vet arrives already knowing your pet's history.",
    details: [
      "They've read the Health Passport before knocking — current medications, known allergies, the last visit's notes.",
      "A complete examination in the room your pet already feels safe in.",
      "Vaccination, sample collection and most minor procedures happen on the spot.",
      "Anything that needs a hospital is named specifically, with the case history shared ahead of your arrival.",
    ],
  },
  {
    number: "04",
    icon: ClipboardList,
    title: "Care record",
    summary: "Everything is written down, permanently, in one place.",
    details: [
      "Observations, the care plan, prescriptions and the follow-up date — written before the vet leaves.",
      "Each entry is marked with who asserted it, so you can tell vet-verified facts from your own notes.",
      "Reminders for the next dose or review are scheduled automatically.",
      "Share the whole record with a boarding facility or a new vet via a QR code that expires when you want it to.",
    ],
  },
];

const principles = [
  {
    icon: ShieldCheck,
    title: "We never diagnose over chat",
    body: "Ask Tailish helps you describe the problem and routes you to the right care. A diagnosis comes from a vet who has examined your pet. Anything that reads as an emergency goes straight to a hospital — we don't try to handle it ourselves.",
  },
  {
    icon: BadgeCheck,
    title: "Every record shows its source",
    body: "A fact recorded by a vet looks different from one typed in by you or extracted from a document by software. You always know which is which, because treating a guess like a verified fact is how mistakes get made.",
  },
  {
    icon: Sparkles,
    title: "Prevention over emergency",
    body: "Most of what goes wrong with pets is cheaper, easier and kinder to prevent. That's why reminders go out before a date lapses, and why we'd rather tell you a visit isn't needed than sell you one.",
  },
];

const faqs = [
  {
    question: "Do I have to use the app?",
    answer:
      "No. The whole service works over WhatsApp if that's what you prefer — bookings, reminders, record uploads, the shop and nearby search. The website and portal give you the fuller view, but they're optional.",
  },
  {
    question: "What if I already have a vet I like?",
    answer:
      "Keep them. You can add your existing vet as a delegate on your pet's Health Passport so they can see the full history, and use Tailish for home visits, records and reminders around that. We're not trying to replace a relationship that's working.",
  },
  {
    question: "How does Tailish know my pet's history?",
    answer:
      "From whatever you give us. Upload old vaccination cards, prescriptions and lab reports, and we extract the details into structured records — marked as draft until a human verifies them. Everything recorded during a Tailish visit is added automatically.",
  },
  {
    question: "Is there a subscription, or do I pay per visit?",
    answer:
      "Either. Pay per visit with no commitment, or take a CarePass membership if you'd rather have consults included and lower per-visit pricing. The Health Passport, reminders and Ask Tailish are free regardless.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How it works"
        eyebrowIcon={Sparkles}
        crumbs={[{ label: "How it Works" }]}
        title="From a worry at 11 PM to a written care plan."
        description="Four steps, no waiting room, and a permanent record at the end of it. Here's exactly what happens at each stage."
      >
        <Button asChild size="lg">
          <Link href="/vet-care/book-visit">Book a Vet Visit</Link>
        </Button>
        <WhatsAppButton
          size="lg"
          variant="outline"
          text={whatsappMessages.general}
          label="Start on WhatsApp"
        />
      </PageHero>

      <Section>
        <Container>
          <ol className="space-y-6">
            {detailedSteps.map((step, index) => (
              <Reveal as="li" key={step.number} delayMs={index * 80}>
                <article className="grid gap-6 rounded-3xl border border-hairline bg-white p-7 shadow-soft transition-shadow duration-300 hover:shadow-lift sm:p-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-12">
                  <div>
                    <div className="flex items-center gap-4">
                      <span className="grid size-14 place-items-center rounded-2xl bg-brand-700 text-white">
                        <step.icon className="size-7" aria-hidden="true" />
                      </span>
                      <span className="font-display text-4xl font-bold text-brand-100">
                        {step.number}
                      </span>
                    </div>
                    <h2 className="mt-5 font-display text-2xl font-bold text-ink">{step.title}</h2>
                    <p className="mt-2 text-base leading-relaxed text-muted">{step.summary}</p>
                  </div>

                  <ul className="space-y-3 lg:border-l lg:border-hairline lg:pl-12">
                    {step.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-3 text-sm leading-relaxed text-ink/80">
                        <BadgeCheck className="mt-0.5 size-5 shrink-0 text-emerald-600" aria-hidden="true" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      <Section tone="tint">
        <Container>
          <SectionHeading
            eyebrow="How we think about it"
            align="center"
            title="Three rules we don't bend."
          />

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {principles.map((principle, index) => (
              <Reveal key={principle.title} delayMs={index * 90}>
                <article className="flex h-full flex-col rounded-3xl border border-hairline bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                  <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                    <principle.icon className="size-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold text-ink">
                    {principle.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted">{principle.body}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 text-center" delayMs={160}>
            <Button asChild variant="outline">
              <Link href="/health-passport">
                See how the Health Passport works
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </Reveal>
        </Container>
      </Section>

      <WhatsAppSection />
      <Faq items={faqs} />
      <FinalCta />
    </>
  );
}
