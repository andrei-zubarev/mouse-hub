"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/product/quantity-stepper";
import { useUIStore } from "@/store/ui-store";
import { useCart } from "@/hooks/use-cart";
import { useRecentlyViewedStore } from "@/store/recently-viewed-store";
import { useLockBodyScroll } from "@/hooks/use-lock-body-scroll";
import { PRODUCTS } from "@/lib/products";
import { cn, formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

/** Мягкий «дорогой» ease — общий для всех движений дроуэра. */
const EASE = [0.22, 1, 0.36, 1] as const;

const FREE_SHIPPING_THRESHOLD = 99;

type Tab = "cart" | "recent";

/** Каскадное появление контента вкладки. */
const cascade = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.24 } },
};
const rise = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: EASE },
  },
};

/** Направленный слайд при переключении вкладок. */
const slide = {
  enter: (dir: number) => ({ opacity: 0, x: 48 * dir }),
  center: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } },
  exit: (dir: number) => ({
    opacity: 0,
    x: -48 * dir,
    transition: { duration: 0.4, ease: EASE },
  }),
};

/**
 * Правый дроуэр корзины: вкладки Cart / Recently viewed,
 * пустое состояние с «Continue shopping», позиции с количеством и итогом.
 */
export function CartDrawer() {
  const open = useUIStore((s) => s.cartOpen);
  const close = useUIStore((s) => s.closeCart);
  const { items, subtotal, updateQuantity, removeItem, totalItems } = useCart();
  const recentSlugs = useRecentlyViewedStore((s) => s.slugs);

  const [tab, setTab] = useState<Tab>("cart");
  const [dir, setDir] = useState(1);

  useLockBodyScroll(open);

  // При каждом открытии возвращаемся на вкладку Cart.
  useEffect(() => {
    if (open) {
      setTab("cart");
      setDir(1);
    }
  }, [open]);

  const recentProducts = recentSlugs
    .map((slug) => PRODUCTS.find((p) => p.slug === slug))
    .filter(Boolean) as Product[];

  function switchTab(next: Tab) {
    if (next === tab) return;
    setDir(next === "recent" ? 1 : -1);
    setTab(next);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Затемнение + блюр фона */}
          <motion.div
            className="fixed inset-0 z-[70] bg-black/45 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5, ease: EASE } }}
            transition={{ duration: 0.7, ease: EASE }}
            onClick={close}
          />

          {/* Панель */}
          <motion.aside
            className="fixed inset-y-0 right-0 z-[71] flex w-full max-w-xl transform-gpu flex-col overflow-hidden rounded-l-[28px] border-l border-white/60 bg-background shadow-[-50px_0_140px_-25px_rgba(0,0,0,0.5)] will-change-transform"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%", transition: { duration: 0.6, ease: [0.5, 0, 0.75, 0] } }}
            transition={{ duration: 0.92, ease: EASE }}
          >
            {/* Внутренний параллакс — контент догоняет панель */}
            <motion.div
              className="flex min-h-0 flex-1 flex-col"
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.95, ease: EASE, delay: 0.12 }}
            >
              {/* Шапка: вкладки + закрыть */}
              <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-5 sm:px-8">
                <div className="flex items-baseline gap-8">
                  <TabButton active={tab === "cart"} onClick={() => switchTab("cart")}>
                    <span className="relative">
                      Cart
                      <AnimatePresence>
                        {totalItems > 0 && (
                          <motion.span
                            key={totalItems}
                            initial={{ scale: 0.4, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.4, opacity: 0, transition: { duration: 0.12 } }}
                            transition={{ type: "spring", stiffness: 420, damping: 18 }}
                            className="absolute -right-5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1.5 text-[11px] font-bold leading-none text-white"
                          >
                            {totalItems}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                  </TabButton>
                  <TabButton active={tab === "recent"} onClick={() => switchTab("recent")}>
                    Recently viewed
                  </TabButton>
                </div>
                <button
                  onClick={close}
                  aria-label="Close cart"
                  className="group grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border transition-colors duration-300 hover:bg-muted"
                >
                  <X className="h-5 w-5 transition-transform duration-500 ease-premium group-hover:rotate-90" />
                </button>
              </div>

              {/* Контент вкладок */}
              <div className="relative min-h-0 flex-1">
                <AnimatePresence custom={dir} initial={false}>
                  <motion.div
                    key={tab}
                    custom={dir}
                    variants={slide}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0 flex flex-col"
                  >
                    {tab === "cart" ? (
                      items.length === 0 ? (
                        <EmptyCart onClose={close} />
                      ) : (
                        <CartItems
                          items={items}
                          subtotal={subtotal}
                          updateQuantity={updateQuantity}
                          removeItem={removeItem}
                          onClose={close}
                        />
                      )
                    ) : (
                      <RecentlyViewed products={recentProducts} onClose={close} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* ───────────────────────────── Вкладки ───────────────────────────── */

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "font-display text-2xl font-bold tracking-tight transition-colors duration-300 sm:text-[26px]",
        active ? "text-foreground" : "text-foreground/25 hover:text-foreground/50",
      )}
    >
      {children}
    </button>
  );
}

