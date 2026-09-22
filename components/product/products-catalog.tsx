"use client";

import { useMemo, useState } from "react";
import { ProductFilters, type FilterValue, type SortValue } from "./product-filters";
import { ProductGrid } from "./product-grid";
import { PRODUCTS } from "@/lib/products";
import type { Product } from "@/types";

/** Парсит вес из характеристик («34 g» → 34) для сортировки. */
function weightOf(p: Product): number {
  const spec = p.specs.find((s) => s.icon === "weight");
  const n = spec ? parseInt(spec.value, 10) : NaN;
  return Number.isNaN(n) ? Number.MAX_SAFE_INTEGER : n;
}

/** Клиентский каталог: фильтрация по категории + сортировка. */
export function ProductsCatalog({ initialFilter = "all" }: { initialFilter?: FilterValue }) {
  const [filter, setFilter] = useState<FilterValue>(initialFilter);
  const [sort, setSort] = useState<SortValue>("featured");

  const products = useMemo(() => {
    let list = filter === "all" ? [...PRODUCTS] : PRODUCTS.filter((p) => p.category === filter);

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "weight":
        list.sort((a, b) => weightOf(a) - weightOf(b));
        break;
      default:
        list.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));
    }
    return list;
  }, [filter, sort]);

  return (
    <div className="flex flex-col gap-8">
      <ProductFilters
        filter={filter}
        sort={sort}
        onFilterChange={setFilter}
        onSortChange={setSort}
        count={products.length}
      />
      <ProductGrid products={products} />
    </div>
  );
}
