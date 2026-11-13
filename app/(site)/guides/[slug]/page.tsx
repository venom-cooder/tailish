import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, BookOpen, Clock, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Container, Section } from "@/components/shared/section";
import { Prose } from "@/components/shared/prose";
import { GuideCard } from "@/components/guides/guides-index";
import { Reveal } from "@/components/motion/reveal";
import { WhatsAppButton } from "@/components/whatsapp/whatsapp-button";
import { CopyButton } from "@/components/shared/copy-button";
import { api } from "@/lib/api";
import { mockGuides } from "@/lib/mock/content";
import { siteConfig } from "@/lib/config";
import { whatsappMessages } from "@/lib/whatsapp";
import { formatDate } from "@/lib/utils";

/**
 * Prerender every guide.
 *
 * Cache Components requires at least one param here; returning all of them
 * means the whole library ships as a static shell, which is what we want for
 * search and AI-answer visibility.
 */
export function generateStaticParams() {
  return mockGuides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = mockGuides.find((g) => g.slug === slug);
  if (!guide) return { title: "Guide not found" };

  return {
    title: guide.title,
    description: guide.excerpt,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      type: "article",
      title: guide.title,
      description: guide.excerpt,
      publishedTime: guide.publishedAt,
      modifiedTime: guide.updatedAt,
      tags: guide.tags,
    },
  };
}

/**
 * Partial Prefetching is enabled, so `params` is awaited inside a Suspense
 * boundary: the route ships a static shell immediately and the article streams
 * in, which keeps navigation instant for paths outside generateStaticParams.
 */
export default function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<GuideSkeleton />}>
      <GuideArticle params={params} />
    </Suspense>
  );
}

function GuideSkeleton() {
  return (
    <Container size="narrow" className="py-16">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="mt-6 h-12 w-full" />
      <Skeleton className="mt-3 h-12 w-3/4" />
      <Skeleton className="mt-8 h-20 w-full" />
      <Skeleton className="mt-10 aspect-[5/3] w-full rounded-3xl" />
      <div className="mt-10 space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-5 w-full" />
        ))}
      </div>
    </Container>
  );
}

async function GuideArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const guide = await api.content.getGuide(slug).catch(() => null);
  if (!guide) notFound();

  const related = (
    await Promise.all(
      (guide.relatedSlugs ?? []).map((relatedSlug) =>
        api.content.getGuide(relatedSlug).catch(() => null),
      ),
    )
  ).filter((item): item is NonNullable<typeof item> => item !== null);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.excerpt,
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt ?? guide.publishedAt,
    // Attributed to the organisation, not a Person. The Person entry named an
    // invented vet and gave their credentials as jobTitle, which is exactly
    // the signal a search engine reads as medical authorship.
    author: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    mainEntityOfPage: `${siteConfig.url}/guides/${guide.slug}`,
    keywords: guide.tags.join(", "),
  };

  const isEmergencyGuide = guide.category === "Emergency";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <article>
        <header className="border-b border-hairline bg-gradient-to-b from-brand-50/80 to-white">
          <Container size="narrow" className="py-12 sm:py-16">
            <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li>
                  <Link href="/" className="transition-colors hover:text-brand-600">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/guides" className="transition-colors hover:text-brand-600">
                    Guides
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="font-medium text-ink" aria-current="page">
                  {guide.category}
                </li>
              </ol>
            </nav>

            <Badge variant="accent">{guide.category}</Badge>

            <h1 className="mt-4 text-3xl font-bold leading-[1.12] sm:text-4xl lg:text-[2.75rem]">
              {guide.title}
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-muted">{guide.excerpt}</p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-hairline pt-6">
              {/* The vet byline and avatar that sat here named a person who
                  does not exist, with credentials to match. */}
              <span className="text-sm font-semibold text-ink">Tailish</span>

              <span className="flex items-center gap-1.5 text-xs text-muted">
                <Clock className="size-3.5" aria-hidden="true" />
                {guide.readingMinutes} min read
              </span>

              <span className="text-xs text-muted">
                Published {formatDate(guide.publishedAt)}
                {guide.updatedAt ? ` · Updated ${formatDate(guide.updatedAt)}` : ""}
              </span>

              <CopyButton
                value={`${siteConfig.url}/guides/${guide.slug}`}
                label="Copy link"
                showLabel
                className="ml-auto"
              />
            </div>
          </Container>
        </header>

        <Container size="narrow" className="py-10">
          <div className="relative aspect-[5/3] overflow-hidden rounded-3xl shadow-soft">
            <Image
              src={guide.coverImage}
              alt=""
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        </Container>

        <Container size="narrow" className="pb-14">
          {isEmergencyGuide ? (
            <div className="mb-9 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/70 p-5">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-red-600" aria-hidden="true" />
              {/* "Find one open near you" linked to /nearby, a directory of
                  invented clinics. Someone reading this guide is mid-emergency;
                  a dead link, or a made-up hospital, is the worst outcome on
                  the site. No link until the listings are real and verified. */}
              <p className="text-sm leading-relaxed text-red-900">
                If your pet is showing any of the signs below right now, stop reading and go to a
                veterinary hospital. Call your own vet, or search for a 24-hour emergency animal
                hospital near you.
              </p>
            </div>
          ) : null}

          <Prose body={guide.body} />

          <ul className="mt-10 flex flex-wrap gap-2 border-t border-hairline pt-8">
            {guide.tags.map((tag) => (
              <li key={tag}>
                <Badge>#{tag}</Badge>
              </li>
            ))}
          </ul>

          <aside className="mt-10 rounded-3xl border border-hairline bg-brand-50/50 p-7">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand-600" aria-hidden="true" />
              {/* Said "reviewed by a registered veterinarian". No vet has
                  reviewed these guides. Saying so plainly is the point of the
                  notice — a false reassurance here is worse than none. */}
              <p className="text-sm leading-relaxed text-muted">
                This guide is general information, written by the Tailish team and{" "}
                <strong className="font-semibold text-ink">not reviewed by a veterinarian</strong>.
                It isn&apos;t a diagnosis, and it can&apos;t account for your pet&apos;s own
                history. If something doesn&apos;t look right, have a vet look at it.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <WhatsAppButton
                text={whatsappMessages.bookVisit}
                label="Book a Vet Visit"
              />
              <WhatsAppButton
                variant="outline"
                text={whatsappMessages.guide(guide.title)}
                label="Ask a follow-up on WhatsApp"
              />
            </div>
          </aside>
        </Container>
      </article>

      {related.length > 0 ? (
        <Section tone="cream" className="py-14">
          <Container>
            <h2 className="flex items-center gap-2.5 font-display text-2xl font-bold text-ink">
              <BookOpen className="size-6 text-brand-600" aria-hidden="true" />
              Read next
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => (
                <Reveal key={item.id} delayMs={index * 80}>
                  <GuideCard guide={item} />
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
