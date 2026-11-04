import type { Breed, Guide, Plan } from "@/lib/types";
import { addDays } from "./clock";

const vetAuthor = {
  name: "Dr. Kavita Rao",
  credentials: "BVSc & AH, MVSc (Medicine)",
  photoUrl: "/images/avatars/vet-1.svg",
};

const nutritionAuthor = {
  name: "Dr. Sneha Patil",
  credentials: "BVSc & AH, PG Dip (Nutrition)",
  photoUrl: "/images/avatars/vet-3.svg",
};

const felineAuthor = {
  name: "Dr. Imran Qureshi",
  credentials: "BVSc & AH",
  photoUrl: "/images/avatars/vet-2.svg",
};

export const mockGuides: Guide[] = [
  {
    id: "gd_01",
    slug: "puppy-vaccination-schedule-india",
    title: "The puppy vaccination schedule, explained for India",
    excerpt:
      "What your puppy needs, when they need it, and why the first sixteen weeks matter more than any other period of their life.",
    category: "Preventive care",
    tags: ["puppy", "vaccination", "schedule"],
    coverImage: "/images/guides/vaccination.svg",
    readingMinutes: 7,
    publishedAt: addDays(-45),
    updatedAt: addDays(-12),
    author: vetAuthor,
    featured: true,
    relatedSlugs: ["deworming-schedule-dogs-cats", "tick-and-flea-prevention-india"],
    body: `Vaccination is the single highest-return thing you will do for your puppy, and the window for doing it well is narrow. Maternal antibodies protect a puppy for the first weeks of life, then fade — and the fade is unpredictable. That gap, somewhere between six and sixteen weeks, is when most preventable illness happens.

## The core schedule

In India, most vets follow a schedule close to this one. Your vet may adjust it based on local disease pressure and your puppy's history.

- **6–8 weeks** — First DHPPi (distemper, hepatitis, parvovirus, parainfluenza).
- **10–12 weeks** — Second DHPPi, usually with leptospirosis.
- **14–16 weeks** — Third DHPPi + Lepto, and the first rabies dose.
- **12 months** — First annual booster, then yearly for life.

Rabies deserves separate mention. It is legally required in most Indian municipalities, it is invariably fatal once symptoms appear, and it is transmissible to you. There is no version of responsible dog ownership in India that skips it.

## Why the last dose is the one people miss

By fourteen weeks the puppy looks healthy, has been to the vet twice already, and the household has relaxed. This is exactly when the final dose gets postponed — and the final dose is the one that carries protection through the vulnerable period. A two-dose puppy is a partially protected puppy.

## Before the needle

A vaccine works on a healthy immune system. Tell your vet if your puppy has had loose stools, reduced appetite, or any fever in the previous few days. A delay of a week is harmless; vaccinating a sick puppy is not.

Deworming should be current before vaccination. A heavy worm burden blunts the immune response, which is why most vets will deworm two weeks before the first shot.

## What to expect afterwards

Mild lethargy and a slightly sore injection site for twenty-four hours is normal and expected. What is not normal: facial swelling, repeated vomiting, hives, or collapse. Those are signs of an allergic reaction and need a vet immediately — which is one reason we suggest scheduling vaccinations in the morning rather than late evening.

## Keeping the record

Vaccination certificates are needed for boarding, travel, housing societies, and sometimes for a flight. Paper cards get lost. Photograph each certificate the day it's issued, and if your puppy's record lives in a Tailish Health Passport, batch numbers and due dates are stored with it and the next dose is scheduled automatically.`,
  },
  {
    id: "gd_02",
    slug: "tick-and-flea-prevention-india",
    title: "Tick and flea prevention through the Indian monsoon",
    excerpt:
      "Ticks peak when humidity does. Here is what actually works, what doesn't, and how to treat the house as well as the dog.",
    category: "Preventive care",
    tags: ["ticks", "fleas", "monsoon", "parasites"],
    coverImage: "/images/guides/ticks.svg",
    readingMinutes: 6,
    publishedAt: addDays(-28),
    author: vetAuthor,
    featured: true,
    relatedSlugs: ["deworming-schedule-dogs-cats", "monsoon-skin-problems-dogs"],
    body: `Ticks are not a nuisance. They are a vector for babesiosis and ehrlichiosis, both of which land dogs in hospital every monsoon in this city, and both of which are far easier to prevent than to treat.

## Why the monsoon is different

Tick life cycles accelerate in warmth and humidity. A female drops off your dog, lays a few thousand eggs in a crack in your balcony wall, and three weeks later you have an infestation that didn't exist when the rains started. The dog is the visible part of the problem; the environment is the actual problem.

## What works

- **Monthly spot-on treatment.** The reliable backbone of prevention. Applied to the skin between the shoulder blades, not the fur.
- **Long-acting collars.** Six to eight months of protection, good for dogs who swim or spend time in green cover.
- **Oral chewables.** Convenient, and unaffected by bathing.

Your vet will pick between these based on your dog's weight, age and lifestyle. What matters more than which one you choose is that you apply it on schedule — a dose given two weeks late is a two-week gap in protection.

## What doesn't work on its own

Anti-tick shampoos kill the ticks on the dog at that moment, and nothing else. They have a role during an active infestation, alongside a spot-on. They are not prevention.

Neem, garlic and essential-oil remedies circulate widely online. They do not achieve reliable kill rates, and several essential oils — tea tree especially — are genuinely toxic to cats.

## Treating the environment

If you have found ticks on your dog, you have ticks in your home.

- Wash all bedding at the hottest safe temperature.
- Vacuum daily for a week, including sofa seams and skirting boards. Empty the vacuum outside.
- Seal cracks in balcony and terrace walls where eggs are laid.
- Treat the premises, not just the pet, if the infestation is established.

## Checking properly

Run your fingers slowly through the coat against the direction of hair growth, every day during the monsoon. Pay attention to the ears, the webbing between toes, under the collar, the armpits and the groin — the warm, thin-skinned places ticks prefer.

If you find one, remove it with a tick hook or fine tweezers, gripping as close to the skin as possible and pulling straight out with steady pressure. Don't twist, don't burn it, don't smother it in oil. Those methods make the tick regurgitate into the bite, which is precisely how disease transmits.

## When to call a vet

Lethargy, pale gums, fever, dark urine or a reluctance to stand after tick exposure are urgent. Tick fever responds well to early treatment and badly to late treatment.`,
  },
  {
    id: "gd_03",
    slug: "foods-toxic-to-dogs-and-cats",
    title: "Foods that are genuinely dangerous for dogs and cats",
    excerpt:
      "A short, honest list — what's actually toxic, what's merely unwise, and what to do in the first ten minutes.",
    category: "Nutrition",
    tags: ["nutrition", "safety", "emergency"],
    coverImage: "/images/guides/food-safety.svg",
    readingMinutes: 5,
    publishedAt: addDays(-60),
    author: nutritionAuthor,
    relatedSlugs: ["how-much-should-my-dog-eat", "puppy-vaccination-schedule-india"],
    body: `Most of what gets shared about toxic foods is either exaggerated or missing the dose that actually matters. Here is the version worth keeping.

## Genuinely toxic — treat as an emergency

- **Xylitol** (in sugar-free gum, some peanut butters, some medicines). Causes a dangerous insulin release in dogs within thirty minutes. Among the most lethal items on this list, in very small amounts.
- **Chocolate**, particularly dark and baking chocolate. Theobromine. Severity scales with cocoa content and the dog's weight.
- **Grapes and raisins.** Can cause acute kidney failure in dogs. There is no established safe dose, and sensitivity varies between individuals for reasons that remain unclear.
- **Onion, garlic, leeks, chives** — including in cooked form, and including in the gravy of leftover sabzi. Damages red blood cells. Cats are more sensitive than dogs.
- **Macadamia nuts.** Weakness, tremors and hyperthermia in dogs.
- **Alcohol and raw dough.** Raw dough ferments in the stomach, producing both alcohol and expansion.

## Dangerous for a different reason

- **Cooked bones.** They splinter. Chicken bones from your plate are a common cause of intestinal perforation.
- **Milk.** Most adult dogs and cats are lactose intolerant. Not toxic, but a reliable route to diarrhoea.
- **Very fatty food.** A plate of fried leftovers can trigger pancreatitis, which is painful, expensive and occasionally fatal.

## Cat-specific

Cats cannot process several compounds dogs tolerate. **Paracetamol is lethal to cats** in doses a person wouldn't think twice about — never medicate a cat with anything from your own cabinet. Lilies, including the pollen and the vase water, cause kidney failure in cats.

## If your pet has eaten something

1. Work out *what*, *how much*, and *when*. Keep the packaging.
2. Call a vet immediately. Do not wait for symptoms — for most of this list, by the time symptoms appear the window for the easiest intervention has closed.
3. **Do not induce vomiting unless a vet tells you to.** With corrosive substances and with some situations it makes the injury worse.

If you are unsure whether something is a problem, ask. A two-minute conversation is cheaper than an overnight stay.`,
  },
  {
    id: "gd_04",
    slug: "how-much-should-my-dog-eat",
    title: "How much should my dog actually eat?",
    excerpt:
      "The number on the back of the bag is a starting point, not an instruction. Here's how to adjust it using your hands.",
    category: "Nutrition",
    tags: ["nutrition", "weight", "feeding"],
    coverImage: "/images/guides/nutrition.svg",
    readingMinutes: 6,
    publishedAt: addDays(-21),
    author: nutritionAuthor,
    relatedSlugs: ["foods-toxic-to-dogs-and-cats", "senior-dog-care-checklist"],
    body: `Feeding guidelines on a pack are calculated for an average, intact, moderately active dog. Your dog is probably none of those things. A neutered, apartment-living Labrador may need twenty to thirty percent less than the bag suggests.

## Start with body condition, not the scale

Weight alone tells you little. Body condition scoring tells you a lot, and you can do it at home in thirty seconds.

- **Ribs.** You should feel them easily under a thin layer of fat, with light pressure. Like the back of your hand, not your knuckles and not your palm.
- **Waist.** Looking down from above, there should be a visible narrowing behind the ribs.
- **Tuck.** From the side, the belly should rise from the ribcage towards the hind legs.

If you cannot feel ribs without pressing, your dog is carrying excess weight. If ribs are visible from across the room, there is too little.

## Adjusting

Change the quantity by about ten percent, then hold it there for three to four weeks before judging. Weekly weigh-ins on a changing diet tell you about water and gut contents, not about fat.

Weigh food rather than scooping it. Two "cups" measured by two people differ by more than most diets do.

## Treats count

This is where most well-fed dogs become overweight dogs. Treats should stay under ten percent of daily calories. Training sessions are the usual culprit — use the smallest piece that still motivates, and subtract it from the meal.

## Meal frequency

Adult dogs: twice daily. Puppies under four months: three to four times. Large, deep-chested breeds: split meals and avoid vigorous exercise immediately around them, because bloat risk is real and sudden.

## When weight won't shift

If you have reduced intake honestly for two months and nothing has changed, stop adjusting the food and see a vet. Hypothyroidism and Cushing's both present this way, and neither responds to portion control.`,
  },
  {
    id: "gd_05",
    slug: "monsoon-skin-problems-dogs",
    title: "Monsoon skin problems in dogs, and what to do early",
    excerpt:
      "Hot spots, yeast and fungal infections spike with the humidity. Catching them in the first two days changes everything.",
    category: "Health",
    tags: ["skin", "monsoon", "dermatology"],
    coverImage: "/images/guides/skin.svg",
    readingMinutes: 5,
    publishedAt: addDays(-15),
    author: vetAuthor,
    relatedSlugs: ["tick-and-flea-prevention-india", "when-to-see-a-vet-urgently"],
    body: `Humidity does two things to dog skin: it keeps the coat damp for longer, and it lets yeast and bacteria that normally live there harmlessly multiply past the point of balance. Dogs with heavy coats, skin folds, or floppy ears have the hardest time.

## What you'll see first

- Persistent scratching or licking at one spot
- A warm, red, moist patch that seems to appear overnight — a hot spot
- A musty smell, particularly from ears or paws
- Red-brown staining on light fur between the toes
- Head shaking or one ear held lower

## The first forty-eight hours

A hot spot can go from a coin-sized patch to a palm-sized wound in a day, because the dog licks it and licking keeps it wet.

1. Clip the hair around it if you can do so safely. Air is the enemy of the infection.
2. Clean gently with a vet-advised antiseptic. Not Dettol, not spirit.
3. **Stop the licking.** A cone is not cruelty; letting a wound triple in size is.
4. Keep the area dry.

## Routine that prevents most of it

- Dry thoroughly after every walk in the rain — especially between toes, under the collar and in skin folds. A towel is fine; a cool blow-dryer is better for thick coats.
- Clean ears weekly in floppy-eared breeds, with a proper ear cleaner.
- Brush more often during monsoon. Matted fur traps moisture against the skin.
- Keep parasite control current. Flea-allergy dermatitis looks exactly like this and resolves only when the fleas do.

## When it needs a vet, not a shampoo

Spreading redness, pus, a bad smell, bleeding, pain on touch, or a dog who is off their food — these need prescription treatment. So does any skin problem that keeps returning in the same place, because recurrence usually means there is an underlying allergy that medicated baths alone will not fix.`,
  },
  {
    id: "gd_06",
    slug: "bringing-home-a-kitten",
    title: "Bringing home a kitten: the first thirty days",
    excerpt:
      "One room, not the whole house. Here's the setup that makes the difference between a confident cat and a scared one.",
    category: "Cats",
    tags: ["kitten", "cats", "new-pet"],
    coverImage: "/images/guides/kitten.svg",
    readingMinutes: 6,
    publishedAt: addDays(-34),
    author: felineAuthor,
    relatedSlugs: ["cat-litter-box-problems", "puppy-vaccination-schedule-india"],
    body: `Kittens do not benefit from the run of a house on day one. A large, unfamiliar space with no identifiable safe corner produces a kitten who hides under furniture for a fortnight.

## Start with one room

Set up a single room — a bathroom or spare bedroom works — with everything the kitten needs and nothing they can be hurt by.

- A litter tray at one end, food and water at the other. Cats will not reliably use a tray next to their food.
- A covered hiding spot: a cardboard box on its side is genuinely better than most purchased igloos.
- Something vertical to climb. Height is where cats feel safe.
- Toys that move, and no toys with loose string or small detachable parts.

Let the kitten come out on their own schedule. Sit on the floor, read something out loud, and don't reach for them. Expanding to the rest of the house works best over a week or two, one room at a time.

## Health, in the first week

Book a vet check within the first few days, even if the kitten appears well. That visit should cover:

- A general examination and weight
- Deworming — most kittens from Indian streets and shelters carry worms
- A check for ear mites and fleas
- The vaccination plan: FVRCP from around eight weeks, rabies from twelve

## Litter training

Kittens mostly train themselves if the setup is right. Use an unscented, fine-grained litter, keep the tray scrupulously clean, and provide one tray per cat plus one extra. If a kitten starts going outside the tray, that is nearly always a problem with the tray, the location, or health — not defiance.

## Handling and socialisation

The window for socialisation in cats closes early — around nine weeks. Within whatever time you have, handle the paws, look in the ears, touch the mouth, and do it gently and often, paired with a treat. The adult cat who tolerates nail trims and medication is made in these weeks.

## Kitten-proofing

Lilies are lethal to cats. So are several houseplants. Secure window grilles and balcony gaps — "high-rise syndrome" is a real and regular emergency. Tuck away loose wires, hair ties and thread; linear foreign bodies are among the more serious things we take out of kittens.`,
  },
  {
    id: "gd_07",
    slug: "when-to-see-a-vet-urgently",
    title: "When it's an emergency: signs that shouldn't wait until morning",
    excerpt:
      "A clear list you can act on at 2 AM, without second-guessing yourself.",
    category: "Emergency",
    tags: ["emergency", "first-aid", "urgent"],
    coverImage: "/images/guides/emergency.svg",
    readingMinutes: 4,
    publishedAt: addDays(-8),
    author: vetAuthor,
    featured: true,
    relatedSlugs: ["foods-toxic-to-dogs-and-cats", "monsoon-skin-problems-dogs"],
    body: `Most worries can wait for a morning appointment. These cannot. If you see any of the following, go to an emergency hospital now — do not wait to see whether it settles.

## Go immediately

- **Difficulty breathing.** Open-mouth breathing in a cat, stretched-out neck, blue or grey gums, loud effortful breaths.
- **Unproductive retching with a swollen, hard belly** in a large-breed dog. This is bloat, and it is measured in hours.
- **Collapse, seizure, or inability to stand.**
- **A male cat straining in the litter tray** and producing nothing. A urinary blockage is fatal within a day or two, and it is often mistaken for constipation.
- **Pale white or grey gums.** Press a gum; colour should return in under two seconds.
- **Heavy bleeding** that doesn't slow with five minutes of firm pressure.
- **Suspected poisoning** — bring the packaging.
- **Road traffic accident or a fall from height**, even if the animal gets up and seems fine. Internal bleeding presents late.
- **Repeated vomiting with lethargy**, especially with a known history of chewing non-food objects.
- **Whelping difficulty** — more than thirty minutes of strong straining without a pup.
- **Eye injury**, or a suddenly painful, cloudy, bulging eye.

## Go today, but it isn't a 2 AM drive

Limping that persists past a day, a single vomit in an otherwise bright animal, mild diarrhoea without blood, a small wound that isn't bleeding, reduced appetite for one meal, mild ear scratching.

## Before you leave the house

Call ahead. An emergency hospital that knows you're coming can have the right things ready. If you don't know which hospital is open, Tailish keeps a list of 24-hour emergency vets near you with live phone numbers.

Carry your pet's medication list and any recent reports. In an emergency, the history is often the thing that saves the most time.

## What we don't do

Tailish never diagnoses an emergency over chat. If what you describe sounds urgent, we tell you to go, and we tell you where. That's the only safe way to handle it.`,
  },
  {
    id: "gd_08",
    slug: "senior-dog-care-checklist",
    title: "Caring for a senior dog: a practical checklist",
    excerpt:
      "What changes after seven, what to screen for, and the small adjustments at home that matter most.",
    category: "Health",
    tags: ["senior", "arthritis", "preventive"],
    coverImage: "/images/guides/senior.svg",
    readingMinutes: 6,
    publishedAt: addDays(-52),
    author: vetAuthor,
    relatedSlugs: ["how-much-should-my-dog-eat", "when-to-see-a-vet-urgently"],
    body: `"Senior" arrives earlier in large breeds — around six for a Great Dane, closer to nine for a small terrier. The transition is gradual, which is exactly why it gets missed. Owners often describe a dog who is "just slowing down" when what's happening is treatable pain.

## Twice-yearly check-ups

Annual becomes six-monthly after seven. A great deal changes in a senior year, and the point of screening is to find things while they are still cheap and manageable.

A useful senior panel covers blood count and biochemistry, kidney and liver values, thyroid, urine analysis, blood pressure, and a dental assessment.

## Arthritis is the thing most often missed

Dogs don't limp dramatically; they adapt. Watch for hesitation before stairs, difficulty rising after a nap, reluctance to jump into the car, sleeping more, or new irritability when touched over the hips.

Arthritis responds well to a combination of weight control, joint supplementation, controlled daily exercise, and — when a vet thinks it's warranted — pain relief. Never give human painkillers. Ibuprofen and paracetamol cause serious harm to dogs and cats.

## Adjusting the house

- Non-slip mats or runners on smooth floors. Slipping is both an injury risk and a confidence drain.
- A ramp or step for the sofa, bed or car.
- An orthopaedic bed away from draughts.
- Raised food and water bowls for dogs with neck or shoulder pain.

## Cognitive change

Night-time pacing, staring at walls, getting stuck in corners, forgetting house training, or a changed sleep-wake cycle can signal canine cognitive dysfunction. It is manageable — there are diets, supplements and medication that help — and it is worth raising rather than accepting as "old age".

## Diet

Senior dogs usually need fewer calories and good-quality, digestible protein — not less protein, which is a persistent myth. Keeping a senior lean is the single most effective thing you can do for their joints and their lifespan.

## The conversation worth having early

Talk to your vet about what quality of life looks like for your dog, before you're making the decision in a crisis. Having that conversation when nothing is urgent is a kindness to yourself as much as to them.`,
  },
  {
    id: "gd_09",
    slug: "cat-litter-box-problems",
    title: "Why your cat stopped using the litter box",
    excerpt:
      "It's almost never spite. Work through health first, then the box, then the environment.",
    category: "Cats",
    tags: ["cats", "behaviour", "litter"],
    coverImage: "/images/guides/litter.svg",
    readingMinutes: 5,
    publishedAt: addDays(-40),
    author: felineAuthor,
    relatedSlugs: ["bringing-home-a-kitten", "when-to-see-a-vet-urgently"],
    body: `A cat who was reliable and now isn't is telling you something. The order in which you investigate matters, because the first category is the urgent one.

## First: rule out medical causes

Urinary tract infection, crystals, bladder stones, kidney disease, diabetes, arthritis making the box hard to climb into, and in older cats, cognitive change — all present as "stopped using the box".

**A male cat straining without producing urine is an emergency.** Blockage kills within a day or two. Do not spend that day rearranging litter trays.

Book a vet visit with a urine sample before you change anything else.

## Second: the box itself

Cats are specific, and most litter box setups are built for human convenience.

- **Number.** One tray per cat, plus one spare. Two cats need three trays.
- **Size.** The tray should be about one and a half times the cat's length. Most commercial trays are too small.
- **Cover.** Many cats dislike hoods — they trap smell and remove escape routes. Try uncovered.
- **Litter.** Unscented, fine-grained clumping suits most cats. Scented litter is marketed to people, not cats.
- **Depth.** Three to four centimetres. Deeper isn't better.
- **Cleanliness.** Scoop at least daily. A cat's threshold for a dirty tray is considerably lower than yours.

## Third: location

Quiet, accessible, with more than one way out. Not beside a washing machine that starts without warning, not next to the food bowls, and not somewhere a dog or another cat can corner them. For senior cats, a tray on each floor, with a low entry side.

## Fourth: stress

New pet, new baby, moved furniture, a neighbourhood cat visible through a window, building work. Cats mark and avoid when they feel their territory is uncertain. Pheromone diffusers, more vertical space, and restoring predictable routines all help.

## Cleaning up properly

Use an enzymatic cleaner. Ammonia-based cleaners smell like urine to a cat and actively invite a repeat. Never punish — it reliably makes the problem worse, because it adds anxiety to a situation that is often caused by anxiety.`,
  },
  {
    id: "gd_10",
    slug: "deworming-schedule-dogs-cats",
    title: "Deworming: how often, and why the schedule changes with age",
    excerpt:
      "Puppies and kittens need it far more often than most people realise. A simple schedule you can follow.",
    category: "Preventive care",
    tags: ["deworming", "parasites", "puppy", "kitten"],
    coverImage: "/images/guides/deworming.svg",
    readingMinutes: 4,
    publishedAt: addDays(-70),
    author: nutritionAuthor,
    relatedSlugs: ["puppy-vaccination-schedule-india", "tick-and-flea-prevention-india"],
    body: `Intestinal worms are close to universal in young animals in India, and several of them are transmissible to people — particularly to children. Deworming is routine, cheap and genuinely important.

## The schedule

**Puppies and kittens**
- Every two weeks from two weeks of age until twelve weeks
- Then monthly until six months
- Then quarterly for life

**Adults**
- Every three months as standard
- More often for dogs who scavenge, hunt, or live with young children

**Pregnant and nursing mothers**
- Follow your vet's protocol; roundworms pass to the litter through the placenta and milk, so treating the mother protects the litter.

## Why quarterly

The interval isn't arbitrary — it tracks the life cycle of common worms. Stretching it to twice a year lets a population re-establish between doses, which defeats the purpose.

## Broad spectrum matters

A dewormer that covers roundworm only leaves tapeworm untouched. Tapeworm in particular is tied to fleas — a dog with recurring tapeworm almost always has a flea problem that hasn't been addressed.

## Signs that there's a burden

A pot-bellied puppy with a dull coat; visible rice-grain segments around the tail; scooting; diarrhoea, sometimes with blood; weight loss despite a good appetite; coughing in heavy roundworm infections.

A clean-looking animal can still carry worms. The absence of signs is not evidence of absence.

## Dose by weight

Underdosing is the most common mistake and it breeds resistance. Weigh your pet rather than estimating — a growing puppy can outpace your estimate in a fortnight.

## For the household

Pick up faeces promptly, wash hands after handling pets and soil, keep children's sandpits covered, and keep the whole household's pets on the same schedule. Treating one pet in a multi-pet home is a short-lived fix.`,
  },
];

