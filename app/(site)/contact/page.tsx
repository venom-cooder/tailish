import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/shared/section";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/forms/lead-forms";
import { WhatsAppButton } from "@/components/whatsapp/whatsapp-button";
import { WhatsAppQR } from "@/components/whatsapp/whatsapp-qr";
import { siteConfig } from "@/lib/config";
import { whatsappMessages } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact Tailish — talk to our care team",
  description: `Reach the Tailish care team on WhatsApp, by phone on ${siteConfig.phone}, or by email at ${siteConfig.email}. Support hours ${siteConfig.supportHours}.`,
  alternates: { canonical: "/contact" },
};

const channels = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    detail: "Fastest route to a person. Bookings, orders, records and care questions.",
    action: "Usually replies in minutes",
  },
  {
    icon: Phone,
    title: siteConfig.phone,
    detail: "Call the care desk if you'd rather talk it through.",
    action: siteConfig.supportHours,
    href: `tel:${siteConfig.phone.replace(/\s/g, "")}`,
  },
  {
    icon: Mail,
    title: siteConfig.email,
    detail: "For anything that isn't urgent — billing, partnerships, feedback.",
    action: "Replies within one working day",
    href: `mailto:${siteConfig.email}`,
  },
  {
    icon: MapPin,
    title: "Our office",
    detail: siteConfig.address,
    action: "By appointment — we're a home-visit service, not a walk-in clinic",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        eyebrowIcon={MessageCircle}
        crumbs={[{ label: "Contact" }]}
        title="Talk to our care team."
        description={`Whatever it's about — a booking, an order, your pet's records, or something that went wrong — there's a person on the other end. Support hours are ${siteConfig.supportHours}.`}
      />

      <Section className="pt-12 sm:pt-14">
        <Container>
          <Reveal className="mb-10 flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50/70 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-red-600" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-red-900">
                  If your pet needs help right now, don&apos;t use this form.
                </p>
                <p className="mt-0.5 text-sm leading-relaxed text-red-800/80">
                  Go to a 24-hour emergency hospital. We keep a verified list with live phone
                  numbers.
                </p>
              </div>
            </div>
            <Button asChild variant="danger" className="shrink-0">
              <Link href="/nearby?type=emergency">Emergency vets near you</Link>
            </Button>
          </Reveal>

          <div className="grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
            <Reveal>
              <h2 className="font-display text-2xl font-bold text-ink">Send us a message</h2>
              <p className="mt-2 text-sm text-muted">
                Fill this in and we&apos;ll get back to you. For anything time-sensitive, WhatsApp is
                quicker.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </Reveal>

            <Reveal delayMs={120} className="space-y-8">
              <div className="rounded-3xl border border-hairline bg-brand-50/50 p-7 text-center">
                <WhatsAppQR
                  size={180}
                  text={whatsappMessages.contact}
                  caption="Scan to chat with Tailish on WhatsApp"
                />
                <div className="mt-6">
                  <WhatsAppButton
                    className="w-full"
                    text={whatsappMessages.contact}
                    label="Open WhatsApp"
                  />
                </div>
              </div>

              <ul className="space-y-3">
                {channels.map((channel) => {
                  const content = (
                    <>
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                        <channel.icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-ink">{channel.title}</span>
                        <span className="mt-0.5 block text-sm leading-relaxed text-muted">
                          {channel.detail}
                        </span>
                        <span className="mt-1.5 flex items-center gap-1.5 text-xs text-brand-600">
                          <Clock className="size-3.5" aria-hidden="true" />
                          {channel.action}
                        </span>
                      </span>
                    </>
                  );

                  return (
                    <li key={channel.title}>
                      {channel.href ? (
                        <a
                          href={channel.href}
                          className="flex gap-4 rounded-2xl border border-hairline bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lift"
                        >
                          {content}
                        </a>
                      ) : (
                        <div className="flex gap-4 rounded-2xl border border-hairline bg-white p-5 shadow-soft">
                          {content}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}
