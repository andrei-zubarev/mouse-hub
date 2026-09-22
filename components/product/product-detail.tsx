"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronRight,
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  Headset,
  Package,
  Usb,
  Grip,
  Check,
} from "lucide-react";
import { ProductGallery } from "./product-gallery";
import { VariantSelector } from "./variant-selector";
import { QuantityStepper } from "./quantity-stepper";
import { AddToCartButton } from "./add-to-cart-button";
import { ProductStory } from "./product-story";
import { ProductGrid } from "./product-grid";
import { ProductBadgePill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/shared/accordion";
import { useCartStore } from "@/store/cart-store";
import { useRecentlyViewedStore } from "@/store/recently-viewed-store";
import { cn, formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

/** Доп-комплекты под кнопкой (визуальный выбор, как на оригинале). */
const BUNDLES = [
  { id: "mouse", icon: Package, title: "Mouse only", desc: "Beast unit + 8K dongle", price: 0 },
  { id: "grip", icon: Grip, title: "+ Grip tape kit", desc: "Pre-cut anti-slip set", price: 12 },
  { id: "dongle", icon: Usb, title: "+ Spare Cat Dongle", desc: "Extra 8000 Hz receiver", price: 29 },
];

const TRUST = [
  { icon: Headset, label: "Customer service" },
  { icon: Truck, label: "Fast shipping" },
  { icon: ShieldCheck, label: "12-month warranty" },
  { icon: RotateCcw, label: "30-day returns" },
];

/** Полная страница товара: герой + сторителлинг-панели. */
export function ProductDetail({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const addViewed = useRecentlyViewedStore((s) => s.addViewed);

  // Регистрируем просмотр для вкладки «Recently viewed» в корзине.
  useEffect(() => {
    addViewed(product.slug);
  }, [product.slug, addViewed]);

  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [bundle, setBundle] = useState("mouse");

  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const price = product.price + (variant.priceDelta ?? 0);

  function handleBuyNow() {
    if (!product.inStock) return;
    addItem(product, variant, qty);
    router.push("/cart");
  }

  const infoItems = [
    {
      q: "Description",
      a: (
        <div className="flex flex-col gap-3">
          <p>{product.description}</p>
          <ul className="flex flex-col gap-2">
            {product.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={3} />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      q: "Specifications",
      a: (
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2.5">
          {product.specs.map((s) => (
            <div key={s.label} className="flex justify-between gap-3 border-b border-border/60 pb-2">
              <dt className="text-muted-foreground">{s.label}</dt>
              <dd className="font-medium text-foreground">{s.value}</dd>
            </div>
          ))}
        </dl>
      ),
    },
    {
      q: "Shipping & Returns",
      a: "Orders ship within 1–2 business days with tracked delivery. Free shipping over $99. Unused items can be returned within 30 days for a full refund.",
    },
    {
      q: "Warranty",
      a: "Every device is covered by a 12-month worry-free warranty against manufacturing defects, handled by MOUSE HUB support.",
    },
  ];

  return (
    <>
      <div className="container py-6 sm:py-10">
        {/* Хлебные крошки */}
        <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/" className="transition hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/products" className="transition hover:text-foreground">Products</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="truncate text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Галерея */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductGallery images={product.images} alt={product.name} />
          </div>

          {/* Информация */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <h1 className="font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-foreground">{formatPrice(price)}</span>
                {product.compareAtPrice && (
                  <span className="text-base text-muted-foreground line-through">
                    {formatPrice(product.compareAtPrice, { withCurrency: false })}
                  </span>
                )}
              </div>
              {product.rating && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={
                          i < Math.round(product.rating!)
                            ? "h-4 w-4 fill-gold text-gold"
                            : "h-4 w-4 text-border"
                        }
                      />
                    ))}
                  </span>
                  <span className="text-muted-foreground">
                    {product.rating.toFixed(1)} · {product.reviews} reviews
                  </span>
                  {product.badge && <ProductBadgePill label={product.badge} />}
                </div>
              )}
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              The forged-magnesium finish may show subtle texture variation between
              units — each shell is unique.
            </p>

            {/* Варианты */}
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Color — <span className="text-foreground">{variant.name}</span>
              </span>
              <VariantSelector
                variants={product.variants}
                selectedId={variant.id}
                onSelect={(v) => setVariantId(v.id)}
              />
            </div>

            {/* Промо-бокс коллаборации */}
            <div className="flex items-center gap-3 rounded-2xl border border-brand/20 bg-brand/[0.06] p-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand text-xs font-bold text-white">
                ×
              </span>
              <p className="text-xs leading-snug text-foreground">
                <span className="font-semibold">MOUSE HUB × FEIRENZAI</span> cooperation —
                limited collaboration finishes available while stocks last.
              </p>
            </div>

            {/* Bundle-опции */}
            <div className="flex flex-col gap-2">
              {BUNDLES.map((b) => {
                const active = bundle === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBundle(b.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border p-3.5 text-left transition",
                      active
                        ? "border-foreground bg-muted/60"
                        : "border-border hover:border-foreground/30",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-9 w-9 shrink-0 place-items-center rounded-full",
                        active ? "bg-foreground text-background" : "bg-muted text-foreground",
                      )}
                    >
                      <b.icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-foreground">{b.title}</span>
                      <span className="block text-xs text-muted-foreground">{b.desc}</span>
                    </span>
                    <span className="shrink-0 text-sm font-semibold text-foreground">
                      {b.price === 0 ? "Included" : `+${formatPrice(b.price, { withCurrency: false })}`}
                    </span>
                    <span
                      className={cn(
                        "grid h-5 w-5 shrink-0 place-items-center rounded-full border",
                        active ? "border-foreground bg-foreground text-background" : "border-border",
                      )}
                    >
                      {active && <Check className="h-3 w-3" strokeWidth={3} />}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Действия */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <QuantityStepper value={qty} onChange={setQty} />
                <AddToCartButton
                  product={product}
                  variant={variant}
                  quantity={qty}
                  size="lg"
                  className="flex-1"
                />
              </div>
              {product.inStock && (
                <Button onClick={handleBuyNow} variant="brand" size="lg" className="w-full">
                  Buy it now
                </Button>
              )}
            </div>

            {/* Аккордеон с информацией */}
            <Accordion items={infoItems} defaultOpen={0} className="mt-1" />

            {/* Trust-иконки */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {TRUST.map((t) => (
                <div
                  key={t.label}
                  className="flex flex-col items-center gap-1.5 rounded-xl bg-muted/50 p-3 text-center"
                >
                  <t.icon className="h-5 w-5 text-foreground" />
                  <span className="text-[11px] font-medium text-muted-foreground">{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Сторителлинг-панели */}
      <ProductStory product={product} />

      {/* Связанные товары */}
      {related.length > 0 && (
        <div className="container pb-20 pt-8">
          <h2 className="mb-8 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            You might also like
          </h2>
          <ProductGrid products={related} />
        </div>
      )}
    </>
  );
}
