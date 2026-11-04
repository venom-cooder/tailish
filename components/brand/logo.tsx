import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The Tailish wordmark.
 *
 * Built from live text rather than an image so it stays crisp at any size and
 * inherits the page's font loading. The dot of the "i" is replaced by a paw
 * print (the letter is rendered as a dotless ı), and a tail curls off the "h".
 */

/** The paw from the wordmark, reusable on its own as a brand bullet or icon. */
export function PawGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <ellipse cx="7.2" cy="8.4" rx="2.5" ry="3.2" transform="rotate(-18 7.2 8.4)" />
      <ellipse cx="12" cy="6.4" rx="2.5" ry="3.3" />
      <ellipse cx="16.8" cy="8.4" rx="2.5" ry="3.2" transform="rotate(18 16.8 8.4)" />
      <path d="M12 12.6c3.1 0 5.6 2.2 5.6 4.6 0 1.9-1.6 3-3.6 3-.8 0-1.4-.2-2-.2s-1.2.2-2 .2c-2 0-3.6-1.1-3.6-3 0-2.4 2.5-4.6 5.6-4.6Z" />
    </svg>
  );
}

function TailMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 34" fill="none" aria-hidden="true" className={className}>
      <path
        d="M2 30C10 31.5 19.5 29 25.5 23.5C30 19.3 31.5 13.5 29 9.5C27.2 6.6 23.5 6 21.5 8.5C19.9 10.5 20.6 13.4 23 14.2"
        stroke="currentColor"
        strokeWidth="4.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({
  className,
  tone = "brand",
  showTagline = false,
}: {
  className?: string;
  /** "brand" for light backgrounds, "light" for deep-teal ones. */
  tone?: "brand" | "light";
  showTagline?: boolean;
}) {
  const color = tone === "light" ? "text-white" : "text-brand-700";

  return (
    <span className={cn("inline-flex flex-col", className)}>
      <span
        className={cn(
          "inline-flex items-start font-display text-[1.6em] font-bold leading-none tracking-[-0.03em]",
          color,
        )}
      >
        <span className="relative inline-flex items-start">
          {/* U+0131 — dotless i, so the paw print can take the dot's place. */}
          {"Taılish"}
          <PawGlyph className="absolute left-[2.42em] top-[-0.30em] size-[0.42em]" />
        </span>
        <TailMark className="-ml-[0.14em] mt-[0.34em] h-[0.62em] w-[0.72em]" />
      </span>
      {showTagline ? (
        <span
          className={cn(
            // The wide tracking needs roughly 14rem to sit on one line, which
            // a phone header does not have — so it only appears from sm up.
            "mt-1.5 hidden text-[0.62em] font-medium uppercase tracking-[0.3em] sm:inline",
            tone === "light" ? "text-white/70" : "text-gold-500",
          )}
        >
          Care. Love. Wellness.
        </span>
      ) : null}
    </span>
  );
}

export function LogoLink({
  className,
  tone = "brand",
  showTagline,
}: {
  className?: string;
  tone?: "brand" | "light";
  showTagline?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="Tailish — home"
      className={cn("inline-flex shrink-0 rounded-xl transition-opacity hover:opacity-80", className)}
    >
      <Logo tone={tone} showTagline={showTagline} />
    </Link>
  );
}

/** Square app-icon form of the mark, for avatars and the QR card. */
export function LogoGlyph({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-2xl bg-brand-700 text-white",
        className,
      )}
    >
      <PawGlyph className="size-1/2" />
    </span>
  );
}
