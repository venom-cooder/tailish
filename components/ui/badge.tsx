import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap [&_svg]:size-3.5",
  {
    variants: {
      variant: {
        default: "border-brand-100 bg-brand-50 text-brand-800",
        verified: "border-emerald-200 bg-emerald-50 text-emerald-800",
        parent: "border-amber-200 bg-amber-50 text-amber-800",
        draft: "border-slate-200 bg-slate-50 text-slate-600",
        accent: "border-accent-200 bg-accent-50 text-accent-700",
        gold: "border-gold-400/40 bg-gold-400/10 text-gold-600",
        danger: "border-red-200 bg-red-50 text-red-700",
        onDark: "border-white/20 bg-white/10 text-white/90 backdrop-blur",
        outline: "border-hairline bg-white text-muted",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
