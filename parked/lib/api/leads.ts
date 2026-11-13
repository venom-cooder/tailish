import type { LeadResult, PartnerApplicationInput, WaitlistInput } from "@/lib/types";
import { nextId } from "@/lib/utils";
import { badRequest, call } from "./client";

function assertPhone(phone: string) {
  if (phone.replace(/\D/g, "").length < 10) {
    badRequest("Enter a valid 10-digit mobile number.", { field: "phone" });
  }
}

export const leadsApi = {
  /** POST /waitlist */
  joinWaitlist: (input: WaitlistInput) =>
    call<LeadResult>({
      method: "POST",
      path: "/waitlist",
      body: input,
      mockLatencyMs: 600,
      mock: () => {
        if (!input.name?.trim()) badRequest("Enter your name.", { field: "name" });
        assertPhone(input.phone);
        if (!input.city?.trim()) badRequest("Which city are you in?", { field: "city" });
        return {
          id: nextId("lead"),
          status: "received" as const,
          message: `Thanks ${input.name.split(" ")[0]} — you're on the list. We'll message you on WhatsApp the moment Tailish opens in ${input.city}.`,
        };
      },
    }),

  /** POST /partners/apply */
  applyAsPartner: (input: PartnerApplicationInput) =>
    call<LeadResult>({
      method: "POST",
      path: "/partners/apply",
      body: input,
      mockLatencyMs: 700,
      mock: () => {
        if (!input.name?.trim()) badRequest("Enter your name.", { field: "name" });
        assertPhone(input.phone);
        if (!/^\S+@\S+\.\S+$/.test(input.email ?? "")) {
          badRequest("Enter a valid email address.", { field: "email" });
        }
        return {
          id: nextId("lead"),
          status: "received" as const,
          message:
            "Thanks for applying. Our partnerships team reviews applications within two working days and will be in touch on the number you've given.",
        };
      },
    }),

  /** POST /contact */
  contact: (input: { name: string; email: string; phone?: string; subject: string; message: string }) =>
    call<LeadResult>({
      method: "POST",
      path: "/contact",
      body: input,
      mockLatencyMs: 600,
      mock: () => {
        if (!input.name?.trim()) badRequest("Enter your name.", { field: "name" });
        if (!/^\S+@\S+\.\S+$/.test(input.email ?? "")) {
          badRequest("Enter a valid email address.", { field: "email" });
        }
        if (!input.message?.trim()) badRequest("Tell us how we can help.", { field: "message" });
        return {
          id: nextId("lead"),
          status: "received" as const,
          message:
            "Message received. We reply to most enquiries within a few hours during support hours — and faster on WhatsApp.",
        };
      },
    }),
};
