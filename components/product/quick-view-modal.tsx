"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  X,
  Facebook,
  Twitter,
  Send,
  MessageCircle,
  Share2,
  HelpCircle,
} from "lucide-react";
import { QuantityStepper } from "./quantity-stepper";
import { AddToCartButton } from "./add-to-cart-button";
import { useUIStore } from "@/store/ui-store";
import { useRecentlyViewedStore } from "@/store/recently-viewed-store";
import { cn, formatPrice } from "@/lib/utils";

/** Мягкий, «вялый» ease. */
const EASE = [0.22, 1, 0.36, 1] as const;

/** Каскадное появление элементов правой панели. */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

const SWITCHES = [
  { id: "omron", label: "OMRON Opticals", available: true },
  { id: "ttc", label: "TTC Nihil Transparent", available: false },
];
const SIDE_STYLES = [
  { id: "slits", label: "Side Slits", available: true },
  { id: "solid", label: "Solid Sides", available: false },
];
const MODELS = [
  { id: "speed", label: "Speed", available: true },
  { id: "balance", label: "Balance", available: false },
  { id: "control", label: "Control", available: false },
];
const SHARE_ICONS = [Facebook, Twitter, Share2, Send, MessageCircle];

/** Быстрый просмотр — крупная премиальная панель по центру (адаптив по категории). */
export function QuickViewModal() {
  const storeProduct = useUIStore((s) => s.quickViewProduct);
  const closeQuickView = useUIStore((s) => s.closeQuickView);
  const addViewed = useRecentlyViewedStore((s) => s.addViewed);

  const [product, setProduct] = useState(storeProduct);
  const open = !!storeProduct;

  const [variantId, setVariantId] = useState("");
  const [imgIndex, setImgIndex] = useState(0);
  const [switchId, setSwitchId] = useState("omron");
  const [sideId, setSideId] = useState("slits");
  const [modelId, setModelId] = useState("speed");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (storeProduct) {
      addViewed(storeProduct.slug);
      setProduct(storeProduct);
      setVariantId(storeProduct.variants[0]?.id ?? "");
      setImgIndex(0);
      setSwitchId("omron");
      setSideId("slits");
      setModelId("speed");
      setQty(1);
    }
  }, [storeProduct, addViewed]);

  const variant = product?.variants.find((v) => v.id === variantId) ?? product?.variants[0];
  const isPad = product?.category === "mousepad";
  const price = (product?.price ?? 0) + (variant?.priceDelta ?? 0);
  const sizeValue = isPad ? "490*420*4mm" : product?.specs.find((s) => s.icon === "size")?.value ?? "";
  const leftBg = isPad ? "#ffffff" : product?.tint ?? "hsl(var(--muted))";

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => !o && closeQuickView()}>
      <AnimatePresence>
        {open && product && variant && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <div className="fixed inset-0 z-[100]">
                {/* Блюр: короткий fade (250ms) — плавно и почти бесплатно */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="absolute inset-0 backdrop-blur-xl"
                />
                {/* Затемнение — длиннее, даёт глубину */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="absolute inset-0 bg-black/60"
                />
              </div>
            </DialogPrimitive.Overlay>

            <div className="pointer-events-none fixed inset-0 z-[101] grid place-items-center p-4 sm:p-6">
              <DialogPrimitive.Content asChild forceMount onOpenAutoFocus={(e) => e.preventDefault()}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.955 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.38, ease: EASE } }}
                  transition={{ duration: 0.7, ease: EASE }}
                  className="pointer-events-auto relative w-full max-w-4xl transform-gpu overflow-hidden rounded-[1.75rem] border border-white/70 bg-background shadow-[0_50px_140px_-28px_rgba(0,0,0,0.62)] ring-1 ring-black/[0.06] will-change-transform"
                >
                  <div className="flex max-h-[92vh] flex-col overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      {/* Левая панель — крупное фото на совпадающем фоне */}
                      <div
                        className="relative flex items-center justify-center overflow-hidden"
                        style={{ backgroundColor: leftBg }}
                      >
                        <div className="relative aspect-square w-full">
                          {product.images.map((src, i) => (
                            <Image
                              key={src + i}
                              src={src}
                              alt={i === 0 ? product.name : ""}
                              aria-hidden={i !== 0}
                              fill
                              sizes="(max-width: 768px) 92vw, 50vw"
                              className={cn(
                                "object-contain transition-opacity duration-500",
                                isPad ? "p-6 sm:p-8" : "scale-[1.12]",
                                i === imgIndex ? "opacity-100" : "opacity-0",
                              )}
                            />
                          ))}
                        </div>

                        {product.images.length > 1 && (
                          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-background/80 px-3 py-2 shadow-sm backdrop-blur">
                            {product.images.map((src, i) => (
                              <button
                                key={src + i}
                                type="button"
                                aria-label={`Image ${i + 1}`}
                                onClick={() => setImgIndex(i)}
                                className={cn(
                                  "h-1.5 rounded-full transition-all duration-300",
                                  i === imgIndex ? "w-2 bg-foreground/80" : "w-1.5 bg-foreground/25 hover:bg-foreground/40",
                                )}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Правая панель — каскадное появление элементов */}
                      <motion.div
                        variants={stagger}
                        initial="hidden"
                        animate="show"
                        className="flex flex-col gap-5 p-7 sm:p-9"
                      >
                        <DialogPrimitive.Title asChild>
                          <motion.h2
                            variants={item}
                            className="max-w-[95%] bg-gradient-to-br from-foreground via-foreground to-foreground/55 bg-clip-text pb-0.5 font-display text-[30px] font-extrabold leading-[1.02] tracking-[-0.02em] text-transparent sm:text-[42px]"
                          >
                            {product.name}
                          </motion.h2>
                        </DialogPrimitive.Title>

                        <motion.p variants={item} className="text-xl font-bold text-foreground">
                          {product.fromPrice && (
                            <span className="mr-1 text-sm font-medium text-muted-foreground">From</span>
                          )}
                          {formatPrice(price)}
                        </motion.p>

                        {/* Опции — по категории */}
                        {isPad ? (
                          <>
                            <motion.div variants={item} className="flex flex-col gap-2.5">
                              <span className="text-sm text-muted-foreground">
                                Size: <span className="font-semibold text-foreground">{sizeValue}</span>
                              </span>
                              <button
                                type="button"
                                className="w-fit rounded-lg border border-foreground px-5 py-2.5 text-sm font-medium text-foreground"
                              >
                                {sizeValue}
                              </button>
                            </motion.div>

                            <motion.div variants={item}>
                              <OptionRow
                                label="Model"
                                value={MODELS.find((m) => m.id === modelId)?.label ?? ""}
                                options={MODELS}
                                selected={modelId}
                                onSelect={setModelId}
                              />
                            </motion.div>
                          </>
                        ) : (
                          <>
                            <motion.div variants={item} className="flex flex-col gap-2.5">
                              <span className="text-sm text-muted-foreground">
                                Color: <span className="font-semibold text-foreground">{variant.name}</span>
                              </span>
                              <div className="flex flex-wrap gap-2.5">
                                {product.variants.map((v) => {
                                  const selected = v.id === variant.id;
                                  return (
                                    <button
                                      key={v.id}
                                      type="button"
                                      onClick={() => setVariantId(v.id)}
                                      aria-label={v.name}
                                      className={cn(
                                        "relative h-12 w-12 overflow-hidden rounded-lg border transition",
                                        selected ? "border-foreground ring-1 ring-foreground" : "border-border hover:border-foreground/40",
                                      )}
                                    >
                                      <span className="block h-full w-full" style={{ backgroundColor: v.hex }} />
                                    </button>
                                  );
                                })}
                              </div>
                            </motion.div>

                            <motion.div variants={item}>
                              <OptionRow
                                label="Switches"
                                value={SWITCHES.find((s) => s.id === switchId)?.label ?? ""}
                                options={SWITCHES}
                                selected={switchId}
                                onSelect={setSwitchId}
                              />
                            </motion.div>
                            <motion.div variants={item}>
                              <OptionRow
                                label="Side style"
                                value={SIDE_STYLES.find((s) => s.id === sideId)?.label ?? ""}
                                options={SIDE_STYLES}
                                selected={sideId}
                                onSelect={setSideId}
                              />
                            </motion.div>
                          </>
                        )}

                        {/* Наличие */}
                        {product.inStock ? (
                          <motion.div
                            variants={item}
                            className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-2 text-xs font-medium text-emerald-700"
                          >
                            <span className="relative flex h-3.5 w-3.5">
                              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-60" />
                              <span className="relative grid h-3.5 w-3.5 place-items-center rounded-full bg-emerald-500">
                                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                              </span>
                            </span>
                            In stock, ready to ship
                          </motion.div>
                        ) : (
                          <motion.div
                            variants={item}
                            className="inline-flex w-fit items-center gap-2 rounded-full bg-red-50 px-3.5 py-2 text-xs font-medium text-red-600"
                          >
                            <span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-red-500">
                              <span className="h-1.5 w-1.5 rounded-full bg-white" />
                            </span>
                            Out of stock
                          </motion.div>
                        )}

                        {/* Кол-во + Add to cart / Sold Out */}
                        {product.inStock ? (
                          <motion.div variants={item} className="flex items-center gap-4">
                            <QuantityStepper value={qty} onChange={setQty} />
                            <AddToCartButton
                              product={product}
                              variant={variant}
                              quantity={qty}
                              size="lg"
                              className="flex-1"
                              label={`Add to cart  -  ${formatPrice(price)}`}
                            />
                          </motion.div>
                        ) : (
                          <motion.button
                            variants={item}
                            type="button"
                            className="w-full cursor-not-allowed rounded-lg bg-ink py-3.5 text-sm font-semibold text-ink-foreground"
                          >
                            Sold Out - Notify me when it&apos;s available
                          </motion.button>
                        )}

                        {/* PayPal */}
                        <motion.div variants={item} className="flex flex-col items-center gap-2">
                          <button
                            type="button"
                            className="flex w-full items-center justify-center gap-1 rounded-lg bg-[#ffc439] py-3.5 text-sm font-semibold transition hover:brightness-95"
                          >
                            <span className="text-black/70">Pay with</span>
                            <span className="font-extrabold italic">
                              <span className="text-[#253b80]">Pay</span>
                              <span className="text-[#179bd7]">Pal</span>
                            </span>
                          </button>
                          <button type="button" className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground">
                            More payment options
                          </button>
                        </motion.div>

                        {/* Share + Need help */}
                        <motion.div variants={item} className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-3.5 text-foreground/70">
                            <span className="text-sm font-medium text-foreground">Share:</span>
                            {SHARE_ICONS.map((Icon, i) => (
                              <button key={i} type="button" aria-label="Share" className="transition hover:text-foreground">
                                <Icon className="h-4 w-4" />
                              </button>
                            ))}
                          </div>
                          <button type="button" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">
                            <HelpCircle className="h-4 w-4" />
                            Need help?
                          </button>
                        </motion.div>
                      </motion.div>
                    </div>

                    {/* Футер */}
                    <Link
                      href={`/products/${product.slug}`}
                      onClick={closeQuickView}
                      className="group flex items-center justify-between gap-2 border-t border-border px-7 py-5 text-sm font-semibold text-foreground transition hover:text-brand sm:px-9"
                    >
                      View full details
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>

                  <DialogPrimitive.Close className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full border border-border bg-background text-foreground transition hover:bg-foreground hover:text-background">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </DialogPrimitive.Close>
                </motion.div>
              </DialogPrimitive.Content>
            </div>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}

/** Строка-селектор опции с недоступными вариантами (перечёркнуты). */
function OptionRow({
  label,
  value,
  options,
  selected,
  onSelect,
}: {
  label: string;
  value: string;
  options: { id: string; label: string; available: boolean }[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-muted-foreground">
        {label}: <span className="font-semibold text-foreground">{value}</span>
      </span>
      <div className="flex flex-wrap gap-2.5">
        {options.map((o) => {
          const isSelected = o.id === selected;
          const unavailable = !o.available;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => !unavailable && onSelect(o.id)}
              disabled={unavailable}
              className={cn(
                "relative overflow-hidden rounded-lg border px-4 py-2.5 text-xs font-medium transition",
                isSelected
                  ? "border-foreground text-foreground"
                  : unavailable
                    ? "shake-on-hover cursor-not-allowed border-red-200 text-red-300"
                    : "border-border text-muted-foreground hover:border-foreground/40",
              )}
            >
              {o.label}
              {unavailable && (
                <span className="pointer-events-none absolute left-0 top-1/2 h-px w-[130%] -translate-y-1/2 -rotate-[14deg] bg-red-300" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
