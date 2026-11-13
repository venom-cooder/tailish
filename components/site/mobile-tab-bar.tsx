"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, IdCard, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { WhatsAppGlyph } from "@/components/whatsapp/whatsapp-button";
import { getWhatsAppLink, whatsappMessageForPath } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

interface Tab {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Extra routes that should light this tab up. */
  match?: string[];
}

// Four tabs, not five: Shop and You pointed at a storefront and a portal that
// are parked, and Care at a vet-care section that is too. Everything here
// resolves to a page that exists.
const TABS: Tab[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "How it works", href: "/how-it-works", icon: Sparkles },
  { label: "Passport", href: "/health-passport", icon: IdCard },
  { label: "Guides", href: "/guides", icon: BookOpen },
];

/** The bar's own height plus its inset — pages reserve this much bottom room. */
export const MOBILE_TAB_BAR_SPACER = "pb-[6.5rem] lg:pb-0";

/**
 * Fixed bottom tab bar, mobile only.
 *
 * App-style primary navigation: the five destinations that carry most traffic
 * stay one thumb-tap away on every page, with WhatsApp parked in the corner as
 * a sixth. The header's hamburger still opens the full menu for the long tail
 * of routes this bar deliberately leaves out.
 */
export function MobileTabBar() {
  const pathname = usePathname() ?? "/";

  const isActive = (tab: Tab) => {
    const routes = [tab.href, ...(tab.match ?? [])];
    return routes.some((route) =>
      route === "/" ? pathname === "/" : pathname === route || pathname.startsWith(`${route}/`),
    );
  };

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 lg:hidden print:hidden",
        // Keeps the bar clear of the iPhone home indicator.
        "pb-[max(0.75rem,env(safe-area-inset-bottom))] px-3",
      )}
    >
      <div className="flex items-center gap-2">
        <nav
          aria-label="Primary"
          className="flex flex-1 items-center justify-around rounded-2xl border border-white/10 bg-brand-900 px-1 py-1.5 shadow-lift backdrop-blur-xl"
        >
          {TABS.map((tab) => {
            const active = isActive(tab);

            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-1.5",
                  "transition-colors duration-200",
                  active ? "text-white" : "text-white/55 active:text-white/80",
                )}
              >
                <span
                  className={cn(
                    "relative grid size-8 place-items-center rounded-lg transition-all duration-200",
                    active ? "bg-white/15" : "bg-transparent",
                  )}
                >
                  <tab.icon className="size-[1.1rem]" aria-hidden="true" />
                </span>
                <span className="w-full truncate text-center text-[0.65rem] font-medium leading-tight">
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <a
          href={getWhatsAppLink({ text: whatsappMessageForPath(pathname) })}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Tailish on WhatsApp — opens in a new tab"
          className="flex shrink-0 flex-col items-center gap-0.5 rounded-2xl border border-white/10 bg-brand-900 px-3 py-1.5 shadow-lift backdrop-blur-xl transition-transform active:scale-95"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-whatsapp text-white">
            <WhatsAppGlyph className="size-[1.1rem]" />
          </span>
          <span className="text-[0.65rem] font-medium leading-tight text-white">Ask</span>
        </a>
      </div>
    </div>
  );
}
