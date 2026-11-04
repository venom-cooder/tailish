import type { Metadata } from "next";
import { ServiceDetail } from "@/components/vet-care/service-detail";
import { mockServices } from "@/lib/mock/services";
import { whatsappMessages } from "@/lib/whatsapp";

const service = mockServices.find((s) => s.slug === "diagnostics")!;

export const metadata: Metadata = {
  title: "Pet diagnostics with home sample collection — from ₹1,199",
  description:
    "Blood panels, urine and skin tests collected at home by a trained technician, processed at partner laboratories, with a vet's plain-language interpretation in your pet's Health Passport.",
  alternates: { canonical: "/vet-care/diagnostics" },
};

export default function DiagnosticsPage() {
  return (
    <ServiceDetail
      service={service}
      whatsappText={whatsappMessages.diagnostics}
      steps={[
        {
          title: "A vet decides what's worth testing",
          body: "Panels are chosen for the question being asked, not sold as a bundle. If a test won't change what we do next, we'll say so rather than add it to the bill.",
        },
        {
          title: "Collection at home",
          body: "A trained technician comes to you with the right tubes and handling for your pet's size and species. Most collections take under fifteen minutes and cause far less stress than a clinic trip.",
        },
        {
          title: "Processed at a partner laboratory",
          body: "Samples go to NABL-partnered labs under correct storage. Most results are back within 24 to 48 hours; urgent panels can be faster.",
        },
        {
          title: "A vet reads it, in plain language",
          body: "You don't get a PDF of reference ranges and a shrug. A vet reviews the results against your pet's history and writes what they mean and what happens next.",
        },
        {
          title: "Filed permanently",
          body: "The report and interpretation are stored in the Health Passport, so any future vet can see the trend rather than a single snapshot.",
        },
      ]}
      pricing={[
        {
          label: "Basic panel",
          price: 1199,
          note: "Complete blood count with home collection and vet interpretation.",
        },
        {
          label: "Full wellness panel",
          price: 2499,
          note: "CBC, biochemistry, kidney and liver values, and urine analysis.",
          highlight: true,
        },
        {
          label: "Senior screening",
          price: 3299,
          note: "Adds thyroid and blood pressure — the recommended annual check after seven.",
        },
      ]}
      limitations={[
        "Imaging — X-ray, ultrasound and scans require a hospital visit.",
        "Some specialised tests need a sample taken under sedation.",
        "Results are interpreted by a vet, but treatment may still need an in-person visit.",
      ]}
      faqs={[
        {
          question: "Does my pet need to fast beforehand?",
          answer:
            "For most biochemistry panels, yes — twelve hours without food, water still freely available. The booking confirmation tells you exactly what's needed for the panel your vet has ordered, so there's no guessing.",
        },
        {
          question: "How soon do results arrive?",
          answer:
            "Most panels return within 24 to 48 hours of collection. You get a notification the moment the report lands, and the vet's interpretation usually follows within a few hours of that.",
        },
        {
          question: "Is collection at home safe for a nervous pet?",
          answer:
            "Generally safer than the alternative. Technicians are trained in low-stress restraint, and a familiar environment means less adrenaline — which also makes some blood values more accurate. For cats especially, this avoids the carrier and the car entirely.",
        },
        {
          question: "What happens if something comes back abnormal?",
          answer:
            "A vet calls you. Not an automated message with a red flag on a number — an actual conversation about what the value means in the context of your pet's age, breed and history, and what the sensible next step is.",
        },
        {
          question: "How often should a healthy pet be screened?",
          answer:
            "Annually for healthy adults, as a baseline that makes future results interpretable. Twice yearly after seven, or for pets on long-term medication. The point of a baseline is that a value in the normal range for most dogs may still be abnormal for yours.",
        },
      ]}
    />
  );
}
