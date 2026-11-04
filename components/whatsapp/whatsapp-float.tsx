"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { getWhatsAppLink, whatsappMessageForPath } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { WhatsAppGlyph } from "./whatsapp-button";

/**
 * Desktop floating WhatsApp action.
 *
 * Hidden below `lg`, where the mobile tab bar carries its own Ask action — two
 * fixed WhatsApp buttons would otherwise stack in the same corner.
 */
export function WhatsAppFloat() {
  const pathname = usePathname() ?? "/";
  const [dismissed, setDismissed] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);

  if (dismissed) return null;

  return (
    // The blurb opens on hover or keyboard focus rather than on a timer: a
    // panel that appears by itself lands on whatever happens to be in the
    // corner, and on the homepage that is the species row.
    <div
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className="fixed bottom-6 right-6 z-40 hidden flex-col items-end gap-3 lg:flex print:hidden"
    >
      {expanded ? (
        <div className="animate-in fade-in-0 slide-in-from-bottom-2 max-w-[17rem] rounded-2xl border border-hairline bg-white p-4 shadow-lift duration-200">
          <p className="text-sm font-semibold text-ink">Need a hand?</p>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            Talk to the Tailish care team on WhatsApp — bookings, reminders and care questions.
          </p>
        </div>
      ) : null}

      <a
        href={getWhatsAppLink({ text: whatsappMessageForPath(pathname) })}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Tailish on WhatsApp — opens in a new tab"
        onFocus={() => setExpanded(true)}
        onBlur={() => setExpanded(false)}
        className={cn(
          "group relative grid size-14 place-items-center rounded-2xl bg-whatsapp text-white shadow-lift",
          "transition-all duration-300 hover:scale-105 hover:bg-whatsapp-dark",
        )}
      >
        {/* Attention pulse, suppressed under prefers-reduced-motion by globals.css. */}
        <span className="absolute inset-0 animate-ping rounded-2xl bg-whatsapp/30 [animation-duration:2.5s]" />
        <WhatsAppGlyph className="relative size-7" />
      </a>

      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="sr-only focus:not-sr-only focus:rounded-xl focus:bg-white focus:px-3 focus:py-1.5 focus:text-xs focus:shadow-soft"
      >
        Hide the WhatsApp button
      </button>
    </div>
  );
}
