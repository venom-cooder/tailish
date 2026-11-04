/**
 * Tailish domain model.
 *
 * These interfaces are the contract between the frontend and the Tailish
 * backend. The mock adapter in /lib/mock produces exactly these shapes, so
 * pointing the app at a real API is a transport swap, not a refactor.
 */

/* ------------------------------------------------------------------ shared */

/**
 * Provenance of a clinical record. Rendered as a trust badge in the UI so a
 * pet parent can always tell who asserted a fact about their pet.
 */
export type RecordSource =
  | "parent_entered"
  | "ai_extracted_draft"
  | "document_verified"
  | "vet_verified";

export type Species = "dog" | "cat" | "rabbit" | "bird" | "other";
export type Sex = "male" | "female" | "unknown";
export type LifeStage = "puppy_kitten" | "adult" | "senior" | "all";

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/** Uniform error envelope thrown by every API call. */
export interface ApiErrorShape {
  status: number;
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/* -------------------------------------------------------------------- auth */

export interface OtpRequestResult {
  requestId: string;
  phone: string;
  /** Seconds until the code expires. */
  expiresInSec: number;
  /** Present only in mock/dev builds so the demo is walkable. */
  devCode?: string;
}

export interface Session {
  authenticated: boolean;
  parent: PetParent | null;
  token: string | null;
}

/* ----------------------------------------------------------------- account */

export interface PetParent {
  id: string;
  name: string;
  phone: string;
  email?: string;
  photoUrl?: string;
  city?: string;
  preferredLanguage: "en" | "hi";
  createdAt: string;
}

export type AddressLabel = "home" | "work" | "other";

export interface Address {
  id: string;
  label: AddressLabel;
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  /** Contact at this address; defaults to the account holder. */
  contactName?: string;
  contactPhone?: string;
  isDefault: boolean;
  geo?: { lat: number; lng: number };
}

export type DelegateRole = "family" | "emergency" | "caretaker" | "vet";

export interface FamilyDelegate {
  id: string;
  name: string;
  phone: string;
  relation: string;
  role: DelegateRole;
  /** Pet ids this delegate can see. Empty array = all pets. */
  petIds: string[];
  canBookVisits: boolean;
  canViewPassport: boolean;
  status: "active" | "invited" | "revoked";
  invitedAt: string;
}

export interface NotificationSettings {
  vaccinationReminders: boolean;
  medicationReminders: boolean;
  visitUpdates: boolean;
  orderUpdates: boolean;
  careTips: boolean;
  offers: boolean;
  channels: {
    whatsapp: boolean;
    sms: boolean;
    email: boolean;
    push: boolean;
  };
  quietHours: { enabled: boolean; from: string; to: string };
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  category: "reminder" | "visit" | "order" | "passport" | "tip";
  createdAt: string;
  read: boolean;
  href?: string;
}

/* -------------------------------------------------------------------- pets */

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed: string;
  /** ISO date of birth when known; otherwise use `ageMonths`. */
  birthDate?: string;
  ageMonths?: number;
  sex: Sex;
  neutered: boolean;
  weightKg: number;
  photoUrl?: string;
  microchipId?: string;
  colorMarkings?: string;
  source: RecordSource;
  /** Denormalised for list screens. */
  passportId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PetInput {
  name: string;
  species: Species;
  breed: string;
  birthDate?: string;
  ageMonths?: number;
  sex: Sex;
  neutered: boolean;
  weightKg: number;
  photoUrl?: string;
  microchipId?: string;
  colorMarkings?: string;
}

/* ---------------------------------------------------------------- passport */

export type VaccinationStatus = "upcoming" | "due" | "overdue" | "completed";

export interface Vaccination {
  id: string;
  petId: string;
  vaccineName: string;
  /** e.g. "DHPPi + Lepto" manufacturer/batch detail. */
  brand?: string;
  batchNo?: string;
  dateGiven: string;
  nextDueDate?: string;
  administeredBy?: string;
  status: VaccinationStatus;
  source: RecordSource;
  notes?: string;
}

export interface Weight {
  id: string;
  petId: string;
  weightKg: number;
  measuredOn: string;
  measuredBy?: string;
  source: RecordSource;
  note?: string;
}

export type ConditionType = "allergy" | "chronic" | "acute" | "surgical" | "behavioural";
export type ConditionStatus = "active" | "resolved" | "monitoring";

export interface Condition {
  id: string;
  petId: string;
  name: string;
  type: ConditionType;
  status: ConditionStatus;
  diagnosedOn?: string;
  notes?: string;
  source: RecordSource;
}

export interface Medication {
  id: string;
  petId: string;
  name: string;
  dosage: string;
  frequency: string;
  route?: string;
  startDate: string;
  endDate?: string;
  prescribedBy?: string;
  active: boolean;
  source: RecordSource;
  notes?: string;
}

export type DocType =
  | "prescription"
  | "lab_report"
  | "imaging"
  | "vaccination_card"
  | "discharge_summary"
  | "invoice"
  | "other";

export interface MedicalDocument {
  id: string;
  petId: string;
  docType: DocType;
  title: string;
  fileUrl: string;
  fileName: string;
  fileSizeKb: number;
  mimeType: string;
  uploadedAt: string;
  issuedOn?: string;
  issuedBy?: string;
  status: "processing" | "verified" | "needs_review";
  source: RecordSource;
}

export type TimelineCategory =
  | "visit"
  | "vaccination"
  | "medication"
  | "document"
  | "weight"
  | "order"
  | "note";

export interface TimelineEvent {
  id: string;
  petId: string;
  eventDate: string;
  category: TimelineCategory;
  title: string;
  details?: string;
  source: RecordSource;
  /** Deep link into the record this event describes. */
  href?: string;
}

export interface ShareLink {
  shareToken: string;
  url: string;
  petId: string;
  expiresAt: string;
  /** Sections the recipient may view. */
  scope: {
    identity: boolean;
    vaccinations: boolean;
    conditions: boolean;
    medications: boolean;
    documents: boolean;
  };
  createdAt: string;
}

/** Read-only projection served at /p/:shareToken. */
export interface SharedPassport {
  pet: Pet;
  vaccinations: Vaccination[];
  conditions: Condition[];
  medications: Medication[];
  weights: Weight[];
  documents: MedicalDocument[];
  sharedBy: string;
  expiresAt: string;
}

/* ------------------------------------------------------------- ai and care */

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  /** Tappable follow-ups rendered as chips under an assistant message. */
  quickReplies?: string[];
  /** Set when the model routes the conversation to a human vet. */
  escalation?: {
    level: "emergency" | "vet_review" | "none";
    message: string;
  };
  /** Supporting records the answer drew on. */
  citations?: { label: string; href: string }[];
}

