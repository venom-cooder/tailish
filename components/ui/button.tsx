import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-accent-500 text-white shadow-soft hover:bg-accent-600 hover:shadow-lift hover:-translate-y-0.5",
        brand:
          "bg-brand-800 text-white shadow-soft hover:bg-brand-900 hover:shadow-lift hover:-translate-y-0.5",
        gold:
          "bg-gold-400 text-brand-900 shadow-soft hover:bg-gold-500 hover:shadow-lift hover:-translate-y-0.5",
        outline:
          "border border-brand-200 bg-white text-brand-800 hover:border-brand-400 hover:bg-brand-50 hover:-translate-y-0.5",
        ghost: "text-brand-800 hover:bg-brand-50",
        subtle: "bg-brand-50 text-brand-800 hover:bg-brand-100",
        onDark:
          "border border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:border-white/40",
        whatsapp:
          "bg-whatsapp text-white shadow-soft hover:bg-whatsapp-dark hover:shadow-lift hover:-translate-y-0.5",
        danger: "bg-red-600 text-white hover:bg-red-700",
        link: "text-brand-700 underline-offset-4 hover:underline hover:text-accent-600",
      },
      // Rounded rectangles, not pills — matching the radius of Input and
      // Select so a button sitting next to a field reads as the same family.
      size: {
        sm: "h-9 rounded-xl px-4 text-sm",
        md: "h-11 rounded-xl px-6 text-[0.9375rem]",
        lg: "h-13 rounded-xl px-8 text-base",
        icon: "size-10 rounded-xl",
        iconSm: "size-8 rounded-lg",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
