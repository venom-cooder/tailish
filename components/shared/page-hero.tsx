import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container, Eyebrow } from "@/components/shared/section";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

/** Breadcrumb + title block used at the top of every inner page. */
export function PageHero({
  eyebrow,
  eyebrowIcon,
  title,
  description,
  crumbs = [],
  tone = "tint",
  children,
  aside,
}: {
  eyebrow?: string;
  eyebrowIcon?: React.ComponentType<{ className?: string }>;
  title: React.ReactNode;
  description?: React.ReactNode;
  crumbs?: Crumb[];
  tone?: "tint" | "deep" | "white";
  /** Actions below the description. */
  children?: React.ReactNode;
  /** Content shown alongside the title on wide screens. */
  aside?: React.ReactNode;
}) {
  const light = tone === "deep";

  return (
    <section
      className={cn(
        "relative overflow-hidden border-b",
        tone === "tint" && "border-hairline bg-gradient-to-b from-brand-50/80 to-white",
        tone === "white" && "border-hairline bg-white",
        light && "paw-field border-brand-800 bg-brand-900",
      )}
    >
      <Container className={cn("py-12 sm:py-16", aside && "lg:py-20")}>
        {crumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol
              className={cn(
                "flex flex-wrap items-center gap-1 text-xs",
                light ? "text-white/60" : "text-muted",
              )}
            >
              <li>
                <Link href="/" className="rounded transition-colors hover:text-brand-600">
                  Home
                </Link>
              </li>
              {crumbs.map((crumb) => (
                <li key={crumb.label} className="flex items-center gap-1">
                  <ChevronRight className="size-3.5 opacity-50" aria-hidden="true" />
                  {crumb.href ? (
                    <Link href={crumb.href} className="rounded transition-colors hover:text-brand-600">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={cn("font-medium", light ? "text-white" : "text-ink")} aria-current="page">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <div className={cn(aside && "grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]")}>
          <div className="max-w-3xl">
            {eyebrow ? (
              <Eyebrow icon={eyebrowIcon} tone={light ? "light" : "brand"}>
                {eyebrow}
              </Eyebrow>
            ) : null}

            <h1
              className={cn(
                "mt-3 text-3xl font-bold leading-[1.12] sm:text-4xl lg:text-5xl",
                light && "text-white",
              )}
            >
              {title}
            </h1>

            {description ? (
              <p
                className={cn(
                  "mt-5 text-base leading-relaxed sm:text-lg",
                  light ? "text-white/75" : "text-muted",
                )}
              >
                {description}
              </p>
            ) : null}

            {children ? <div className="mt-8 flex flex-col gap-3 sm:flex-row">{children}</div> : null}
          </div>

          {aside ? <div>{aside}</div> : null}
        </div>
      </Container>
    </section>
  );
}
