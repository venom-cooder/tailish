import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  CalendarCheck,
  FlaskConical,
  Heart,
  Home,
  IdCard,
  MapPin,
  PawPrint,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  Syringe,
  Video,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
  badge?: string;
}

export const vetCareNav: NavItem[] = [
  {
    label: "Book a Vet Visit",
    href: "/vet-care/book-visit",
    description: "Tell us the concern — we match the right vet and slot.",
    icon: CalendarCheck,
    badge: "Most used",
  },
  {
    label: "Home Visit",
    href: "/vet-care/home-visit",
    description: "A registered vet at your door, from ₹899.",
    icon: Home,
  },
  {
    label: "Video Consult",
    href: "/vet-care/video-consult",
    description: "Talk to a vet in minutes, from ₹299.",
    icon: Video,
  },
  {
    label: "Vaccination",
    href: "/vet-care/vaccination",
    description: "Cold-chain vaccines, tracked and reminded.",
    icon: Syringe,
  },
  {
    label: "Diagnostics",
    href: "/vet-care/diagnostics",
    description: "Home sample collection, reports in the passport.",
    icon: FlaskConical,
  },
];

export const vetCareSecondary: NavItem[] = [
  { label: "All vet care services", href: "/vet-care", icon: Stethoscope },
  { label: "How Tailish works", href: "/how-it-works", icon: Sparkles },
  { label: "Plans & CarePass", href: "/pricing", icon: ShieldCheck },
];

export const shopNav: NavItem[] = [
  { label: "Dog Food", href: "/shop/dog-food", icon: PawPrint },
  { label: "Cat Food", href: "/shop/cat-food", icon: PawPrint },
  { label: "Treats & Chews", href: "/shop/treats", icon: Heart },
  { label: "Health & Supplements", href: "/shop/health-supplements", icon: Stethoscope },
  { label: "Parasite Control", href: "/shop/parasite-control", icon: ShieldCheck },
  { label: "Grooming", href: "/shop/grooming", icon: Sparkles },
  { label: "Toys & Enrichment", href: "/shop/toys-enrichment", icon: Heart },
  { label: "Walk & Accessories", href: "/shop/accessories", icon: ShoppingBag },
];

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
    description: "Vet-reviewed answers to the questions parents ask most.",
    icon: BookOpen,
  },
  {
    label: "Vets near you",
    href: "/nearby",
    description: "Clinics, hospitals and emergency care around Indore.",
    icon: MapPin,
  },
  {
    label: "Plans & CarePass",
    href: "/pricing",
    description: "Membership that covers the year's routine care.",
    icon: ShieldCheck,
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
    title: "Vet care",
    items: [
      { label: "Book a vet visit", href: "/vet-care/book-visit" },
      { label: "Home visit", href: "/vet-care/home-visit" },
      { label: "Video consult", href: "/vet-care/video-consult" },
      { label: "Vaccination", href: "/vet-care/vaccination" },
      { label: "Diagnostics", href: "/vet-care/diagnostics" },
      { label: "Emergency vets nearby", href: "/nearby?type=emergency" },
    ],
  },
  {
    title: "Shop",
    items: [
      { label: "All products", href: "/shop" },
      { label: "Dog food", href: "/shop/dog-food" },
      { label: "Cat food", href: "/shop/cat-food" },
      { label: "Health & supplements", href: "/shop/health-supplements" },
      { label: "Parasite control", href: "/shop/parasite-control" },
      { label: "Your cart", href: "/cart" },
    ],
  },
  {
    title: "Learn",
    items: [
      { label: "How Tailish works", href: "/how-it-works" },
      { label: "Health Passport", href: "/health-passport" },
      { label: "Care guides", href: "/guides" },
      { label: "Plans & CarePass", href: "/pricing" },
      { label: "Find vets near you", href: "/nearby" },
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

export const portalNav: NavItem[] = [
  { label: "Dashboard", href: "/app", icon: Home },
  { label: "My pets", href: "/app/pets", icon: PawPrint },
  { label: "Ask Tailish", href: "/app/ask", icon: Sparkles },
  { label: "Care & bookings", href: "/app/care", icon: Stethoscope },
  { label: "Orders", href: "/app/orders", icon: ShoppingBag },
  { label: "Addresses", href: "/app/addresses", icon: MapPin },
  { label: "Family & sharing", href: "/app/family", icon: Heart },
  { label: "Notifications", href: "/app/notifications", icon: IdCard },
  { label: "Profile & privacy", href: "/app/profile", icon: ShieldCheck },
];
