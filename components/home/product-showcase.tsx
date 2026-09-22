import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { Reveal } from "@/components/shared/reveal";
import { SHOWCASE_PRODUCTS } from "@/lib/products";

/** Витрина флагманских мышей — 4 карточки под сплит-секцией. */
export function ProductShowcase() {
  return (
    <section className="container pb-16 sm:pb-24">
      <Reveal className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Best sellers
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            The Beast lineup
          </h2>
        </div>
        <Link
          href="/products?category=mouse"
          className="group inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-foreground transition hover:text-brand"
        >
          View all
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Reveal>

      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {SHOWCASE_PRODUCTS.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}
