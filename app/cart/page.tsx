"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, Trash2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/product/quantity-stepper";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";

const FREE_SHIPPING_THRESHOLD = 99;
const SHIPPING_FEE = 9;

/** Страница корзины: позиции + сводка заказа. */
export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, clear, hasHydrated, totalItems } = useCart();

  // До гидратации показываем нейтральный плейсхолдер (без мисматча).
  if (!hasHydrated) {
    return (
      <div className="container flex min-h-[50vh] items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-brand" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container flex min-h-[55vh] flex-col items-center justify-center gap-5 py-20 text-center">
        <div className="grid h-24 w-24 place-items-center rounded-full bg-muted">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Looks like you haven&apos;t added anything yet.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/products">Start shopping</Link>
        </Button>
      </div>
    );
  }

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  return (
    <div className="container py-10 sm:py-14">
      <div className="mb-8 flex items-end justify-between gap-4">
        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Shopping Cart
          <span className="ml-2 text-lg font-medium text-muted-foreground">
            ({totalItems})
          </span>
        </h1>
        <button
          onClick={clear}
          className="text-sm font-medium text-muted-foreground transition hover:text-price"
        >
          Clear cart
        </button>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-12">
        {/* Позиции */}
        <ul className="flex flex-col divide-y divide-border border-y border-border">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.li
                key={item.key}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex gap-4 py-6"
              >
                <Link
                  href={`/products/${item.slug}`}
                  className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-border bg-muted/40"
                >
                  <Image src={item.image} alt={item.name} fill sizes="112px" className="object-contain p-3" />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-display text-base font-semibold leading-snug hover:text-brand"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted-foreground">{item.variantName}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.key)}
                      aria-label="Remove"
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-price"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-auto flex items-end justify-between pt-3">
                    <QuantityStepper
                      value={item.quantity}
                      onChange={(q) => updateQuantity(item.key, q)}
                    />
                    <div className="text-right">
                      <p className="text-base font-bold text-foreground">
                        {formatPrice(item.price * item.quantity, { withCurrency: false })}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-muted-foreground">
                          {formatPrice(item.price, { withCurrency: false })} each
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {/* Сводка */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-muted/30 p-6">
            <h2 className="font-display text-lg font-bold">Order Summary</h2>
            <dl className="mt-5 flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="font-medium">{formatPrice(subtotal, { withCurrency: false })}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd className="font-medium">
                  {shipping === 0 ? (
                    <span className="text-brand">Free</span>
                  ) : (
                    formatPrice(shipping, { withCurrency: false })
                  )}
                </dd>
              </div>
              {shipping > 0 && (
                <p className="rounded-lg bg-background px-3 py-2 text-xs text-muted-foreground">
                  Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal, { withCurrency: false })} more
                  for free shipping.
                </p>
              )}
              <div className="mt-2 flex justify-between border-t border-border pt-4 text-base">
                <dt className="font-semibold">Total</dt>
                <dd className="font-bold text-price">{formatPrice(total)}</dd>
              </div>
            </dl>

            <Button size="lg" className="mt-6 w-full" variant="brand">
              <Lock className="h-4 w-4" /> Checkout
            </Button>
            <Link
              href="/products"
              className="mt-4 inline-flex w-full items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
