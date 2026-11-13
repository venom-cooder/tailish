import type { Metadata } from "next";
import { PortalShell } from "@/components/portal/portal-shell";

export const metadata: Metadata = {
  title: { default: "Your account", template: "%s · Tailish" },
  // The portal is personal; keep it out of search results entirely.
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell>{children}</PortalShell>;
}
