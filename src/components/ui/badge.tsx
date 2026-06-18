import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold", {
  variants: {
    variant: {
      default: "border-sky-400/30 bg-sky-400/10 text-sky-200",
      success: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
      warning: "border-amber-400/30 bg-amber-400/10 text-amber-200",
      danger: "border-red-400/30 bg-red-400/10 text-red-200",
      critical: "border-red-600/40 bg-red-600/15 text-red-100",
      muted: "border-slate-600 bg-slate-800/70 text-slate-300"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
