import type { Metadata } from "next";
import { ServiceDetail } from "@/components/vet-care/service-detail";
import { mockServices } from "@/lib/mock/services";
import { whatsappMessages } from "@/lib/whatsapp";

const service = mockServices.find((s) => s.slug === "video-consult")!;

export const metadata: Metadata = {
  title: "Online vet consultation — talk to a registered vet from ₹299",
  description:
    "Video consults with registered veterinarians, usually connected within fifteen minutes. Right for second opinions, diet and behaviour questions, and deciding whether a visit is needed.",
  alternates: { canonical: "/vet-care/video-consult" },
};

export default function VideoConsultPage() {
  return (
    <ServiceDetail
      service={service}
      whatsappText={whatsappMessages.videoConsult}
      steps={[
        {
          title: "Describe the concern",
          body: "Type what's happening in plain language. Attach photos, a short video, or a report you'd like read — the vet reviews these before the call starts.",
        },
        {
          title: "Connect, usually within 15 minutes",
          body: "During support hours you're matched with the next available registered vet. You can also book a specific vet for a later slot if you'd rather keep continuity.",
        },
        {
          title: "Twenty minutes of actual conversation",
          body: "Long enough to work through history, show the vet what you're seeing, and ask the questions you'd forget in a five-minute appointment.",
        },
        {
          title: "A clear recommendation",
          body: "Manage at home, come in for a home visit, or go to a hospital now. You get a written summary either way, saved to the Health Passport.",
        },
      ]}
      pricing={[
        {
          label: "Single consult",
          price: 299,
          note: "20 minutes with a registered vet, plus a written summary.",
          highlight: true,
        },
        {
          label: "Follow-up consult",
          price: 199,
          note: "Within 14 days on the same concern, with the same vet where possible.",
        },
        {
          label: "CarePass members",
          price: 0,
          note: "Unlimited video consults included on CarePass and CarePass+.",
        },
      ]}
      limitations={[
        "No physical examination — a vet cannot palpate an abdomen over video.",
        "Some medications legally require an in-person examination first.",
        "Not appropriate for emergencies; we route those to a hospital immediately.",
        "Diagnoses that depend on bloodwork or imaging need those tests done.",
      ]}
      faqs={[
        {
          question: "When is a video consult genuinely enough?",
          answer:
            "Diet and weight questions, behaviour problems, reviewing a lab report, a second opinion on an existing plan, skin issues you can show clearly on camera, and the very common question of whether something needs a vet at all. These are all well served over video and save you a visit.",
        },
        {
          question: "When isn't it enough?",
          answer:
            "Anything involving pain on touch, breathing difficulty, an abdomen that needs palpating, a wound that needs cleaning, or a situation that's changing by the hour. Your vet will say so within the first few minutes and won't charge you for the remainder of the call.",
        },
        {
          question: "Can I get a prescription from a video consult?",
          answer:
            "For many conditions, yes. Some medicines — controlled drugs in particular — require a physical examination before they can be prescribed, and a vet who tells you otherwise isn't practising properly. Where a prescription is appropriate it's issued digitally to your Health Passport.",
        },
        {
          question: "What do I need for the call?",
          answer:
            "A phone with a working camera, decent light, and ideally a second person to hold or distract your pet while you film. Have the food packet, any medicine boxes and previous reports within reach.",
        },
      ]}
    />
  );
}
