import { cn } from "@/lib/utils";
import { ProductCard } from "./product-card";
import type { Product } from "@/types";

/** Адаптивная сетка карточек товара. */
export function ProductGrid({
  products,
  className,
}: {
  products: Product[];
  className?: string;
}) {
  if (products.length === 0) {
    return (
      <div className="grid place-items-center rounded-2xl border border-dashed border-border py-24 text-center">
        <p className="text-sm text-muted-foreground">
          No products match your filters yet.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} />
      ))}
    </div>
  );
}
