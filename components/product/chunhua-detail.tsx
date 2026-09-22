"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Facebook, MessageCircle, Send, Truck, X } from "lucide-react";
import { XIcon } from "@/components/icons";
import { Magnetic } from "@/components/shared/magnetic";
import { Accordion } from "@/components/shared/accordion";
import { QuantityStepper } from "@/components/product/quantity-stepper";
import { useLockBodyScroll } from "@/hooks/use-lock-body-scroll";
import { useCartStore } from "@/store/cart-store";
import { useUIStore } from "@/store/ui-store";
import { useRecentlyViewedStore } from "@/store/recently-viewed-store";
import { cn, formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

/* ───────────────────────── Данные страницы ───────────────────────── */

/** Поверхности: Balance распродан (розовая «зачёркнутая» пилюля, как на оригинале). */
const MODELS = [
  { id: "speed", name: "Speed", available: true },
  { id: "balance", name: "Balance", available: false },
  { id: "control", name: "Control", available: true },
] as const;

const SIZE_LABEL = "490 × 420 mm";

/* ───────────────────────── Вспомогательные блоки ───────────────────────── */

/** Панель-секция с плавным появлением при скролле. */
function StoryPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={cn("relative overflow-hidden rounded-3xl", className)}
    >
      {children}
    </motion.section>
  );
}

/**
 * Изображение с плавным параллаксом: внутри контейнера картинка
 * следует за курсором на пружине и слегка увеличивается при наведении.
 */
function ParallaxImage({
  src,
  alt,
  sizes,
  priority = false,
  contain = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  contain?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const sx = useSpring(x, { stiffness: 110, damping: 16, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 110, damping: 16, mass: 0.5 });
  const sScale = useSpring(scale, { stiffness: 160, damping: 22 });

  function onMove(e: React.MouseEvent) {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set(((e.clientX - r.left) / r.width - 0.5) * 22);
    y.set(((e.clientY - r.top) / r.height - 0.5) * 16);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
    scale.set(1);
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => scale.set(1.06)}
      onMouseLeave={onLeave}
      className="absolute inset-0 overflow-hidden"
    >
      <motion.div style={{ x: sx, y: sy, scale: sScale }} className="absolute inset-0">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={contain ? "object-contain" : "object-cover"}
        />
      </motion.div>
    </div>
  );
}

