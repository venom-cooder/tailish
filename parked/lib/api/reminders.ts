import { addDays, TODAY_ISO } from "@/lib/mock/clock";
import { getState, persist } from "@/lib/mock/store";
import type { Reminder, ReminderUpdate } from "@/lib/types";
import { daysBetween } from "@/lib/utils";
import { badRequest, call, notFound } from "./client";

/** Anything past its due date and not yet done reads as overdue. */
function withDerivedStatus(reminder: Reminder): Reminder {
  if (reminder.status === "done") return reminder;
  if (reminder.status === "snoozed" && reminder.snoozedUntil) {
    return daysBetween(TODAY_ISO, reminder.snoozedUntil) > 0
      ? reminder
      : { ...reminder, status: "pending" };
  }
  return daysBetween(TODAY_ISO, reminder.dueOn) < 0
    ? { ...reminder, status: "overdue" }
    : { ...reminder, status: "pending" };
}

export const remindersApi = {
  /** GET /reminders */
  list: (filters?: { petId?: string; includeDone?: boolean }) =>
    call<Reminder[]>({
      method: "GET",
      path: "/reminders",
      query: { petId: filters?.petId, includeDone: filters?.includeDone },
      mock: () =>
        getState()
          .reminders.map(withDerivedStatus)
          .filter((r) => (filters?.petId ? r.petId === filters.petId : true))
          .filter((r) => (filters?.includeDone ? true : r.status !== "done"))
          .sort((a, b) => a.dueOn.localeCompare(b.dueOn)),
    }),

  /** PATCH /reminders/:id — done, snooze or reschedule */
  update: (id: string, update: ReminderUpdate) =>
    call<Reminder>({
      method: "PATCH",
      path: `/reminders/${id}`,
      body: update,
      mockLatencyMs: 220,
      mock: () => {
        const state = getState();
        const existing = state.reminders.find((r) => r.id === id);
        if (!existing) notFound("We couldn't find that reminder.");

        let updated: Reminder;
        switch (update.action) {
          case "done":
            updated = { ...existing, status: "done", snoozedUntil: undefined };
            break;
          case "snooze": {
            const days = update.snoozeDays ?? 3;
            updated = {
              ...existing,
              status: "snoozed",
              snoozedUntil: addDays(days),
            };
            break;
          }
          case "reschedule": {
            if (!update.dueOn) badRequest("Pick a new date.", { field: "dueOn" });
            updated = {
              ...existing,
              dueOn: update.dueOn,
              status: "pending",
              snoozedUntil: undefined,
            };
            break;
          }
          default:
            badRequest("Unsupported reminder action.");
        }

        state.reminders = state.reminders.map((r) => (r.id === id ? updated : r));
        persist();
        return updated;
      },
    }),
};
