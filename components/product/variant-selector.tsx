"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { ProductVariant } from "@/types";

/** Свотчи цветов товара. Управляемый компонент. */
export function VariantSelector({
  variants,
  selectedId,
  onSelect,
  size = "md",
}: {
  variants: ProductVariant[];
  selectedId: string;
  onSelect: (variant: ProductVariant) => void;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "h-6 w-6" : "h-9 w-9";
  return (
    <div className="flex items-center gap-2">
      {variants.map((v) => {
        const active = v.id === selectedId;
        const isLight = ["#f2f2f2", "#c7ece0", "#f7b6c2"].includes(v.hex.toLowerCase());
        return (
          <button
            key={v.id}
            type="button"
            title={v.name}
            aria-label={v.name}
            aria-pressed={active}
            onClick={() => onSelect(v)}
            className={cn(
              "relative grid place-items-center rounded-full ring-offset-2 ring-offset-background transition",
              dim,
              active ? "ring-2 ring-brand" : "ring-1 ring-border hover:ring-foreground/40",
            )}
            style={{ backgroundColor: v.hex }}
          >
            {active && (
              <Check
                className={cn(
                  "h-3.5 w-3.5",
                  isLight ? "text-foreground/70" : "text-white",
                )}
                strokeWidth={3}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
