import Link from "next/link";
import { ArrowLeft, BookOpen, MapPin, Search, ShoppingBag } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/section";

const suggestions = [
  { icon: ShoppingBag, label: "Shop", href: "/shop" },
  { icon: BookOpen, label: "Care guides", href: "/guides" },
  { icon: MapPin, label: "Vets nearby", href: "/nearby" },
  { icon: Search, label: "Health Passport", href: "/health-passport" },
];

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col bg-gradient-to-b from-brand-50/70 to-white">
      <header className="border-b border-hairline bg-white/60">
        <Container className="flex h-18 items-center">
          <Link href="/" aria-label="Tailish — home" className="rounded-xl">
            <Logo className="text-[1rem]" />
          </Link>
        </Container>
      </header>

      <main id="main" className="flex flex-1 items-center py-16">
        <Container size="narrow" className="text-center">
          <p className="font-display text-7xl font-bold text-brand-200 sm:text-8xl">404</p>

          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
            This page has wandered off.
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted">
            The link may be old, or the page may have moved. Nothing to worry about — here are a few
            places that definitely exist.
          </p>

          <ul className="mx-auto mt-10 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
            {suggestions.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex h-full flex-col items-center gap-2.5 rounded-2xl border border-hairline bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
                >
                  <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-700 group-hover:text-white">
                    <item.icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-medium text-ink">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/">
                <ArrowLeft className="size-5" aria-hidden="true" />
                Back to home
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact">Tell us what broke</Link>
            </Button>
          </div>
        </Container>
      </main>
    </div>
  );
}
