"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, IdCard, ShoppingBag, Stethoscope, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
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

const TABS: Tab[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Care", href: "/vet-care", icon: Stethoscope, match: ["/how-it-works", "/nearby"] },
  { label: "Shop", href: "/shop", icon: ShoppingBag, match: ["/cart", "/checkout"] },
  { label: "Passport", href: "/health-passport", icon: IdCard, match: ["/guides"] },
  { label: "You", href: "/app", icon: User, match: ["/login"] },
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
  const { cart } = useCart();

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
            const showCount = tab.href === "/shop" && cart.itemCount > 0;

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
                  {showCount ? (
                    <span className="absolute -right-1 -top-0.5 grid min-w-4 place-items-center rounded-full bg-accent-500 px-1 text-[0.6rem] font-bold tabular leading-4 text-white">
                      {cart.itemCount}
                    </span>
                  ) : null}
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