export interface AskRequest {
  message: string;
  petId?: string;
  conversationId?: string;
}

export interface AskResponse {
  conversationId: string;
  message: ChatMessage;
}

export type Urgency = "routine" | "soon" | "urgent" | "emergency";

export interface SymptomIntakeRequest {
  petId: string;
  primaryConcern: string;
  durationHours: number;
  answers: Record<string, string>;
}

export interface SymptomIntakeResult {
  intakeId: string;
  urgency: Urgency;
  summary: string;
  /** Plain-language observations — never a diagnosis. */
  observations: string[];
  recommendedServiceSlugs: string[];
  disclaimer: string;
}

export type NearbyType = "vet" | "emergency" | "pharmacy" | "groomer" | "store" | "cafe" | "boarding";

export interface NearbyPlace {
  id: string;
  name: string;
  type: NearbyType;
  area: string;
  city: string;
  address: string;
  phone?: string;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  open24h: boolean;
  openNow: boolean;
  hours: string;
  geo: { lat: number; lng: number };
  tags: string[];
  verified: boolean;
}

/* ---------------------------------------------------------------- services */

export type ServiceSlug =
  | "home-visit"
  | "video-consult"
  | "vaccination"
  | "diagnostics"
  | "book-visit";

export interface Service {
  id: string;
  slug: ServiceSlug;
  name: string;
  shortDescription: string;
  description: string;
  priceFrom: number;
  durationMin: number;
  /** lucide-react icon name, resolved by the UI. */
  icon: string;
  inclusions: string[];
  forSpecies: Species[];
  popular?: boolean;
}

export type ProviderType = "vet" | "vet_tech" | "groomer" | "lab";

export interface Provider {
  id: string;
  name: string;
  type: ProviderType;
  qualifications: string;
  registrationNo: string;
  photoUrl?: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  area: string;
  city: string;
  languages: string[];
  specialities: string[];
  servicesOffered: ServiceSlug[];
  nextAvailable: string;
  verified: boolean;
}

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "on_the_way"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Booking {
  id: string;
  reference: string;
  petId: string;
  petName: string;
  serviceSlug: ServiceSlug;
  serviceName: string;
  providerId?: string;
  providerName?: string;
  scheduledFor: string;
  slotLabel: string;
  status: BookingStatus;
  addressId?: string;
  addressSummary?: string;
  price: number;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: string;
  /** Populated once the visit is complete. */
  visitSummary?: {
    observations: string[];
    carePlan: string[];
    followUpOn?: string;
  };
}

export interface BookingInput {
  petId: string;
  serviceSlug: ServiceSlug;
  providerId?: string;
  scheduledFor: string;
  slotLabel: string;
  addressId?: string;
  notes?: string;
}

/* --------------------------------------------------------------- commerce */

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  productCount: number;
  forSpecies: Species[];
}

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock" | "preorder";

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  brand: string;
  categorySlug: string;
  categoryName: string;
  forSpecies: Species[];
  lifeStage: LifeStage[];
  price: number;
  /** Struck-through reference price when discounted. */
  compareAtPrice?: number;
  description: string;
  highlights: string[];
  ingredients?: string;
  allergenTags: string[];
  weightLabel?: string;
  images: string[];
  rating: number;
  reviewCount: number;
  stockStatus: StockStatus;
  /** Marked in the UI as a paid placement, per advertising disclosure norms. */
  sponsored: boolean;
  /** Needs a valid prescription before checkout. */
  prescriptionRequired?: boolean;
  tags: string[];
}

