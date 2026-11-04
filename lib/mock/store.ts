import type {
  Address,
  Booking,
  Cart,
  FamilyDelegate,
  MedicalDocument,
  Medication,
  NotificationSettings,
  Condition,
  Order,
  Pet,
  PetParent,
  Reminder,
  ShareLink,
  TimelineEvent,
  Vaccination,
  Weight,
} from "@/lib/types";
import { mockAddresses, mockDelegates, mockNotificationSettings, mockParent } from "./account";
import { mockOrders } from "./catalog";
import {
  mockConditions,
  mockDocuments,
  mockMedications,
  mockPets,
  mockTimeline,
  mockVaccinations,
  mockWeights,
} from "./pets";
import { mockBookings, mockReminders } from "./services";

/**
 * In-memory mutable state for the mock adapter.
 *
 * Mutations made through the API client (add to cart, book a visit, mark a
 * reminder done) land here so the demo behaves like a real application within
 * a session. Cart and session are mirrored into localStorage so a refresh
 * doesn't lose the user's place.
 *
 * None of this exists once NEXT_PUBLIC_API_BASE_URL is set.
 */

const STORAGE_KEY = "tailish:mock-store:v1";

export const FREE_DELIVERY_THRESHOLD = 1499;
export const DELIVERY_FEE = 49;

export interface MockState {
  parent: PetParent;
  authenticated: boolean;
  token: string | null;
  addresses: Address[];
  delegates: FamilyDelegate[];
  notificationSettings: NotificationSettings;
  readNotificationIds: string[];
  pets: Pet[];
  vaccinations: Vaccination[];
  weights: Weight[];
  conditions: Condition[];
  medications: Medication[];
  documents: MedicalDocument[];
  timeline: TimelineEvent[];
  shareLinks: ShareLink[];
  bookings: Booking[];
  reminders: Reminder[];
  cart: Cart;
  orders: Order[];
}

export const emptyCart = (): Cart => ({
  id: "cart_demo",
  lines: [],
  itemsSubtotal: 0,
  deliveryFee: 0,
  discount: 0,
  total: 0,
  itemCount: 0,
  freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
});

function createInitialState(): MockState {
  return {
    parent: { ...mockParent },
    authenticated: false,
    token: null,
    addresses: mockAddresses.map((a) => ({ ...a })),
    delegates: mockDelegates.map((d) => ({ ...d })),
    notificationSettings: structuredClone(mockNotificationSettings),
    readNotificationIds: [],
    pets: mockPets.map((p) => ({ ...p })),
    vaccinations: mockVaccinations.map((v) => ({ ...v })),
    weights: mockWeights.map((w) => ({ ...w })),
    conditions: mockConditions.map((c) => ({ ...c })),
    medications: mockMedications.map((m) => ({ ...m })),
    documents: mockDocuments.map((d) => ({ ...d })),
    timeline: mockTimeline.map((t) => ({ ...t })),
    shareLinks: [],
    bookings: mockBookings.map((b) => ({ ...b })),
    reminders: mockReminders.map((r) => ({ ...r })),
    cart: emptyCart(),
    orders: mockOrders.map((o) => ({ ...o })),
  };
}

let state: MockState = createInitialState();
let hydrated = false;

/** Subset of state worth surviving a page refresh. */
interface PersistedState {
  authenticated: boolean;
  token: string | null;
  cart: Cart;
  orders: Order[];
  bookings: Booking[];
  pets: Pet[];
  addresses: Address[];
  readNotificationIds: string[];
}

/**
 * Restores persisted state on first access in the browser.
 *
 * Deliberately lazy: called from API methods (which run in effects and event
 * handlers), never during render, so the server shell and the first client
 * render always agree.
 */
export function getState(): MockState {
  if (!hydrated && typeof window !== "undefined") {
    hydrated = true;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<PersistedState>;
        state = {
          ...state,
          ...saved,
          cart: saved.cart ?? state.cart,
        };
      }
    } catch {
      // A corrupt or unreadable store is not worth failing over — start fresh.
    }
  }
  return state;
}

export function persist() {
  if (typeof window === "undefined") return;
  try {
    const snapshot: PersistedState = {
      authenticated: state.authenticated,
      token: state.token,
      cart: state.cart,
      orders: state.orders,
      bookings: state.bookings,
      pets: state.pets,
      addresses: state.addresses,
      readNotificationIds: state.readNotificationIds,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Quota or private-mode failures are non-fatal for a demo store.
  }
}

/** Used by the "reset demo data" control in the portal. */
export function resetState() {
  state = createInitialState();
  hydrated = true;
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

/** Recomputes cart totals from its lines. Call after every line mutation. */
export function recalculateCart(cart: Cart): Cart {
  const itemsSubtotal = cart.lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  const itemCount = cart.lines.reduce((sum, line) => sum + line.quantity, 0);
  const deliveryFee =
    itemsSubtotal === 0 || itemsSubtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const discount = cart.appliedCoupon === "TAILISH10" ? Math.round(itemsSubtotal * 0.1) : 0;

  cart.lines = cart.lines.map((line) => ({ ...line, lineTotal: line.unitPrice * line.quantity }));
  cart.itemsSubtotal = itemsSubtotal;
  cart.itemCount = itemCount;
  cart.deliveryFee = deliveryFee;
  cart.discount = discount;
  cart.total = Math.max(0, itemsSubtotal + deliveryFee - discount);
  cart.freeDeliveryThreshold = FREE_DELIVERY_THRESHOLD;
  return cart;
}
