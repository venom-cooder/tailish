import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/shared/section";
import { PageHero } from "@/components/shared/page-hero";
import { GuideCard, GuidesIndex } from "@/components/guides/guides-index";
import { Reveal } from "@/components/motion/reveal";
import { FinalCta } from "@/components/home/sections";
import { api, guideCategories } from "@/lib/api";

export const metadata: Metadata = {
  title: "Pet care guides — written and reviewed by veterinarians",
  description:
    "Practical guides on vaccination schedules, parasite prevention, nutrition, skin problems and emergencies — written for Indian conditions and reviewed by registered vets.",
  alternates: { canonical: "/guides" },
};

export default async function GuidesPage() {
  const guides = await api.content.listGuides();
  const featured = guides.filter((guide) => guide.featured).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow="Care guides"
        eyebrowIcon={BookOpen}
        crumbs={[{ label: "Guides" }]}
        title="Pet care, explained properly."
        description="Written for Indian conditions — monsoon ticks, summer heat, the vaccines your municipality actually requires — and reviewed by registered veterinarians before publication."
      />

      {featured.length > 0 ? (
        <Section className="pb-0 pt-12 sm:pt-14">
          <Container>
            <SectionHeading eyebrow="Start here" title="The ones worth reading first." />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((guide, index) => (
                <Reveal key={guide.id} delayMs={index * 80}>
                  <GuideCard guide={guide} />
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <Section>
        <Container>
          <SectionHeading eyebrow="All guides" title="Browse the library." className="mb-10" />
          <GuidesIndex guides={guides} categories={guideCategories()} />
        </Container>
      </Section>

      <FinalCta />
    </>
  );
}
