import type {
  ChatMessage,
  FoodSafetyResult,
  FoodSafetyVerdict,
  NutritionPlan,
  Species,
  SymptomIntakeResult,
  Urgency,
} from "@/lib/types";

/**
 * Canned Ask Tailish replies.
 *
 * The real endpoint is backed by a model with retrieval over the pet's own
 * passport. The important behaviour to preserve when wiring that up is the
 * safety posture these fixtures encode: observations and triage, never a
 * diagnosis, and a hard escalation path for anything urgent.
 */

export const ASK_DISCLAIMER =
  "Tailish gives general care guidance, not a diagnosis. Anything urgent goes straight to a registered veterinarian.";

const EMERGENCY_PATTERNS = [
  "not breathing",
  "can't breathe",
  "cant breathe",
  "difficulty breathing",
  "struggling to breathe",
  "blue gums",
  "pale gums",
  "white gums",
  "collapsed",
  "collapse",
  "seizure",
  "fitting",
  "unconscious",
  "unresponsive",
  "bloat",
  "swollen belly",
  "hard stomach",
  "hit by",
  "road accident",
  "fell from",
  "bleeding heavily",
  "won't stop bleeding",
  "poison",
  "ate chocolate",
  "ate rat",
  "rodenticide",
  "xylitol",
  "ate grapes",
  "ate raisins",
  "straining to urinate",
  "can't urinate",
  "cant pee",
  "not able to pee",
  "blocked",
  "paracetamol",
  "ibuprofen",
  "snake bite",
  "heat stroke",
  "heatstroke",
];

const VET_REVIEW_PATTERNS = [
  "vomiting",
  "vomit",
  "diarrhoea",
  "diarrhea",
  "loose motion",
  "limping",
  "not eating",
  "off food",
  "lethargic",
  "fever",
  "blood",
  "swelling",
  "lump",
  "coughing",
  "sneezing",
  "discharge",
  "scratching",
  "itching",
  "hair loss",
  "ear infection",
  "shaking head",
];

export function classifyUrgency(message: string): Urgency {
  const text = message.toLowerCase();
  if (EMERGENCY_PATTERNS.some((pattern) => text.includes(pattern))) return "emergency";
  if (VET_REVIEW_PATTERNS.some((pattern) => text.includes(pattern))) return "soon";
  return "routine";
}

const EMERGENCY_REPLY = (petName: string): Omit<ChatMessage, "id" | "createdAt"> => ({
  role: "assistant",
  content: `What you've described needs a veterinarian now — not later today, and not after trying something at home first. Please take ${petName} to the nearest emergency hospital.

**Do this on the way**
- Call ahead so they can prepare. The list of 24-hour hospitals near you is one tap away.
- Keep ${petName} warm, quiet and as still as possible.
- If something was swallowed, bring the packaging with you.
- Do not induce vomiting and do not give any human medicine.

I've flagged this to the Tailish care desk. A vet will call you within a few minutes.`,
  quickReplies: ["Show emergency vets near me", "Call the Tailish care desk"],
  escalation: {
    level: "emergency",
    message: "Routed to the on-call veterinarian. Emergency hospitals are listed below.",
  },
  citations: [{ label: "When it's an emergency", href: "/guides/when-to-see-a-vet-urgently" }],
});

