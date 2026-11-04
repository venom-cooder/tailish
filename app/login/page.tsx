"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2, Lock, Phone, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useSession } from "@/components/providers/session-provider";
import { WhatsAppButton } from "@/components/whatsapp/whatsapp-button";
import { api, DEMO_OTP } from "@/lib/api";
import { useMutation } from "@/lib/hooks/use-async";
import { USE_REAL_API } from "@/lib/config";
import { whatsappMessages } from "@/lib/whatsapp";
import type { OtpRequestResult } from "@/lib/types";

const OTP_LENGTH = 4;

export default function LoginPage() {
  const router = useRouter();
  const { refresh } = useSession();

  const [step, setStep] = React.useState<"phone" | "code">("phone");
  const [phone, setPhone] = React.useState("");
  const [request, setRequest] = React.useState<OtpRequestResult | null>(null);
  const [digits, setDigits] = React.useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [secondsLeft, setSecondsLeft] = React.useState(0);

  const inputsRef = React.useRef<(HTMLInputElement | null)[]>([]);

  const sendOtp = useMutation(async () => {
    const result = await api.auth.requestOtp(phone);
    setRequest(result);
    setStep("code");
    setSecondsLeft(result.expiresInSec);
    return result;
  });

  const verifyOtp = useMutation(async (code: string) => {
    const session = await api.auth.verifyOtp(phone, code);
    await refresh();
    router.push("/app");
    return session;
  });

  // Countdown for the resend affordance.
  React.useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  React.useEffect(() => {
    if (step === "code") inputsRef.current[0]?.focus();
  }, [step]);

  function handleDigit(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);

    if (digit && index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus();

    const code = next.join("");
    if (code.length === OTP_LENGTH && !next.includes("")) {
      void verifyOtp.run(code);
    }
  }

  function handleKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    event.preventDefault();
    const next = Array(OTP_LENGTH)
      .fill("")
      .map((_, index) => pasted[index] ?? "");
    setDigits(next);
    if (pasted.length === OTP_LENGTH) void verifyOtp.run(pasted);
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Brand panel */}
      <div className="paw-field relative hidden flex-col justify-between bg-brand-900 p-12 lg:flex">
        <Logo tone="light" showTagline className="text-[1.25rem]" />

        <div>
          <h2 className="max-w-md text-3xl font-bold leading-[1.15] text-white">
            Care begins with one simple sign-in.
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-white/70">
            Your pet&apos;s Health Passport, bookings, reminders and orders — all behind one number
            you already remember.
          </p>

          <ul className="mt-8 space-y-3">
            {[
              "No password to forget or reset",
              "Verified by OTP on your mobile",
              "Works on WhatsApp too",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-white/75">
                <ShieldCheck className="size-5 shrink-0 text-brand-300" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-white/50">
          Tailish Pet Care Private Limited · Indore, Madhya Pradesh
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col justify-center px-5 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-brand-700 lg:hidden"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to Tailish
          </Link>

          <div className="lg:hidden">
            <Logo className="text-[1.15rem]" />
          </div>

          {step === "phone" ? (
            <form
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                void sendOtp.run();
              }}
              className="mt-8 lg:mt-0"
            >
              <h1 className="font-display text-2xl font-bold text-ink">Welcome back</h1>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Enter your mobile number. We&apos;ll send a code to verify it — no password needed.
              </p>

              <div className="mt-7">
                <Field label="Mobile number" htmlFor="phone" required>
                  <div className="flex gap-2">
                    <span className="grid h-11 shrink-0 place-items-center rounded-xl border border-hairline bg-brand-50/60 px-4 text-sm font-medium tabular text-ink">
                      +91
                    </span>
                    <Input
                      id="phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      aria-invalid={sendOtp.error ? true : undefined}
                    />
                  </div>
                </Field>
              </div>

              {sendOtp.error ? (
                <p role="alert" className="mt-3 text-sm text-red-600">
                  {sendOtp.error}
                </p>
              ) : null}

              <Button type="submit" size="lg" className="mt-6 w-full" disabled={sendOtp.pending}>
                {sendOtp.pending ? (
                  <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                ) : (
                  <Phone className="size-5" aria-hidden="true" />
                )}
                Continue securely
              </Button>

              <div className="my-6 flex items-center gap-4">
                <span className="h-px flex-1 bg-hairline" />
                <span className="text-xs uppercase tracking-wide text-muted">or</span>
                <span className="h-px flex-1 bg-hairline" />
              </div>

              <WhatsAppButton
                size="lg"
                variant="outline"
                className="w-full"
                text={whatsappMessages.general}
                label="Continue on WhatsApp"
              />

              <p className="mt-7 text-xs leading-relaxed text-muted">
                By continuing you agree to our{" "}
                <Link href="/terms" className="font-medium text-brand-700 underline-offset-4 hover:underline">
                  terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="font-medium text-brand-700 underline-offset-4 hover:underline">
                  privacy policy
                </Link>
                .
              </p>
            </form>
          ) : (
            <div className="mt-8 lg:mt-0">
              <button
                type="button"
                onClick={() => {
                  setStep("phone");
                  setDigits(Array(OTP_LENGTH).fill(""));
                }}
                className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-brand-700"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Change number
              </button>

              <h1 className="font-display text-2xl font-bold text-ink">
                Enter the code we just sent
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Sent to <span className="font-medium text-ink">{request?.phone}</span> by SMS and on
                WhatsApp.
              </p>

              <div className="mt-7">
                <fieldset>
                  <legend className="sr-only">Verification code</legend>
                  <div className="flex gap-3">
                    {digits.map((digit, index) => (
                      <input
                        key={index}
                        ref={(node) => {
                          inputsRef.current[index] = node;
                        }}
                        type="text"
                        inputMode="numeric"
                        autoComplete={index === 0 ? "one-time-code" : "off"}
                        maxLength={1}
                        value={digit}
                        onChange={(event) => handleDigit(index, event.target.value)}
                        onKeyDown={(event) => handleKeyDown(index, event)}
                        onPaste={handlePaste}
                        aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
                        className="h-16 w-full rounded-2xl border border-hairline bg-white text-center font-display text-2xl font-bold tabular text-ink transition-colors focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                      />
                    ))}
                  </div>
                </fieldset>
              </div>

              {verifyOtp.error ? (
                <p role="alert" className="mt-3 text-sm text-red-600">
                  {verifyOtp.error}
                </p>
              ) : null}

              {verifyOtp.pending ? (
                <p className="mt-4 flex items-center gap-2 text-sm text-muted">
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Verifying…
                </p>
              ) : null}

              <Button
                size="lg"
                className="mt-6 w-full"
                disabled={digits.includes("") || verifyOtp.pending}
                onClick={() => void verifyOtp.run(digits.join(""))}
              >
                Verify and continue
                <ArrowRight className="size-5" aria-hidden="true" />
              </Button>

              <p className="mt-5 text-center text-sm text-muted">
                {secondsLeft > 0 ? (
                  <>
                    Resend code in <span className="tabular font-medium text-ink">{secondsLeft}s</span>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => void sendOtp.run()}
                    className="font-medium text-brand-700 underline-offset-4 hover:underline"
                  >
                    Resend code
                  </button>
                )}
              </p>

              {/* Demo affordance — the mock adapter accepts one fixed code.
                  Never rendered once a real backend is configured. */}
              {!USE_REAL_API && request?.devCode ? (
                <p className="mt-6 flex items-start gap-2.5 rounded-2xl border border-gold-400/35 bg-gold-400/5 p-4 text-xs leading-relaxed text-muted">
                  <Lock className="mt-0.5 size-4 shrink-0 text-gold-600" aria-hidden="true" />
                  <span>
                    <span className="font-semibold text-ink">Demo mode.</span> No SMS is sent — use
                    the code <span className="font-bold tabular text-ink">{DEMO_OTP}</span> to sign
                    in.
                  </span>
                </p>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
