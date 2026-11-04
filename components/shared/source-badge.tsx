import { BadgeCheck, FileCheck, PenLine, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { RecordSource } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Provenance badge for clinical records.
 *
 * Every record in the Health Passport carries a `source`, and the UI always
 * shows it: a pet parent should be able to tell at a glance whether a fact was
 * asserted by a vet, extracted from a document, or typed in by hand.
 */

const SOURCE_META: Record<
  RecordSource,
  {
    label: string;
    short: string;
    variant: "verified" | "parent" | "draft" | "default";
    icon: React.ComponentType<{ className?: string }>;
    explanation: string;
  }
> = {
  vet_verified: {
    label: "Vet verified",
    short: "Verified",
    variant: "verified",
    icon: BadgeCheck,
    explanation:
      "Recorded or confirmed by a registered veterinarian during a Tailish consultation.",
  },
  document_verified: {
    label: "Document verified",
    short: "Verified",
    variant: "verified",
    icon: FileCheck,
    explanation:
      "Taken from an uploaded clinical document and checked by the Tailish care desk.",
  },
  ai_extracted_draft: {
    label: "Draft — needs review",
    short: "Draft",
    variant: "draft",
    icon: Sparkles,
    explanation:
      "Read automatically from an uploaded document. Not yet checked by a human — treat as provisional.",
  },
  parent_entered: {
    label: "Parent entered",
    short: "Parent entered",
    variant: "parent",
    icon: PenLine,
    explanation: "Entered by you. Useful context, but not clinically verified.",
  },
};

export function SourceBadge({
  source,
  compact = false,
  className,
}: {
  source: RecordSource;
  compact?: boolean;
  className?: string;
}) {
  const meta = SOURCE_META[source];
  const Icon = meta.icon;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={meta.variant} className={cn("cursor-help", className)}>
            <Icon className="size-3.5" aria-hidden="true" />
            {compact ? meta.short : meta.label}
            <span className="sr-only">. {meta.explanation}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>{meta.explanation}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function sourceLabel(source: RecordSource) {
  return SOURCE_META[source].label;
}
