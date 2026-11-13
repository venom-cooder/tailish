"use client";

import * as React from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/label";
import { Input, Select, Textarea } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useMutation } from "@/lib/hooks/use-async";
import type { PartnerApplicationInput, Species } from "@/lib/types";

function SuccessNote({ message }: { message: string }) {
  return (
    <div
      role="status"
      className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5"
    >
      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" aria-hidden="true" />
      <p className="text-sm leading-relaxed text-emerald-900">{message}</p>
    </div>
  );
}

/* --------------------------------------------------------------- contact */

export function ContactForm() {
  const [done, setDone] = React.useState<string | null>(null);
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    subject: "General enquiry",
    message: "",
  });

  const submit = useMutation(async () => {
    const result = await api.leads.contact(form);
    setDone(result.message);
    return result;
  });

  if (done) return <SuccessNote message={done} />;

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void submit.run();
      }}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" htmlFor="contact-name" required>
          <Input
            id="contact-name"
            value={form.name}
            autoComplete="name"
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
        </Field>
        <Field label="Email" htmlFor="contact-email" required>
          <Input
            id="contact-email"
            type="email"
            value={form.email}
            autoComplete="email"
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Phone" htmlFor="contact-phone" hint="Optional — faster if we need to call.">
          <Input
            id="contact-phone"
            type="tel"
            value={form.phone}
            autoComplete="tel"
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
          />
        </Field>
        <Field label="What's this about?" htmlFor="contact-subject">
          <Select
            id="contact-subject"
            value={form.subject}
            onChange={(event) => setForm({ ...form, subject: event.target.value })}
          >
            <option>General enquiry</option>
            <option>Booking or appointment</option>
            <option>An order from the shop</option>
            <option>Health Passport or records</option>
            <option>Membership and billing</option>
            <option>Partnership</option>
            <option>Feedback or complaint</option>
          </Select>
        </Field>
      </div>

      <Field label="How can we help?" htmlFor="contact-message" required>
        <Textarea
          id="contact-message"
          rows={5}
          value={form.message}
          onChange={(event) => setForm({ ...form, message: event.target.value })}
          placeholder="Tell us what's going on…"
        />
      </Field>

      {submit.error ? (
        <p role="alert" className="text-sm text-red-600">
          {submit.error}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={submit.pending}>
        {submit.pending ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : null}
        Send message
      </Button>

      <p className="text-xs leading-relaxed text-muted">
        We reply to most enquiries within a few hours during support hours. For anything urgent about
        your pet&apos;s health, please book a visit or go to an emergency hospital rather than
        waiting on email.
      </p>
    </form>
  );
}

/* -------------------------------------------------------------- waitlist */

export function WaitlistForm({ compact }: { compact?: boolean }) {
  const [done, setDone] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<{ name: string; phone: string; city: string; petType: Species }>({
    name: "",
    phone: "",
    city: "",
    petType: "dog",
  });

  const submit = useMutation(async () => {
    const result = await api.leads.joinWaitlist(form);
    setDone(result.message);
    return result;
  });

  if (done) return <SuccessNote message={done} />;

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void submit.run();
      }}
      className="space-y-4"
    >
      <div className={compact ? "grid gap-4 sm:grid-cols-3" : "grid gap-4 sm:grid-cols-2"}>
        <Field label="Your name" htmlFor="wl-name" required>
          <Input
            id="wl-name"
            value={form.name}
            autoComplete="name"
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
        </Field>
        <Field label="Mobile number" htmlFor="wl-phone" required>
          <Input
            id="wl-phone"
            type="tel"
            inputMode="numeric"
            placeholder="98765 43210"
            value={form.phone}
            autoComplete="tel"
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
          />
        </Field>
        <Field label="Your city" htmlFor="wl-city" required>
          <Input
            id="wl-city"
            value={form.city}
            autoComplete="address-level2"
            onChange={(event) => setForm({ ...form, city: event.target.value })}
          />
        </Field>
        {!compact ? (
          <Field label="You have a…" htmlFor="wl-pet">
            <Select
              id="wl-pet"
              value={form.petType}
              onChange={(event) => setForm({ ...form, petType: event.target.value as Species })}
            >
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="rabbit">Rabbit</option>
              <option value="bird">Bird</option>
              <option value="other">Something else</option>
            </Select>
          </Field>
        ) : null}
      </div>

      {submit.error ? (
        <p role="alert" className="text-sm text-red-600">
          {submit.error}
        </p>
      ) : null}

      <Button type="submit" disabled={submit.pending}>
        {submit.pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
        Join the waitlist
      </Button>
    </form>
  );
}

/* -------------------------------------------------------------- partners */

export function PartnerForm() {
  const [done, setDone] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<PartnerApplicationInput>({
    name: "",
    phone: "",
    email: "",
    clinicName: "",
    registrationNo: "",
    city: "Indore",
    partnerType: "vet",
    message: "",
  });

  const submit = useMutation(async () => {
    const result = await api.leads.applyAsPartner(form);
    setDone(result.message);
    return result;
  });

  if (done) return <SuccessNote message={done} />;

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void submit.run();
      }}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" htmlFor="p-name" required>
          <Input
            id="p-name"
            value={form.name}
            autoComplete="name"
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
        </Field>
        <Field label="I am a…" htmlFor="p-type">
          <Select
            id="p-type"
            value={form.partnerType}
            onChange={(event) =>
              setForm({ ...form, partnerType: event.target.value as PartnerApplicationInput["partnerType"] })
            }
          >
            <option value="vet">Veterinarian</option>
            <option value="clinic">Clinic or hospital</option>
            <option value="groomer">Groomer</option>
            <option value="store">Pet store or brand</option>
            <option value="other">Something else</option>
          </Select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email" htmlFor="p-email" required>
          <Input
            id="p-email"
            type="email"
            value={form.email}
            autoComplete="email"
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </Field>
        <Field label="Mobile number" htmlFor="p-phone" required>
          <Input
            id="p-phone"
            type="tel"
            inputMode="numeric"
            value={form.phone}
            autoComplete="tel"
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Clinic or business name" htmlFor="p-clinic">
          <Input
            id="p-clinic"
            value={form.clinicName}
            onChange={(event) => setForm({ ...form, clinicName: event.target.value })}
          />
        </Field>
        <Field
          label="Council registration number"
          htmlFor="p-reg"
          hint="Required for veterinarians and clinics."
        >
          <Input
            id="p-reg"
            value={form.registrationNo}
            onChange={(event) => setForm({ ...form, registrationNo: event.target.value })}
          />
        </Field>
      </div>

      <Field label="City" htmlFor="p-city" required>
        <Input
          id="p-city"
          value={form.city}
          autoComplete="address-level2"
          onChange={(event) => setForm({ ...form, city: event.target.value })}
        />
      </Field>

      <Field label="Anything else we should know?" htmlFor="p-message">
        <Textarea
          id="p-message"
          rows={4}
          value={form.message}
          onChange={(event) => setForm({ ...form, message: event.target.value })}
          placeholder="Your areas of practice, availability, or what you'd like to do with Tailish."
        />
      </Field>

      {submit.error ? (
        <p role="alert" className="text-sm text-red-600">
          {submit.error}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={submit.pending}>
        {submit.pending ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : null}
        Submit application
      </Button>
    </form>
  );
}
