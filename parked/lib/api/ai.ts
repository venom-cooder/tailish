import { mockAskReply, mockFoodSafety, mockNutritionPlan, mockSymptomIntake } from "@/lib/mock/ai";
import { getState } from "@/lib/mock/store";
import type {
  AskRequest,
  AskResponse,
  FoodSafetyResult,
  NutritionPlan,
  Species,
  SymptomIntakeRequest,
  SymptomIntakeResult,
} from "@/lib/types";
import { nextId } from "@/lib/utils";
import { badRequest, call } from "./client";

export const aiApi = {
  /**
   * POST /ask — Ask Tailish.
   *
   * The backend streams; this client returns the complete message. When the
   * streaming endpoint lands, the chat UI already renders messages one at a
   * time, so only this function changes.
   */
  ask: (request: AskRequest) =>
    call<AskResponse>({
      method: "POST",
      path: "/ask",
      body: request,
      mockLatencyMs: 850,
      mock: () => {
        if (!request.message.trim()) badRequest("Type a question to get started.");
        const state = getState();
        const pet = state.pets.find((p) => p.id === request.petId) ?? state.pets[0];
        const reply = mockAskReply(request.message, pet?.name ?? "your pet");
        return {
          conversationId: request.conversationId ?? nextId("conv"),
          message: {
            ...reply,
            id: nextId("msg"),
            createdAt: new Date().toISOString(),
          },
        };
      },
    }),

  /** POST /symptom-intake */
  symptomIntake: (request: SymptomIntakeRequest) =>
    call<SymptomIntakeResult>({
      method: "POST",
      path: "/symptom-intake",
      body: request,
      mockLatencyMs: 1100,
      mock: () => ({
        intakeId: nextId("intake"),
        ...mockSymptomIntake(request.primaryConcern, request.durationHours),
      }),
    }),

  /** GET /food-safety?item= */
  foodSafety: (item: string, species: Species = "dog") =>
    call<FoodSafetyResult>({
      method: "GET",
      path: "/food-safety",
      query: { item, species },
      mockLatencyMs: 400,
      mock: () => {
        if (!item.trim()) badRequest("Type a food to check.");
        return mockFoodSafety(item, species);
      },
    }),

  /** GET /nutrition/:petId */
  nutrition: (petId: string) =>
    call<NutritionPlan>({
      method: "GET",
      path: `/nutrition/${petId}`,
      mock: () => {
        const pet = getState().pets.find((p) => p.id === petId);
        return mockNutritionPlan(petId, pet?.name ?? "your pet");
      },
    }),
};