export interface CartLine {
  id: string;
  productId: string;
  slug: string;
  name: string;
  brand: string;
  image: string;
  unitPrice: number;
  compareAtPrice?: number;
  quantity: number;
  lineTotal: number;
  stockStatus: StockStatus;
  weightLabel?: string;
}

export interface Cart {
  id: string;
  lines: CartLine[];
  itemsSubtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  itemCount: number;
  /** Spend remaining before delivery becomes free. */
  freeDeliveryThreshold: number;
  appliedCoupon?: string;
}

export type OrderStatus =
  | "placed"
  | "confirmed"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded" | "cod";

export interface OrderLine {
  id: string;
  productId: string;
  slug: string;
  name: string;
  brand: string;
  image: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  reference: string;
  lines: OrderLine[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: "upi" | "card" | "netbanking" | "cod";
  itemsSubtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  placedAt: string;
  expectedBy?: string;
  deliveredAt?: string;
  address: Address;
  trackingLink?: string;
  invoiceUrl?: string;
}

export interface CheckoutRequest {
  addressId: string;
  paymentMethod: "upi" | "card" | "netbanking" | "cod";
  couponCode?: string;
  notes?: string;
}

export interface CheckoutResult {
  order: Order;
  payment: {
    id: string;
    provider: "razorpay";
    /** Hosted payment page the browser is redirected to. */
    paymentLink: string;
    amount: number;
    status: PaymentStatus;
  };
}

export interface PaymentStatusResult {
  id: string;
  orderId: string;
  status: PaymentStatus;
  method?: string;
  updatedAt: string;
}

/* -------------------------------------------------------------- reminders */

export type ReminderType =
  | "vaccination"
  | "medication"
  | "deworming"
  | "visit"
  | "grooming"
  | "reorder";

export type ReminderStatus = "pending" | "done" | "snoozed" | "overdue";

export interface Reminder {
  id: string;
  petId: string;
  petName: string;
  type: ReminderType;
  title: string;
  details?: string;
  dueOn: string;
  status: ReminderStatus;
  snoozedUntil?: string;
  actionHref?: string;
}

export type ReminderAction = "done" | "snooze" | "reschedule";

export interface ReminderUpdate {
  action: ReminderAction;
  /** Required for snooze (days) or reschedule (ISO date). */
  snoozeDays?: number;
  dueOn?: string;
}

/* ---------------------------------------------------------------- content */

export interface GuideAuthor {
  name: string;
  credentials: string;
  photoUrl?: string;
}

export interface Guide {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  coverImage: string;
  readingMinutes: number;
  publishedAt: string;
  updatedAt?: string;
  author: GuideAuthor;
  /** Markdown-ish body rendered by the guide page. */
  body: string;
  featured?: boolean;
  relatedSlugs?: string[];
}

export interface Breed {
  id: string;
  name: string;
  species: Species;
  sizeCategory: "toy" | "small" | "medium" | "large" | "giant";
  lifeExpectancy: string;
  typicalWeightKg: { min: number; max: number };
  temperament: string[];
  groomingNeeds: "low" | "moderate" | "high";
  exerciseNeeds: "low" | "moderate" | "high";
  commonConditions: string[];
  climateNote: string;
  imageUrl: string;
  summary: string;
}

export type FoodSafetyVerdict = "safe" | "caution" | "unsafe";

export interface FoodSafetyResult {
  item: string;
  species: Species;
  verdict: FoodSafetyVerdict;
  summary: string;
  reasons: string[];
  ifEaten: string[];
  disclaimer: string;
}

export interface NutritionPlan {
  petId: string;
  petName: string;
  dailyCalories: number;
  mealsPerDay: number;
  portionLabel: string;
  waterMlPerDay: number;
  bodyConditionNote: string;
  recommendations: string[];
  avoid: string[];
  recommendedProductSlugs: string[];
  disclaimer: string;
}

/* ------------------------------------------------------------------ leads */

export interface WaitlistInput {
  name: string;
  phone: string;
  city: string;
  petType?: Species;
  email?: string;
}

export interface PartnerApplicationInput {
  name: string;
  phone: string;
  email: string;
  clinicName?: string;
  registrationNo?: string;
  city: string;
  partnerType: "vet" | "clinic" | "groomer" | "store" | "other";
  message?: string;
}

export interface LeadResult {
  id: string;
  status: "received";
  message: string;
}

/* ------------------------------------------------------------- membership */

export interface Plan {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  pricePerYear: number;
  pricePerMonth: number;
  popular?: boolean;
  savingsNote?: string;
  features: { label: string; included: boolean }[];
  ctaLabel: string;
}
