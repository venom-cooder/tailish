import * as React from "react";
import { AlertCircle, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Loading, empty and error states.
 *
 * Shared so that every data-backed surface on the site resolves the same way —
 * a pet parent should never be looking at a blank panel wondering whether it's
 * broken or just slow.
 */

export function LoadingState({
  label = "Loading…",
  className,
  rows = 3,
}: {
  label?: string;
  className?: string;
  rows?: number;
}) {
  return (
    <div className={cn("space-y-3", className)} role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-20 w-full" />
      ))}
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
  className,
}: {
  message: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-start gap-4 rounded-2xl border border-red-100 bg-red-50/60 p-6 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-600" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-red-900">Something went wrong</p>
          <p className="mt-0.5 text-sm text-red-800/80">{message}</p>
        </div>
      </div>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry} className="shrink-0">
          <RefreshCw className="size-4" />
          Try again
        </Button>
      ) : null}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 rounded-3xl border border-dashed border-brand-200 bg-brand-50/40 px-6 py-14 text-center",
        className,
      )}
    >
      {Icon ? (
        <span className="grid size-14 place-items-center rounded-2xl bg-white text-brand-500 shadow-soft">
          <Icon className="size-6" aria-hidden="true" />
        </span>
      ) : null}
      <div className="max-w-sm">
        <p className="font-display text-lg font-semibold text-ink">{title}</p>
        {description ? <p className="mt-1.5 text-sm leading-relaxed text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

/**
 * Placeholder for features the backend hasn't shipped yet.
 *
 * The endpoints exist in /lib/api and return mock data; this marks the surface
 * honestly rather than presenting demo output as live.
 */
export function ComingSoon({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-2xl border border-gold-400/30 bg-gold-400/5 p-5",
        className,
      )}
    >
      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-gold-400/15 text-gold-600">
        <Clock className="size-4" aria-hidden="true" />
      </span>
      <div>
        <p className="text-sm font-semibold text-ink">
          {title}
          <span className="ml-2 rounded-full bg-gold-400/15 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-gold-600">
            Coming soon
          </span>
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted">{description}</p>
      </div>
    </div>
  );
}
