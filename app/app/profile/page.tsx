"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  Check,
  Download,
  Globe,
  Loader2,
  Lock,
  LogOut,
  Mail,
  Smartphone,
  Trash2,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/label";
import { Input, Select } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { PortalHeader } from "@/components/portal/portal-shell";
import { ErrorState, LoadingState } from "@/components/shared/states";
import { useSession } from "@/components/providers/session-provider";
import { api } from "@/lib/api";
import { useAsync, useMutation } from "@/lib/hooks/use-async";
import type { NotificationSettings, PetParent } from "@/lib/types";

const REMINDER_TOGGLES: { key: keyof NotificationSettings; label: string; detail: string }[] = [
  {
    key: "vaccinationReminders",
    label: "Vaccination reminders",
    detail: "Before a dose is due, not after it has lapsed.",
  },
  {
    key: "medicationReminders",
    label: "Medication reminders",
    detail: "Daily while a prescribed course is running.",
  },
  {
    key: "visitUpdates",
    label: "Visit updates",
    detail: "Confirmations, arrival windows and visit summaries.",
  },
  { key: "orderUpdates", label: "Order updates", detail: "Dispatch, delivery and any delays." },
  { key: "careTips", label: "Care tips", detail: "Seasonal advice — monsoon ticks, summer heat." },
  { key: "offers", label: "Offers and promotions", detail: "Occasional discounts on the shop." },
];

const CHANNELS: { key: keyof NotificationSettings["channels"]; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "whatsapp", label: "WhatsApp", icon: Smartphone },
  { key: "sms", label: "SMS", icon: Smartphone },
  { key: "email", label: "Email", icon: Mail },
  { key: "push", label: "Push notifications", icon: Bell },
];

