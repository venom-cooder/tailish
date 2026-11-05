import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Minimal markdown renderer for guide bodies and legal copy.
 *
 * Supports exactly what the content in /lib/mock uses — `##` headings,
 * paragraphs, `-` bullets, numbered lists and `**bold**` — rather than pulling
 * in a full markdown pipeline. The backend will serve the same subset.
 */

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  // Split on **bold** and [label](href) without a parser.
  const nodes: React.ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(pattern).filter(Boolean);

  parts.forEach((part, index) => {
    const key = `${keyPrefix}-${index}`;
    if (part.startsWith("**") && part.endsWith("**")) {
      nodes.push(
        <strong key={key} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>,
      );
      return;
    }
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      nodes.push(
        <Link
          key={key}
          href={link[2]}
          className="font-medium text-brand-700 underline underline-offset-4 transition-colors hover:text-accent-600"
        >
          {link[1]}
        </Link>,
      );
      return;
    }
    nodes.push(<React.Fragment key={key}>{part}</React.Fragment>);
  });

  return nodes;
}

export function Prose({ body, className }: { body: string; className?: string }) {
  const blocks = body.trim().split(/\n\s*\n/);

  return (
    <div className={cn("space-y-5", className)}>
      {blocks.map((block, blockIndex) => {
        const key = `b${blockIndex}`;
        const lines = block.split("\n");

        if (block.startsWith("## ")) {
          return (
            <h2
              key={key}
              className="scroll-mt-28 pt-4 font-display text-xl font-bold text-ink sm:text-2xl"
            >
              {renderInline(block.slice(3), key)}
            </h2>
          );
        }

        if (block.startsWith("### ")) {
          return (
            <h3 key={key} className="scroll-mt-28 pt-2 font-display text-lg font-semibold text-ink">
              {renderInline(block.slice(4), key)}
            </h3>
          );
        }

        if (lines.every((line) => line.startsWith("- "))) {
          return (
            <ul key={key} className="space-y-2.5 pl-1">
              {lines.map((line, lineIndex) => (
                <li
                  key={`${key}-${lineIndex}`}
                  className="flex gap-3 text-[0.9375rem] leading-relaxed text-muted"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand-400"
                  />
                  <span>{renderInline(line.slice(2), `${key}-${lineIndex}`)}</span>
                </li>
              ))}
            </ul>
          );
        }

        if (lines.every((line) => /^\d+\.\s/.test(line))) {
          return (
            <ol key={key} className="space-y-2.5">
              {lines.map((line, lineIndex) => (
                <li
                  key={`${key}-${lineIndex}`}
                  className="flex gap-3 text-[0.9375rem] leading-relaxed text-muted"
                >
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
                    {lineIndex + 1}
                  </span>
                  <span>
                    {renderInline(line.replace(/^\d+\.\s/, ""), `${key}-${lineIndex}`)}
                  </span>
                </li>
              ))}
            </ol>
          );
        }

        // A single newline inside a paragraph is a line break, not a space:
        // address and contact blocks are written one field per line and would
        // otherwise run together into a single sentence.
        return (
          <p key={key} className="text-[0.9375rem] leading-relaxed text-muted sm:text-base">
            {lines.map((line, lineIndex) => (
              <React.Fragment key={`${key}-${lineIndex}`}>
                {lineIndex > 0 ? <br /> : null}
                {renderInline(line, `${key}-${lineIndex}`)}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
