import type { Metadata } from "next";
import { Scale } from "lucide-react";
import { Container, Section } from "@/components/shared/section";
import { PageHero } from "@/components/shared/page-hero";
import { Prose } from "@/components/shared/prose";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Terms of service",
  description:
    "The terms governing use of Tailish — what we provide, what we don't, cancellations, shop orders, and the limits of our liability.",
  alternates: { canonical: "/terms" },
};

const LAST_UPDATED = "1 October 2026";

const body = `These terms govern your use of tailish.in, the Tailish portal and the Tailish WhatsApp service, all operated by Tailish Pet Care Private Limited. By using any of them, you agree to what follows.

## What Tailish is, and isn't

Tailish is a platform that connects pet parents with independently registered veterinarians, maintains health records, and sells pet products. **Tailish does not itself practise veterinary medicine.** Veterinarians on the platform exercise their own clinical judgement and are responsible for the care they provide.

Nothing on this site, in the portal, or in Ask Tailish constitutes a diagnosis or a substitute for an in-person veterinary examination. Guidance is general in nature. Clinical decisions about your pet belong to a veterinarian who has examined them.

**In an emergency, go directly to a veterinary hospital.** Do not wait for a response from Tailish.

## Your account

- You must be 18 or older to hold an account.
- The information you give us about yourself and your pets must be accurate. Clinical decisions get made on the basis of it.
- You are responsible for activity on your account, and for who you grant delegate access to.
- Tell us promptly if you believe your account has been accessed without your permission.

## Bookings, payments and cancellations

- Prices are shown before you confirm. Anything additional during a visit is quoted and agreed before it happens.
- Payment is collected through Razorpay. We do not store card details.
- **Cancel or reschedule free up to two hours before** a booked slot. Inside two hours, or where a vet has already travelled to you, a cancellation fee of up to 50% of the consultation fee may apply.
- If Tailish cancels a visit, you are refunded in full.
- Prescriptions are issued at the veterinarian's discretion. Some medicines legally require an in-person examination, and no vet on this platform will issue them without one.

## The Health Passport

Records in the Health Passport are provided for your benefit and your veterinarian's. Each record is labelled with its source. Records marked **parent entered** or **draft** have not been clinically verified, and should not be relied on as if they had been.

You own your pet's data. You can export it or delete it at any time, subject to the retention periods in our privacy policy.

Share links you create are your responsibility. Anyone holding a valid link can view the sections you shared until it expires or you revoke it.

## Shop orders

- Orders are accepted subject to stock. If something is unavailable we will tell you and refund it.
- Delivery is free above ₹1,499 and ₹49 below. Delivery times are estimates, not guarantees.
- **Returns:** unopened, undamaged products may be returned within 7 days of delivery. For reasons of safety we cannot accept returns of opened food, opened medication, or any prescription item.
- **Prescription products** require a valid prescription, which we verify before dispatch.
- Products marked "sponsored" are paid placements. They are labelled wherever they appear, and placement never changes a veterinarian's clinical advice.

## Membership

Memberships run for the period purchased and renew only if you choose. You may cancel at any time from your profile; access continues until the end of the paid period. Included benefits — consults, visits, wellness panels — do not carry over between periods.

## Acceptable use

Don't use Tailish to misrepresent yourself or your pet, to obtain medication by deception, to abuse our staff or the veterinarians on the platform, or to scrape, reverse-engineer or disrupt the service. We may suspend accounts that do.

## Liability

To the extent permitted by law, Tailish's liability for any claim relating to the platform is limited to the amount you paid us for the service in question. We are not liable for the clinical judgement of independent veterinarians, for outcomes of care, or for indirect or consequential losses.

Nothing here limits liability for death or personal injury caused by negligence, or for fraud.

## Changes and governing law

We may change these terms, and will post the updated version here with a new date. Material changes will be notified to you directly. Continued use after a change means you accept it.

These terms are governed by the laws of India, and the courts at Indore, Madhya Pradesh have exclusive jurisdiction.

## Contact

Tailish Pet Care Private Limited
${siteConfig.address}
${siteConfig.email} · ${siteConfig.phone}`;

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        eyebrowIcon={Scale}
        crumbs={[{ label: "Terms" }]}
        title="Terms of service"
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
