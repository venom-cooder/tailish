import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Sora } from "next/font/google";
import { CartProvider } from "@/components/providers/cart-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import { CartDrawer } from "@/components/shop/cart-drawer";
import { WhatsAppFloat } from "@/components/whatsapp/whatsapp-float";
import { siteConfig } from "@/lib/config";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

// Used only for the italic accent line in display headings — the warm, high
// contrast counterpoint to Sora that the brand layout leans on.
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Tailish — Guided vet care for happier, healthier pets",
    template: "%s · Tailish",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "vet at home",
    "pet care India",
    "dog vaccination Indore",
    "cat vet near me",
    "pet health records",
    "online vet consultation",
    "pet health passport",
  ],
  authors: [{ name: "Tailish" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "Tailish — Guided vet care for happier, healthier pets",
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Tailish — Guided vet care for happier, healthier pets",
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "/" },
  category: "Pet care",
};

export const viewport: Viewport = {
  themeColor: "#0F3F44",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // `data-scroll-behavior` is required from Next 16 on: the router no longer
    // overrides a global `scroll-behavior: smooth` during navigation, so
    // without it every route change animates from the old scroll position
    // instead of landing at the top of the new page.
    <html
      lang="en-IN"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${sora.variable} ${playfair.variable}`}
    >
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only z-100 focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:rounded-xl focus:bg-brand-900 focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-white"
        >
          Skip to content
        </a>

        <SessionProvider>
          <CartProvider>
            {children}
            <CartDrawer />
            {/* Deliberately not inside <Suspense>: the float reads the current
                route for its prefilled message, and wrapping it postponed the
                boundary so React left the button parked in its hidden
                streaming holder — invisible on every statically rendered
                page. Reading usePathname() needs no boundary here. */}
            <WhatsAppFloat />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
