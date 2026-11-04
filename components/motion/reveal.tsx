"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Reveal-on-scroll wrapper.
 *
 * Elements render hidden (via the `.reveal` class in globals.css) and are
 * released once they enter the viewport. The CSS carries a
 * `prefers-reduced-motion` override, so a visitor with reduced motion enabled
 * sees content immediately and never a blank section — which is also what
 * happens if JavaScript fails to run.
 */
export function Reveal({
  children,
  className,
  delayMs = 0,
  as: Tag = "div",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  /** Stagger within a group, in milliseconds. */
  delayMs?: number;
  as?: "div" | "section" | "li" | "article" | "header";
  /** Anchor target, for in-page links like /about#partners. */
  id?: string;
}) {
  const ref = React.useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node || revealed) return;

    // Without IntersectionObserver, show everything rather than nothing.
    // Deferred to the next frame so it isn't a synchronous setState in the
    // effect body (which would cascade a render for every revealed element).
    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setRevealed(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [revealed]);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      id={id}
      className={cn("reveal", className)}
      data-revealed={revealed ? "true" : "false"}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