/* Заголовок с построчным «выездом» слов из-под маски при скролле. */
const headingContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const headingWord = {
  hidden: { y: "115%" },
  visible: {
    y: "0%",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

function AnimatedHeading({ text, className }: { text: string; className?: string }) {
  return (
    <motion.h2
      variants={headingContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      className={className}
    >
      {text.split("\n").map((line, li) => (
        <span key={li} className="block">
          {line.split(" ").map((word, wi, words) => (
            <span key={wi} className="inline-block overflow-hidden pb-0.5 align-top">
              <motion.span variants={headingWord} className="inline-block">
                {word}
                {wi < words.length - 1 ? " " : ""}
              </motion.span>
            </span>
          ))}
        </span>
      ))}
    </motion.h2>
  );
}

/** Свотч цвета: уменьшенный рендер ковра нужной расцветки. */
function ColorSwatch({ src }: { src: string }) {
  return (
    <span className="relative block h-11 w-11 overflow-hidden rounded-md bg-white">
      <Image src={src} alt="" fill sizes="44px" className="scale-[1.7] object-cover" />
    </span>
  );
}

/* ───────────────────────── Главный компонент ───────────────────────── */

/** Страница MOUSE HUB CHUNHUA — герой + сторителлинг-панели продукта. */
export function ChunhuaDetail({ product }: { product: Product }) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUIStore((s) => s.openCart);
  const addViewed = useRecentlyViewedStore((s) => s.addViewed);

  useEffect(() => {
    addViewed(product.slug);
  }, [product.slug, addViewed]);

  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const [model, setModel] = useState<string>("speed");
  const [qty, setQty] = useState(1);
  const [imgIndex, setImgIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxDir, setLightboxDir] = useState(0);

  useLockBodyScroll(lightboxOpen);

  const imagesCount = product.images.length;

  /** Листание в просмотре с направлением для анимации (с зацикливанием). */
  function showLightboxImage(next: number) {
    setLightboxDir(next > imgIndex ? 1 : -1);
    setImgIndex(((next % imagesCount) + imagesCount) % imagesCount);
  }

  // Управление просмотром с клавиатуры: Escape — закрыть, стрелки — листать.
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") showLightboxImage(imgIndex + 1);
      if (e.key === "ArrowLeft") showLightboxImage(imgIndex - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen, imgIndex, imagesCount]);

  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];

  /** Выбор цвета листает галерею на рендер этой расцветки (порядок совпадает). */
  function selectColor(id: string) {
    setVariantId(id);
    const i = product.variants.findIndex((v) => v.id === id);
    if (i >= 0 && i < product.images.length) setImgIndex(i);
  }

  function handleAddToCart() {
    addItem(product, variant, qty);
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 1600);
  }

  function handlePayPal() {
    addItem(product, variant, qty);
    router.push("/cart");
  }

  const shareLinks = [
    { label: "Share on Facebook", icon: Facebook, href: "https://facebook.com" },
    { label: "Share on X", icon: XIcon, href: "https://x.com" },
    { label: "Share on Telegram", icon: Send, href: "https://telegram.org" },
    { label: "Share on WhatsApp", icon: MessageCircle, href: "https://whatsapp.com" },
  ];

  return (
    <>
      {/* ─────────── Покупочный блок ─────────── */}
      <div className="container py-8 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          {/* Медиа: крупное изображение + миниатюры */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
            <div
              role="button"
              tabIndex={0}
              aria-label="View full-size image"
              onClick={() => setLightboxOpen(true)}
              onKeyDown={(e) => e.key === "Enter" && setLightboxOpen(true)}
              className="relative aspect-[5/4] cursor-zoom-in overflow-hidden rounded-2xl bg-white"
            >
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={imgIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.3, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <ParallaxImage
                    src={product.images[imgIndex]}
                    alt={product.name}
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    priority
                    contain
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setImgIndex(i)}
                  aria-label={`View image ${i + 1}`}
                  className={cn(
                    "relative aspect-[4/3] w-20 overflow-hidden rounded-lg border transition",
                    i === imgIndex
                      ? "border-foreground"
                      : "border-border hover:border-foreground/40",
                  )}
                >
                  <Image src={img} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Информация */}
          <div className="flex max-w-md flex-col">
            <h1 className="font-display text-2xl font-bold leading-tight tracking-tight sm:text-[28px]">
              {product.name}
            </h1>

            <p className="mt-4 text-lg font-medium">{formatPrice(product.price)}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">Tax included.</p>

            {/* Цвет */}
            <div className="mt-6">
              <p className="text-xs text-muted-foreground">
                Color: <span className="text-foreground">{variant.name}</span>
              </p>
              <div className="mt-2 flex gap-2">
                {product.variants.map((v, i) => (
                  <Magnetic key={v.id} strength={0.3}>
                    <button
                      type="button"
                      onClick={() => selectColor(v.id)}
                      aria-label={v.name}
                      className={cn(
                        "block rounded-lg border p-0.5 transition",
                        v.id === variant.id
                          ? "border-foreground"
                          : "border-border hover:border-foreground/40",
                      )}
                    >
                      <ColorSwatch src={product.images[i] ?? product.images[0]} />
                    </button>
                  </Magnetic>
                ))}
              </div>
            </div>

            {/* Модель поверхности */}
            <div className="mt-5">
              <p className="text-xs text-muted-foreground">
                Model: <span className="text-foreground">{MODELS.find((m) => m.id === model)?.name}</span>
              </p>
              <div className="mt-2 flex gap-2">
                {MODELS.map((m) =>
                  m.available ? (
                    <Magnetic key={m.id} strength={0.3}>
                      <button
                        type="button"
                        onClick={() => setModel(m.id)}
                        className={cn(
                          "block rounded-md border px-4 py-1.5 text-xs font-medium transition",
                          m.id === model
                            ? "border-foreground text-foreground"
                            : "border-border text-foreground hover:border-foreground/40",
                        )}
                      >
                        {m.name}
                      </button>
                    </Magnetic>
                  ) : (
                    <Magnetic key={m.id} strength={0.3}>
                      <span
                        title="Sold out"
                        className="block cursor-not-allowed select-none rounded-md border border-rose-200 bg-rose-50 px-4 py-1.5 text-xs font-medium text-rose-300 line-through"
                      >
                        {m.name}
                      </span>
                    </Magnetic>
                  ),
                )}
              </div>
            </div>

            {/* Размер */}
            <div className="mt-5">
              <p className="text-xs text-muted-foreground">
                Size: <span className="text-foreground">{SIZE_LABEL}</span>
              </p>
              <div className="mt-2">
                <Magnetic strength={0.3}>
                  <span className="block rounded-md border border-foreground px-4 py-1.5 text-xs font-medium">
                    {SIZE_LABEL}
                  </span>
                </Magnetic>
              </div>
            </div>

            {/* Количество + в корзину */}
            <div className="mt-7 flex items-stretch gap-3">
              <QuantityStepper value={qty} onChange={setQty} className="shrink-0" />
              <button
                type="button"
                onClick={handleAddToCart}
                className="group relative h-11 flex-1 overflow-hidden rounded-full bg-ink text-sm font-semibold text-ink-foreground shadow-sm transition active:scale-[0.98]"
              >
                {/* Волна заливки: слой с волнистым SVG-краем въезжает слева на hover */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-0 w-full -translate-x-[calc(100%+28px)] bg-brand transition-transform duration-[1200ms] ease-premium group-hover:translate-x-0"
                >
                  <svg
                    viewBox="0 0 28 44"
                    preserveAspectRatio="none"
                    className="absolute left-full top-0 h-full w-7 fill-brand"
                  >
                    <path d="M0 0 C 16 7, 4 15, 13 22 C 22 29, 6 37, 0 44 Z" />
                  </svg>
                </span>
                <AnimatePresence mode="wait" initial={false}>
                  {added ? (
                    <motion.span
                      key="added"
                      className="relative inline-flex items-center gap-2"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Check className="h-4 w-4" /> Added
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      className="relative inline-block"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      Add to cart&nbsp;&nbsp;·&nbsp;&nbsp;{formatPrice(product.price)}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>

            {/* PayPal */}
            <button
              type="button"
              onClick={handlePayPal}
              className="mt-3 h-11 w-full rounded-full bg-[#ffc439] text-sm font-medium text-[#111] transition hover:brightness-95 active:scale-[0.98]"
            >
              Pay with{" "}
              <span className="font-display text-[15px] font-extrabold italic">
                <span className="text-[#003087]">Pay</span>
                <span className="text-[#009cde]">Pal</span>
              </span>
            </button>
            <button
              type="button"
              onClick={handlePayPal}
              className="mt-3 self-center text-xs text-muted-foreground underline underline-offset-2 transition hover:text-foreground"
            >
              More payment options
            </button>

            {/* Share */}
            <div className="mt-6 flex items-center gap-4">
              <span className="text-xs text-muted-foreground">Share:</span>
              <div className="flex items-center gap-3.5">
                {shareLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="text-foreground/70 transition hover:text-foreground"
                  >
                    <s.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Description */}
            <Accordion
              className="mt-6"
              items={[
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
              ]}
            />

            {/* Наличие */}
            <p className="mt-5 inline-flex items-center gap-2 text-xs text-muted-foreground">
              <Truck className="h-4 w-4 text-foreground" />
              In stock! Ships within 1-2 business days.
            </p>
          </div>
        </div>
      </div>

      {/* ─────────── Story-секции ─────────── */}
      <div className="container flex flex-col gap-6 pb-20 sm:gap-8">
        {/* 1. Hero-артворк с тремя вариантами */}
        <StoryPanel>
          <div className="relative aspect-[2/1] w-full">
            <ParallaxImage
              src="/images/mousepads/chunhua/hero.svg"
              alt="CHUNHUA mousepad — three colorways"
              sizes="100vw"
            />
          </div>
        </StoryPanel>

        {/* 2. Три поверхности */}
        <StoryPanel className="bg-muted">
          <div className="grid lg:grid-cols-2">
            <div className="relative aspect-square">
              <ParallaxImage
                src="/images/mousepads/chunhua/stack.svg"
                alt="Three CHUNHUA pads stacked"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-14 lg:p-16">
              <AnimatedHeading
                text="Three Options, Endless Possibilities"
                className="font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl"
              />
              <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
                No two gamers play alike — and neither are their needs. That&apos;s
                why this mousepad comes in three distinct surface types, so the
                glide always matches your playstyle: Speed for wide, fast flicks,
                Balance for the best of both worlds, and Control for pinpoint
                precision.
              </p>
            </div>
          </div>
        </StoryPanel>

        {/* 3. SlimFlex HR база */}
        <StoryPanel className="bg-background">
          <div className="grid lg:grid-cols-2">
            <div className="order-2 flex flex-col justify-center p-8 sm:p-14 lg:order-1 lg:p-16">
              <AnimatedHeading
                text="Advanced Anti-Slip SlimFlex HR Base"
                className="font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-[44px]"
              />
              <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
                Built on a high-performance 4&nbsp;mm SlimFlex HR base (formerly
                known as Japanese Poron), this pad is all about staying rock-solid
                when the action heats up. Diving into a clutch moment or pulling
                off precise micro-moves — the SlimFlex HR base keeps the pad
                locked in place, so you can game harder and worry less.
              </p>
            </div>
            <div className="order-1 relative aspect-square lg:order-2">
              <ParallaxImage
                src="/images/mousepads/chunhua/flex.svg"
                alt="Flexible pad with SlimFlex HR base"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </StoryPanel>

        {/* 4. Прошитые края */}
        <StoryPanel className="bg-muted">
          <div className="grid lg:grid-cols-2">
            <div className="relative aspect-square">
              <ParallaxImage
                src="/images/mousepads/chunhua/stitch.svg"
                alt="Hand-stitched recessed edge"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-14 lg:p-16">
              <AnimatedHeading
                text={"Ultra-Slim,\nHand-Stitched\nEdges"}
                className="font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl"
              />
              <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
                Meticulously hand-stitched with recessed ultra-slim edges, this
                design adds comfort for your wrist, prevents fraying over time and
                extends durability — all while keeping a sleek, premium look.
              </p>
            </div>
          </div>
        </StoryPanel>

        {/* 5. Финальный ракурс */}
        <StoryPanel>
          <div className="relative aspect-[16/9] w-full sm:aspect-[2/1]">
            <ParallaxImage
              src="/images/mousepads/chunhua/angle.svg"
              alt="CHUNHUA mousepad at an angle"
              sizes="100vw"
            />
          </div>
        </StoryPanel>
      </div>

      {/* ─────────── Полноэкранный просмотр фото ─────────── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setLightboxOpen(false)}
            className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-white p-4 sm:p-10"
          >
            {/* Закрыть */}
            <motion.button
              type="button"
              aria-label="Close full-size view"
              initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.25 }}
              onClick={() => setLightboxOpen(false)}
              className="absolute right-5 top-5 z-10 grid h-11 w-11 place-items-center rounded-full bg-muted text-foreground transition hover:bg-border"
            >
              <X className="h-5 w-5" />
            </motion.button>

            {/* Стрелки листания */}
            <motion.button
              type="button"
              aria-label="Previous image"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ type: "spring", stiffness: 180, damping: 22, delay: 0.3 }}
              onClick={(e) => {
                e.stopPropagation();
                showLightboxImage(imgIndex - 1);
              }}
              className="absolute left-4 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-border bg-white text-foreground shadow-card transition hover:bg-muted sm:left-8"
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
            <motion.button
              type="button"
              aria-label="Next image"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ type: "spring", stiffness: 180, damping: 22, delay: 0.3 }}
              onClick={(e) => {
                e.stopPropagation();
                showLightboxImage(imgIndex + 1);
              }}
              className="absolute right-4 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-border bg-white text-foreground shadow-card transition hover:bg-muted sm:right-8"
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>

            {/* Фото: «дорогое» открытие + направленное перелистывание */}
            <motion.div
              initial={{ opacity: 0, scale: 0.86, y: 48 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 24 }}
              transition={{ type: "spring", stiffness: 150, damping: 24, mass: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="relative h-full max-h-[78vh] w-full max-w-5xl cursor-default"
            >
              <AnimatePresence initial={false} custom={lightboxDir} mode="popLayout">
                <motion.div
                  key={imgIndex}
                  custom={lightboxDir}
                  initial={{ opacity: 0, x: lightboxDir * 90, scale: 0.985 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: lightboxDir * -90, scale: 0.985 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={product.images[imgIndex]}
                    alt={product.name}
                    fill
                    sizes="100vw"
                    className="object-contain"
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Переключение расцветок внутри просмотра */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 180, damping: 22, delay: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="mt-5 flex gap-3"
            >
              {product.images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => showLightboxImage(i)}
                  aria-label={`View image ${i + 1}`}
                  className={cn(
                    "relative aspect-[4/3] w-16 overflow-hidden rounded-lg border bg-white transition",
                    i === imgIndex
                      ? "border-foreground"
                      : "border-border opacity-60 hover:opacity-100",
                  )}
                >
                  <Image src={img} alt="" fill sizes="64px" className="scale-[1.6] object-cover" />
                </button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
