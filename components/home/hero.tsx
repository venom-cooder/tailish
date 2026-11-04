import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Home, ShieldCheck, Video, Zap } from "lucide-react";
import { PawGlyph } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/section";
import { CareFinder } from "@/components/home/care-finder";
import { cn } from "@/lib/utils";

const trustMarks = [
  { icon: Zap, label: "Rapid Care", detail: "30–120 mins*" },
  { icon: Home, label: "Vet at Home", detail: "in Indore" },
  { icon: ShieldCheck, label: "Verified Vets", detail: "& partners" },
  { icon: Heart, label: "All Records", detail: "in one place" },
];

const petTypes = [
  { label: "Dogs", src: "/images/pet-types/dog.svg", href: "/shop/dog-food" },
  { label: "Cats", src: "/images/pet-types/cat.svg", href: "/shop/cat-food" },
  { label: "Rabbits", src: "/images/pet-types/rabbit.svg", href: "/vet-care" },
  { label: "Birds", src: "/images/pet-types/bird.svg", href: "/vet-care" },
  { label: "Small pets", src: "/images/pet-types/small.svg", href: "/vet-care" },
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-cream">
      {/* Full-bleed scene, desktop only. Narrow screens get the same artwork as
          a contained banner further down instead: at 375px there is no column
          wide enough to hold both the headline and the pets without the text
          landing on top of them. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 hidden lg:block">
        <Image
          src="/images/hero-home.svg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[60%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/70 via-30% to-transparent" />
      </div>

      <Container className="relative pb-8 pt-7 sm:pt-10 lg:pb-12 lg:pt-16">
        <div className="grid items-start gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_25rem] lg:gap-10 xl:gap-16">
          <div className="max-w-xl lg:pt-6">
            <span className="inline-flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-brand-600 sm:text-xs">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-accent-500" />
              </span>
              Indore&apos;s Guided Pet-Care Network
            </span>

            <h1 className="mt-4 font-display text-[2.125rem] font-bold leading-[1.05] tracking-[-0.02em] text-brand-900 sm:mt-5 sm:text-[3.25rem] lg:text-[3.75rem]">
              Expert care
              <span className="block font-serif italic text-gold-500">for every tail</span>
              in your life.
            </h1>

            <p className="mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-muted sm:mt-5 sm:text-base">
              From everyday questions to expert veterinary care, we&apos;re with you at every step —
              at home, in clinic, and beyond.
            </p>

            <div className="mt-6 flex flex-col gap-2.5 sm:mt-7 sm:flex-row sm:gap-3">
              <Button asChild size="lg" variant="brand" className="rounded-2xl">
                <Link href="/vet-care/book-visit">
                  <PawGlyph className="size-5" aria-hidden="true" />
                  Request Pet Care
                  <ArrowRight className="size-4.5" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-2xl bg-white/90">
                <Link href="/vet-care/video-consult">
                  <Video className="size-5" aria-hidden="true" />
                  Talk to a Vet Online
                </Link>
              </Button>
            </div>

            {/* Mobile stand-in for the desktop full-bleed scene. */}
            <div className="relative mt-6 aspect-[16/11] overflow-hidden rounded-3xl shadow-soft lg:hidden">
              <Image
                src="/images/hero-home.svg"
                alt="A golden retriever and a tabby cat resting together at home"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 0px"
                className="object-cover object-[78%_center]"
              />
            </div>

            <ul className="mt-6 grid grid-cols-2 gap-x-5 gap-y-3.5 sm:mt-8 sm:grid-cols-4 lg:gap-x-5">
              {trustMarks.map((mark) => (
                <li key={mark.label} className="flex items-start gap-2">
                  <mark.icon
                    className="mt-0.5 size-4.5 shrink-0 text-brand-600"
                    aria-hidden="true"
                  />
                  <span className="min-w-0">
                    <span className="block text-[0.8125rem] font-semibold leading-tight text-ink">
                      {mark.label}
                    </span>
                    <span className="block text-xs leading-tight text-muted">{mark.detail}</span>
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-[0.6875rem] leading-relaxed text-muted/80">
              *Typical in-zone window. Exact arrival is confirmed after the case is reviewed.
            </p>
          </div>

          <CareFinder className="lg:mt-2" />
        </div>

        {/* Species row. Sits below both columns so it reads as a shelf under the
            whole hero, the way it does in the reference layout. */}
        <nav
          aria-label="Browse by pet"
          className={cn(
            "mt-7 rounded-3xl border border-white/70 bg-white/80 p-2 shadow-soft backdrop-blur-xl sm:p-3",
            "lg:mt-10 lg:ml-auto lg:w-fit",
          )}
        >
          {/* Sized so all five fit a 375px screen without scrolling — a row
              that clips its last item reads as broken rather than scrollable. */}
          <ul className="grid grid-cols-5 gap-0.5 sm:flex sm:justify-center sm:gap-2">
            {petTypes.map((pet) => (
              <li key={pet.label} className="min-w-0">
                <Link
                  href={pet.href}
                  className="group flex flex-col items-center gap-1.5 rounded-2xl px-0.5 py-2 transition-colors hover:bg-brand-50 sm:w-24 sm:gap-2"
                >
                  <span className="relative size-11 shrink-0 overflow-hidden rounded-full ring-2 ring-white transition-transform duration-300 group-hover:scale-105 sm:size-16">
                    <Image src={pet.src} alt="" fill sizes="64px" className="object-cover" />
                  </span>
                  <span className="w-full truncate text-center text-[0.625rem] font-medium text-ink/85 sm:text-xs">
                    {pet.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </section>
  );
}
