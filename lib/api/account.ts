import { mockNotifications } from "@/lib/mock/account";
import { getState, persist } from "@/lib/mock/store";
import type {
  Address,
  AppNotification,
  FamilyDelegate,
  NotificationSettings,
  PetParent,
} from "@/lib/types";
import { nextId } from "@/lib/utils";
import { badRequest, call, notFound } from "./client";

export const accountApi = {
  /** GET /me */
  getProfile: () =>
    call<PetParent>({
      method: "GET",
      path: "/me",
      mock: () => getState().parent,
    }),

  /** PATCH /me */
  updateProfile: (patch: Partial<PetParent>) =>
    call<PetParent>({
      method: "PATCH",
      path: "/me",
      body: patch,
      mock: () => {
        const state = getState();
        state.parent = { ...state.parent, ...patch };
        persist();
        return state.parent;
      },
    }),

  /* ------------------------------------------------------------ addresses */

  /** GET /addresses */
  listAddresses: () =>
    call<Address[]>({
      method: "GET",
      path: "/addresses",
      mock: () => getState().addresses,
    }),

  /** POST /addresses */
  createAddress: (input: Omit<Address, "id">) =>
    call<Address>({
      method: "POST",
      path: "/addresses",
      body: input,
      mock: () => {
        const state = getState();
        if (!input.line1?.trim()) badRequest("Address line 1 is required.", { field: "line1" });
        if (!/^\d{6}$/.test(input.pincode ?? "")) {
          badRequest("Enter a valid 6-digit PIN code.", { field: "pincode" });
        }
        const address: Address = { ...input, id: nextId("addr") };
        if (address.isDefault) {
          state.addresses = state.addresses.map((a) => ({ ...a, isDefault: false }));
        }
        state.addresses = [...state.addresses, address];
        persist();
        return address;
      },
    }),

  /** PATCH /addresses/:id */
  updateAddress: (id: string, patch: Partial<Address>) =>
    call<Address>({
      method: "PATCH",
      path: `/addresses/${id}`,
      body: patch,
      mock: () => {
        const state = getState();
        const existing = state.addresses.find((a) => a.id === id);
        if (!existing) notFound("That address no longer exists.");
        if (patch.isDefault) {
          state.addresses = state.addresses.map((a) => ({ ...a, isDefault: false }));
        }
        const updated = { ...existing, ...patch };
        state.addresses = state.addresses.map((a) => (a.id === id ? updated : a));
        persist();
        return updated;
      },
    }),

  /** DELETE /addresses/:id */
  deleteAddress: (id: string) =>
    call<{ ok: true }>({
      method: "DELETE",
      path: `/addresses/${id}`,
      mock: () => {
        const state = getState();
        state.addresses = state.addresses.filter((a) => a.id !== id);
        // Never leave the account without a default delivery address.
        if (state.addresses.length > 0 && !state.addresses.some((a) => a.isDefault)) {
          state.addresses[0] = { ...state.addresses[0], isDefault: true };
        }
        persist();
        return { ok: true as const };
      },
    }),

  /* ------------------------------------------------------------ delegates */

  /** GET /family-delegates */
  listDelegates: () =>
    call<FamilyDelegate[]>({
      method: "GET",
      path: "/family-delegates",
      mock: () => getState().delegates,
    }),

  /** POST /family-delegates */
  createDelegate: (input: Omit<FamilyDelegate, "id" | "status" | "invitedAt">) =>
    call<FamilyDelegate>({
      method: "POST",
      path: "/family-delegates",
      body: input,
      mock: () => {
        const state = getState();
        if (!input.name?.trim()) badRequest("Enter the person's name.", { field: "name" });
        if (input.phone.replace(/\D/g, "").length < 10) {
          badRequest("Enter a valid 10-digit mobile number.", { field: "phone" });
        }
        const delegate: FamilyDelegate = {
          ...input,
          id: nextId("del"),
          status: "invited",
          invitedAt: new Date().toISOString(),
        };
        state.delegates = [...state.delegates, delegate];
        return delegate;
      },
    }),

  /** PATCH /family-delegates/:id */
  updateDelegate: (id: string, patch: Partial<FamilyDelegate>) =>
    call<FamilyDelegate>({
      method: "PATCH",
      path: `/family-delegates/${id}`,
      body: patch,
      mock: () => {
        const state = getState();
        const existing = state.delegates.find((d) => d.id === id);
        if (!existing) notFound("That person is no longer on your list.");
        const updated = { ...existing, ...patch };
        state.delegates = state.delegates.map((d) => (d.id === id ? updated : d));
        return updated;
      },
    }),

  /** DELETE /family-delegates/:id */
  deleteDelegate: (id: string) =>
    call<{ ok: true }>({
      method: "DELETE",
      path: `/family-delegates/${id}`,
      mock: () => {
        const state = getState();
        state.delegates = state.delegates.filter((d) => d.id !== id);
        return { ok: true as const };
      },
    }),

  /* --------------------------------------------------------- preferences */

  /** GET /settings/notifications */
  getNotificationSettings: () =>
    call<NotificationSettings>({
      method: "GET",
      path: "/settings/notifications",
      mock: () => getState().notificationSettings,
    }),

  /** PATCH /settings/notifications */
  updateNotificationSettings: (patch: Partial<NotificationSettings>) =>
    call<NotificationSettings>({
      method: "PATCH",
      path: "/settings/notifications",
      body: patch,
      mock: () => {
        const state = getState();
        state.notificationSettings = {
          ...state.notificationSettings,
          ...patch,
          channels: { ...state.notificationSettings.channels, ...patch.channels },
          quietHours: { ...state.notificationSettings.quietHours, ...patch.quietHours },
        };
        return state.notificationSettings;
      },
    }),

  /** GET /notifications */
  listNotifications: () =>
    call<AppNotification[]>({
      method: "GET",
      path: "/notifications",
      mock: () => {
        const read = new Set(getState().readNotificationIds);
        return mockNotifications.map((n) => (read.has(n.id) ? { ...n, read: true } : n));
      },
    }),

  /** PATCH /notifications/:id */
  markNotificationRead: (id: string) =>
    call<{ ok: true }>({
      method: "PATCH",
      path: `/notifications/${id}`,
      body: { read: true },
      mock: () => {
        const state = getState();
        if (!state.readNotificationIds.includes(id)) {
          state.readNotificationIds = [...state.readNotificationIds, id];
          persist();
        }
        return { ok: true as const };
      },
    }),

  /** POST /notifications/read-all */
  markAllNotificationsRead: () =>
    call<{ ok: true }>({
      method: "POST",
      path: "/notifications/read-all",
      mock: () => {
        const state = getState();
        state.readNotificationIds = mockNotifications.map((n) => n.id);
        persist();
        return { ok: true as const };
      },
    }),
};
