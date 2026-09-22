import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, Product, ProductVariant } from "@/types";

interface CartState {
  items: CartItem[];
  /** Флаг гидратации — чтобы счётчик в хедере не мигал при SSR. */
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;

  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clear: () => void;
}

const makeKey = (productId: string, variantId: string) => `${productId}:${variantId}`;

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),

      addItem: (product, variant, quantity = 1) =>
        set((state) => {
          const key = makeKey(product.id, variant.id);
          const existing = state.items.find((i) => i.key === key);

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.key === key ? { ...i, quantity: i.quantity + quantity } : i,
              ),
            };
          }

          const newItem: CartItem = {
            key,
            productId: product.id,
            slug: product.slug,
            name: product.name,
            image: product.images[0],
            variantId: variant.id,
            variantName: variant.name,
            price: product.price + (variant.priceDelta ?? 0),
            quantity,
          };
          return { items: [...state.items, newItem] };
        }),

      removeItem: (key) =>
        set((state) => ({ items: state.items.filter((i) => i.key !== key) })),

      updateQuantity: (key, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.key !== key)
              : state.items.map((i) => (i.key === key ? { ...i, quantity } : i)),
        })),

      clear: () => set({ items: [] }),
    }),
    {
      name: "mouse-hub-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

/* ───────────── Производные селекторы (вне стора, чистые функции) ───────────── */

export const selectTotalItems = (items: CartItem[]) =>
  items.reduce((sum, i) => sum + i.quantity, 0);

export const selectSubtotal = (items: CartItem[]) =>
  items.reduce((sum, i) => sum + i.price * i.quantity, 0);
