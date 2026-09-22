import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/** Профиль пользователя (mock-авторизация, живёт в localStorage). */
export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  /** ISO-дата регистрации — для «Member since». */
  joinedAt: string;
  /** Подписка на новости (чекбокс в модалке входа). */
  newsletter: boolean;
  /** Способ входа — для бейджа в профиле. */
  provider: "email" | "shop" | "google";
}

interface AuthState {
  user: UserProfile | null;
  /** Флаг гидратации — чтобы аватар в хедере не мигал при SSR. */
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;

  signIn: (opts: {
    email: string;
    newsletter?: boolean;
    provider?: UserProfile["provider"];
    name?: string;
  }) => void;
  signOut: () => void;
  updateProfile: (patch: Partial<Pick<UserProfile, "name" | "email" | "phone" | "country" | "newsletter">>) => void;
}

/** «Jane.doe» из jane.doe@mail.com → «Jane Doe». */
const nameFromEmail = (email: string) => {
  const local = email.split("@")[0] ?? "Player";
  return local
    .split(/[._\-+]/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),

      signIn: ({ email, newsletter = false, provider = "email", name }) =>
        set({
          user: {
            name: name ?? nameFromEmail(email),
            email,
            joinedAt: new Date().toISOString(),
            newsletter,
            provider,
          },
        }),

      signOut: () => set({ user: null }),

      updateProfile: (patch) =>
        set((state) =>
          state.user ? { user: { ...state.user, ...patch } } : state,
        ),
    }),
    {
      name: "mouse-hub-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
