"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlarmClock,
  BellRing,
  CalendarClock,
  Check,
  Loader2,
  Pill,
  RefreshCw,
  Scissors,
  ShoppingBag,
  Stethoscope,
  Syringe,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/shared/states";
import { api } from "@/lib/api";
import { TODAY_ISO } from "@/lib/mock/clock";
import type { Reminder, ReminderType } from "@/lib/types";
import { cn, daysBetween, formatDate } from "@/lib/utils";

const TYPE_ICON: Record<ReminderType, React.ComponentType<{ className?: string }>> = {
  vaccination: Syringe,
  medication: Pill,
  deworming: Stethoscope,
  visit: CalendarClock,
  grooming: Scissors,
  reorder: ShoppingBag,
};

function dueLabel(reminder: Reminder) {
  const days = daysBetween(TODAY_ISO, reminder.dueOn);
  if (reminder.status === "done") return "Completed";
  if (days < 0) return `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} overdue`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `Due in ${days} days`;
}

export function ReminderList({
  reminders,
  onChange,
  limit,
}: {
  reminders: Reminder[];
  /** Called with the updated reminder so the parent can refresh its list. */
  onChange: (updated: Reminder) => void;
  limit?: number;
}) {
  const visible = limit ? reminders.slice(0, limit) : reminders;

  if (visible.length === 0) {
    return (
      <EmptyState
        icon={BellRing}
        title="Nothing due right now"
        description="When a vaccination, medicine or review comes up, it'll appear here and on WhatsApp."
      />
    );
  }

  return (
    <ul className="space-y-3">
      {visible.map((reminder) => (
        <li key={reminder.id}>
          <ReminderCard reminder={reminder} onChange={onChange} />
        </li>
      ))}
    </ul>
  );
}

function ReminderCard({
  reminder,
  onChange,
}: {
  reminder: Reminder;
  onChange: (updated: Reminder) => void;
}) {
  const [pending, setPending] = React.useState<string | null>(null);
  const [rescheduling, setRescheduling] = React.useState(false);
  const [newDate, setNewDate] = React.useState(reminder.dueOn);

  const Icon = TYPE_ICON[reminder.type];
  const overdue = reminder.status === "overdue";
  const done = reminder.status === "done";

  async function act(action: "done" | "snooze" | "reschedule", extra?: Record<string, unknown>) {
    setPending(action);
    try {
      const updated = await api.reminders.update(reminder.id, { action, ...extra });
      onChange(updated);
      setRescheduling(false);
    } finally {
      setPending(null);
    }
  }

  return (
    <article
      className={cn(
        "rounded-2xl border bg-white p-5 shadow-soft transition-all duration-300",
        done
          ? "border-hairline opacity-60"
          : overdue
            ? "border-accent-200 bg-accent-50/30 hover:shadow-lift"
            : "border-hairline hover:-translate-y-0.5 hover:shadow-lift",
      )}
    >
      <div className="flex items-start gap-4">
        <span
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-xl",
            overdue ? "bg-accent-100 text-accent-700" : "bg-brand-50 text-brand-600",
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={cn("text-sm font-semibold text-ink", done && "line-through")}>
              {reminder.title}
            </h3>
            <Badge variant={overdue ? "accent" : done ? "verified" : "default"}>
              {dueLabel(reminder)}
            </Badge>
            {reminder.status === "snoozed" && reminder.snoozedUntil ? (
              <Badge variant="outline">Snoozed to {formatDate(reminder.snoozedUntil)}</Badge>
            ) : null}
          </div>

          <p className="mt-1 text-xs text-muted">
            {reminder.petName} · {formatDate(reminder.dueOn)}
          </p>

          {reminder.details ? (
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{reminder.details}</p>
          ) : null}

          {rescheduling ? (
            <div className="mt-4 flex flex-wrap items-end gap-2">
              <div>
                <label
                  htmlFor={`date-${reminder.id}`}
                  className="block text-xs font-medium text-ink"
                >
                  New date
                </label>
                <Input
                  id={`date-${reminder.id}`}
                  type="date"
                  value={newDate}
                  min={TODAY_ISO}
                  onChange={(event) => setNewDate(event.target.value)}
                  className="mt-1 h-10 w-44"
                />
              </div>
              <Button
                size="sm"
                disabled={pending !== null}
                onClick={() => void act("reschedule", { dueOn: newDate })}
              >
                {pending === "reschedule" ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : null}
                Save
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setRescheduling(false)}>
                Cancel
              </Button>
            </div>
          ) : !done ? (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button size="sm" disabled={pending !== null} onClick={() => void act("done")}>
                {pending === "done" ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Check className="size-4" aria-hidden="true" />
                )}
                Mark done
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline" disabled={pending !== null}>
                    <AlarmClock className="size-4" aria-hidden="true" />
                    Snooze
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {[1, 3, 7, 14].map((days) => (
                    <DropdownMenuItem
                      key={days}
                      onSelect={() => void act("snooze", { snoozeDays: days })}
                    >
                      <AlarmClock />
                      {days} day{days === 1 ? "" : "s"}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button size="sm" variant="ghost" onClick={() => setRescheduling(true)}>
                <RefreshCw className="size-4" aria-hidden="true" />
                Reschedule
              </Button>

              {reminder.actionHref ? (
                <Button asChild size="sm" variant="ghost">
                  <Link href={reminder.actionHref}>Take action</Link>
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
