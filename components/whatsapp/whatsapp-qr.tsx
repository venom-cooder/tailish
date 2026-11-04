"use client";

import { QRCodeSVG } from "qrcode.react";
import { LogoGlyph } from "@/components/brand/logo";
import { getWhatsAppLink, whatsappDisplayNumber } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { WhatsAppGlyph } from "./whatsapp-button";

/**
 * Brand mark placed at the centre of the QR code.
 *
 * URL-encoded rather than base64 so it needs no `btoa` at render time and
 * carries no network dependency.
 */
const PAW_BADGE_DATA_URI = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
    '<rect width="24" height="24" rx="6" fill="#0F3F44"/>' +
    '<g fill="#ffffff" transform="translate(3 3) scale(0.75)">' +
    '<ellipse cx="7.2" cy="8.4" rx="2.5" ry="3.2" transform="rotate(-18 7.2 8.4)"/>' +
    '<ellipse cx="12" cy="6.4" rx="2.5" ry="3.3"/>' +
    '<ellipse cx="16.8" cy="8.4" rx="2.5" ry="3.2" transform="rotate(18 16.8 8.4)"/>' +
    '<path d="M12 12.6c3.1 0 5.6 2.2 5.6 4.6 0 1.9-1.6 3-3.6 3-.8 0-1.4-.2-2-.2s-1.2.2-2 .2c-2 0-3.6-1.1-3.6-3 0-2.4 2.5-4.6 5.6-4.6Z"/>' +
    "</g></svg>",
)}`;

/**
 * QR code for the configured WhatsApp number.
 *
 * Encodes the same wa.me link as every WhatsApp button on the site, so the
 * code regenerates automatically when NEXT_PUBLIC_WHATSAPP_NUMBER changes.
 */
export function WhatsAppQR({
  text,
  size = 180,
  caption = "Scan to chat with Tailish on WhatsApp",
  showNumber = true,
  className,
  tone = "light",
}: {
  text?: string;
  size?: number;
  caption?: string;
  showNumber?: boolean;
  className?: string;
  /** "light" for a white card, "dark" for use on a deep-teal band. */
  tone?: "light" | "dark";
}) {
  const link = getWhatsAppLink({ text });

  return (
    <figure className={cn("flex flex-col items-center gap-4", className)}>
      <div
        className={cn(
          "rounded-3xl border p-4 shadow-soft transition-transform duration-300 hover:scale-[1.02]",
          tone === "dark" ? "border-white/15 bg-white" : "border-hairline bg-white",
        )}
      >
        <QRCodeSVG
          value={link}
          size={size}
          level="M"
          marginSize={0}
          bgColor="#ffffff"
          fgColor="#0F3F44"
          title="WhatsApp QR code for Tailish"
          imageSettings={{
            src: PAW_BADGE_DATA_URI,
            height: Math.round(size * 0.2),
            width: Math.round(size * 0.2),
            excavate: true,
          }}
        />
      </div>

      <figcaption className="text-center">
        <span
          className={cn(
            "flex items-center justify-center gap-2 text-sm font-medium",
            tone === "dark" ? "text-white" : "text-ink",
          )}
        >
          <WhatsAppGlyph className="size-4 text-whatsapp" />
          {caption}
        </span>
        {showNumber ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "mt-1 inline-block text-sm tabular underline-offset-4 transition-colors hover:underline",
              tone === "dark" ? "text-white/70 hover:text-white" : "text-muted hover:text-brand-700",
            )}
          >
            {whatsappDisplayNumber()}
          </a>
        ) : null}
      </figcaption>
    </figure>
  );
}

/** Compact QR for the footer column. */
export function WhatsAppQRMini({ text, className }: { text?: string; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="rounded-xl bg-white p-1.5">
        <QRCodeSVG
          value={getWhatsAppLink({ text })}
          size={64}
          level="L"
          marginSize={0}
          bgColor="#ffffff"
          fgColor="#0F3F44"
          title="WhatsApp QR code for Tailish"
        />
      </div>
      <div className="text-xs leading-relaxed text-white/70">
        <span className="block font-medium text-white">Scan to chat</span>
        {whatsappDisplayNumber()}
      </div>
    </div>
  );
}

export { LogoGlyph };
