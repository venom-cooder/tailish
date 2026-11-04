import * as React from "react";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function Container({
  className,
  size = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { size?: "default" | "wide" | "narrow" }) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-6 lg:px-8",
        size === "narrow" && "max-w-3xl",
        size === "default" && "max-w-7xl",
        size === "wide" && "max-w-[88rem]",
        className,
      )}
      {...props}
    />
  );
}

export function Section({
  className,
  tone = "white",
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & { tone?: "white" | "tint" | "cream" | "deep" }) {
  return (
    <section
      className={cn(
        "relative py-16 sm:py-20 lg:py-24",
        tone === "tint" && "bg-brand-50/60",
        tone === "cream" && "bg-cream",
        tone === "deep" && "paw-field bg-brand-900 text-white/80",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export function Eyebrow({
  children,
  className,
  tone = "brand",
  icon: Icon,
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "brand" | "light" | "gold";
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]",
        tone === "brand" && "text-brand-600",
        tone === "gold" && "text-gold-600",
        tone === "light" && "text-white/70",
        className,
      )}
    >
      {Icon ? <Icon className="size-4" /> : null}
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  eyebrowIcon,
  title,
  description,
  align = "left",
  tone = "brand",
  className,
  children,
}: {
  eyebrow?: string;
  eyebrowIcon?: React.ComponentType<{ className?: string }>;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  tone?: "brand" | "light";
  className?: string;
  /** Actions rendered opposite the heading on wide screens. */
  children?: React.ReactNode;
}) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
        {eyebrow ? (
          <Eyebrow icon={eyebrowIcon} tone={tone === "light" ? "light" : "brand"}>
            {eyebrow}
          </Eyebrow>
        ) : null}
        <h2
          className={cn(
            "mt-3 text-3xl font-bold leading-[1.15] sm:text-4xl lg:text-[2.75rem]",
            tone === "light" && "text-white",
          )}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "mt-4 text-base leading-relaxed sm:text-lg",
              tone === "light" ? "text-white/75" : "text-muted",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {children ? <div className="shrink-0">{children}</div> : null}
    </Reveal>
  );
}