const CANNED: { match: RegExp; reply: (petName: string) => Omit<ChatMessage, "id" | "createdAt"> }[] = [
  {
    match: /vaccinat|vaccine|booster|rabies/i,
    reply: (petName) => ({
      role: "assistant",
      content: `Here's where ${petName} stands on vaccinations right now.

- **Rabies** — due in 12 days. Already booked with Dr. Kavita Rao for a home visit.
- **DHPPi + Lepto** — current, next dose in about 7 months.
- **Kennel cough** — lapsed 45 days ago. Worth catching up on if boarding or daycare is likely.
- **Deworming** — due in 2 days.

Kennel cough and the deworming can both be done in the same visit as the rabies booster, which saves ${petName} a second round of handling. Want me to add them to the existing appointment?`,
      quickReplies: [
        "Add both to the booked visit",
        "What does kennel cough protect against?",
        "Book a separate visit",
      ],
      citations: [
        { label: "Puppy vaccination schedule", href: "/guides/puppy-vaccination-schedule-india" },
      ],
    }),
  },
  {
    match: /food|eat|diet|feed|kibble|nutrition|weight|portion/i,
    reply: (petName) => ({
      role: "assistant",
      content: `${petName} is on a chicken-free diet because of a confirmed protein sensitivity, and weighs 28.6 kg as of the visit three days ago — down 0.5 kg, which is the direction we wanted.

**Where things stand**
- Current food: hypoallergenic lamb and rice, roughly 310 g a day split across two meals.
- Treats should stay under about 10% of daily calories. The freeze-dried lamb treats fit; anything chicken-based does not.
- Body condition at the last visit was scored 5/9 — ideal.

Keep the portion where it is for another three weeks before adjusting again. Weight responds slowly, and week-to-week changes mostly reflect water, not fat.`,
      quickReplies: [
        "How much should Bruno eat?",
        "Suggest chicken-free treats",
        "Is rice okay every day?",
      ],
      citations: [
        { label: "How much should my dog eat?", href: "/guides/how-much-should-my-dog-eat" },
        { label: "Shop chicken-free food", href: "/shop/category/dog-food" },
      ],
    }),
  },
  {
    match: /tick|flea|parasite|worm|deworm/i,
    reply: (petName) => ({
      role: "assistant",
      content: `${petName}'s quarterly deworming is due in 2 days — that's the one to action first.

**On ticks and fleas**
Indore is past peak monsoon but tick pressure stays high into October. If ${petName} is on a monthly spot-on, keep to the date rather than waiting to see ticks; a dose given two weeks late is a two-week gap.

Daily checks matter as much as the product. Go through the coat against the direction of growth, and pay attention to ears, the webbing between toes, under the collar, armpits and groin.

If you find one, pull it straight out with a tick hook close to the skin. Don't twist or apply oil — that makes the tick regurgitate into the bite, which is how disease transmits.`,
      quickReplies: ["Order deworming tablets", "Book a home visit", "Signs of tick fever"],
      citations: [
        { label: "Tick and flea prevention", href: "/guides/tick-and-flea-prevention-india" },
        { label: "Shop parasite control", href: "/shop/category/parasite-control" },
      ],
    }),
  },
  {
    match: /skin|itch|scratch|rash|dermat|coat|hair fall|hair loss/i,
    reply: (petName) => ({
      role: "assistant",
      content: `${petName} has a confirmed seasonal atopic dermatitis that flares in humidity, and is 6 days from the end of the current Apoquel course.

**What the last visit recorded**
Redness over the lower back had reduced, and the plan was to finish the course, continue medicated baths twice weekly for three weeks, and keep chicken out of food and treats.

**Worth telling a vet about**
If you're seeing new redness, a warm moist patch appearing quickly, any smell, or ${petName} breaking the skin with licking — that needs review before the course ends rather than after.

I can't tell from here whether what you're seeing now is the existing flare settling or a new one starting. A photo sent to the care desk usually resolves that in minutes.`,
      quickReplies: [
        "Send a photo to the care desk",
        "Book a follow-up visit",
        "Which shampoo should I use?",
      ],
      escalation: {
        level: "vet_review",
        message: "Flagged for review by the care desk — this is an active, treated condition.",
      },
      citations: [
        { label: "Monsoon skin problems", href: "/guides/monsoon-skin-problems-dogs" },
        { label: "Medicated oatmeal shampoo", href: "/shop/product/medicated-oatmeal-shampoo" },
      ],
    }),
  },
  {
    match: /medicine|medication|apoquel|tablet|dose|dosage/i,
    reply: (petName) => ({
      role: "assistant",
      content: `${petName} is currently on two things.

- **Apoquel (oclacitinib) 16 mg** — one tablet once daily with food. 6 days remaining, then stop as prescribed.
- **Omega-3 skin supplement** — 2 pumps once daily on food, ongoing.

Give the Apoquel with a meal rather than on an empty stomach. If you miss a dose, give it when you remember and carry on — don't double up.

Don't stop early even if the skin looks settled. Stopping an anti-itch course at the first improvement is the most common reason a flare rebounds.`,
      quickReplies: ["Set a daily reminder", "What if I miss a dose?", "Refill the omega-3 oil"],
      citations: [{ label: "Open Health Passport", href: "/app/pets/pet_01" }],
    }),
  },
  {
    match: /groom|bath|nail|brush|shampoo/i,
    reply: (petName) => ({
      role: "assistant",
      content: `With the dermatitis course still running, ${petName} should be on medicated baths twice weekly for another three weeks — use the prescribed shampoo rather than a regular one, and leave it on for the full contact time on the label before rinsing.

**The rest of the routine**
- Brush every other day. A Golden Retriever's undercoat traps moisture, and trapped moisture is what starts hot spots.
- Dry thoroughly after every bath and every wet walk — especially between the toes, under the collar and behind the ears.
- Nails roughly monthly, or when you can hear them on hard flooring.
- Ears weekly with a proper cleaner. Floppy ears hold humidity.`,
      quickReplies: ["Book a groomer nearby", "Order the medicated shampoo", "How do I trim nails safely?"],
      citations: [{ label: "Groomers near you", href: "/nearby?type=groomer" }],
    }),
  },
  {
    match: /book|appointment|visit|vet|consult/i,
    reply: (petName) => ({
      role: "assistant",
      content: `${petName} already has one booking in place: a vaccination home visit with Dr. Kavita Rao in 12 days, 10:30–11:15 AM, at Sampat Hills.

If you need something sooner, there are three routes:

- **Home visit** — a vet at your door, from ₹899. Best for anything that needs hands on the animal.
- **Video consult** — from ₹299, usually connected within 15 minutes. Good for questions, reviewing a report, or deciding whether an in-person visit is needed.
- **Emergency** — if this can't wait, I'll point you at the nearest 24-hour hospital instead.

Which of those fits?`,
      quickReplies: ["Book a home visit", "Start a video consult", "Show my bookings"],
      citations: [{ label: "Book a vet visit", href: "/vet-care/book-visit" }],
    }),
  },
  {
    match: /passport|record|report|document|share/i,
    reply: (petName) => ({
      role: "assistant",
      content: `${petName}'s Health Passport is up to date as of the visit three days ago. It currently holds 4 vaccination records, 7 weight measurements, 3 conditions, 2 active medications and 4 documents.

You can share a read-only copy with a boarding facility, a new vet or a family member — it generates a QR code and an expiring link, and you choose which sections are visible. Nothing is shared until you create the link, and you can revoke it at any time.`,
      quickReplies: ["Share the passport", "Upload a report", "Show the timeline"],
      citations: [{ label: "Open Health Passport", href: "/app/pets/pet_01" }],
    }),
  },
];

