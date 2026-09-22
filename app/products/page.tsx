import type { Metadata } from "next";
import { ProductsCatalog } from "@/components/product/products-catalog";
import type { FilterValue } from "@/components/product/product-filters";

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse every MOUSE HUB mouse, keyboard and mousepad.",
};

const VALID: FilterValue[] = ["all", "mouse", "keyboard", "mousepad", "iem"];

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const raw = searchParams.category as FilterValue | undefined;
  const initialFilter: FilterValue = raw && VALID.includes(raw) ? raw : "all";

  return (
    <div className="container py-10 sm:py-14">
      {/* Заголовок раздела */}
      <div className="mb-8 border-b border-border pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Shop
        </p>
        <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          All Products
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Featherweight magnesium mice, Hall-effect keyboards and SlimFlex
          mousepads — engineered to win.
        </p>
      </div>

      <ProductsCatalog initialFilter={initialFilter} />
    </div>
  );
}