/* ─────────────────────────── Пустая корзина ─────────────────────────── */

function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      variants={cascade}
      initial="hidden"
      animate="show"
      className="flex flex-1 flex-col items-center justify-center gap-7 px-8 pb-16 text-center"
    >
      <motion.h3
        variants={rise}
        className="max-w-[340px] font-display text-[28px] font-bold leading-tight tracking-tight sm:text-[32px]"
      >
        Your cart is currently empty.
      </motion.h3>
      <motion.p variants={rise} className="text-sm leading-relaxed text-foreground/70">
        Not sure where to start?
        <br />
        Try these collections:
      </motion.p>
      <motion.div variants={rise} className="w-full max-w-[300px]">
        <ContinueShopping onClose={onClose} />
      </motion.div>
    </motion.div>
  );
}

/** Кнопка «Continue shopping →» как на оригинале, с инверсией на hover. */
function ContinueShopping({ onClose }: { onClose: () => void }) {
  return (
    <Link
      href="/products"
      onClick={onClose}
      className="group flex w-full items-center justify-between rounded-xl bg-muted px-5 py-4 text-[15px] font-medium text-foreground transition-all duration-300 ease-premium hover:bg-foreground hover:text-background"
    >
      Continue shopping
      <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-premium group-hover:translate-x-1" />
    </Link>
  );
}

/* ─────────────────────────── Корзина с позициями ─────────────────────────── */

