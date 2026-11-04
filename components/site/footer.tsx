import Link from "next/link";
import { Lock, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "@/components/brand/social-icons";
import { Container } from "@/components/shared/section";
import { WhatsAppQRMini } from "@/components/whatsapp/whatsapp-qr";
import { WhatsAppLink } from "@/components/whatsapp/whatsapp-button";
import { siteConfig } from "@/lib/config";
import { whatsappMessages } from "@/lib/whatsapp";
import { footerNav } from "./nav-data";

const COPYRIGHT_YEAR = 2026;

const socials = [
  { label: "Instagram", href: siteConfig.social.instagram, icon: InstagramIcon },
  { label: "Facebook", href: siteConfig.social.facebook, icon: FacebookIcon },
  { label: "YouTube", href: siteConfig.social.youtube, icon: YoutubeIcon },
  { label: "LinkedIn", href: siteConfig.social.linkedin, icon: LinkedinIcon },
];

export function SiteFooter() {
  return (
    <footer className="paw-field bg-brand-900 text-white/70">
      {/* The extra bottom padding is inside the footer, not around it, so the
          deep-teal background still runs to the screen edge behind the mobile
          tab bar while the copyright line clears it. */}
      <Container className="pb-32 pt-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)]">
          <div>
            <Logo tone="light" showTagline className="text-[1.15rem]" />

            <p className="mt-5 max-w-sm text-sm leading-relaxed">
              Guided vet care for dogs and cats — home visits, video consults, vaccinations and a
              Health Passport that follows your pet everywhere. Built in {siteConfig.city}, for
              Indian pet parents.
            </p>

            <div className="mt-6 space-y-2.5 text-sm">
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2.5 transition-colors hover:text-white"
              >
                <Phone className="size-4 shrink-0 text-brand-300" aria-hidden="true" />
                {siteConfig.phone}
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-2.5 transition-colors hover:text-white"
              >
                <Mail className="size-4 shrink-0 text-brand-300" aria-hidden="true" />
                {siteConfig.email}
              </a>
              <p className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-300" aria-hidden="true" />
                {siteConfig.address}
              </p>
              <WhatsAppLink
                text={whatsappMessages.general}
                label="Chat on WhatsApp"
                className="text-white/70 hover:text-whatsapp"
              />
            </div>

            <WhatsAppQRMini text={whatsappMessages.general} className="mt-7" />
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerNav.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h2 className="text-sm font-semibold text-white">{group.title}</h2>
                <ul className="mt-4 space-y-2.5">
                  {group.items.map((item) => (
                    <li key={`${group.title}-${item.href}`}>
                      <Link
                        href={item.href}
                        className="text-sm transition-colors hover:text-white hover:underline underline-offset-4"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2.5 text-xs leading-relaxed sm:max-w-xl">
            <Lock className="mt-0.5 size-4 shrink-0 text-brand-300" aria-hidden="true" />
            Your pet&apos;s health records are encrypted in transit and at rest. Nothing is shared
            without a link you create, and every shared link expires. Tailish provides guided care
            and never replaces an in-person veterinary examination.
          </p>

          <ul className="flex items-center gap-2">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Tailish on ${social.label}`}
                  className="grid size-10 place-items-center rounded-xl border border-white/15 transition-all hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10 hover:text-white"
                >
                  <social.icon className="size-4" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-7 flex flex-col gap-3 border-t border-white/10 pt-7 text-xs sm:flex-row sm:items-center sm:justify-between">
          {/* A literal year, not `new Date()`: a clock read during prerender
              fails the Cache Components build and desyncs hydration. */}
          <p>© {COPYRIGHT_YEAR} Tailish Pet Care Private Limited. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/privacy" className="transition-colors hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms
            </Link>
            <Link href="/contact" className="transition-colors hover:text-white">
              Contact
            </Link>
            <span>Made with care in {siteConfig.city}</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
