import type { Metadata } from "next";
import { ServiceDetail } from "@/components/vet-care/service-detail";
import { mockServices } from "@/lib/mock/services";
import { whatsappMessages } from "@/lib/whatsapp";

const service = mockServices.find((s) => s.slug === "home-visit")!;

export const metadata: Metadata = {
  title: "Home vet visit in Indore — a registered vet at your door from ₹899",
  description:
    "A full veterinary consultation at home: examination, vaccination, sample collection and a written care plan. No carrier, no car ride, no waiting room.",
  alternates: { canonical: "/vet-care/home-visit" },
};

export default function HomeVisitPage() {
  return (
    <ServiceDetail
      service={service}
      whatsappText={whatsappMessages.homeVisit}
      steps={[
        {
          title: "Tell us what's going on",
          body: "A few guided questions about the concern, how long it's been happening, and whether eating, drinking and energy have changed. Takes about two minutes.",
        },
        {
          title: "Pick a vet and a slot",
          body: "You see who's available, their qualifications and registration number, and what they specialise in. Same-day slots are usually open if you book before noon.",
        },
        {
          title: "The vet arrives prepared",
          body: "They've already read your pet's Health Passport — current medications, known allergies, the last visit's notes. You don't start from the beginning.",
        },
        {
          title: "A full examination, at home",
          body: "Temperature, heart and lungs, abdomen, ears, eyes, skin, mouth and weight. Vaccination, sample collection or minor procedures happen on the spot if needed.",
        },
        {
          title: "Written summary before they leave",
          body: "Observations, the care plan, any prescriptions and a follow-up date — recorded in the Health Passport. Follow-up questions are answered free for seven days.",
        },
      ]}
      pricing={[
        {
          label: "Consultation",
          price: 899,
          note: "Full examination, written summary and care plan. 45 minutes.",
          highlight: true,
        },
        {
          label: "Consultation + vaccination",
          price: 1399,
          note: "Adds a core vaccine with batch record and the next due date scheduled.",
        },
        {
          label: "Consultation + diagnostics",
          price: 1899,
          note: "Adds home sample collection and a standard blood panel with interpretation.",
        },
      ]}
      limitations={[
        "Imaging — X-ray, ultrasound and scans need a hospital.",
        "Surgery and procedures requiring general anaesthesia.",
        "Intensive or overnight care; we refer and share the case history.",
        "Emergencies — go directly to a 24-hour hospital, and we'll tell you which.",
      ]}
      faqs={[
        {
          question: "Which areas of Indore do you cover?",
          answer:
            "Vijay Nagar, Palasia, Scheme 54, Scheme 78, Bhawarkua, Rajwada, Rau and the surrounding areas. If your pin code is outside the current zone the booking flow will tell you upfront rather than at the door, and you can still take a video consult.",
        },
        {
          question: "Do I need to do anything to prepare?",
          answer:
            "Keep your pet in a well-lit room on a surface the vet can examine them on — a table with a towel, or the floor for a large dog. Have any previous reports to hand, though if they're already in the Health Passport the vet has them. For cats, shut the room off beforehand so there's no under-the-bed retreat mid-examination.",
        },
        {
          question: "Can the vet give a prescription at home?",
          answer:
            "Yes, where it's clinically appropriate. Prescriptions are issued digitally into your Health Passport, so they're available whenever a pharmacy or another vet asks for them. Medicines on the prescription can be ordered straight from the Tailish shop.",
        },
        {
          question: "What if my pet gets worse after the visit?",
          answer:
            "Message the care desk — follow-up questions on the same concern are free for seven days, and the vet who saw your pet reviews them. If the situation has escalated, we'll say so and direct you to emergency care rather than scheduling another visit.",
        },
        {
          question: "Is a home visit as thorough as a clinic?",
          answer:
            "For the examination itself, yes — and often better, because a relaxed animal is easier to examine properly. Where a clinic wins is equipment: imaging, surgery and in-house lab machines. Your vet will tell you plainly when that's what the situation needs.",
        },
      ]}
    />
  );
}