const FALLBACK = (petName: string): Omit<ChatMessage, "id" | "createdAt"> => ({
  role: "assistant",
  content: `Happy to help with that. For context, here's what I have on ${petName} right now: 3 years old, 28.6 kg as of three days ago, on a chicken-free diet, with an active dermatitis course that has 6 days to run and a rabies booster due in 12 days.

Tell me a bit more about what you're seeing — when it started, whether anything has changed in food or routine, and whether ${petName} is otherwise eating and drinking normally. If it would be easier to show me, you can send a photo or a short video.`,
  quickReplies: [
    "Vaccination status",
    "Food and weight",
    "Ticks and parasites",
    "Book a vet visit",
  ],
});

export function mockAskReply(message: string, petName = "your pet"): Omit<ChatMessage, "id" | "createdAt"> {
  if (classifyUrgency(message) === "emergency") return EMERGENCY_REPLY(petName);
  const hit = CANNED.find((entry) => entry.match.test(message));
  return (hit?.reply ?? FALLBACK)(petName);
}

export const ASK_SUGGESTIONS = [
  "Is Bruno due for any vaccination?",
  "He has been scratching more than usual",
  "How much should Bruno eat each day?",
  "Can dogs eat curd?",
  "Book a home visit this week",
  "Show nearby emergency vets",
];

/* ------------------------------------------------------------ intake ----- */

export function mockSymptomIntake(
  primaryConcern: string,
  durationHours: number,
): Omit<SymptomIntakeResult, "intakeId"> {
  const urgency = classifyUrgency(primaryConcern);
  const escalated: Urgency =
    urgency === "emergency" ? "emergency" : durationHours >= 48 ? "soon" : urgency;

  if (escalated === "emergency") {
    return {
      urgency: "emergency",
      summary:
        "Based on what you've described, this needs to be seen by a veterinarian immediately rather than scheduled.",
      observations: [
        "The reported signs fall into our emergency category.",
        "A registered vet has been alerted and will call you.",
        "Nearest 24-hour hospitals are listed with live phone numbers.",
      ],
      recommendedServiceSlugs: [],
      disclaimer: ASK_DISCLAIMER,
    };
  }

  return {
    urgency: escalated,
    summary:
      escalated === "soon"
        ? "This is worth a vet's eyes within the next day or so. It isn't an emergency on what you've told us, but it shouldn't be left to settle on its own."
        : "This looks like it can be handled as a routine consultation. A video consult is usually the quickest way to get a clear answer.",
    observations: [
      `Primary concern recorded as "${primaryConcern}".`,
      `Reported duration: about ${durationHours} hours.`,
      "Appetite, drinking and energy level have been noted for the vet.",
      "Current medications and known allergies were attached from the Health Passport.",
    ],
    recommendedServiceSlugs:
      escalated === "soon" ? ["home-visit", "video-consult"] : ["video-consult", "home-visit"],
    disclaimer: ASK_DISCLAIMER,
  };
}

