import type { Metadata } from "next";
import { Lock } from "lucide-react";
import { Container, Section } from "@/components/shared/section";
import { PageHero } from "@/components/shared/page-hero";
import { Prose } from "@/components/shared/prose";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "What Tailish collects, why, who can see your pet's health records, how SMS and WhatsApp consent works, and how to export or delete everything.",
  alternates: { canonical: "/privacy" },
};

const { legal } = siteConfig;

const body = `**Operated by:** ${legal.entity}
**Brand:** Tailish AI Pet Care
**Website:** ${siteConfig.url}
**Privacy contact:** ${siteConfig.email}

## 1. Introduction

Welcome to Tailish AI Pet Care ("Tailish", "we", "our" or "us").

Tailish is an AI-powered pet care companion designed to make everyday pet parenting simpler, more informed, and more convenient.

Our services may include personalised pet profiles, general wellness and nutrition information, vaccination and preventive-care reminders, AI-powered conversations, pet care recommendations, and assistance discovering veterinary professionals and other pet-related services.

This Privacy Policy explains how we collect, use, store, protect, share and manage personal information when you interact with Tailish through our website, WhatsApp, SMS, mobile applications, or other supported communication channels.

The organisation identified above is responsible for the personal information described in this Policy, subject to applicable law.

By using our services, you acknowledge that you have been provided this Privacy Policy. Where consent is legally required, we will request it separately.

## 2. Information we collect

We collect information reasonably necessary to provide, maintain, secure and improve our services.

### A. Personal and contact information

Depending on the services you use, this may include:

- Name and preferred name.
- Mobile number and WhatsApp contact details.
- Email address.
- City, region and location preferences.
- Account identifiers and communication preferences.
- Customer service requests and related correspondence.

We do not require users to disclose information unrelated to the services they request.

### B. Pet profile information

To personalise the Tailish experience, we may collect:

- Pet name, species, breed, age and sex.
- Weight and general physical characteristics.
- Diet, feeding preferences and activity levels.
- Vaccination history and upcoming vaccination dates.
- Preventive-care and deworming schedules.
- Allergies, sensitivities and relevant health history.
- Behavioural observations and lifestyle information.
- Veterinary recommendations or prescriptions voluntarily shared by the user.
- Pet photographs and documents voluntarily uploaded.

Pet-related records may contain personal information about the pet owner, particularly where linked to an identifiable account.

### C. AI conversations and user-submitted content

When you communicate with Tailish, we may process:

- Messages and questions submitted to our AI assistant.
- Images, attachments and information voluntarily shared.
- Information needed to maintain conversation context.
- Previous interactions and relevant preferences.
- Feedback and corrections provided by users.

This information helps Tailish provide contextual responses and avoid requiring users to repeat the same pet details.

### D. Technical and usage information

When technically supported, we may collect:

- Device and browser information.
- IP address and approximate location derived from technical information.
- Website interactions and feature usage.
- Session data, timestamps and error logs.
- Cookies and similar technologies, where used.

### E. Transaction and service information

Where paid products or services are offered, we may process order details, transaction references, payment status, billing details and service history.

Payment card information is handled by authorised payment processing providers rather than stored directly by Tailish, unless specifically disclosed and supported by appropriate security controls.

## 3. How we use your information

**Service delivery.** To operate Tailish, respond to enquiries, create and manage pet profiles, maintain account history, provide general pet care information, and deliver requested features.

**Personalisation.** To tailor guidance based on your pet's age, breed, diet, lifestyle, preferences and information voluntarily provided.

**Reminders and notifications.** To send requested vaccination reminders, preventive-care alerts, scheduled wellness check-ins, appointment notifications and service-related updates.

**AI assistance.** To process your questions through AI systems, generate responses, maintain appropriate conversational context, and support safety checks.

**Customer support.** To investigate issues, respond to feedback, manage requests, and resolve technical or account-related concerns.

**Service improvement.** To understand product performance, fix errors, improve reliability and develop new capabilities using information processed in accordance with applicable privacy obligations.

**Security and compliance.** To detect unauthorised activity, prevent misuse, maintain appropriate records, meet legal obligations, and protect users and our services.

**Marketing.** To send promotional communications only where permitted by applicable law and supported by the appropriate consent or other lawful basis. SMS marketing consent is separate from consent to receive service-related messages.

## 4. AI processing and automated assistance

Tailish uses artificial intelligence to generate information and assist users.

User-submitted information may be processed by AI model providers and other authorised technology providers necessary to deliver the requested service.

AI responses may contain inaccuracies, omissions or outdated information.

**Tailish AI is not a licensed veterinarian, does not independently diagnose diseases, and does not replace a qualified veterinary professional.**

Health-related information shared with Tailish is used to support the requested interaction, subject to this Policy.

We will not claim that user conversations are never used for model training unless that restriction is supported by our contracts and technical configuration. Any use of identifiable user information for training, model improvement or unrelated purposes must be disclosed and handled in accordance with applicable law and consent requirements.

## 5. SMS messaging privacy and consent

Tailish may offer SMS messaging for users who expressly choose to receive eligible notifications.

SMS messages may include:

- Pet care and vaccination reminders.
- Customer service responses.
- Account and service notifications.
- Appointment or booking updates, where supported.
- Other communications specifically covered by the user's consent.

**SMS consent is optional and is not a condition of purchasing products or accessing unrelated Tailish services.**

We maintain records of messaging consent where applicable, including the phone number, consent method, timestamp, notice version and subscription preferences.

### SMS data protection commitment

**We do not sell or share your SMS opt-in data or personal information with third parties for marketing purposes.**

Mobile numbers, SMS opt-in consent records and messaging preferences will not be sold, rented or shared with third parties or affiliates for their independent marketing or promotional purposes.

SMS opt-in consent is specific to Tailish and will not be transferred to other businesses for their marketing campaigns.

Authorised messaging infrastructure and service providers may process information strictly as necessary to deliver messages, operate the communication service, provide support, or satisfy legal requirements, subject to appropriate protections.

**Message frequency varies** according to your selected reminders, requests and account activity.

**Message and data rates may apply.**

You may:

- Reply **STOP** to unsubscribe from the relevant SMS programme.
- Reply **HELP** for messaging assistance.
- Contact ${siteConfig.email} for additional support.

Opting out of SMS does not automatically delete your Tailish account or cancel communications necessary for separately requested services through other channels.

## 6. WhatsApp communications

Tailish may provide AI conversations, reminders, customer support and service notifications through WhatsApp.

When communicating through WhatsApp:

- Your mobile number and message content may be processed through Meta's WhatsApp platform and authorised messaging infrastructure providers.
- Tailish may maintain conversation history to provide continuity and personalised assistance.
- Business-initiated communications will follow applicable consent requirements and WhatsApp platform policies.
- You may request that Tailish stop sending optional WhatsApp communications.
- You may manage or block business communications using the controls made available by WhatsApp.

A user's consent to receive SMS messages does not automatically authorise unrelated WhatsApp marketing, and vice versa.

Your use of WhatsApp is also subject to Meta's applicable privacy terms.

## 7. Sharing of information

**We do not sell personal information.**

We may disclose the minimum information reasonably necessary to the following categories of recipients, subject to appropriate safeguards:

### A. Infrastructure and technology providers

Providers of hosting, databases, communication platforms, AI processing, analytics and technical support that help operate Tailish.

### B. Veterinary and pet service providers

Where you request a booking, referral, consultation or another service, relevant information may be shared with the selected provider to facilitate your request.

Independent service providers may maintain their own privacy policies and be responsible for their subsequent handling of information.

### C. Payment processing providers

Where purchases or paid services are supported, necessary transaction information may be processed by authorised payment providers.

### D. Legal and regulatory authorities

We may disclose information when required by applicable law, a lawful government request, court order or other legally recognised obligation.

### E. Business transfers

In the event of a merger, acquisition, restructuring or business transfer, information may be transferred subject to applicable privacy requirements, contractual protections, and any required notice or consent.

**SMS consent records and mobile opt-in information are excluded from sharing for independent third-party marketing or promotional purposes.**

## 8. Data storage and security

We seek to protect personal information through appropriate organisational and technical safeguards, such as access restrictions, authentication, secure communications, service-provider controls and monitoring.

Our security practices are periodically reviewed and updated according to operational requirements and applicable law.

No electronic system or internet transmission can be guaranteed to be completely secure.

Users should avoid sharing passwords, financial authentication information or unnecessary sensitive personal details through chat.

If we become aware of a personal data breach, we will respond and provide notifications where required by applicable law.

## 9. Data retention

We retain personal information only for as long as reasonably necessary for the purposes for which it was collected, subject to applicable legal, security, accounting and operational requirements.

Different categories of information may require different retention periods. These include:

- Account and pet profile records maintained while the account or relevant service remains active.
- Conversation history retained for service continuity according to applicable retention settings.
- Consent records maintained as needed to demonstrate communications compliance.
- Transaction records retained for legally required accounting and tax purposes.
- Security logs retained for legitimate security and investigation needs.

When information is no longer required, it will be deleted, anonymised or otherwise handled in accordance with applicable retention requirements and our documented procedures.

Backup copies may remain temporarily until scheduled deletion or backup rotation, subject to applicable law.

## 10. Your privacy rights

Subject to applicable law, you may request to:

- Access information held about you.
- Correct inaccurate personal information.
- Update your pet profile.
- Request deletion of personal information.
- Withdraw consent where processing depends on consent.
- Stop optional SMS or WhatsApp communications.
- Obtain information about applicable privacy practices.
- Submit a privacy-related complaint or grievance.

Requests may be submitted to ${siteConfig.email}.

We may need to verify your identity before fulfilling requests, to prevent unauthorised access or deletion.

Certain information may need to be retained where required by law or legitimate compliance obligations.

## 11. Children's privacy

Tailish is intended primarily for adults responsible for the care of pets.

Individuals under 18 should use Tailish only with the authorisation and supervision of a parent or legal guardian, where permitted by applicable law.

We do not knowingly seek to collect children's personal information without the consent required by law.

If you believe a child has submitted personal information without appropriate authorisation, contact ${siteConfig.email}.

## 12. Cookies and analytics

Our website may use essential cookies and, where implemented, analytics or preference-management technologies.

Essential cookies support functions such as authentication, security and session continuity.

Optional analytics and advertising technologies, if used, will be disclosed and controlled in accordance with applicable law.

Users may manage cookies through available browser or website controls.

## 13. International data processing

Tailish may use technology and communication providers located outside the user's country.

Where personal information is processed internationally, we will comply with applicable restrictions and implement appropriate contractual, organisational or technical safeguards where required.

## 14. Third-party links and services

Tailish may provide links to veterinary clinics, pet stores, grooming services, trainers, payment providers or external resources.

We do not control the privacy practices of independent third parties.

Users should review their applicable privacy notices before providing information to those services.

## 15. Changes to this Privacy Policy

We may update this Privacy Policy to reflect product changes, operational practices, legal requirements or improvements in privacy protection.

The updated version will be published with a revised effective date.

Where required by law, we will provide additional notice or obtain consent before implementing material changes.

## 16. Contact and grievance redressal

For privacy enquiries, data access requests, corrections, deletion requests or complaints, contact:

**Tailish AI Pet Care**
Legal entity: ${legal.entity}
Email: ${siteConfig.email}
Registered address: ${siteConfig.address}
Website: ${siteConfig.url}

**Designated privacy / grievance contact:** ${legal.grievanceOfficer}

We will review requests and respond within applicable legal timeframes.

## Our privacy commitment

Your pet's story deserves care, and your personal information deserves protection.

Tailish aims to provide useful, transparent and responsible AI-powered pet care services while respecting your choices about your information and communications.`;

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        eyebrowIcon={Lock}
        crumbs={[{ label: "Privacy" }]}
        title="Privacy policy"
        description={`Effective ${legal.effectiveDate} · Last updated ${legal.effectiveDate}`}
      />

      <Section className="py-14">
        <Container size="narrow">
          <Prose body={body} />
        </Container>
      </Section>
    </>
  );
}
