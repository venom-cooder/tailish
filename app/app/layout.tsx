import type { Metadata } from "next";
import { PortalShell } from "@/components/portal/portal-shell";

export const metadata: Metadata = {
  title: { default: "Your account", template: "%s · Tailish" },
  // The portal is personal; keep it out of search results entirely.
  robots: { index: false, follow: false },
};

/**
 * The portal shell highlights the active nav item from the current route, so
 * it genuinely depends on runtime URL data. Unlike the marketing pages there's
 * nothing to gain from an instant static shell here: every screen is
 * authenticated, noindex, and renders account data fetched after mount.
 */
export const instant = false;

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell>{children}</PortalShell>;
}