/* ------------------------------------------------------- food safety ----- */

interface FoodEntry {
  verdict: FoodSafetyVerdict;
  summary: string;
  reasons: string[];
  ifEaten: string[];
}

const FOOD_DB: Record<string, FoodEntry> = {
  chocolate: {
    verdict: "unsafe",
    summary: "Toxic to both dogs and cats. Dark and baking chocolate are the most dangerous.",
    reasons: [
      "Contains theobromine, which pets metabolise far more slowly than people do.",
      "Causes vomiting, racing heart, tremors and in larger doses, seizures.",
      "Severity scales with cocoa percentage and the animal's body weight.",
    ],
    ifEaten: [
      "Call a vet immediately — do not wait for symptoms to appear.",
      "Have the wrapper ready: type of chocolate and weight eaten both matter.",
      "Do not induce vomiting unless a vet instructs you to.",
    ],
  },
  grapes: {
    verdict: "unsafe",
    summary: "Grapes and raisins can cause acute kidney failure in dogs. No safe dose is known.",
    reasons: [
      "The toxic mechanism is still not fully understood.",
      "Sensitivity varies hugely between individuals — some dogs react to very little.",
      "Raisins are more concentrated than fresh grapes.",
    ],
    ifEaten: ["Treat as an emergency and call a vet now.", "Note how many and when."],
  },
  onion: {
    verdict: "unsafe",
    summary: "Onion, garlic, leeks and chives damage red blood cells. Cooked forms count too.",
    reasons: [
      "Damages red blood cells, leading to anaemia that can appear days later.",
      "Cats are more sensitive than dogs.",
      "Commonly reaches pets through leftover gravy, sabzi and biryani.",
    ],
    ifEaten: [
      "Call a vet — signs can take several days to appear.",
      "Watch for lethargy, pale gums and dark urine.",
    ],
  },
  xylitol: {
    verdict: "unsafe",
    summary: "One of the most dangerous items on this list, in very small quantities.",
    reasons: [
      "Triggers a rapid insulin release in dogs, causing a dangerous drop in blood sugar.",
      "Found in sugar-free gum, mints, some peanut butters and some medicines.",
      "Can also cause liver failure at higher doses.",
    ],
    ifEaten: ["This is an emergency. Go to a vet now.", "Bring the packaging."],
  },
  milk: {
    verdict: "caution",
    summary: "Not toxic, but most adult dogs and cats cannot digest lactose.",
    reasons: [
      "Lactase production drops after weaning in most pets.",
      "Typically causes loose stools, gas and stomach discomfort.",
      "Plain curd is often better tolerated than milk.",
    ],
    ifEaten: [
      "Usually self-limiting — ensure fresh water is available.",
      "Call a vet if diarrhoea lasts beyond a day or contains blood.",
    ],
  },
  curd: {
    verdict: "caution",
    summary: "Plain, unsweetened curd in small amounts is fine for most dogs.",
    reasons: [
      "Fermentation reduces lactose, so it is better tolerated than milk.",
      "Must be plain — no sugar, no sweeteners, and never anything containing xylitol.",
      "Keep it to a spoonful or two; it still adds calories.",
    ],
    ifEaten: ["No action needed for a small amount.", "Watch for loose stools in sensitive pets."],
  },
  rice: {
    verdict: "safe",
    summary: "Plain cooked rice is safe and commonly used in bland diets.",
    reasons: [
      "Easily digestible carbohydrate.",
      "Frequently recommended with boiled protein during digestive upsets.",
      "Must be plain — no onion, garlic, salt or masala.",
    ],
    ifEaten: ["No action needed."],
  },
  chicken: {
    verdict: "safe",
    summary: "Plain cooked chicken is safe for most pets — but never cooked bones.",
    reasons: [
      "A good lean protein source, well tolerated by most pets.",
      "Must be unseasoned: no onion, garlic, masala or excess salt.",
      "Cooked bones splinter and can perforate the intestine.",
      "Some pets, including Bruno, have a confirmed chicken protein sensitivity.",
    ],
    ifEaten: [
      "No action needed for plain, boneless chicken.",
      "If a cooked bone was eaten, call a vet.",
    ],
  },
  banana: {
    verdict: "safe",
    summary: "Safe in small amounts. High in sugar, so keep it occasional.",
    reasons: ["Good source of potassium.", "High natural sugar — not for daily feeding.", "Remove the peel."],
    ifEaten: ["No action needed."],
  },
  paracetamol: {
    verdict: "unsafe",
    summary: "Lethal to cats and dangerous to dogs. Never give human painkillers to pets.",
    reasons: [
      "Cats lack the enzyme needed to process it safely.",
      "Causes liver damage and prevents blood carrying oxygen.",
      "Ibuprofen and aspirin are also unsafe.",
    ],
    ifEaten: ["This is an emergency. Go to a vet immediately.", "Bring the packet and note the dose."],
  },
};

