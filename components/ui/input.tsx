import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "h-11 w-full rounded-xl border border-hairline bg-white px-4 text-[0.9375rem] text-ink transition-colors",
        "placeholder:text-muted/60 hover:border-brand-200",
        "focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10",
        "disabled:cursor-not-allowed disabled:bg-brand-50/50 disabled:text-muted",
        "aria-[invalid=true]:border-red-400 aria-[invalid=true]:ring-red-500/10",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "min-h-24 w-full rounded-xl border border-hairline bg-white px-4 py-3 text-[0.9375rem] text-ink transition-colors",
      "placeholder:text-muted/60 hover:border-brand-200",
      "focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10",
      "aria-[invalid=true]:border-red-400",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "h-11 w-full appearance-none rounded-xl border border-hairline bg-white px-4 pr-10 text-[0.9375rem] text-ink transition-colors",
      "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%235A6B70%22 stroke-width=%222%22 stroke-linecap=%22round%22%3E%3Cpath d=%22m6 9 6 6 6-6%22/%3E%3C/svg%3E')] bg-[length:18px] bg-[right_0.875rem_center] bg-no-repeat",
      "hover:border-brand-200 focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10",
      className,
    )}
    {...props}
  />
));
Select.displayName = "Select";
