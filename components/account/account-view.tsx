"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, UserRound } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { MOCK_ORDERS, selectOrdersTotal } from "@/lib/orders";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import { Button } from "@/components/ui/button";
import { AccountOrders } from "@/components/account/account-orders";
import { AccountProfile } from "@/components/account/account-profile";

type Tab = "orders" | "profile";

const TABS: Array<{ id: Tab; label: string }> = [
  { id: "orders", label: "Orders" },
  { id: "profile", label: "Profile" },
];

const isTab = (v: string | null): v is Tab => v === "orders" || v === "profile";

/** Инициалы для аватара («Jane Doe» → «JD»). */
const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("") || "W";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Личный кабинет: компактная шапка профиля и две вкладки — Orders / Profile. */
export function AccountView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, hasHydrated, signOut } = useAuthStore();
  const openAccount = useUIStore((s) => s.openAccount);

  const tabParam = searchParams.get("tab");
  const [tab, setTab] = useState<Tab>(isTab(tabParam) ? tabParam : "orders");

  // Синхронизация с ?tab= (кнопки Orders/Profile в модалке).
  useEffect(() => {
    if (isTab(tabParam)) setTab(tabParam);
  }, [tabParam]);

  if (!hasHydrated) {
    return (
      <div className="container flex min-h-[55vh] items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-brand" />
      </div>
    );
  }

  /* ─────────────── Гость: приглашение войти ─────────────── */
  if (!user) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-muted text-foreground">
          <UserRound className="h-6 w-6" />
        </span>
        <h1 className="mt-6 font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Your {`MOUSE HUB`} account
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-balance text-sm text-muted-foreground">
          Sign in to track orders and manage your details.
        </p>
        <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row">
          <Button size="lg" variant="brand" onClick={openAccount}>
            Sign in
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/products">Browse products</Link>
          </Button>
        </div>
      </div>
    );
  }

  /* ─────────────── Авторизован: кабинет ─────────────── */
  const ordersTotal = selectOrdersTotal(MOCK_ORDERS);
  const joined = new Date(user.joinedAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const summary = [
    { label: "Orders", value: String(MOCK_ORDERS.length) },
    { label: "Total spent", value: formatPrice(ordersTotal, { withCurrency: false }) },
    { label: "Member since", value: joined },
  ];

  return (
    <div className="container max-w-5xl py-10 sm:py-14">
      {/* Шапка: аватар, имя, email, выход */}
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-muted font-display text-lg font-bold text-foreground">
            {initials(user.name)}
          </span>
          <div className="min-w-0">
            <h1 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
              {user.name}
            </h1>
            <p className="mt-0.5 truncate text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => {
            signOut();
            router.push("/");
          }}
        >
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </div>

      {/* Короткая сводка вместо карточек со статистикой */}
      <dl className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-border py-4">
        {summary.map((s) => (
          <div key={s.label} className="flex items-baseline gap-2">
            <dt className="text-xs uppercase tracking-wider text-muted-foreground">
              {s.label}
            </dt>
            <dd className="font-display text-sm font-bold text-foreground">
              {s.value}
            </dd>
          </div>
        ))}
      </dl>

      {/* Вкладки — простое подчёркивание активной */}
      <div className="mt-8 flex gap-6 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setTab(t.id);
              router.replace(`/account?tab=${t.id}`, { scroll: false });
            }}
            className={cn(
              "relative -mb-px pb-3 text-sm font-medium transition-colors",
              tab === t.id
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
            {tab === t.id && (
              <motion.span
                layoutId="account-tab-underline"
                transition={{ duration: 0.3, ease: EASE }}
                className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-foreground"
              />
            )}
          </button>
        ))}
      </div>

      {/* Контент вкладки */}
      <div className="mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            {tab === "orders" ? <AccountOrders /> : <AccountProfile />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
