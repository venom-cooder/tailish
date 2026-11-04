import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  BadgeCheck,
  Bell,
  FileText,
  IdCard,
  Lock,
  QrCode,
  Share2,
  Stethoscope,
  Syringe,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container, Section, SectionHeading } from "@/components/shared/section";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { HealthPassportCard } from "@/components/shared/health-passport-card";
import { SourceBadge } from "@/components/shared/source-badge";
import { Faq, FinalCta } from "@/components/home/sections";
import { WhatsAppButton } from "@/components/whatsapp/whatsapp-button";
import { WhatsAppQR } from "@/components/whatsapp/whatsapp-qr";
import { mockPets, mockVaccinations } from "@/lib/mock/pets";
import { addDays } from "@/lib/mock/clock";
import { whatsappMessages } from "@/lib/whatsapp";
import type { RecordSource } from "@/lib/types";

export const metadata: Metadata = {
  title: "Health Passport — your pet's complete medical record, in one place",
  description:
    "Vaccinations, weights, conditions, medications, documents and a full timeline — with provenance on every record and a shareable QR code that expires when you say so.",
  alternates: { canonical: "/health-passport" },
};

const sections = [
  {
    icon: IdCard,
    title: "Identity",
    body: "Name, breed, date of birth, sex, neuter status, microchip number and markings — the details every form asks for and nobody can find.",
  },
  {
    icon: Syringe,
    title: "Vaccinations",
    body: "Every dose with its brand, batch number, who administered it and when the next one is due. Lapses are flagged before they happen.",
  },
  {
    icon: Activity,
    title: "Weight history",
    body: "A chart rather than a number. Trends are what tell you something is wrong, and a single reading never does.",
  },
  {
    icon: Stethoscope,
    title: "Conditions & allergies",
    body: "Chronic conditions, allergies and past surgeries, each with status and diagnosis date — so a new vet starts informed.",
  },
  {
    icon: FileText,
    title: "Medications",
    body: "What your pet is on now, what they've finished, the dose and the frequency. Reminders included while a course is running.",
  },
  {
    icon: Upload,
    title: "Documents",
    body: "Prescriptions, lab reports, imaging and discharge summaries. Upload a photo and we extract the details into structured records.",
  },
];

const provenanceExamples: { source: RecordSource; label: string; meaning: string }[] = [
  {
    source: "vet_verified",
    label: "Rabies booster, batch A24871K",
    meaning: "Recorded by Dr. Kavita Rao during a Tailish home visit.",
  },
  {
    source: "document_verified",
    label: "Blood panel, 12 Oct",
    meaning: "Read from an uploaded lab report and checked by the care desk.",
  },
  {
    source: "ai_extracted_draft",
    label: "Skin cytology report",
    meaning: "Extracted automatically. Provisional until a human confirms it.",
  },
  {
    source: "parent_entered",
    label: "Weight 29.4 kg, home scale",
    meaning: "Entered by you. Useful context, not a clinical measurement.",
  },
];

const faqs = [
  {
    question: "Is the Health Passport free?",
    answer:
      "Yes. Records, reminders, uploads and sharing cost nothing, whether or not you ever book a visit. We'd rather every pet in the city had a proper record than put a paywall in front of one.",
  },
  {
    question: "Who can see my pet's records?",
    answer:
      "Only you, until you decide otherwise. Records are encrypted in transit and at rest. Sharing creates a link and QR code that expires, shows only the sections you choose, and can be revoked instantly. Family members and delegates get exactly the access you grant them.",
  },
  {
    question: "What happens to my data if I stop using Tailish?",
    answer:
      "You can export the full record as a PDF at any time, and you can delete your account and its data outright. We don't hold your pet's medical history hostage to keep you subscribed.",
  },
  {
    question: "Can I add records from before I joined?",
    answer:
      "That's the point of the upload flow. Photograph old vaccination cards, prescriptions and reports, and we extract the details into structured records — marked as draft until the care desk verifies them against the document.",
  },
  {
    question: "Will another vet accept it?",
    answer:
      "In practice, yes — shared passports include the original documents alongside the structured data, and the batch numbers and registration numbers a vet actually wants to see. Boarding facilities and housing societies generally accept the vaccination certificate directly.",
  },
  {
    question: "Does it work for more than one pet?",
    answer:
      "Yes, and each pet gets their own passport, passport ID and share links. Reminders are per pet, so a multi-pet household doesn't end up with one undifferentiated pile of notifications.",
  },
];

