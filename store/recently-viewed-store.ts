import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Недавно просмотренные товары (вкладка «Recently viewed» в корзине).
 * Храним только slug'и — карточки резолвятся из каталога на клиенте.
 */
interface RecentlyViewedState {
  slugs: string[];
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  /** Добавляет товар в начало списка (без дублей, максимум MAX_RECENT). */
  addViewed: (slug: string) => void;
}

const MAX_RECENT = 8;

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      slugs: [],
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),

      addViewed: (slug) =>
        set((state) => ({
          slugs: [slug, ...state.slugs.filter((s) => s !== slug)].slice(0, MAX_RECENT),
        })),
    }),
    {
      name: "mouse-hub-recently-viewed",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ slugs: state.slugs }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
