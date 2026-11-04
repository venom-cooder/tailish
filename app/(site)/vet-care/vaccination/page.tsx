import type { Metadata } from "next";
import { ServiceDetail } from "@/components/vet-care/service-detail";
import { mockServices } from "@/lib/mock/services";
import { whatsappMessages } from "@/lib/whatsapp";

const service = mockServices.find((s) => s.slug === "vaccination")!;

export const metadata: Metadata = {
  title: "Pet vaccination at home in Indore — from ₹699, cold-chain verified",
  description:
    "Core and seasonal vaccines for dogs and cats, administered at home. Batch numbers recorded in the Health Passport and the next due date scheduled automatically.",
  alternates: { canonical: "/vet-care/vaccination" },
};

export default function VaccinationPage() {
  return (
    <ServiceDetail
      service={service}
      whatsappText={whatsappMessages.vaccination}
      steps={[
        {
          title: "We check what's actually due",
          body: "Your pet's vaccination history is read from the Health Passport — including anything uploaded from a previous clinic — so you're not re-vaccinating unnecessarily or missing a lapsed dose.",
        },
        {
          title: "A health check comes first",
          body: "A vaccine only works on a healthy immune system. The vet examines your pet and checks temperature before anything is given. If your pet isn't well, we reschedule — a week's delay is harmless.",
        },
        {
          title: "Cold-chain verified, at your door",
          body: "Vaccines travel in temperature-controlled storage and the batch number is recorded at the point of administration. A vaccine that has broken cold chain is a vaccine that doesn't work.",
        },
        {
          title: "Certificate and next date, immediately",
          body: "A digital certificate lands in the Health Passport with the vaccine name, brand, batch number and next due date — accepted by boarding facilities, housing societies and for travel.",
        },
        {
          title: "We remind you before it lapses",
          body: "Not after. You get a reminder ahead of the due date, on WhatsApp, with a one-tap option to book the next dose.",
        },
      ]}
      pricing={[
        {
          label: "Single vaccine",
          price: 699,
          note: "One core vaccine with pre-vaccination check and digital certificate.",
        },
        {
          label: "Vaccine + consultation",
          price: 1399,
          note: "Adds a full examination — the usual choice for an annual visit.",
          highlight: true,
        },
        {
          label: "Puppy / kitten course",
          price: 2499,
          note: "The full primary course across visits, with deworming included.",
        },
      ]}
      limitations={[
        "Vaccination is deferred if your pet has a fever or is otherwise unwell.",
        "Rabies titre testing for international travel needs a certified laboratory.",
        "Pets with a history of vaccine reaction are seen at a clinic, not at home.",
      ]}
      faqs={[
        {
          question: "Which vaccines does my dog actually need in India?",
          answer:
            "The core course is DHPPi — distemper, hepatitis, parvovirus and parainfluenza — usually with leptospirosis, plus rabies. Rabies is legally required in most Indian municipalities and is non-negotiable. Kennel cough is advisable if your dog boards, goes to daycare or mixes at parks. Our guide on the puppy vaccination schedule walks through the timing.",
        },
        {
          question: "And for cats?",
          answer:
            "FVRCP — the feline tricat covering rhinotracheitis, calicivirus and panleukopenia — plus rabies. Indoor-only cats still need both: panleukopenia survives in the environment and travels in on shoes, and rabies remains a legal requirement.",
        },
        {
          question: "How do I know the cold chain wasn't broken?",
          answer:
            "Every vaccine is transported in a monitored cold box and the batch number is recorded against your pet at the moment it's given. You can see that batch number in the Health Passport. If a cold box reads out of range, that stock is not used — the visit is rescheduled instead.",
        },
        {
          question: "What if we've missed a dose by months?",
          answer:
            "Common, and usually fixable. Depending on how long it's been and your pet's age, the vet will either resume the schedule or restart the primary course. Bring whatever record you have — even a photo of an old card helps — and we'll work out the shortest safe path back to protection.",
        },
        {
          question: "Are side effects something to worry about?",
          answer:
            "Mild lethargy and a sore injection site for a day are normal and expected. Facial swelling, repeated vomiting, hives or collapse are not — those need a vet immediately, which is why we schedule vaccinations in daytime slots rather than late evening.",
        },
      ]}
    />
  );
}
