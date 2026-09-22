"use client";

import { cn } from "@/lib/utils";
import type { ProductCategory } from "@/types";

export type FilterValue = "all" | ProductCategory;
export type SortValue = "featured" | "price-asc" | "price-desc" | "weight";

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "mouse", label: "Mice" },
  { value: "keyboard", label: "Keyboards" },
  { value: "mousepad", label: "MousePads" },
  { value: "iem", label: "IEM" },
];

const SORTS: { value: SortValue; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "weight", label: "Lightest first" },
];

/** Панель фильтрации каталога: категории (таб-пилюли) + сортировка. */
export function ProductFilters({
  filter,
  sort,
  onFilterChange,
  onSortChange,
  count,
}: {
  filter: FilterValue;
  sort: SortValue;
  onFilterChange: (f: FilterValue) => void;
  onSortChange: (s: SortValue) => void;
  count: number;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
        {FILTERS.map((f) => {
          const active = f.value === filter;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => onFilterChange(f.value)}
              className={cn(
                "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                active
                  ? "bg-ink text-ink-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-muted-foreground sm:inline">
          {count} item{count === 1 ? "" : "s"}
        </span>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortValue)}
          className="h-10 rounded-full border border-border bg-background px-4 text-sm font-medium text-foreground outline-none transition focus:border-foreground/30"
          aria-label="Sort products"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
