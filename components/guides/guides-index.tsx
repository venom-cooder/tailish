"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Clock, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/states";
import { Reveal } from "@/components/motion/reveal";
import type { Guide } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

/**
 * Filtering happens in the browser over the full, server-rendered list.
 *
 * Every guide is in the initial HTML, so search engines and AI crawlers see
 * the whole library regardless of the active filter — and switching category
 * costs no round trip.
 */
export function GuidesIndex({ guides, categories }: { guides: Guide[]; categories: string[] }) {
  const [category, setCategory] = React.useState("all");
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const term = query.trim().toLowerCase();
    return guides.filter((guide) => {
      if (category !== "all" && guide.category !== category) return false;
      if (!term) return true;
      return `${guide.title} ${guide.excerpt} ${guide.tags.join(" ")}`
        .toLowerCase()
        .includes(term);
    });
  }, [guides, category, query]);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="scrollbar-thin flex gap-2 overflow-x-auto pb-1">
          {["all", ...categories].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setCategory(value)}
              aria-pressed={category === value}
              className={cn(
                "shrink-0 rounded-xl border px-4 py-2 text-sm font-medium transition-all",
                category === value
                  ? "border-brand-700 bg-brand-700 text-white"
                  : "border-hairline bg-white text-muted hover:border-brand-300 hover:text-brand-700",
              )}
            >
              {value === "all" ? "All guides" : value}
            </button>
          ))}
        </div>

        <div className="relative lg:w-72">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search guides…"
            aria-label="Search guides"
            className="pl-11"
          />
        </div>
      </div>

      <p className="mt-6 text-sm text-muted" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "guide" : "guides"}
        {category !== "all" ? ` in ${category}` : ""}
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No guides match that"
          description="Try a different search term, or browse all guides."
          className="mt-8"
        />
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((guide, index) => (
            <Reveal key={guide.id} delayMs={Math.min(index, 6) * 60}>
              <GuideCard guide={guide} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

export function GuideCard({ guide, className }: { guide: Guide; className?: string }) {
  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-3xl border border-hairline bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-lift",
        className,
      )}
    >
      <Link href={`/guides/${guide.slug}`} className="relative block aspect-[5/3] overflow-hidden">
        <Image
          src={guide.coverImage}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Badge variant="onDark" className="absolute left-4 top-4">
          {guide.category}
        </Badge>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-lg font-semibold leading-snug text-ink">
          <Link href={`/guides/${guide.slug}`} className="transition-colors hover:text-brand-700">
            {guide.title}
          </Link>
        </h3>

        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted">{guide.excerpt}</p>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-hairline pt-4 text-xs text-muted">
          <span>{guide.author.name}</span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" aria-hidden="true" />
            {guide.readingMinutes} min · {formatDate(guide.publishedAt)}
          </span>
        </div>
      </div>
    </article>
  );
}
