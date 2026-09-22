"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, CircleUserRound, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, SITE, SOCIAL_LINKS } from "@/lib/constants";
import { SOCIAL_ICON_MAP, MouseHubLogo } from "@/components/icons";
import { useUIStore } from "@/store/ui-store";
import { useAuthStore } from "@/store/auth-store";
import { useLockBodyScroll } from "@/hooks/use-lock-body-scroll";

/** Выезжающее слева мобильное меню с аккордеоном подразделов. */
export function MobileMenu() {
  const open = useUIStore((s) => s.mobileMenuOpen);
  const close = useUIStore((s) => s.closeMobileMenu);
  const openAccount = useUIStore((s) => s.openAccount);
  const user = useAuthStore((s) => s.user);
  const authHydrated = useAuthStore((s) => s.hasHydrated);
  const [expanded, setExpanded] = useState<string | null>(null);

  useLockBodyScroll(open);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            className="fixed inset-y-0 left-0 z-[61] flex w-[86%] max-w-sm flex-col bg-background lg:hidden"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.3, 1, 0.3, 1] }}
          >
            <div className="flex h-16 items-center justify-between border-b border-border px-5">
              <Link href="/" onClick={close} className="flex items-center gap-2">
                <MouseHubLogo className="h-6 w-6 text-foreground" />
                <span className="font-display text-base font-extrabold">{SITE.name}</span>
              </Link>
              <button
                onClick={close}
                aria-label="Close menu"
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4">
              {NAV_ITEMS.map((item) => {
                const hasChildren = !!item.children?.length;
                const isOpen = expanded === item.label;
                return (
                  <div key={item.label} className="border-b border-border/60">
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        onClick={close}
                        className="flex-1 py-3.5 px-2 font-display text-base font-semibold text-foreground"
                      >
                        {item.label}
                      </Link>
                      {hasChildren && (
                        <button
                          onClick={() => setExpanded(isOpen ? null : item.label)}
                          aria-label={`Toggle ${item.label}`}
                          className="grid h-10 w-10 place-items-center rounded-full hover:bg-muted"
                        >
                          <ChevronDown
                            className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
                          />
                        </button>
                      )}
                    </div>
                    <AnimatePresence initial={false}>
                      {hasChildren && isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.3, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col gap-0.5 pb-3 pl-4">
                            {item.children!.map((child) => (
                              <Link
                                key={child.label}
                                href={child.href}
                                onClick={close}
                                className="rounded-lg px-2 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            {/* Аккаунт: гость → модалка входа, авторизован → личный кабинет */}
            <div className="border-t border-border px-3 py-3">
              {authHydrated && user ? (
                <Link
                  href="/account"
                  onClick={close}
                  className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition hover:bg-muted"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-sm font-bold text-white">
                    {user.name.trim()[0]?.toUpperCase() ?? "W"}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{user.name}</span>
                    <span className="block text-xs text-muted-foreground">View account</span>
                  </span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={openAccount}
                  className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition hover:bg-muted"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-muted">
                    <CircleUserRound className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-semibold">Sign in or create account</span>
                </button>
              )}
            </div>

            <div className="flex items-center border-t border-border px-5 py-4">
              <div className="flex items-center gap-4">
                {SOCIAL_LINKS.map((s) => {
                  const Icon = SOCIAL_ICON_MAP[s.icon];
                  return (
                    <Link key={s.label} href={s.href} aria-label={s.label} className="text-muted-foreground hover:text-foreground">
                      <Icon className="h-4 w-4" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
