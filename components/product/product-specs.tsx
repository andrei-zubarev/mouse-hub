import { cn } from "@/lib/utils";
import { SPEC_ICONS } from "@/components/icons";
import type { ProductSpec } from "@/types";

/** Сетка характеристик с иконками (как на карточках оригинала). */
export function ProductSpecs({
  specs,
  className,
  variant = "grid",
}: {
  specs: ProductSpec[];
  className?: string;
  variant?: "grid" | "inline";
}) {
  if (variant === "inline") {
    return (
      <div className={cn("flex flex-wrap gap-x-4 gap-y-2", className)}>
        {specs.slice(0, 3).map((spec) => {
          const Icon = SPEC_ICONS[spec.icon];
          return (
            <span
              key={spec.label}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <Icon className="h-3.5 w-3.5" />
              {spec.value}
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3", className)}>
      {specs.map((spec) => {
        const Icon = SPEC_ICONS[spec.icon];
        return (
          <div
            key={spec.label}
            className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3"
          >
            <Icon className="h-5 w-5 shrink-0 text-brand" />
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                {spec.label}
              </p>
              <p className="truncate text-sm font-semibold text-foreground">
                {spec.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
