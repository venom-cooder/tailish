"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, FlaskConical, Home, Search, Syringe, Video } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PawGlyph } from "@/components/brand/logo";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type Intent = "help" | "explore";

const SERVICES: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Talk to Vet", href: "/vet-care/video-consult", icon: Video },
  // "Home Visit" rather than "Vet at Home": it matches the service's own name
  // elsewhere on the site and fits a phone-width tile on one line.
  { label: "Home Visit", href: "/vet-care/home-visit", icon: Home },
  { label: "Vaccination", href: "/vet-care/vaccination", icon: Syringe },
  { label: "Diagnostics", href: "/vet-care/diagnostics", icon: FlaskConical },
];

const PLACEHOLDER: Record<Intent, string> = {
  help: "What's the concern?",
  explore: "Search care guides…",
};

/**
 * The hero's entry point: one box that routes a visitor by what they came for.
 *
 * "I need help" hands the typed concern to the care team on WhatsApp — the
 * channel the rest of the site funnels into, and the one where a person
 * actually replies. "I want to explore" sends the same text to the guides
 * search instead, so browsing never opens a chat the visitor didn't ask for.
 */
export function CareFinder({ className }: { className?: string }) {
  const [intent, setIntent] = React.useState<Intent>("help");
  const [concern, setConcern] = React.useState("");

  const trimmed = concern.trim();

  const destination =
    intent === "help"
      ? getWhatsAppLink({
          text: trimmed
            ? `Hi Tailish! ${trimmed}`
            : "Hi Tailish! I'd like help deciding what my pet needs.",
        })
      : `/guides${trimmed ? `?q=${encodeURIComponent(trimmed)}` : ""}`;

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (intent === "help") {
      window.open(destination, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = destination;
    }
  }

  return (
    <div
      className={cn(
        // A container query, not a viewport one: this card is full-width on a
        // phone and a fixed 25rem column on desktop, so its own width is what
        // decides whether the long labels fit.
        "@container rounded-3xl border border-white/70 bg-white/85 p-5 shadow-lift backdrop-blur-xl sm:p-6",
        className,
      )}
    >
      <h2 className="font-display text-xl font-bold text-ink sm:text-[1.375rem]">
        Find the right care
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-muted">
        Tell us what you need. A real person on the care team follows up.
      </p>

      {/* Segmented control — a radiogroup so arrow keys move between options. */}
      <div
        role="radiogroup"
        aria-label="What brings you here?"
        className="mt-4 grid grid-cols-2 gap-1 rounded-2xl bg-brand-50 p-1"
      >
        {(
          [
            { value: "help", short: "Need help", long: "I need help for my pet" },
            { value: "explore", short: "Explore", long: "I want to explore" },
          ] as const
        ).map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={intent === option.value}
            onClick={() => setIntent(option.value)}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-[0.8125rem] font-semibold transition-all duration-200",
              intent === option.value
                ? "bg-brand-900 text-white shadow-soft"
                : "text-muted hover:text-brand-700",
            )}
          >
            {option.value === "help" ? (
              <PawGlyph className="size-3.5 shrink-0" aria-hidden="true" />
            ) : null}
            {/* The full sentence only fits once the card reaches its desktop
                width; below that it would truncate mid-word. */}
            <span className="@[22rem]:hidden">{option.short}</span>
            <span className="hidden @[22rem]:inline">{option.long}</span>
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="relative mt-3">
        <label htmlFor="care-finder-input" className="sr-only">
          {PLACEHOLDER[intent]}
        </label>
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <input
          id="care-finder-input"
          type="text"
          value={concern}
          onChange={(event) => setConcern(event.target.value)}
          placeholder={PLACEHOLDER[intent]}
          className="h-14 w-full rounded-2xl border border-hairline bg-white pl-12 pr-16 text-[0.9375rem] text-ink outline-none transition-colors placeholder:text-muted/80 focus:border-brand-400"
        />
        <button
          type="submit"
          aria-label={intent === "help" ? "Ask the care team on WhatsApp" : "Search care guides"}
          className="absolute right-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-xl bg-gold-400 text-brand-900 transition-all duration-200 hover:bg-gold-500 active:scale-95"
        >
          <ArrowRight className="size-5" aria-hidden="true" />
        </button>
      </form>

      <ul className="mt-3 grid grid-cols-4 gap-2">
        {SERVICES.map((service) => (
          <li key={service.href}>
            <Link
              href={service.href}
              className="group flex h-full flex-col items-center gap-2 rounded-2xl bg-brand-50/80 px-1.5 py-3 text-center transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-100"
            >
              <service.icon
                className="size-5 text-brand-600 transition-colors group-hover:text-brand-800"
                aria-hidden="true"
              />
              <span className="text-[0.6875rem] font-medium leading-tight text-ink/80">
                {service.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
