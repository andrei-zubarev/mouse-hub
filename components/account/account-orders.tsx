"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, PackageSearch } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { MOCK_ORDERS, ORDER_STATUS_META } from "@/lib/orders";

/** История заказов: карточки с раскрытием состава и итогов. */
export function AccountOrders() {
  const [expanded, setExpanded] = useState<string | null>(MOCK_ORDERS[0]?.id ?? null);

  if (MOCK_ORDERS.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-border py-16 text-center">
        <PackageSearch className="h-10 w-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No orders yet.</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {MOCK_ORDERS.map((order, i) => {
        const open = expanded === order.id;
        const meta = ORDER_STATUS_META[order.status];
        const itemsCount = order.items.reduce((s, it) => s + it.quantity, 0);

        return (
          <motion.li
            key={order.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
            className={cn(
              "overflow-hidden rounded-3xl border transition-colors",
              open ? "border-foreground/25 shadow-card" : "border-border",
            )}
          >
            {/* Шапка заказа */}
            <button
              type="button"
              onClick={() => setExpanded(open ? null : order.id)}
              className="flex w-full items-center gap-4 p-5 text-left sm:p-6"
            >
              {/* Стопка превью товаров */}
              <div className="flex shrink-0 -space-x-4">
                {order.items.slice(0, 3).map((item) => (
                  <div
                    key={item.slug}
                    className="relative h-14 w-14 overflow-hidden rounded-xl border-2 border-background bg-muted"
                  >
                    <Image src={item.image} alt={item.name} fill sizes="56px" className="object-contain p-1.5" />
                  </div>
                ))}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="font-display text-sm font-bold sm:text-base">Order {order.id}</p>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${meta.className}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClassName}`} />
                    {meta.label}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {new Date(order.date).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  · {itemsCount} {itemsCount === 1 ? "item" : "items"}
                </p>
              </div>

              <p className="hidden shrink-0 text-sm font-bold sm:block">
                {formatPrice(order.total, { withCurrency: false })}
              </p>
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300",
                  open && "rotate-180",
                )}
              />
            </button>

            {/* Детали */}
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="border-t border-border px-5 py-5 sm:px-6">
                    <ul className="flex flex-col gap-3">
                      {order.items.map((item) => (
                        <li key={item.slug} className="flex items-center gap-3">
                          <Link
                            href={`/products/${item.slug}`}
                            className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border bg-muted/40"
                          >
                            <Image src={item.image} alt={item.name} fill sizes="64px" className="object-contain p-2" />
                          </Link>
                          <div className="min-w-0 flex-1">
                            <Link
                              href={`/products/${item.slug}`}
                              className="block truncate text-sm font-semibold hover:text-brand"
                            >
                              {item.name}
                            </Link>
                            <p className="text-xs text-muted-foreground">
                              {item.variantName} · ×{item.quantity}
                            </p>
                          </div>
                          <p className="shrink-0 text-sm font-bold">
                            {formatPrice(item.price * item.quantity, { withCurrency: false })}
                          </p>
                        </li>
                      ))}
                    </ul>

                    <dl className="mt-5 flex flex-col gap-1.5 border-t border-border pt-4 text-sm">
                      {order.trackingNumber && (
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Tracking</dt>
                          <dd className="font-mono text-xs font-medium sm:text-sm">
                            {order.trackingNumber}
                          </dd>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Shipping</dt>
                        <dd className="font-medium">
                          {order.shipping === 0 ? (
                            <span className="text-brand">Free</span>
                          ) : (
                            formatPrice(order.shipping, { withCurrency: false })
                          )}
                        </dd>
                      </div>
                      <div className="flex justify-between text-base">
                        <dt className="font-semibold">Total</dt>
                        <dd className="font-bold text-price">{formatPrice(order.total)}</dd>
                      </div>
                    </dl>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.li>
        );
      })}
    </ul>
  );
}
