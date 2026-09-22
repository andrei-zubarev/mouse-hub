"use client";

import { useCartStore, selectSubtotal, selectTotalItems } from "@/store/cart-store";

/**
 * Удобный фасад над cart-store: отдаёт элементы, действия и производные суммы.
 * Компоненты используют его вместо ручной работы с селекторами.
 */
export function useCart() {
  const items = useCartStore((s) => s.items);
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clear = useCartStore((s) => s.clear);

  return {
    items,
    hasHydrated,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    totalItems: selectTotalItems(items),
    subtotal: selectSubtotal(items),
  };
}
