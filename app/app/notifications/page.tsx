"use client";

import Link from "next/link";
import {
  BellRing,
  CheckCheck,
  ClipboardList,
  Lightbulb,
  Package,
  Stethoscope,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortalHeader } from "@/components/portal/portal-shell";
import { ReminderList } from "@/components/portal/reminder-list";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/states";
import { api } from "@/lib/api";
import { useAsync, useMutation } from "@/lib/hooks/use-async";
import type { AppNotification, Reminder } from "@/lib/types";
import { cn, formatDate, formatTime } from "@/lib/utils";

const CATEGORY_ICON: Record<
  AppNotification["category"],
  React.ComponentType<{ className?: string }>
> = {
  reminder: BellRing,
  visit: Stethoscope,
  order: Package,
  passport: ClipboardList,
  tip: Lightbulb,
};

export default function NotificationsPage() {
  const notifications = useAsync<AppNotification[]>(() => api.account.listNotifications(), []);
  const reminders = useAsync<Reminder[]>(() => api.reminders.list({ includeDone: true }), []);

  const markAllRead = useMutation(async () => {
    const result = await api.account.markAllNotificationsRead();
    notifications.refresh();
    return result;
  });

  const unreadCount = (notifications.data ?? []).filter((item) => !item.read).length;

  return (
    <>
      <PortalHeader
        title="Notifications"
        description="Reminders, visit updates and order news — the same things we send you on WhatsApp."
      >
        {unreadCount > 0 ? (
          <Button variant="outline" disabled={markAllRead.pending} onClick={() => void markAllRead.run()}>
            <CheckCheck className="size-4" aria-hidden="true" />
            Mark all read
          </Button>
        ) : null}
        <Button asChild variant="ghost">
          <Link href="/app/profile">Notification settings</Link>
        </Button>
      </PortalHeader>

      <Tabs defaultValue="reminders">
        <TabsList>
          <TabsTrigger value="reminders">
            Reminders ({(reminders.data ?? []).filter((r) => r.status !== "done").length})
          </TabsTrigger>
          <TabsTrigger value="activity">
            Activity{unreadCount > 0 ? ` (${unreadCount} new)` : ""}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reminders">
          {reminders.loading ? (
            <LoadingState label="Loading reminders" rows={4} />
          ) : reminders.error ? (
            <ErrorState message={reminders.error} onRetry={reminders.refresh} />
          ) : (
            <ReminderList
              reminders={reminders.data ?? []}
              onChange={(updated) =>
                reminders.setData(
                  (current) =>
                    current?.map((item) => (item.id === updated.id ? updated : item)) ?? null,
                )
              }
            />
          )}
        </TabsContent>

        <TabsContent value="activity">
          {notifications.loading ? (
            <LoadingState label="Loading activity" rows={4} />
          ) : notifications.error ? (
            <ErrorState message={notifications.error} onRetry={notifications.refresh} />
          ) : (notifications.data ?? []).length === 0 ? (
            <EmptyState
              icon={BellRing}
              title="Nothing here yet"
              description="Visit updates, order news and care tips will show up here."
            />
          ) : (
            <ul className="space-y-3">
              {notifications.data?.map((notification) => {
                const Icon = CATEGORY_ICON[notification.category];
                const body = (
                  <>
                    <span
                      className={cn(
                        "grid size-11 shrink-0 place-items-center rounded-xl",
                        notification.read
                          ? "bg-brand-50 text-brand-500"
                          : "bg-brand-700 text-white",
                      )}
                    >
                      <Icon className="size-5" aria-hidden="true" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            "text-sm",
                            notification.read ? "font-medium text-ink/80" : "font-semibold text-ink",
                          )}
                        >
                          {notification.title}
                        </span>
                        {!notification.read ? <Badge variant="accent">New</Badge> : null}
                      </span>

                      <span className="mt-1 block text-sm leading-relaxed text-muted">
                        {notification.body}
                      </span>

                      <span className="mt-1.5 block text-xs text-muted">
                        {formatDate(notification.createdAt)} ·{" "}
                        {formatTime(notification.createdAt)}
                      </span>
                    </span>
                  </>
                );

                return (
                  <li key={notification.id}>
                    {notification.href ? (
                      <Link
                        href={notification.href}
                        className={cn(
                          "flex items-start gap-4 rounded-2xl border bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift",
                          notification.read ? "border-hairline" : "border-brand-200",
                        )}
                      >
                        {body}
                      </Link>
                    ) : (
                      <div
                        className={cn(
                          "flex items-start gap-4 rounded-2xl border bg-white p-5 shadow-soft",
                          notification.read ? "border-hairline" : "border-brand-200",
                        )}
                      >
                        {body}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}
