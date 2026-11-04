import { AnnouncementBar } from "@/components/site/announcement-bar";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { MobileTabBar } from "@/components/site/mobile-tab-bar";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <AnnouncementBar />
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      {/* SiteFooter reserves its own room for the tab bar — see the note on
          its Container — so nothing extra is needed around it here. */}
      <SiteFooter />
      {/* Not wrapped in <Suspense>: SiteHeader reads usePathname() the same way
          without one, and a postponed boundary here leaves the bar parked in
          React's hidden streaming holder and never shown. */}
      <MobileTabBar />
    </div>
  );
}
