"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, ShoppingBag, User, X } from "lucide-react";
import { LogoLink, PawGlyph } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/components/providers/cart-provider";
import { WhatsAppGlyph } from "@/components/whatsapp/whatsapp-button";
import { getWhatsAppLink, whatsappMessages } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import {
  primaryNav,
  resourcesNav,
  shopNav,
  vetCareNav,
  vetCareSecondary,
  type NavItem,
} from "./nav-data";

/* ------------------------------------------------------------- dropdowns */

/**
 * Hover-and-focus dropdown.
 *
 * Opens on pointer hover for speed, and on keyboard focus so it is reachable
 * without a mouse. A short close delay stops the panel vanishing while the
 * pointer crosses the gap between trigger and panel.
 */
function NavDropdown({
  label,
  href,
  children,
  wide,
}: {
  label: string;
  href: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  };

  React.useEffect(() => cancelClose, []);

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
      onFocus={() => setOpen(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false);
      }}
    >
      <Link
        href={href}
        aria-expanded={open}
        aria-haspopup="true"
        className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-ink/80 transition-colors hover:text-brand-700"
      >
        {label}
        <ChevronDown
          className={cn("size-4 transition-transform duration-200", open && "rotate-180")}
          aria-hidden="true"
        />
      </Link>

      <div
        className={cn(
          "absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 transition-all duration-200",
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0",
        )}
      >
        <div
          className={cn(
            "overflow-hidden rounded-3xl border border-hairline bg-white p-2 shadow-lift",
            wide ? "w-[38rem]" : "w-80",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function DropdownItem({ item, compact }: { item: NavItem; compact?: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className="group flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-brand-50"
    >
      {Icon ? (
        <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-white">
          <Icon className="size-4.5" aria-hidden="true" />
        </span>
      ) : null}
      <span className="min-w-0">
        <span className="flex items-center gap-2 text-sm font-semibold text-ink">
          {item.label}
          {item.badge ? (
            <Badge variant="accent" className="px-2 py-0 text-[0.625rem]">
              {item.badge}
            </Badge>
          ) : null}
        </span>
        {!compact && item.description ? (
          <span className="mt-0.5 block text-xs leading-relaxed text-muted">{item.description}</span>
        ) : null}
      </span>
    </Link>
  );
}

/* ----------------------------------------------------------------- header */

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const { cart, setOpen: setCartOpen } = useCart();
  const [scrolled, setScrolled] = React.useState(false);

  // The menu records the route it was opened on, so navigating anywhere closes
  // it automatically — including via browser back — with no effect involved.
  const [openedOnPath, setOpenedOnPath] = React.useState<string | null>(null);
  const mobileOpen = openedOnPath === pathname;
  const setMobileOpen = React.useCallback(
    (open: boolean) => setOpenedOnPath(open ? pathname : null),
    [pathname],
  );

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Stop the page scrolling behind the open sheet.
  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "border-b border-hairline bg-cream/95 shadow-soft backdrop-blur-lg"
            : "border-b border-transparent bg-cream/70 backdrop-blur-sm",
        )}
      >
        {/* Mobile height is fixed at 4.5rem to match the menu sheet's offset;
            only the desktop bar shrinks on scroll. */}
        <div
          className={cn(
            "mx-auto flex h-18 max-w-7xl items-center gap-4 px-5 transition-[height] duration-300 sm:px-6 lg:px-8",
            scrolled ? "lg:h-[4.5rem]" : "lg:h-22",
          )}
        >
          {/* The tagline is dropped once the bar shrinks, so the wordmark keeps
              its vertical rhythm instead of crowding the reduced height. */}
          <LogoLink
            showTagline={!scrolled}
            className={cn("transition-all duration-300", scrolled ? "text-[1rem]" : "text-[1.1rem]")}
          />

          <nav aria-label="Main" className="ml-2 hidden items-center lg:flex">
            <NavDropdown label="Vet Care" href="/vet-care" wide>
              <div className="grid grid-cols-2 gap-1">
                {vetCareNav.map((item) => (
                  <DropdownItem key={item.href} item={item} />
                ))}
              </div>
              <div className="mt-1 flex flex-wrap gap-1 border-t border-hairline pt-2">
                {vetCareSecondary.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-xl px-3 py-2 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-50"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </NavDropdown>

            <NavDropdown label="Shop" href="/shop">
              <div className="grid grid-cols-1 gap-0.5">
                {shopNav.map((item) => (
                  <DropdownItem key={item.href} item={item} compact />
                ))}
              </div>
              <div className="mt-1 border-t border-hairline pt-2">
                <Link
                  href="/shop"
                  className="block rounded-xl px-3 py-2 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-50"
                >
                  Browse everything in the shop →
                </Link>
              </div>
            </NavDropdown>

            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive(item.href) ? "text-brand-700" : "text-ink/80 hover:text-brand-700",
                )}
              >
                {item.label}
              </Link>
            ))}

            <NavDropdown label="Resources" href="/guides">
              <div className="grid grid-cols-1 gap-0.5">
                {resourcesNav.map((item) => (
                  <DropdownItem key={item.href} item={item} compact />
                ))}
              </div>
            </NavDropdown>
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            {/* Icon-only: the label would crowd the bar, and the site-wide
                float plus the mobile tab bar both spell the action out. */}
            <a
              href={getWhatsAppLink({ text: whatsappMessages.general })}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp — opens in a new tab"
              className="hidden size-10 place-items-center rounded-xl text-whatsapp transition-colors hover:bg-whatsapp/10 lg:grid"
            >
              <WhatsAppGlyph className="size-5" />
            </a>

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Open cart — ${cart.itemCount} item${cart.itemCount === 1 ? "" : "s"}`}
              className="relative grid size-10 place-items-center rounded-xl text-ink/80 transition-colors hover:bg-brand-50 hover:text-brand-700"
            >
              <ShoppingBag className="size-5" aria-hidden="true" />
              {cart.itemCount > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-accent-500 px-1 text-[0.65rem] font-bold tabular text-white">
                  {cart.itemCount}
                </span>
              ) : null}
            </button>

            <Link
              href="/app"
              aria-label="Your account"
              className="hidden size-10 place-items-center rounded-xl text-ink/80 transition-colors hover:bg-brand-50 hover:text-brand-700 sm:grid"
            >
              <User className="size-5" aria-hidden="true" />
            </Link>

            <Button asChild size="md" variant="gold" className="hidden rounded-2xl sm:inline-flex">
              <Link href="/vet-care/book-visit">
                <PawGlyph className="size-4.5" aria-hidden="true" />
                Request Pet Care
              </Link>
            </Button>

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="grid size-10 place-items-center rounded-xl text-ink transition-colors hover:bg-brand-50 lg:hidden"
            >
              {mobileOpen ? (
                <X className="size-5" aria-hidden="true" />
              ) : (
                <Menu className="size-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

      </header>

      {/* Rendered as a sibling of <header>, not inside it: the header's
          backdrop-blur establishes a containing block for fixed-position
          descendants, which would collapse this panel to the header's height. */}
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

/* ------------------------------------------------------------ mobile menu */

function MobileSection({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <div>
      <p className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">{title}</p>
      <div className="mt-1.5 space-y-0.5">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[0.9375rem] font-medium text-ink transition-colors hover:bg-brand-50"
          >
            {item.icon ? <item.icon className="size-4.5 text-brand-500" aria-hidden="true" /> : null}
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 top-[4.5rem] z-40 overflow-y-auto border-t border-hairline bg-white lg:hidden">
      <div className="space-y-6 px-5 py-6">
        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <Link href="/vet-care/book-visit">Book a Vet Visit</Link>
          </Button>
          <Button
            asChild
            variant="whatsapp"
            size="icon"
            aria-label="Chat on WhatsApp — opens in a new tab"
          >
            <a
              href={getWhatsAppLink({ text: whatsappMessages.general })}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppGlyph className="size-5" />
            </a>
          </Button>
        </div>

        <MobileSection title="Vet care" items={[...vetCareNav, ...vetCareSecondary]} />
        <MobileSection title="Shop" items={[{ label: "All products", href: "/shop" }, ...shopNav]} />
        <MobileSection
          title="Explore"
          items={[
            ...primaryNav,
            { label: "About Tailish", href: "/about" },
            { label: "Contact", href: "/contact" },
          ]}
        />
        <MobileSection
          title="Your account"
          items={[
            { label: "Dashboard", href: "/app" },
            { label: "My pets", href: "/app/pets" },
            { label: "Orders", href: "/app/orders" },
            { label: "Sign in", href: "/login" },
          ]}
        />

        <button
          type="button"
          onClick={onClose}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-hairline py-3 text-sm font-medium text-muted transition-colors hover:bg-brand-50"
        >
          <X className="size-4" aria-hidden="true" />
          Close menu
        </button>
      </div>
    </div>
  );
}
