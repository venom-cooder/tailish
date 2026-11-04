import type { Metadata } from "next";
import { Lock } from "lucide-react";
import { Container, Section } from "@/components/shared/section";
import { PageHero } from "@/components/shared/page-hero";
import { Prose } from "@/components/shared/prose";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "What Tailish collects, why, who can see your pet's health records, and how to export or delete everything.",
  alternates: { canonical: "/privacy" },
};

const LAST_UPDATED = "1 October 2026";

const body = `Tailish Pet Care Private Limited ("Tailish", "we") operates tailish.in and the Tailish WhatsApp service. This policy explains what we collect, why, and what control you have. It is written to be read, not to be survived.

## What we collect

- **Account details** — your name, mobile number, email address and delivery addresses.
- **Pet records** — the information you or your veterinarian enter about your pets: species, breed, age, weight, vaccinations, conditions, medications, and documents you upload.
- **Service records** — bookings, visit summaries written by veterinarians, orders and payments.
- **Conversations** — messages you send to Ask Tailish or the care desk, including on WhatsApp.
- **Technical data** — device type, browser, IP address and pages visited, used to keep the service working and secure.

We do not collect your location continuously. Where a feature needs location — finding nearby vets, for instance — it asks at the moment it needs it, and you can decline and type an area instead.

## Why we collect it

- To provide the care you ask for, and to give the attending veterinarian the history they need.
- To send reminders you have asked for, on the channels you have chosen.
- To fulfil and deliver shop orders.
- To improve the service, using aggregated data that does not identify you or your pet.
- To meet legal and regulatory obligations, including records veterinarians are required to keep.

We do not sell your personal information. We do not share your pet's health records with advertisers, insurers or data brokers.

## Who can see your pet's records

By default, only you. Beyond that, access happens in three ways, all of which you control:

1. **The attending veterinarian.** When you book, the vet seeing your pet can view that pet's passport. Their access ends with the episode of care.
2. **Delegates you invite.** Family members, caretakers or your own vet, with exactly the permissions you grant — viewing the passport, booking visits, or both.
3. **Share links you create.** A read-only link and QR code covering the sections you choose. Links expire — seven days unless you change it — and you can revoke any link instantly.

Our care desk can access records when you ask for help, and that access is logged.

## How we protect it

Data is encrypted in transit using TLS and encrypted at rest. Access by Tailish staff is role-based, logged and limited to what the role requires. Payment card details never touch our servers — payments are processed by Razorpay, who are PCI-DSS compliant.

No system is perfect. If a breach affects your data, we will tell you and the relevant authority, promptly and specifically, rather than burying it in a notice.

## WhatsApp

When you use Tailish on WhatsApp, your messages travel through WhatsApp's infrastructure and are subject to their privacy terms as well as ours. We receive the message content and your WhatsApp number, and we store conversations as part of your service record. You can ask us to delete a conversation at any time.

## How long we keep it

- **Clinical records** are retained for the period required of veterinary records, currently three years after the last episode of care, and longer where a specific legal requirement applies.
- **Order and payment records** are retained for eight years, as tax law requires.
- **Conversations and technical logs** are retained for twelve months.
- **Everything else** is deleted within thirty days of you closing your account.

## Your rights

You can, at any time:

- **Access and export** everything we hold, including a PDF of your pet's full Health Passport.
- **Correct** anything inaccurate — and tell us when a record's provenance is wrong.
- **Delete** your account and its data, subject to the clinical and tax retention periods above.
- **Withdraw consent** for reminders, marketing or any optional processing, without losing access to care.
- **Object or complain**, to us first and to the relevant data protection authority if we don't resolve it.

Write to ${siteConfig.email} and we will respond within thirty days, usually much sooner.

## Children

Tailish is not directed at children under 18, and we do not knowingly create accounts for them.

## Changes

We will post changes here and, where they materially affect you, tell you directly before they take effect. The date at the top of this page always reflects the current version.

## Contact

Tailish Pet Care Private Limited
${siteConfig.address}
${siteConfig.email} · ${siteConfig.phone}`;

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        eyebrowIcon={Lock}
        crumbs={[{ label: "Privacy" }]}
        title="Privacy policy"
        description={`Last updated ${LAST_UPDATED}`}
      />

      <Section className="py-14">
        <Container size="narrow">
          <Prose body={body} />
        </Container>
      </Section>
    </>
  );
}
