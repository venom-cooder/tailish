"use client";

import * as React from "react";
import { Heart, Loader2, Plus, ShieldCheck, Trash2, UserPlus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/label";
import { Input, Select } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { PortalHeader } from "@/components/portal/portal-shell";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/states";
import { api } from "@/lib/api";
import { useAsync, useMutation } from "@/lib/hooks/use-async";
import type { DelegateRole, FamilyDelegate, Pet } from "@/lib/types";
import { cn, initials } from "@/lib/utils";

const ROLE_LABEL: Record<DelegateRole, string> = {
  family: "Family",
  emergency: "Emergency contact",
  caretaker: "Caretaker",
  vet: "Veterinarian",
};

export default function FamilyPage() {
  const delegates = useAsync<FamilyDelegate[]>(() => api.account.listDelegates(), []);
  const pets = useAsync<Pet[]>(() => api.pets.list(), []);
  const [adding, setAdding] = React.useState(false);

  return (
    <>
      <PortalHeader
        title="Family & sharing"
        description="People who can see your pets' records or book care on your behalf."
      >
        {!adding ? (
          <Button onClick={() => setAdding(true)}>
            <Plus className="size-4" aria-hidden="true" />
            Invite someone
          </Button>
        ) : null}
      </PortalHeader>

      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-hairline bg-brand-50/50 p-5">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand-600" aria-hidden="true" />
        <p className="text-sm leading-relaxed text-muted">
          Delegates see only what you grant, for only the pets you choose. Revoking access is
          immediate. This is separate from share links — those are read-only and expire on their own.
        </p>
      </div>

      {adding ? (
        <DelegateForm
          pets={pets.data ?? []}
          onCancel={() => setAdding(false)}
          onSaved={() => {
            setAdding(false);
            delegates.refresh();
          }}
        />
      ) : delegates.loading ? (
        <LoadingState label="Loading your family list" rows={3} />
      ) : delegates.error ? (
        <ErrorState message={delegates.error} onRetry={delegates.refresh} />
      ) : (delegates.data ?? []).length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Nobody added yet"
          description="Add a family member, a caretaker, or your own vet so they can help when you can't."
          action={<Button onClick={() => setAdding(true)}>Invite someone</Button>}
        />
      ) : (
        <ul className="space-y-4">
          {delegates.data?.map((delegate) => (
            <li key={delegate.id}>
              <DelegateCard
                delegate={delegate}
                pets={pets.data ?? []}
                onChanged={delegates.refresh}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function DelegateCard({
  delegate,
  pets,
  onChanged,
}: {
  delegate: FamilyDelegate;
  pets: Pet[];
  onChanged: () => void;
}) {
  const [confirming, setConfirming] = React.useState(false);

  const update = useMutation(async (patch: Partial<FamilyDelegate>) => {
    const result = await api.account.updateDelegate(delegate.id, patch);
    onChanged();
    return result;
  });

  const remove = useMutation(async () => {
    const result = await api.account.deleteDelegate(delegate.id);
    onChanged();
    return result;
  });

  const petNames =
    delegate.petIds.length === 0
      ? "All pets"
      : pets
          .filter((pet) => delegate.petIds.includes(pet.id))
          .map((pet) => pet.name)
          .join(", ");

  return (
    <article
      className={cn(
        "rounded-3xl border bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift",
        delegate.status === "revoked" ? "border-hairline opacity-60" : "border-hairline",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-100 font-semibold text-brand-800">
            {initials(delegate.name)}
          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-semibold text-ink">{delegate.name}</h2>
              <Badge variant={delegate.status === "active" ? "verified" : "outline"}>
                {delegate.status}
              </Badge>
              <Badge>{ROLE_LABEL[delegate.role]}</Badge>
            </div>

            <p className="mt-1 text-sm text-muted">
              {delegate.relation} · {delegate.phone}
            </p>
            <p className="mt-0.5 text-xs text-muted">Access to: {petNames}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 border-t border-hairline pt-5 sm:grid-cols-2">
        <label className="flex items-center justify-between gap-4 rounded-2xl border border-hairline p-4">
          <span className="text-sm text-ink">Can view Health Passport</span>
          <Switch
            checked={delegate.canViewPassport}
            disabled={update.pending}
            onCheckedChange={(checked) => void update.run({ canViewPassport: checked })}
            aria-label={`${delegate.name} can view Health Passport`}
          />
        </label>

        <label className="flex items-center justify-between gap-4 rounded-2xl border border-hairline p-4">
          <span className="text-sm text-ink">Can book visits</span>
          <Switch
            checked={delegate.canBookVisits}
            disabled={update.pending}
            onCheckedChange={(checked) => void update.run({ canBookVisits: checked })}
            aria-label={`${delegate.name} can book visits`}
          />
        </label>
      </div>

      {update.error || remove.error ? (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {update.error ?? remove.error}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {delegate.status === "active" ? (
          <Button
            size="sm"
            variant="ghost"
            disabled={update.pending}
            onClick={() => void update.run({ status: "revoked" })}
          >
            Revoke access
          </Button>
        ) : delegate.status === "revoked" ? (
          <Button
            size="sm"
            variant="outline"
            disabled={update.pending}
            onClick={() => void update.run({ status: "active" })}
          >
            Restore access
          </Button>
        ) : (
          <Badge variant="outline">Invitation sent — awaiting acceptance</Badge>
        )}

        {confirming ? (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="danger"
              disabled={remove.pending}
              onClick={() => void remove.run()}
            >
              {remove.pending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : null}
              Confirm removal
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setConfirming(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            className="text-red-600 hover:bg-red-50"
            onClick={() => setConfirming(true)}
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Remove
          </Button>
        )}
      </div>
    </article>
  );
}

function DelegateForm({
  pets,
  onCancel,
  onSaved,
}: {
  pets: Pet[];
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = React.useState({
    name: "",
    phone: "",
    relation: "",
    role: "family" as DelegateRole,
    petIds: [] as string[],
    canViewPassport: true,
    canBookVisits: false,
  });

  const save = useMutation(async () => {
    const result = await api.account.createDelegate(form);
    onSaved();
    return result;
  });

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void save.run();
      }}
      className="max-w-2xl rounded-3xl border border-hairline bg-white p-6 shadow-soft sm:p-8"
    >
      <div className="flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2.5 font-display text-lg font-semibold text-ink">
          <UserPlus className="size-5 text-brand-600" aria-hidden="true" />
          Invite someone
        </h2>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close"
          className="grid size-9 place-items-center rounded-lg text-muted transition-colors hover:bg-brand-50 hover:text-ink"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="mt-6 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Their name" htmlFor="del-name" required>
            <Input
              id="del-name"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
          </Field>
          <Field label="Mobile number" htmlFor="del-phone" required>
            <Input
              id="del-phone"
              type="tel"
              inputMode="numeric"
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
              placeholder="98765 43210"
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Relationship" htmlFor="del-relation" hint="e.g. Mother, neighbour, our vet">
            <Input
              id="del-relation"
              value={form.relation}
              onChange={(event) => setForm({ ...form, relation: event.target.value })}
            />
          </Field>
          <Field label="Role" htmlFor="del-role">
            <Select
              id="del-role"
              value={form.role}
              onChange={(event) => setForm({ ...form, role: event.target.value as DelegateRole })}
            >
              {(Object.keys(ROLE_LABEL) as DelegateRole[]).map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABEL[role]}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-ink">Which pets?</legend>
          <p className="mt-0.5 text-xs text-muted">Leave all unchecked to grant access to every pet.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {pets.map((pet) => {
              const selected = form.petIds.includes(pet.id);
              return (
                <button
                  key={pet.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      petIds: selected
                        ? current.petIds.filter((id) => id !== pet.id)
                        : [...current.petIds, pet.id],
                    }))
                  }
                  className={cn(
                    "rounded-xl border px-4 py-2 text-sm font-medium transition-all",
                    selected
                      ? "border-brand-700 bg-brand-700 text-white"
                      : "border-hairline text-muted hover:border-brand-300 hover:text-brand-700",
                  )}
                >
                  {pet.name}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex items-center justify-between gap-4 rounded-2xl border border-hairline p-4">
            <span className="text-sm text-ink">Can view Health Passport</span>
            <Switch
              checked={form.canViewPassport}
              onCheckedChange={(checked) => setForm({ ...form, canViewPassport: checked })}
              aria-label="Can view Health Passport"
            />
          </label>
          <label className="flex items-center justify-between gap-4 rounded-2xl border border-hairline p-4">
            <span className="text-sm text-ink">Can book visits</span>
            <Switch
              checked={form.canBookVisits}
              onCheckedChange={(checked) => setForm({ ...form, canBookVisits: checked })}
              aria-label="Can book visits"
            />
          </label>
        </div>
      </div>

      {save.error ? (
        <p role="alert" className="mt-5 text-sm text-red-600">
          {save.error}
        </p>
      ) : null}

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Button type="submit" size="lg" disabled={save.pending}>
          {save.pending ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : null}
          Send invitation
        </Button>
        <Button type="button" size="lg" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      <p className="mt-5 text-xs leading-relaxed text-muted">
        They&apos;ll get a WhatsApp message with a link to accept. Access starts only once they do.
      </p>
    </form>
  );
}
