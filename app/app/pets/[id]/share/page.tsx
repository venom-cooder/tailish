"use client";

import * as React from "react";
import { use } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { Clock, Link2, Loader2, Share2, ShieldCheck, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select } from "@/components/ui/input";
import { PortalHeader } from "@/components/portal/portal-shell";
import { CopyButton } from "@/components/shared/copy-button";
import { ErrorState, LoadingState } from "@/components/shared/states";
import { WhatsAppButton } from "@/components/whatsapp/whatsapp-button";
import { api } from "@/lib/api";
import { useAsync, useMutation } from "@/lib/hooks/use-async";
import type { Pet, ShareLink } from "@/lib/types";
import { formatDateLong } from "@/lib/utils";

const SCOPE_FIELDS = [
  { key: "identity", label: "Identity", detail: "Name, breed, age, microchip, markings." },
  { key: "vaccinations", label: "Vaccinations", detail: "Doses, dates, batch numbers and due dates." },
  { key: "conditions", label: "Conditions & allergies", detail: "Chronic conditions and known allergies." },
  { key: "medications", label: "Medications", detail: "What your pet is currently taking." },
  { key: "documents", label: "Documents", detail: "Prescriptions, lab reports and imaging." },
] as const;

export default function SharePassportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const pet = useAsync<Pet>(() => api.pets.get(id), [id]);

  const [scope, setScope] = React.useState<ShareLink["scope"]>({
    identity: true,
    vaccinations: true,
    conditions: true,
    medications: true,
    documents: false,
  });
  const [expiresInDays, setExpiresInDays] = React.useState(7);
  const [link, setLink] = React.useState<ShareLink | null>(null);

  const create = useMutation(async () => {
    const result = await api.passport.createShareLink(id, scope, expiresInDays);
    setLink(result);
    return result;
  });

  const revoke = useMutation(async () => {
    if (!link) return null;
    const result = await api.passport.revokeShareLink(id, link.shareToken);
    setLink(null);
    return result;
  });

  if (pet.loading) return <LoadingState label="Loading pet" rows={3} />;
  if (pet.error) return <ErrorState message={pet.error} onRetry={pet.refresh} />;

  return (
    <>
      <PortalHeader
        title={`Share ${pet.data?.name}'s passport`}
        description="Generate a read-only link and QR code. You choose what's visible, and it expires on its own."
        backHref={`/app/pets/${id}`}
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
        <section className="rounded-3xl border border-hairline bg-white p-6 shadow-soft sm:p-8">
          <h2 className="font-display text-lg font-semibold text-ink">What should they see?</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            Anything you leave off simply isn&apos;t in the shared view — not hidden behind a click.
          </p>

          <ul className="mt-6 space-y-3">
            {SCOPE_FIELDS.map((field) => (
              <li
                key={field.key}
                className="flex items-start justify-between gap-4 rounded-2xl border border-hairline p-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink">{field.label}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted">{field.detail}</p>
                </div>
                <Switch
                  checked={scope[field.key]}
                  onCheckedChange={(checked) =>
                    setScope((current) => ({ ...current, [field.key]: checked }))
                  }
                  aria-label={`Share ${field.label}`}
                />
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <label htmlFor="expiry" className="block text-sm font-medium text-ink">
              Link expires after
            </label>
            <Select
              id="expiry"
              value={expiresInDays}
              onChange={(event) => setExpiresInDays(Number(event.target.value))}
              className="mt-2"
            >
              <option value={1}>1 day</option>
              <option value={7}>7 days</option>
              <option value={30}>30 days</option>
              <option value={90}>90 days</option>
            </Select>
          </div>

          {create.error ? (
            <p role="alert" className="mt-4 text-sm text-red-600">
              {create.error}
            </p>
          ) : null}

          <Button
            size="lg"
            className="mt-6 w-full"
            disabled={create.pending}
            onClick={() => void create.run()}
          >
            {create.pending ? (
              <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            ) : (
              <Share2 className="size-5" aria-hidden="true" />
            )}
            {link ? "Generate a new link" : "Create share link"}
          </Button>
        </section>

        <section>
          {link ? (
            <div className="rounded-3xl border border-hairline bg-white p-6 text-center shadow-soft sm:p-8">
              <Badge variant="verified" className="mx-auto">
                Link active
              </Badge>

              <div className="mx-auto mt-6 inline-block rounded-3xl border border-hairline p-4">
                <QRCodeSVG
                  value={link.url}
                  size={190}
                  level="M"
                  marginSize={0}
                  bgColor="#ffffff"
                  fgColor="#0F3F44"
                  title={`QR code for ${pet.data?.name}'s shared Health Passport`}
                />
              </div>

              <p className="mt-5 text-sm font-medium text-ink">
                Scan at a clinic, boarding desk or groomer
              </p>

              <div className="mt-5 flex items-center gap-2 rounded-2xl border border-hairline bg-brand-50/50 p-3">
                <Link2 className="size-4 shrink-0 text-brand-600" aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate text-left text-xs text-muted">
                  {link.url}
                </span>
                <CopyButton value={link.url} label="Copy link" showLabel className="shrink-0" />
              </div>

              <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted">
                <Clock className="size-3.5" aria-hidden="true" />
                Expires {formatDateLong(link.expiresAt)}
              </p>

              <ul className="mt-5 flex flex-wrap justify-center gap-1.5">
                {SCOPE_FIELDS.filter((field) => link.scope[field.key]).map((field) => (
                  <li key={field.key}>
                    <Badge>{field.label}</Badge>
                  </li>
                ))}
              </ul>

              <div className="mt-7 space-y-2.5">
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/p/${link.shareToken}`}>Preview what they&apos;ll see</Link>
                </Button>

                <WhatsAppButton
                  variant="outline"
                  className="w-full"
                  text={`Here is ${pet.data?.name}'s Tailish Health Passport: ${link.url}`}
                  label="Send on WhatsApp"
                />

                <Button
                  variant="ghost"
                  className="w-full text-red-600 hover:bg-red-50"
                  disabled={revoke.pending}
                  onClick={() => void revoke.run()}
                >
                  {revoke.pending ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Trash2 className="size-4" aria-hidden="true" />
                  )}
                  Revoke this link
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col justify-center rounded-3xl border border-dashed border-brand-200 bg-brand-50/40 p-8 text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white text-brand-600 shadow-soft">
                <ShieldCheck className="size-7" aria-hidden="true" />
              </span>
              <h2 className="mt-5 font-display text-lg font-semibold text-ink">
                Nothing shared yet
              </h2>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted">
                Choose what to include and create a link. Until you do, nobody outside your account
                can see {pet.data?.name}&apos;s records.
              </p>
            </div>
          )}

          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-hairline bg-white p-5">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand-600" aria-hidden="true" />
            <p className="text-xs leading-relaxed text-muted">
              Anyone holding an active link can view the sections you shared, without signing in.
              Revoke it the moment you no longer need it — and remember the link, not the QR image,
              is the thing that grants access.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
