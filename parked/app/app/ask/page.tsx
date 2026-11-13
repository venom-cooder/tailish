"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, Loader2, Phone, Send, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, Textarea } from "@/components/ui/input";
import { PortalHeader } from "@/components/portal/portal-shell";
import { Prose } from "@/components/shared/prose";
import { WhatsAppButton } from "@/components/whatsapp/whatsapp-button";
import { api } from "@/lib/api";
import { useAsync, useMutation } from "@/lib/hooks/use-async";
import { ASK_DISCLAIMER, ASK_SUGGESTIONS } from "@/lib/mock/ai";
import type { ChatMessage, Pet } from "@/lib/types";
import { whatsappMessages } from "@/lib/whatsapp";
import { cn, nextId } from "@/lib/utils";

export default function AskPage() {
  const pets = useAsync<Pet[]>(() => api.pets.list(), []);
  // Derived default — see the note in the booking flow.
  const [chosenPetId, setChosenPetId] = React.useState<string | null>(null);
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = React.useState<string | undefined>();

  const threadRef = React.useRef<HTMLDivElement>(null);

  const petId = chosenPetId ?? pets.data?.[0]?.id ?? "";
  const setPetId = setChosenPetId;

  // Keep the newest message in view as the thread grows.
  React.useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const ask = useMutation(async (text: string) => {
    const userMessage: ChatMessage = {
      id: nextId("msg"),
      role: "user",
      content: text,
      createdAt: "",
    };
    setMessages((current) => [...current, userMessage]);
    setInput("");

    const response = await api.ai.ask({ message: text, petId, conversationId });
    setConversationId(response.conversationId);
    setMessages((current) => [...current, response.message]);
    return response;
  });

  function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || ask.pending) return;
    void ask.run(trimmed);
  }

  const activePet = pets.data?.find((p) => p.id === petId);

  return (
    <>
      <PortalHeader
        title="Ask Tailish"
        description="Care questions, answered with your pet's own records attached. Not a diagnosis — that comes from a vet who has examined them."
      >
        {(pets.data ?? []).length > 1 ? (
          <Select
            value={petId}
            onChange={(event) => setPetId(event.target.value)}
            aria-label="Choose which pet this is about"
            className="w-44"
          >
            {pets.data?.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.name}
              </option>
            ))}
          </Select>
        ) : null}
      </PortalHeader>

      <div className="flex min-h-[32rem] flex-col overflow-hidden rounded-3xl border border-hairline bg-white shadow-soft">
        {/* Safety banner — always visible, never dismissible. */}
        <div className="flex items-start gap-3 border-b border-hairline bg-brand-50/60 px-5 py-3.5 sm:px-6">
          <ShieldCheck className="mt-0.5 size-4.5 shrink-0 text-brand-600" aria-hidden="true" />
          <p className="text-xs leading-relaxed text-muted">
            {ASK_DISCLAIMER}{" "}
            <Link
              href="/nearby?type=emergency"
              className="font-medium text-brand-700 underline-offset-4 hover:underline"
            >
              Emergency vets near you
            </Link>
          </p>
        </div>

        <div ref={threadRef} className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-10 text-center">
              <span className="grid size-14 place-items-center rounded-2xl bg-brand-700 text-white">
                <Sparkles className="size-7" aria-hidden="true" />
              </span>
              <h2 className="mt-5 font-display text-xl font-semibold text-ink">
                How is {activePet?.name ?? "your pet"} today?
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
                Ask anything about food, behaviour, medication or something you&apos;ve noticed.
                {activePet
                  ? ` ${activePet.name}'s vaccinations, conditions and current medications are already attached.`
                  : ""}
              </p>

              <ul className="mt-7 flex max-w-xl flex-wrap justify-center gap-2">
                {ASK_SUGGESTIONS.map((suggestion) => (
                  <li key={suggestion}>
                    <button
                      type="button"
                      onClick={() => submit(suggestion)}
                      className="rounded-xl border border-hairline bg-white px-4 py-2 text-sm text-muted transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-700"
                    >
                      {suggestion}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            messages.map((message) => <MessageBubble key={message.id} message={message} onReply={submit} />)
          )}

          {ask.pending ? (
            <div className="flex items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-700 text-white">
                <Sparkles className="size-4.5" aria-hidden="true" />
              </span>
              <span className="flex items-center gap-2 rounded-2xl bg-brand-50 px-4 py-3 text-sm text-muted">
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Reading {activePet?.name ?? "your pet"}&apos;s records…
              </span>
            </div>
          ) : null}
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit(input);
          }}
          className="border-t border-hairline p-4 sm:p-5"
        >
          <div className="flex items-end gap-3">
            <label htmlFor="ask-input" className="sr-only">
              Your question
            </label>
            <Textarea
              id="ask-input"
              rows={1}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                // Enter sends; Shift+Enter inserts a newline.
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  submit(input);
                }
              }}
              placeholder={`Ask about ${activePet?.name ?? "your pet"}…`}
              className="min-h-12 resize-none py-3.5"
            />
            <Button
              type="submit"
              size="icon"
              className="size-12 shrink-0"
              disabled={!input.trim() || ask.pending}
              aria-label="Send question"
            >
              <Send className="size-5" aria-hidden="true" />
            </Button>
          </div>

          {ask.error ? (
            <p role="alert" className="mt-2.5 text-sm text-red-600">
              {ask.error}
            </p>
          ) : null}

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted">
              Press Enter to send · Shift + Enter for a new line
            </p>
            <WhatsAppButton
              variant="ghost"
              size="sm"
              text={whatsappMessages.askTailish}
              label="Continue on WhatsApp"
            />
          </div>
        </form>
      </div>
    </>
  );
}

