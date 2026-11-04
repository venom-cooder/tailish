"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, LogOut, Menu, RotateCcw, ShoppingBag, X } from "lucide-react";
import { LogoLink } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "@/components/providers/session-provider";
import { useCart } from "@/components/providers/cart-provider";
import { WhatsAppGlyph } from "@/components/whatsapp/whatsapp-button";
import { portalNav } from "@/components/site/nav-data";
import { MobileTabBar, MOBILE_TAB_BAR_SPACER } from "@/components/site/mobile-tab-bar";
import { getWhatsAppLink, whatsappMessages } from "@/lib/whatsapp";
import { resetState } from "@/lib/mock/store";
import { USE_REAL_API } from "@/lib/config";
import { cn, initials } from "@/lib/utils";

/**
 * Chrome for the authenticated pet-parent portal.
 *
 * Deliberately distinct from the marketing header: a persistent sidebar,
 * no sales navigation, and the account always one click away.
 */
export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/app";
  const { parent, authenticated, loading, signOut } = useSession();
  const { cart, setOpen: setCartOpen } = useCart();
  // Recording the route the menu was opened on makes navigation close it
  // automatically, without an effect that writes state on every path change.
  const [openedOnPath, setOpenedOnPath] = React.useState<string | null>(null);
  const mobileOpen = openedOnPath === pathname;
  const setMobileOpen = (open: boolean) => setOpenedOnPath(open ? pathname : null);

  const isActive = (href: string) =>
    href === "/app" ? pathname === "/app" : pathname.startsWith(href);

  const nav = (
    <nav aria-label="Account" className="space-y-0.5">
      {portalNav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isActive(item.href) ? "page" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition-colors",
            isActive(item.href)
              ? "bg-brand-700 text-white"
              : "text-ink/75 hover:bg-brand-50 hover:text-brand-800",
          )}
        >
          {item.icon ? <item.icon className="size-4.5 shrink-0" aria-hidden="true" /> : null}
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-dvh flex-col bg-cream/60">
      <header className="sticky top-0 z-40 border-b border-hairline bg-white/92 backdrop-blur-lg">
        <div className="mx-auto flex h-18 max-w-7xl items-center gap-4 px-5 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="grid size-10 place-items-center rounded-xl text-ink transition-colors hover:bg-brand-50 lg:hidden"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>

          <LogoLink className="text-[1rem]" />

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <a
              href={getWhatsAppLink({ text: whatsappMessages.general })}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp — opens in a new tab"
              className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-ink/80 transition-colors hover:bg-whatsapp/10 hover:text-whatsapp-dark sm:inline-flex"
            >
              <WhatsAppGlyph className="size-4 text-whatsapp" />
              WhatsApp
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
              href="/app/profile"
              className="flex items-center gap-2.5 rounded-xl py-1 pl-1 pr-3 transition-colors hover:bg-brand-50"
            >
              <Avatar className="size-9">
                {parent?.photoUrl ? <AvatarImage src={parent.photoUrl} alt="" /> : null}
                <AvatarFallback>{parent ? initials(parent.name) : "TL"}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium text-ink sm:block">
                {loading ? "…" : (parent?.name.split(" ")[0] ?? "Guest")}
              </span>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-5 py-8 sm:px-6 lg:px-8">
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-28">
            {nav}

            <div className="mt-6 space-y-2 border-t border-hairline pt-6">
              <Link
                href="/"
                className="flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-brand-50 hover:text-brand-800"
              >
                <ArrowLeft className="size-4.5" aria-hidden="true" />
                Back to site
              </Link>

              {authenticated ? (
                <button
                  type="button"
                  onClick={() => void signOut()}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut className="size-4.5" aria-hidden="true" />
                  Sign out
                </button>
              ) : (
                <Button asChild size="sm" className="w-full">
                  <Link href="/login">Sign in</Link>
                </Button>
              )}

              {!USE_REAL_API ? <ResetDemoButton /> : null}
            </div>
          </div>
        </aside>

        {/* The bottom tab bar overlays this column on mobile, so the last card
            on a page needs room to clear it. */}
        <main id="main" className={cn("min-w-0 flex-1", MOBILE_TAB_BAR_SPACER)}>
          {children}
        </main>
      </div>

      {/* Carried into the portal too: "You" is one of the bar's own tabs, and a
          nav that disappears on the page it links to strands the visitor. */}
      <MobileTabBar />

      {mobileOpen ? (
        <div className="fixed inset-x-0 bottom-0 top-18 z-30 overflow-y-auto border-t border-hairline bg-white px-5 py-6 lg:hidden">
          {nav}
          <div className="mt-6 space-y-2 border-t border-hairline pt-6">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-brand-50"
            >
              <ArrowLeft className="size-4.5" aria-hidden="true" />
              Back to site
            </Link>
            {authenticated ? (
              <button
                type="button"
                onClick={() => void signOut()}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="size-4.5" aria-hidden="true" />
                Sign out
              </button>
            ) : (
              <Button asChild size="sm" className="w-full">
                <Link href="/login">Sign in</Link>
              </Button>
            )}
            {!USE_REAL_API ? <ResetDemoButton /> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Restores the mock dataset.
 *
 * Only rendered when no backend is configured — see USE_REAL_API in lib/config.
 */
function ResetDemoButton() {
  return (
    <button
      type="button"
      onClick={() => {
        resetState();
        window.location.reload();
      }}
      className="flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-xs font-medium text-muted/70 transition-colors hover:bg-brand-50 hover:text-brand-800"
    >
      <RotateCcw className="size-4" aria-hidden="true" />
      Reset demo data
    </button>
  );
}

/** Page title block used at the top of each portal screen. */
export function PortalHeader({
  title,
  description,
  backHref,
  children,
}: {
  title: string;
  description?: string;
  backHref?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {backHref ? (
          <Link
            href={backHref}
            className="mb-2 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-brand-700"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back
          </Link>
        ) : null}
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">{title}</h1>
        {description ? (
          <p className="mt-1.5 text-sm leading-relaxed text-muted">{description}</p>
        ) : null}
      </div>
      {children ? <div className="flex shrink-0 flex-wrap gap-2">{children}</div> : null}
    </header>
  );
}
