import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide leading-none",
  {
    variants: {
      variant: {
        new: "bg-brand text-white",
        hot: "bg-price text-white",
        limited: "bg-gold text-gold-foreground",
        sold: "bg-foreground/80 text-white",
        neutral: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

/** Сопоставляет текст бейджа товара со стилем. */
export function ProductBadgePill({ label }: { label: string }) {
  const variant =
    label === "New"
      ? "new"
      : label === "Hot"
        ? "hot"
        : label === "Limited"
          ? "limited"
          : label === "Sold Out"
            ? "sold"
            : "neutral";
  return <Badge variant={variant}>{label}</Badge>;
}