export const mockBreeds: Breed[] = [
  {
    id: "brd_01",
    name: "Golden Retriever",
    species: "dog",
    sizeCategory: "large",
    lifeExpectancy: "10–12 years",
    typicalWeightKg: { min: 25, max: 34 },
    temperament: ["Gentle", "Eager to please", "Sociable", "Patient with children"],
    groomingNeeds: "high",
    exerciseNeeds: "high",
    commonConditions: [
      "Hip and elbow dysplasia",
      "Atopic dermatitis",
      "Hypothyroidism",
      "Ear infections",
    ],
    climateNote:
      "The dense double coat struggles in Indian summers. Walk early and late, never shave the coat — it insulates against heat as well as cold — and watch closely for heatstroke.",
    imageUrl: "/images/breeds/golden-retriever.svg",
    summary:
      "An exceptionally social family dog that does badly when left alone for long stretches. High grooming and high exercise, with skin and joints as the two areas to watch in Indian conditions.",
  },
  {
    id: "brd_02",
    name: "Labrador Retriever",
    species: "dog",
    sizeCategory: "large",
    lifeExpectancy: "10–12 years",
    typicalWeightKg: { min: 25, max: 36 },
    temperament: ["Friendly", "Food-motivated", "Trainable", "Energetic"],
    groomingNeeds: "moderate",
    exerciseNeeds: "high",
    commonConditions: ["Obesity", "Hip dysplasia", "Ear infections", "Exercise-induced collapse"],
    climateNote:
      "Copes with Indian heat better than most large breeds but overheats when exercised at midday. The single biggest health risk is weight — Labradors carry a genetic variant that blunts their sense of fullness.",
    imageUrl: "/images/breeds/labrador.svg",
    summary:
      "India's most popular large breed, for good reason. Easy to train, easy to overfeed. Strict portion control and daily exercise prevent most of what goes wrong.",
  },
  {
    id: "brd_03",
    name: "Indian Pariah Dog",
    species: "dog",
    sizeCategory: "medium",
    lifeExpectancy: "13–16 years",
    typicalWeightKg: { min: 15, max: 25 },
    temperament: ["Alert", "Independent", "Loyal", "Highly adaptable"],
    groomingNeeds: "low",
    exerciseNeeds: "moderate",
    commonConditions: ["Tick-borne illness", "Injuries from street life (in rescues)"],
    climateNote:
      "Evolved for this climate. The short single coat, efficient cooling and natural disease resistance make this the lowest-maintenance dog you can own in India.",
    imageUrl: "/images/breeds/indie.svg",
    summary:
      "Genuinely the healthiest dog for Indian homes — long-lived, heat-adapted and low maintenance. Needs early socialisation, and rewards patience with deep loyalty.",
  },
  {
    id: "brd_04",
    name: "German Shepherd",
    species: "dog",
    sizeCategory: "large",
    lifeExpectancy: "9–13 years",
    typicalWeightKg: { min: 22, max: 40 },
    temperament: ["Confident", "Protective", "Highly trainable", "Work-driven"],
    groomingNeeds: "high",
    exerciseNeeds: "high",
    commonConditions: [
      "Hip and elbow dysplasia",
      "Degenerative myelopathy",
      "Bloat (GDV)",
      "Exocrine pancreatic insufficiency",
    ],
    climateNote:
      "Heavy coat and high drive are a difficult combination in summer. Needs shade, cool flooring and exercise restricted to early morning and night.",
    imageUrl: "/images/breeds/gsd.svg",
    summary:
      "A working dog that needs a job. Without structured training and real mental work, the intelligence turns into anxiety and destructiveness. Screen hips before buying.",
  },
  {
    id: "brd_05",
    name: "Indian Shorthair (Billi)",
    species: "cat",
    sizeCategory: "small",
    lifeExpectancy: "14–18 years",
    typicalWeightKg: { min: 3, max: 5 },
    temperament: ["Independent", "Alert", "Affectionate on their terms", "Excellent hunters"],
    groomingNeeds: "low",
    exerciseNeeds: "moderate",
    commonConditions: ["Dental disease", "Urinary issues in neutered males", "Parasites"],
    climateNote:
      "Perfectly suited to the climate. Needs reliable shade and fresh water; indoor cats need vertical space and daily play to stay well.",
    imageUrl: "/images/breeds/indian-shorthair.svg",
    summary:
      "Hardy, long-lived and low maintenance. Neuter early, keep dental health under review, and ensure indoor cats get real play — hunting behaviour needs an outlet.",
  },
  {
    id: "brd_06",
    name: "Persian",
    species: "cat",
    sizeCategory: "medium",
    lifeExpectancy: "12–16 years",
    typicalWeightKg: { min: 3.5, max: 6 },
    temperament: ["Calm", "Quiet", "Affectionate", "Low activity"],
    groomingNeeds: "high",
    exerciseNeeds: "low",
    commonConditions: [
      "Brachycephalic airway issues",
      "Polycystic kidney disease",
      "Excessive tear staining",
      "Dental malocclusion",
    ],
    climateNote:
      "The flat face and long coat make heat genuinely dangerous. Air conditioning or reliable cooling is close to a requirement in an Indian summer.",
    imageUrl: "/images/breeds/persian.svg",
    summary:
      "Beautiful and demanding. Daily brushing is non-negotiable, facial folds need cleaning, and breathing should be monitored. Ask for PKD screening from any breeder.",
  },
];