export default function ProfilePage() {
  const { signOut } = useSession();
  const profile = useAsync<PetParent>(() => api.account.getProfile(), []);
  const settings = useAsync<NotificationSettings>(() => api.account.getNotificationSettings(), []);

  const [saved, setSaved] = React.useState(false);

  // Only the fields the user has actually touched are held in state; the rest
  // read straight from the loaded profile. Avoids copying server data into
  // state with an effect, and means a refresh can't clobber an in-progress edit.
  const [edits, setEdits] = React.useState<Partial<PetParent>>({});
  const form: Partial<PetParent> = {
    name: edits.name ?? profile.data?.name ?? "",
    email: edits.email ?? profile.data?.email ?? "",
    city: edits.city ?? profile.data?.city ?? "",
    preferredLanguage: edits.preferredLanguage ?? profile.data?.preferredLanguage ?? "en",
  };
  const setForm = (next: Partial<PetParent>) => setEdits(next);

  React.useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => setSaved(false), 2500);
    return () => clearTimeout(timer);
  }, [saved]);

  const saveProfile = useMutation(async () => {
    const result = await api.account.updateProfile(form);
    profile.setData(result);
    setSaved(true);
    return result;
  });

  const saveSettings = useMutation(async (patch: Partial<NotificationSettings>) => {
    const result = await api.account.updateNotificationSettings(patch);
    settings.setData(result);
    return result;
  });

  if (profile.loading) return <LoadingState label="Loading your profile" rows={4} />;
  if (profile.error) return <ErrorState message={profile.error} onRetry={profile.refresh} />;

  return (
    <>
      <PortalHeader
        title="Profile & privacy"
        description="Your details, how we reach you, and what happens to your data."
      />

      <div className="max-w-3xl space-y-6">
        {/* Profile */}
        <section className="rounded-3xl border border-hairline bg-white p-6 shadow-soft sm:p-8">
          <h2 className="flex items-center gap-2.5 font-display text-lg font-semibold text-ink">
            <User className="size-5 text-brand-600" aria-hidden="true" />
            Your details
          </h2>

          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              void saveProfile.run();
            }}
            className="mt-6 space-y-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" htmlFor="profile-name" required>
                <Input
                  id="profile-name"
                  value={form.name ?? ""}
                  autoComplete="name"
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                />
              </Field>

              <Field
                label="Mobile number"
                htmlFor="profile-phone"
                hint="Your sign-in number. Contact support to change it."
              >
                <Input id="profile-phone" value={profile.data?.phone ?? ""} disabled />
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Email" htmlFor="profile-email">
                <Input
                  id="profile-email"
                  type="email"
                  value={form.email ?? ""}
                  autoComplete="email"
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                />
              </Field>

              <Field label="City" htmlFor="profile-city">
                <Input
                  id="profile-city"
                  value={form.city ?? ""}
                  autoComplete="address-level2"
                  onChange={(event) => setForm({ ...form, city: event.target.value })}
                />
              </Field>
            </div>

            <Field label="Preferred language" htmlFor="profile-lang">
              <Select
                id="profile-lang"
                value={form.preferredLanguage ?? "en"}
                onChange={(event) =>
                  setForm({ ...form, preferredLanguage: event.target.value as "en" | "hi" })
                }
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </Select>
            </Field>

            {saveProfile.error ? (
              <p role="alert" className="text-sm text-red-600">
                {saveProfile.error}
              </p>
            ) : null}

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={saveProfile.pending}>
                {saveProfile.pending ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : saved ? (
                  <Check className="size-4" aria-hidden="true" />
                ) : null}
                {saved ? "Saved" : "Save changes"}
              </Button>
            </div>
          </form>
        </section>

        {/* Notifications */}
        <section className="rounded-3xl border border-hairline bg-white p-6 shadow-soft sm:p-8">
          <h2 className="flex items-center gap-2.5 font-display text-lg font-semibold text-ink">
            <Bell className="size-5 text-brand-600" aria-hidden="true" />
            What we send you
          </h2>

          {settings.loading ? (
            <LoadingState label="Loading notification settings" rows={3} className="mt-6" />
          ) : settings.data ? (
            <>
              <ul className="mt-6 space-y-2.5">
                {REMINDER_TOGGLES.map((toggle) => (
                  <li
                    key={toggle.key}
                    className="flex items-start justify-between gap-4 rounded-2xl border border-hairline p-4"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink">{toggle.label}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted">{toggle.detail}</p>
                    </div>
                    <Switch
                      checked={Boolean(settings.data?.[toggle.key])}
                      onCheckedChange={(checked) => void saveSettings.run({ [toggle.key]: checked })}
                      aria-label={toggle.label}
                    />
                  </li>
                ))}
              </ul>

              <h3 className="mt-8 flex items-center gap-2.5 text-sm font-semibold text-ink">
                <Globe className="size-4 text-brand-600" aria-hidden="true" />
                Where we send them
              </h3>

              <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {CHANNELS.map((channel) => (
                  <li
                    key={channel.key}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-hairline p-4"
                  >
                    <span className="flex items-center gap-2.5 text-sm text-ink">
                      <channel.icon className="size-4 text-brand-500" aria-hidden="true" />
                      {channel.label}
                    </span>
                    <Switch
                      checked={settings.data?.channels[channel.key] ?? false}
                      onCheckedChange={(checked) =>
                        void saveSettings.run({ channels: { [channel.key]: checked } as never })
                      }
                      aria-label={channel.label}
                    />
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-start justify-between gap-4 rounded-2xl border border-hairline bg-brand-50/40 p-5">
                <div>
                  <p className="text-sm font-medium text-ink">Quiet hours</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted">
                    Nothing but genuine emergencies between{" "}
                    <span className="tabular">{settings.data.quietHours.from}</span> and{" "}
                    <span className="tabular">{settings.data.quietHours.to}</span>.
                  </p>
                </div>
                <Switch
                  checked={settings.data.quietHours.enabled}
                  onCheckedChange={(checked) =>
                    void saveSettings.run({ quietHours: { enabled: checked } as never })
                  }
                  aria-label="Quiet hours"
                />
              </div>
            </>
          ) : null}
        </section>

        {/* Privacy */}
        <section className="rounded-3xl border border-hairline bg-white p-6 shadow-soft sm:p-8">
          <h2 className="flex items-center gap-2.5 font-display text-lg font-semibold text-ink">
            <Lock className="size-5 text-brand-600" aria-hidden="true" />
            Your data
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-muted">
            Your pet&apos;s records belong to you. Export them whenever you like, and delete your
            account outright if you want to — we don&apos;t hold medical history hostage to keep you
            subscribed.
          </p>

          <ul className="mt-6 space-y-3">
            <li className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-hairline p-5">
              <div>
                <p className="text-sm font-medium text-ink">Export everything</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">
                  A PDF of each pet&apos;s full Health Passport, plus your orders and bookings.
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="size-4" aria-hidden="true" />
                Request export
              </Button>
            </li>

            <li className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-hairline p-5">
              <div>
                <p className="text-sm font-medium text-ink">Active permissions</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">
                  Who you&apos;ve granted access to, and every share link you&apos;ve created.
                </p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/app/family">Review access</Link>
              </Button>
            </li>

            <li className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50/50 p-5">
              <div>
                <p className="text-sm font-medium text-red-900">Delete my account</p>
                <p className="mt-0.5 text-xs leading-relaxed text-red-800/80">
                  Permanent. Clinical records are retained only as long as veterinary record-keeping
                  rules require — see our{" "}
                  <Link href="/privacy" className="underline underline-offset-4">
                    privacy policy
                  </Link>
                  .
                </p>
              </div>
              <Button variant="outline" size="sm" className="border-red-200 text-red-700 hover:bg-red-100">
                <Trash2 className="size-4" aria-hidden="true" />
                Delete account
              </Button>
            </li>
          </ul>
        </section>

        {/* Session */}
        <section className="rounded-3xl border border-hairline bg-white p-6 shadow-soft sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">Session</h2>
              <p className="mt-1 text-sm text-muted">
                Signed in as{" "}
                <span className="font-medium text-ink">{profile.data?.phone}</span>
              </p>
            </div>
            <Button variant="outline" onClick={() => void signOut()}>
              <LogOut className="size-4" aria-hidden="true" />
              Sign out
            </Button>
          </div>

          <p className="mt-5 flex flex-wrap items-center gap-2 text-xs text-muted">
            Member since {profile.data ? new Date(profile.data.createdAt).getUTCFullYear() : "—"}
            <Badge variant="gold">Essential plan</Badge>
          </p>
        </section>
      </div>
    </>
  );
}
