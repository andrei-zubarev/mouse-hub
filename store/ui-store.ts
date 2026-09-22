import { create } from "zustand";
import type { Product } from "@/types";

/**
 * Глобальное UI-состояние оверлеев: корзина-дроуэр, мобильное меню,
 * поиск и модалка быстрого просмотра товара.
 */
interface UIState {
  cartOpen: boolean;
  mobileMenuOpen: boolean;
  searchOpen: boolean;
  accountOpen: boolean;
  quickViewProduct: Product | null;

  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  openMobileMenu: () => void;
  closeMobileMenu: () => void;

  openSearch: () => void;
  closeSearch: () => void;

  openAccount: () => void;
  closeAccount: () => void;

  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  cartOpen: false,
  mobileMenuOpen: false,
  searchOpen: false,
  accountOpen: false,
  quickViewProduct: null,

  openCart: () => set({ cartOpen: true, mobileMenuOpen: false }),
  closeCart: () => set({ cartOpen: false }),
  toggleCart: () => set((s) => ({ cartOpen: !s.cartOpen })),

  openMobileMenu: () => set({ mobileMenuOpen: true }),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),

  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),

  openAccount: () => set({ accountOpen: true, mobileMenuOpen: false }),
  closeAccount: () => set({ accountOpen: false }),

  openQuickView: (product) => set({ quickViewProduct: product }),
  closeQuickView: () => set({ quickViewProduct: null }),
}));