export const mockPlans: Plan[] = [
  {
    id: "pln_01",
    slug: "essential",
    name: "Essential",
    tagline: "The basics, handled — records, reminders and a vet when you need one.",
    pricePerYear: 1999,
    pricePerMonth: 199,
    ctaLabel: "Start with Essential",
    features: [
      { label: "Health Passport for up to 2 pets", included: true },
      { label: "Automatic vaccination & deworming reminders", included: true },
      { label: "Ask Tailish — unlimited care questions", included: true },
      { label: "2 video consults a year", included: true },
      { label: "5% off everything in the shop", included: true },
      { label: "Home visits at member pricing", included: true },
      { label: "Free home visits", included: false },
      { label: "Annual wellness panel", included: false },
      { label: "Priority emergency routing", included: false },
    ],
  },
  {
    id: "pln_02",
    slug: "carepass",
    name: "CarePass",
    tagline: "Our most popular plan — proactive care across the whole year.",
    pricePerYear: 5999,
    pricePerMonth: 549,
    popular: true,
    savingsNote: "Members save about ₹4,200 a year on average",
    ctaLabel: "Get CarePass",
    features: [
      { label: "Health Passport for up to 4 pets", included: true },
      { label: "Automatic vaccination & deworming reminders", included: true },
      { label: "Ask Tailish — unlimited care questions", included: true },
      { label: "Unlimited video consults", included: true },
      { label: "12% off everything in the shop", included: true },
      { label: "Home visits at member pricing", included: true },
      { label: "2 free home visits a year", included: true },
      { label: "Annual wellness panel included", included: true },
      { label: "Priority emergency routing", included: false },
    ],
  },
  {
    id: "pln_03",
    slug: "carepass-plus",
    name: "CarePass+",
    tagline: "For multi-pet homes and seniors who need closer monitoring.",
    pricePerYear: 11999,
    pricePerMonth: 1099,
    ctaLabel: "Get CarePass+",
    features: [
      { label: "Health Passport for unlimited pets", included: true },
      { label: "Automatic vaccination & deworming reminders", included: true },
      { label: "Ask Tailish — unlimited care questions", included: true },
      { label: "Unlimited video consults", included: true },
      { label: "18% off everything in the shop", included: true },
      { label: "Home visits at member pricing", included: true },
      { label: "6 free home visits a year", included: true },
      { label: "Two wellness panels a year", included: true },
      { label: "Priority emergency routing & care manager", included: true },
    ],
  },
];
