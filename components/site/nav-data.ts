import type { LucideIcon } from "lucide-react";
import { BookOpen, CalendarCheck, Heart, IdCard, Sparkles } from "lucide-react";

/**
 * Navigation for the live site.
 *
 * Only routes that exist appear here. The vet-care, shop, pricing, nearby and
 * portal menus were removed with the pages they pointed at — see parked/ for
 * why, and restore their entries alongside the routes themselves. The vet-care
 * dropdown also quoted prices ("from ₹899", "from ₹299") that were never
 * confirmed, so those go back only with real ones.
 */

export interface NavItem {
  label: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
  badge?: string;
}

/** Rendered as flat links in the header bar. Kept short so nothing wraps. */
export const primaryNav: NavItem[] = [
  { label: "Health Passport", href: "/health-passport", icon: IdCard },
];

/** The long tail, collected behind one "Resources" dropdown. */
export const resourcesNav: NavItem[] = [
  {
    label: "How Tailish works",
    href: "/how-it-works",
    description: "From first message to follow-up, step by step.",
    icon: Sparkles,
  },
  {
    label: "Care guides",
    href: "/guides",
    description: "Practical answers to the questions pet parents ask most.",
    icon: BookOpen,
  },
  {
    label: "About Tailish",
    href: "/about",
    description: "Who we are and the standard we hold ourselves to.",
    icon: Heart,
  },
  {
    label: "Contact",
    href: "/contact",
    description: "Reach the care team however suits you.",
    icon: CalendarCheck,
  },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Learn",
    items: [
      { label: "How Tailish works", href: "/how-it-works" },
      { label: "Health Passport", href: "/health-passport" },
      { label: "Care guides", href: "/guides" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About Tailish", href: "/about" },
      { label: "Contact us", href: "/contact" },
      { label: "Partner with us", href: "/about#partners" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of service", href: "/terms" },
    ],
  },
];