const FOOD_ALIASES: Record<string, string> = {
  raisin: "grapes",
  raisins: "grapes",
  kishmish: "grapes",
  grape: "grapes",
  garlic: "onion",
  onions: "onion",
  pyaaz: "onion",
  lehsun: "onion",
  dahi: "curd",
  yogurt: "curd",
  yoghurt: "curd",
  chawal: "rice",
  doodh: "milk",
  kela: "banana",
  crocin: "paracetamol",
  dolo: "paracetamol",
  ibuprofen: "paracetamol",
  chocolates: "chocolate",
};

export function mockFoodSafety(item: string, species: Species): FoodSafetyResult {
  const key = item.trim().toLowerCase();
  const resolved = FOOD_ALIASES[key] ?? key;
  const match =
    FOOD_DB[resolved] ??
    Object.entries(FOOD_DB).find(([name]) => resolved.includes(name))?.[1];

  if (!match) {
    return {
      item,
      species,
      verdict: "caution",
      summary: `We don't have a verified entry for "${item}" yet.`,
      reasons: [
        "Our food database covers the items most commonly reported in Indian households.",
        "When we don't have a verified answer, we say so rather than guessing.",
      ],
      ifEaten: [
        "Ask Tailish with the exact item and quantity, and a vet will review it.",
        "If your pet is unwell in any way, contact a vet directly.",
      ],
      disclaimer: ASK_DISCLAIMER,
    };
  }

  return { item, species, ...match, disclaimer: ASK_DISCLAIMER };
}

export const FOOD_SAFETY_POPULAR = [
  "Chocolate",
  "Grapes",
  "Onion",
  "Curd",
  "Rice",
  "Banana",
  "Milk",
  "Paracetamol",
];

/* --------------------------------------------------------- nutrition ----- */

export function mockNutritionPlan(petId: string, petName: string): NutritionPlan {
  return {
    petId,
    petName,
    dailyCalories: 1320,
    mealsPerDay: 2,
    portionLabel: "about 310 g of dry food a day, split across two meals",
    waterMlPerDay: 1700,
    bodyConditionNote:
      "Body condition scored 5/9 at the last visit — ideal. Weight is down 0.5 kg since the diet adjustment, which is the direction we wanted.",
    recommendations: [
      "Keep to a single-animal-protein diet. Lamb and fish are both well tolerated.",
      "Weigh food rather than using a scoop — scoops vary by more than the diet does.",
      "Hold the current portion for three more weeks before adjusting again.",
      "Keep treats under 10% of daily calories, and subtract them from meals.",
      "Continue the omega-3 supplement alongside the dermatitis plan.",
    ],
    avoid: [
      "Anything chicken-based — confirmed protein sensitivity.",
      "Cooked bones, fried leftovers and masala food.",
      "Milk and milk-based sweets.",
      "Free-feeding; two measured meals works better for weight control.",
    ],
    recommendedProductSlugs: [
      "hypoallergenic-adult-dog-food-lamb-rice",
      "omega-3-skin-coat-oil",
      "freeze-dried-lamb-training-treats",
      "slow-feeder-bowl",
    ],
    disclaimer:
      "Calculated from your pet's recorded weight, age, neuter status and activity level, and reviewed against the care plan from the last visit. Adjust only with your vet's input.",
  };
}