function CartItems({
  items,
  subtotal,
  updateQuantity,
  removeItem,
  onClose,
}: {
  items: ReturnType<typeof useCart>["items"];
  subtotal: number;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  onClose: () => void;
}) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(1, subtotal / FREE_SHIPPING_THRESHOLD);

  return (
    <>
      <motion.div
        variants={cascade}
        initial="hidden"
        animate="show"
        className="min-h-0 flex-1 overflow-y-auto px-6 py-5 sm:px-8"
      >
        <ul className="flex flex-col divide-y divide-border/70">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.li
                key={item.key}
                layout
                variants={rise}
                exit={{ opacity: 0, x: 48, transition: { duration: 0.28, ease: EASE } }}
                className="flex gap-4 py-4 first:pt-0"
              >
                <Link
                  href={`/products/${item.slug}`}
                  onClick={onClose}
                  className="group relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-xl border border-border bg-muted/40"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="88px"
                    className="object-contain p-2.5 transition-transform duration-500 ease-premium group-hover:scale-105"
                  />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={onClose}
                      className="line-clamp-2 text-sm font-semibold text-foreground transition-colors hover:text-brand"
                    >
                      {item.name}
                    </Link>
                    <button
                      onClick={() => removeItem(item.key)}
                      aria-label="Remove item"
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-price"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.variantName}</p>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <QuantityStepper
                      value={item.quantity}
                      onChange={(q) => updateQuantity(item.key, q)}
                      className="scale-90 origin-left"
                    />
                    <span className="text-sm font-bold text-foreground">
                      {formatPrice(item.price * item.quantity, { withCurrency: false })}
                    </span>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </motion.div>

      {/* Подвал: прогресс до бесплатной доставки + итог + чекаут */}
      <div className="border-t border-border px-6 py-5 sm:px-8">
        <div className="mb-4">
          <p className="mb-2 text-xs text-muted-foreground">
            {remaining > 0 ? (
              <>
                You&apos;re{" "}
                <span className="font-semibold text-foreground">
                  {formatPrice(remaining, { withCurrency: false })}
                </span>{" "}
                away from free shipping
              </>
            ) : (
              <span className="font-semibold text-foreground">
                🎉 You&apos;ve unlocked free shipping
              </span>
            )}
          </p>
          <div className="h-1 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={false}
              animate={{ width: `${progress * 100}%` }}
              transition={{ type: "spring", stiffness: 110, damping: 22 }}
              className="h-full rounded-full bg-gradient-to-r from-brand to-gold"
            />
          </div>
        </div>

        <div className="mb-1 flex items-center justify-between text-sm text-muted-foreground">
          <span>Subtotal</span>
          <span className="font-semibold text-foreground">{formatPrice(subtotal)}</span>
        </div>
        <p className="mb-4 text-xs text-muted-foreground">
          Shipping &amp; taxes calculated at checkout.
        </p>
        <div className="flex flex-col gap-2">
          <Button size="lg" className="w-full" asChild>
            <Link href="/cart" onClick={onClose}>
              Checkout · {formatPrice(subtotal, { withCurrency: false })}
            </Link>
          </Button>
          <button
            onClick={onClose}
            className="text-center text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            Continue shopping
          </button>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────── Recently viewed ─────────────────────────── */

function RecentlyViewed({
  products,
  onClose,
}: {
  products: Product[];
  onClose: () => void;
}) {
  if (products.length === 0) {
    return (
      <motion.div
        variants={cascade}
        initial="hidden"
        animate="show"
        className="flex flex-1 flex-col items-center justify-center gap-7 px-8 pb-16 text-center"
      >
        <motion.h3
          variants={rise}
          className="max-w-[340px] font-display text-[28px] font-bold leading-tight tracking-tight sm:text-[32px]"
        >
          Nothing viewed yet.
        </motion.h3>
        <motion.p variants={rise} className="text-sm leading-relaxed text-foreground/70">
          Products you look at will appear here.
        </motion.p>
        <motion.div variants={rise} className="w-full max-w-[300px]">
          <ContinueShopping onClose={onClose} />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={cascade}
      initial="hidden"
      animate="show"
      className="min-h-0 flex-1 overflow-y-auto px-6 py-2 sm:px-8"
    >
      <ul className="flex flex-col divide-y divide-border/70">
        {products.map((p) => (
          <motion.li key={p.id} variants={rise}>
            <RecentRow product={p} onClose={onClose} />
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

/** Строка недавно просмотренного: миниатюра · имя+цена · кнопка «+ View». */
function RecentRow({ product: p, onClose }: { product: Product; onClose: () => void }) {
  const href = `/products/${p.slug}`;
  const onSale = typeof p.compareAtPrice === "number" && p.compareAtPrice > p.price;

  return (
    <div className="group flex items-center gap-4 py-4">
      <Link
        href={href}
        onClick={onClose}
        className="relative h-[68px] w-[68px] shrink-0 overflow-hidden rounded-xl bg-muted"
        style={p.tint ? { backgroundColor: p.tint } : undefined}
      >
        <Image
          src={p.images[0]}
          alt={p.name}
          fill
          sizes="68px"
          className="object-contain p-2.5 transition-transform duration-500 ease-premium group-hover:scale-105"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <Link
          href={href}
          onClick={onClose}
          className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors hover:text-brand"
        >
          {p.name}
        </Link>
        <p className="mt-1 flex items-baseline gap-2 text-sm">
          <span className={cn("font-semibold", onSale ? "text-price" : "text-foreground")}>
            {p.fromPrice && (
              <span className="mr-1 text-xs font-normal text-muted-foreground">From</span>
            )}
            {formatPrice(p.price)}
          </span>
          {onSale && (
            <span className="text-xs font-normal text-muted-foreground line-through">
              {formatPrice(p.compareAtPrice!)}
            </span>
          )}
        </p>
      </div>

      <Link
        href={href}
        onClick={onClose}
        className="group/btn inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-all duration-300 ease-premium hover:bg-brand hover:shadow-card-hover"
      >
        <Plus className="h-3.5 w-3.5 transition-transform duration-300 ease-premium group-hover/btn:rotate-90" />
        View
      </Link>
    </div>
  );
}
