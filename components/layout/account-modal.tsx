"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, CircleUserRound, Loader2, Package, X } from "lucide-react";
import { useUIStore } from "@/store/ui-store";
import { useAuthStore } from "@/store/auth-store";
import { useLockBodyScroll } from "@/hooks/use-lock-body-scroll";
import { cn } from "@/lib/utils";

/** Многоцветная «G» Google. */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3.01c-1.07.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.72-4.95H1.27v3.11A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.28a7.2 7.2 0 0 1 0-4.56V6.61H1.27a12 12 0 0 0 0 10.78l4.01-3.11Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44A11.53 11.53 0 0 0 12 0 12 12 0 0 0 1.27 6.61l4.01 3.11C6.22 6.88 8.87 4.77 12 4.77Z"
      />
    </svg>
  );
}

type SubmitPhase = "idle" | "loading" | "success";

/**
 * Модалка «Sign in or create account»: shop-кнопка, Google, вход по email
 * и быстрые ссылки Orders / Profile. Авторизация мок-овая (auth-store).
 */
export function AccountModal() {
  const router = useRouter();
  const open = useUIStore((s) => s.accountOpen);
  const close = useUIStore((s) => s.closeAccount);
  const signIn = useAuthStore((s) => s.signIn);

  const [email, setEmail] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [phase, setPhase] = useState<SubmitPhase>("idle");

  useLockBodyScroll(open);

  // Сброс формы после закрытия (после exit-анимации).
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      setEmail("");
      setNewsletter(false);
      setPhase("idle");
    }, 350);
    return () => clearTimeout(t);
  }, [open]);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  /** Мок-вход: короткая «загрузка» → галочка → редирект в кабинет. */
  const completeSignIn = (provider: "email" | "shop" | "google", name?: string) => {
    if (phase !== "idle") return;
    setPhase("loading");
    setTimeout(() => {
      setPhase("success");
      signIn({
        email: emailValid ? email.trim() : "player@mousehub.gg",
        newsletter,
        provider,
        name,
      });
      setTimeout(() => {
        close();
        router.push("/account");
      }, 650);
    }, 900);
  };

  const goTo = (tab: "orders" | "profile") => {
    close();
    router.push(`/account?tab=${tab}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />

          <div className="fixed inset-0 z-[81] grid place-items-center p-4">
            <motion.div
              role="dialog"
              aria-modal
              aria-label="Sign in or create account"
              initial={{ opacity: 0, y: 28, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="w-full max-w-[420px] rounded-3xl bg-background p-6 shadow-card-hover"
            >
              {/* Заголовок + закрыть */}
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-display text-xl font-bold tracking-tight">
                  Sign in or create account
                </h2>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-muted text-foreground transition hover:bg-border"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 flex flex-col gap-3">
                {/* Основной вход */}
                <button
                  type="button"
                  onClick={() => completeSignIn("shop")}
                  disabled={phase !== "idle"}
                  className="h-12 w-full rounded-xl bg-brand text-[15px] font-semibold text-brand-foreground shadow-sm transition hover:bg-brand/90 hover:shadow-glow active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
                >
                  Sign in with shop
                </button>

                <button
                  type="button"
                  onClick={() => completeSignIn("google")}
                  disabled={phase !== "idle"}
                  className="flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-muted text-[15px] font-medium text-foreground transition hover:bg-border/70 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
                >
                  <GoogleIcon className="h-5 w-5" />
                  Continue with Google
                </button>

                {/* Разделитель */}
                <div className="my-1 flex items-center gap-4">
                  <span className="h-px flex-1 bg-border" />
                  <span className="text-xs font-medium tracking-widest text-muted-foreground">
                    OR
                  </span>
                  <span className="h-px flex-1 bg-border" />
                </div>

                {/* Email-вход */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (emailValid) completeSignIn("email");
                  }}
                  className="group relative"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    disabled={phase !== "idle"}
                    className="h-14 w-full rounded-xl border border-input bg-background px-4 pr-14 text-[15px] outline-none transition placeholder:text-muted-foreground focus:border-brand focus:ring-2 focus:ring-brand/25 disabled:opacity-70"
                  />
                  <button
                    type="submit"
                    aria-label="Continue with email"
                    disabled={!emailValid || phase !== "idle"}
                    className={cn(
                      "absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-lg transition-all duration-300",
                      emailValid || phase !== "idle"
                        ? "bg-ink text-ink-foreground hover:bg-ink/85"
                        : "text-muted-foreground",
                    )}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {phase === "loading" ? (
                        <motion.span
                          key="loading"
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.6 }}
                        >
                          <Loader2 className="h-[18px] w-[18px] animate-spin" />
                        </motion.span>
                      ) : phase === "success" ? (
                        <motion.span
                          key="success"
                          initial={{ opacity: 0, scale: 0.4 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 20 }}
                        >
                          <Check className="h-[18px] w-[18px]" />
                        </motion.span>
                      ) : (
                        <motion.span
                          key="idle"
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 6 }}
                        >
                          <ArrowRight className="h-[18px] w-[18px]" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </form>

                {/* Подписка на новости */}
                <label className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={newsletter}
                    onChange={(e) => setNewsletter(e.target.checked)}
                    className="peer sr-only"
                  />
                  <span
                    className={cn(
                      "grid h-[18px] w-[18px] place-items-center rounded-[5px] border transition-all duration-200",
                      newsletter
                        ? "border-brand bg-brand text-white"
                        : "border-foreground/30 bg-background",
                    )}
                  >
                    {newsletter && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                  Email me with news and offers
                </label>

                {/* Быстрые ссылки */}
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => goTo("orders")}
                    className="flex h-12 items-center justify-center gap-2 rounded-xl border border-border text-[15px] font-medium transition hover:border-foreground/30 hover:bg-muted active:scale-[0.98]"
                  >
                    <Package className="h-[18px] w-[18px]" />
                    Orders
                  </button>
                  <button
                    type="button"
                    onClick={() => goTo("profile")}
                    className="flex h-12 items-center justify-center gap-2 rounded-xl border border-border text-[15px] font-medium transition hover:border-foreground/30 hover:bg-muted active:scale-[0.98]"
                  >
                    <CircleUserRound className="h-[18px] w-[18px]" />
                    Profile
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