function MessageBubble({
  message,
  onReply,
}: {
  message: ChatMessage;
  onReply: (text: string) => void;
}) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] rounded-2xl rounded-br-md bg-brand-700 px-4 py-3 text-sm leading-relaxed text-white sm:max-w-[75%]">
          {message.content}
        </p>
      </div>
    );
  }

  const emergency = message.escalation?.level === "emergency";
  const vetReview = message.escalation?.level === "vet_review";

  return (
    <div className="flex gap-3">
      <span
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-xl text-white",
          emergency ? "bg-red-600" : "bg-brand-700",
        )}
      >
        {emergency ? (
          <AlertTriangle className="size-4.5" aria-hidden="true" />
        ) : (
          <Sparkles className="size-4.5" aria-hidden="true" />
        )}
      </span>

      <div className="min-w-0 flex-1">
        <div
          className={cn(
            "rounded-2xl rounded-tl-md border px-4 py-3.5",
            emergency ? "border-red-200 bg-red-50" : "border-hairline bg-brand-50/50",
          )}
        >
          <Prose body={message.content} className="space-y-3 [&_p]:text-sm [&_li]:text-sm" />
        </div>

        {message.escalation && message.escalation.level !== "none" ? (
          <div
            className={cn(
              "mt-2.5 flex flex-wrap items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs",
              emergency ? "bg-red-100 text-red-900" : "bg-gold-400/10 text-gold-600",
            )}
          >
            <ShieldCheck className="size-4 shrink-0" aria-hidden="true" />
            <span className="min-w-0 flex-1">{message.escalation.message}</span>
            {emergency ? (
              <Button asChild size="sm" variant="danger">
                <Link href="/nearby?type=emergency">
                  <Phone className="size-4" aria-hidden="true" />
                  Find one now
                </Link>
              </Button>
            ) : vetReview ? (
              <Button asChild size="sm" variant="outline">
                <Link href="/vet-care/book-visit">Book a review</Link>
              </Button>
            ) : null}
          </div>
        ) : null}

        {message.citations?.length ? (
          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {message.citations.map((citation) => (
              <li key={citation.href}>
                <Link href={citation.href}>
                  <Badge variant="outline" className="transition-colors hover:border-brand-300">
                    {citation.label}
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}

        {message.quickReplies?.length ? (
          <ul className="mt-3 flex flex-wrap gap-2">
            {message.quickReplies.map((reply) => (
              <li key={reply}>
                <button
                  type="button"
                  onClick={() => onReply(reply)}
                  className="rounded-lg border border-brand-200 bg-white px-3.5 py-1.5 text-xs font-medium text-brand-700 transition-all hover:-translate-y-0.5 hover:border-brand-400 hover:bg-brand-50"
                >
                  {reply}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
