"use client";

import * as React from "react";
import { Loader2, MapPin, Pencil, Plus, Star, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/label";
import { Input, Select } from "@/components/ui/input";
import { PortalHeader } from "@/components/portal/portal-shell";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/states";
import { api } from "@/lib/api";
import { useAsync, useMutation } from "@/lib/hooks/use-async";
import type { Address, AddressLabel } from "@/lib/types";
import { cn } from "@/lib/utils";

const BLANK: Omit<Address, "id"> = {
  label: "home",
  line1: "",
  line2: "",
  landmark: "",
  city: "Indore",
  state: "Madhya Pradesh",
  pincode: "",
  contactName: "",
  contactPhone: "",
  isDefault: false,
};

export default function AddressesPage() {
  const addresses = useAsync<Address[]>(() => api.account.listAddresses(), []);
  const [editing, setEditing] = React.useState<Address | "new" | null>(null);

  return (
    <>
      <PortalHeader
        title="Addresses"
        description="Where our vets visit and where your orders are delivered."
      >
        {editing === null ? (
          <Button onClick={() => setEditing("new")}>
            <Plus className="size-4" aria-hidden="true" />
            Add address
          </Button>
        ) : null}
      </PortalHeader>

      {editing !== null ? (
        <AddressForm
          address={editing === "new" ? undefined : editing}
          onCancel={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            addresses.refresh();
          }}
        />
      ) : addresses.loading ? (
        <LoadingState label="Loading your addresses" rows={2} />
      ) : addresses.error ? (
        <ErrorState message={addresses.error} onRetry={addresses.refresh} />
      ) : (addresses.data ?? []).length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No addresses saved"
          description="Add one so a vet knows where to come and we know where to deliver."
          action={<Button onClick={() => setEditing("new")}>Add an address</Button>}
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {addresses.data?.map((address) => (
            <li key={address.id}>
              <AddressCard
                address={address}
                onEdit={() => setEditing(address)}
                onChanged={addresses.refresh}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function AddressCard({
  address,
  onEdit,
  onChanged,
}: {
  address: Address;
  onEdit: () => void;
  onChanged: () => void;
}) {
  const [confirming, setConfirming] = React.useState(false);

  const remove = useMutation(async () => {
    const result = await api.account.deleteAddress(address.id);
    onChanged();
    return result;
  });

  const makeDefault = useMutation(async () => {
    const result = await api.account.updateAddress(address.id, { isDefault: true });
    onChanged();
    return result;
  });

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-3xl border bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift",
        address.isDefault ? "border-brand-300 ring-1 ring-brand-600/10" : "border-hairline",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
            <MapPin className="size-5" aria-hidden="true" />
          </span>
          <span className="font-semibold capitalize text-ink">{address.label}</span>
        </div>
        {address.isDefault ? <Badge variant="verified">Default</Badge> : null}
      </div>

      <address className="mt-4 flex-1 text-sm not-italic leading-relaxed text-muted">
        {address.line1}
        {address.line2 ? (
          <>
            <br />
            {address.line2}
          </>
        ) : null}
        {address.landmark ? (
          <>
            <br />
            {address.landmark}
          </>
        ) : null}
        <br />
        {address.city}, {address.state} {address.pincode}
        {address.contactPhone ? (
          <>
            <br />
            <span className="text-xs">
              {address.contactName} · {address.contactPhone}
            </span>
          </>
        ) : null}
      </address>

      {remove.error ? (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {remove.error}
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2 border-t border-hairline pt-4">
        <Button size="sm" variant="outline" onClick={onEdit}>
          <Pencil className="size-4" aria-hidden="true" />
          Edit
        </Button>

        {!address.isDefault ? (
          <Button
            size="sm"
            variant="ghost"
            disabled={makeDefault.pending}
            onClick={() => void makeDefault.run()}
          >
            {makeDefault.pending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Star className="size-4" aria-hidden="true" />
            )}
            Make default
          </Button>
        ) : null}

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
              Confirm
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
            Delete
          </Button>
        )}
      </div>
    </article>
  );
}

function AddressForm({
  address,
  onCancel,
  onSaved,
}: {
  address?: Address;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = React.useState<Omit<Address, "id">>(address ?? BLANK);

  const save = useMutation(async () => {
    const result = address
      ? await api.account.updateAddress(address.id, form)
      : await api.account.createAddress(form);
    onSaved();
    return result;
  });

  function update<K extends keyof Omit<Address, "id">>(key: K, value: Address[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

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
        <h2 className="font-display text-lg font-semibold text-ink">
          {address ? "Edit address" : "New address"}
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
        <Field label="Label" htmlFor="addr-label">
          <Select
            id="addr-label"
            value={form.label}
            onChange={(event) => update("label", event.target.value as AddressLabel)}
          >
            <option value="home">Home</option>
            <option value="work">Work</option>
            <option value="other">Other</option>
          </Select>
        </Field>

        <Field label="Flat / house number and building" htmlFor="addr-line1" required>
          <Input
            id="addr-line1"
            value={form.line1}
            autoComplete="address-line1"
            onChange={(event) => update("line1", event.target.value)}
            placeholder="44, Sampat Hills"
          />
        </Field>

        <Field label="Area, street or sector" htmlFor="addr-line2">
          <Input
            id="addr-line2"
            value={form.line2}
            autoComplete="address-line2"
            onChange={(event) => update("line2", event.target.value)}
            placeholder="2nd Floor, Block B"
          />
        </Field>

        <Field
          label="Landmark"
          htmlFor="addr-landmark"
          hint="Genuinely useful — most of our vets find homes by landmark, not pin."
        >
          <Input
            id="addr-landmark"
            value={form.landmark}
            onChange={(event) => update("landmark", event.target.value)}
            placeholder="Near Apollo Pharmacy"
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="City" htmlFor="addr-city" required>
            <Input
              id="addr-city"
              value={form.city}
              autoComplete="address-level2"
              onChange={(event) => update("city", event.target.value)}
            />
          </Field>
          <Field label="State" htmlFor="addr-state" required>
            <Input
              id="addr-state"
              value={form.state}
              autoComplete="address-level1"
              onChange={(event) => update("state", event.target.value)}
            />
          </Field>
          <Field label="PIN code" htmlFor="addr-pin" required>
            <Input
              id="addr-pin"
              inputMode="numeric"
              maxLength={6}
              value={form.pincode}
              autoComplete="postal-code"
              onChange={(event) => update("pincode", event.target.value.replace(/\D/g, ""))}
              placeholder="452010"
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Contact name"
            htmlFor="addr-contact"
            hint="Who the vet or courier should ask for."
          >
            <Input
              id="addr-contact"
              value={form.contactName}
              autoComplete="name"
              onChange={(event) => update("contactName", event.target.value)}
            />
          </Field>
          <Field label="Contact phone" htmlFor="addr-phone">
            <Input
              id="addr-phone"
              type="tel"
              inputMode="numeric"
              value={form.contactPhone}
              autoComplete="tel"
              onChange={(event) => update("contactPhone", event.target.value)}
            />
          </Field>
        </div>

        <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-hairline bg-brand-50/40 p-4">
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={(event) => update("isDefault", event.target.checked)}
            className="size-5 rounded-md accent-brand-600"
          />
          <span className="text-sm text-ink">Use this as my default address</span>
        </label>
      </div>

      {save.error ? (
        <p role="alert" className="mt-5 text-sm text-red-600">
          {save.error}
        </p>
      ) : null}

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Button type="submit" size="lg" disabled={save.pending}>
          {save.pending ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : null}
          {address ? "Save changes" : "Save address"}
        </Button>
        <Button type="button" size="lg" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