export default function HealthPassportPage() {
  const pet = mockPets[0];
  const vaccinations = mockVaccinations.filter((v) => v.petId === pet.id);

  return (
    <>
      <PageHero
        eyebrow="Health Passport"
        eyebrowIcon={IdCard}
        crumbs={[{ label: "Health Passport" }]}
        title="Your pet's whole health story, in one place that travels."
        description="Vaccination cards get lost. Prescriptions end up in a drawer. The Health Passport keeps everything together, shows you where each fact came from, and makes it shareable the day you need it most."
        aside={
          <HealthPassportCard
            pet={pet}
            vaccinations={vaccinations}
            lastVisitDate={addDays(-3)}
            href="/app/pets/pet_01"
          />
        }
      >
        <Button asChild size="lg">
          <Link href="/app/pets/new">Create a free passport</Link>
        </Button>
        <WhatsAppButton
          size="lg"
          variant="outline"
          text={whatsappMessages.healthPassport}
          label="Set it up on WhatsApp"
        />
      </PageHero>

      <Section>
        <Container>
          <SectionHeading
            eyebrow="What's inside"
            align="center"
            title="Six sections that cover a pet's whole life."
            description="Not a folder of scanned PDFs — structured records you can search, chart and share."
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((section, index) => (
              <Reveal key={section.title} delayMs={index * 70}>
                <article className="flex h-full flex-col rounded-3xl border border-hairline bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-lift">
                  <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                    <section.icon className="size-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold text-ink">{section.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{section.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="cream">
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <SectionHeading
                eyebrow="Provenance"
                eyebrowIcon={BadgeCheck}
                title="You always know who said what."
                description="A fact a vet recorded is not the same as one you typed in at midnight, and software shouldn't present them identically. Every record in the passport carries its source."
              />

              <ul className="mt-9 space-y-4">
                {provenanceExamples.map((example) => (
                  <li
                    key={example.label}
                    className="flex flex-col gap-2 rounded-2xl border border-hairline bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-5"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink">{example.label}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted">{example.meaning}</p>
                    </div>
                    <SourceBadge source={example.source} className="shrink-0 self-start sm:self-auto" />
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delayMs={120}>
              <SectionHeading
                eyebrow="Sharing"
                eyebrowIcon={Share2}
                title="Share it in one tap. Revoke it in one more."
                description="Boarding facilities, a new vet, a family member looking after your pet while you travel — they get a read-only view that expires."
              />

              <div className="mt-9 space-y-4">
                {[
                  {
                    icon: QrCode,
                    title: "QR code or link",
                    body: "Show the code at a boarding desk or send the link. No account needed on the other side.",
                  },
                  {
                    icon: Lock,
                    title: "You choose the sections",
                    body: "Share vaccinations only, or the full record including documents. Default is identity and vaccinations.",
                  },
                  {
                    icon: Bell,
                    title: "It expires by default",
                    body: "Seven days unless you change it, and you can revoke any link instantly from the passport.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex gap-4 rounded-2xl border border-hairline bg-white p-5"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                      <item.icon className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink">{item.title}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-muted">{item.body}</p>
                    </div>
                  </div>
                ))}

                <Button asChild variant="outline" className="w-full">
                  <Link href="/p/demo-passport">See a shared passport</Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section tone="deep">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            <Reveal>
              <Badge variant="onDark">Fastest way in</Badge>
              <h2 className="mt-4 text-3xl font-bold leading-[1.15] text-white sm:text-4xl">
                Set up a passport on WhatsApp in two minutes.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/75">
                Send a photo of your pet&apos;s vaccination card and we&apos;ll build the record for
                you — vaccines, dates, batch numbers and the next due date, all extracted and checked
                before anything is marked verified.
              </p>
              <div className="mt-8">
                <WhatsAppButton
                  size="lg"
                  text={whatsappMessages.healthPassport}
                  label="Start on WhatsApp"
                />
              </div>
            </Reveal>

            <Reveal delayMs={120} className="flex justify-center lg:justify-end">
              <div className="rounded-[2rem] border border-white/15 bg-white/5 p-8 backdrop-blur">
                <WhatsAppQR
                  tone="dark"
                  size={190}
                  text={whatsappMessages.healthPassport}
                  caption="Scan to set up your pet's passport"
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Faq items={faqs} />
      <FinalCta />
    </>
  );
}
