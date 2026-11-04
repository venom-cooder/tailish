import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { SourceBadge } from "@/components/shared/source-badge";
import type { Weight } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

/**
 * Weight history as an inline SVG line chart.
 *
 * Hand-drawn rather than pulled from a charting library: it's one series of a
 * dozen points, and the dependency would cost more than it saves. Values are
 * also listed as a table below for screen readers.
 */
export function WeightChart({ weights, className }: { weights: Weight[]; className?: string }) {
  if (weights.length < 2) {
    return (
      <p className={cn("text-sm text-muted", className)}>
        Record at least two measurements to see a trend.
      </p>
    );
  }

  const sorted = [...weights].sort((a, b) => a.measuredOn.localeCompare(b.measuredOn));
  const values = sorted.map((w) => w.weightKg);

  const min = Math.min(...values);
  const max = Math.max(...values);
  // Pad the range so the line never sits flat on an edge.
  const padding = Math.max(0.5, (max - min) * 0.25);
  const low = min - padding;
  const high = max + padding;

  const W = 640;
  const H = 220;
  const PAD_X = 36;
  const PAD_Y = 20;

  const x = (index: number) =>
    PAD_X + (index / (sorted.length - 1)) * (W - PAD_X * 2);
  const y = (value: number) =>
    PAD_Y + (1 - (value - low) / (high - low)) * (H - PAD_Y * 2);

  const line = sorted.map((w, index) => `${index === 0 ? "M" : "L"}${x(index)},${y(w.weightKg)}`).join(" ");
  const area = `${line} L${x(sorted.length - 1)},${H - PAD_Y} L${x(0)},${H - PAD_Y} Z`;

  const latest = sorted[sorted.length - 1];
  const previous = sorted[sorted.length - 2];
  const delta = latest.weightKg - previous.weightKg;
  const TrendIcon = delta > 0.05 ? TrendingUp : delta < -0.05 ? TrendingDown : Minus;

  return (
    <div className={className}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Current weight</p>
          <p className="mt-1 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold tabular text-ink">
              {latest.weightKg}
            </span>
            <span className="text-sm text-muted">kg</span>
          </p>
          <p
            className={cn(
              "mt-1 flex items-center gap-1.5 text-xs font-medium",
              delta > 0.05 ? "text-accent-600" : delta < -0.05 ? "text-emerald-700" : "text-muted",
            )}
          >
            <TrendIcon className="size-3.5" aria-hidden="true" />
            {delta === 0
              ? "No change"
              : `${delta > 0 ? "+" : ""}${delta.toFixed(1)} kg since ${formatDate(previous.measuredOn)}`}
          </p>
        </div>
        <SourceBadge source={latest.source} compact />
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-5 w-full"
        role="img"
        aria-label={`Weight history: ${sorted.length} measurements from ${latest.weightKg} kg most recently`}
      >
        <defs>
          <linearGradient id="weight-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--color-brand-500)" stopOpacity="0.22" />
            <stop offset="1" stopColor="var(--color-brand-500)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Horizontal guides with value labels. */}
        {[0, 0.5, 1].map((fraction) => {
          const value = high - fraction * (high - low);
          const yPos = PAD_Y + fraction * (H - PAD_Y * 2);
          return (
            <g key={fraction}>
              <line
                x1={PAD_X}
                x2={W - PAD_X}
                y1={yPos}
                y2={yPos}
                stroke="var(--color-hairline)"
                strokeDasharray="3 4"
              />
              <text
                x={0}
                y={yPos + 4}
                className="fill-[var(--color-muted)] text-[11px]"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {value.toFixed(1)}
              </text>
            </g>
          );
        })}

        <path d={area} fill="url(#weight-area)" />
        <path
          d={line}
          fill="none"
          stroke="var(--color-brand-600)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {sorted.map((w, index) => (
          <circle
            key={w.id}
            cx={x(index)}
            cy={y(w.weightKg)}
            r={index === sorted.length - 1 ? 6 : 4}
            fill={index === sorted.length - 1 ? "var(--color-accent-500)" : "white"}
            stroke="var(--color-brand-600)"
            strokeWidth="2.5"
          />
        ))}
      </svg>

      <ol className="mt-5 divide-y divide-hairline rounded-2xl border border-hairline">
        {[...sorted].reverse().map((w) => (
          <li key={w.id} className="flex items-center justify-between gap-4 px-4 py-3">
            <div className="min-w-0">
              <p className="text-sm font-medium tabular text-ink">{w.weightKg} kg</p>
              <p className="text-xs text-muted">
                {formatDate(w.measuredOn)}
                {w.measuredBy ? ` · ${w.measuredBy}` : ""}
              </p>
              {w.note ? <p className="mt-0.5 text-xs italic text-muted">{w.note}</p> : null}
            </div>
            <SourceBadge source={w.source} compact className="shrink-0" />
          </li>
        ))}
      </ol>
    </div>
  );
}
