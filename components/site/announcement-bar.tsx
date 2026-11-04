import Link from "next/link";
import { CircleHelp, MapPin, Truck } from "lucide-react";
import { Container } from "@/components/shared/section";
import { siteConfig } from "@/lib/config";

const links = [
  { label: "Track request", href: "/app/care", icon: Truck },
  { label: "Help", href: "/contact", icon: CircleHelp },
];

/**
 * Thin utility strip above the header.
 *
 * Carries the service-area claim — the single most useful thing a first-time
 * visitor from search can learn — plus the two errands people arrive with
 * already in mind, which would otherwise compete for room in the main nav.
 */
export function AnnouncementBar() {
  return (
    <div className="bg-brand-900 text-white/80">
      <Container className="flex h-10 items-center justify-between gap-4 text-xs">
        <p className="flex min-w-0 items-center gap-1.5">
          <MapPin className="size-3.5 shrink-0 text-gold-400" aria-hidden="true" />
          <span className="truncate">{siteConfig.city}&apos;s Guided Pet-Care Network</span>
        </p>

        <nav aria-label="Utility" className="flex shrink-0 items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 transition-colors hover:bg-white/10 hover:text-white"
            >
              <link.icon className="size-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">{link.label}</span>
            </Link>
          ))}
        </nav>
      </Container>
    </div>
  );
}
