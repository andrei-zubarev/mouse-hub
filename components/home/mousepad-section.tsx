"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { ProductBadgePill } from "@/components/ui/badge";
import { useUIStore } from "@/store/ui-store";
import { MOUSEPAD_PRODUCTS } from "@/lib/products";
import type { Product } from "@/types";

/** Три коврика в порядке оригинала: QISHA · MA-GIC · CHUNHUA. */
const PAD_SLUGS = ["qisha-mousepad", "magic-mousepad", "chunhua-mousepad"];
const PADS = PAD_SLUGS.map((slug) => MOUSEPAD_PRODUCTS.find((p) => p.slug === slug)).filter(
  Boolean,
) as Product[];

/** Плитка коллажа с опциональной подписью. */
function CollageCard({
  src,
  aspect,
  alt,
  label,
  labelDark,
  delay = 0,
}: {
  src: string;
  aspect: string;
  alt: string;
  label?: string;
  labelDark?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay }}
      className={cn("group relative overflow-hidden rounded-2xl bg-muted", aspect)}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 48vw, 32vw"
        className="object-cover transition-transform duration-[900ms] ease-premium group-hover:scale-[1.05]"
      />
      {label && (
        <span
          className={cn(
            "absolute bottom-4 left-5 font-display text-sm font-bold tracking-wide",
            labelDark ? "text-foreground/80" : "text-white drop-shadow",
          )}
        >
          {label}
        </span>
      )}
    </motion.div>
  );
}

/** Карточка коврика: крупное фото на белом (скраббинг фото курсором + зум
 *  при наведении), ниже — светло-серая полоса с именем и ценой. */
function MousepadCard({ product, index }: { product: Product; index: number }) {
  const openQuickView = useUIStore((s) => s.openQuickView);
  const [active, setActive] = useState(0);
  const mediaRef = useRef<HTMLDivElement>(null);
  const images = product.images;
  const href = `/products/${product.slug}`;

  // Скраббинг фото по горизонтали курсора внутри ячейки.
  function handleMove(e: React.MouseEvent) {
    const el = mediaRef.current;
    if (!el || images.length < 2) return;
    const rect = el.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const idx = Math.min(images.length - 1, Math.max(0, Math.floor(ratio * images.length)));
    if (idx !== active) setActive(idx);
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: "spring", stiffness: 180, damping: 22, mass: 0.9, delay: (index % 3) * 0.1 }}
      className="group flex flex-col overflow-hidden rounded-[1.25rem] border border-border/70 bg-white transition-all duration-500 ease-jelly hover:-translate-y-1.5 hover:shadow-card-hover"
    >
      {/* Фото: радиус на верхних углах самих картинок */}
      <div
        ref={mediaRef}
        onMouseMove={handleMove}
        onMouseLeave={() => setActive(0)}
        className="relative aspect-square w-full overflow-hidden rounded-t-[1.25rem] bg-white"
      >
        {product.badge && (
          <div className="absolute left-1/2 top-2 z-10 -translate-x-1/2">
            <ProductBadgePill label={product.badge} />
          </div>
        )}

        <button
          type="button"
          onClick={() => openQuickView(product)}
          aria-label="Quick view"
          className="absolute right-3 top-3 z-10 grid h-10 w-10 scale-75 place-items-center rounded-full bg-background/70 text-foreground opacity-0 shadow-card backdrop-blur transition-all duration-300 ease-jelly hover:scale-100 hover:bg-background group-hover:scale-100 group-hover:opacity-100"
        >
          <Eye className="h-[18px] w-[18px]" />
        </button>

        <Link href={href} className="absolute inset-0 block">
          {images.map((src, i) => (
            <Image
              key={src + i}
              src={src}
              alt={i === 0 ? product.name : ""}
              aria-hidden={i !== 0}
              fill
              sizes="(max-width: 768px) 90vw, 30vw"
              className={cn(
                "rounded-t-[1.25rem] object-contain transition-all duration-500 ease-jelly group-hover:scale-[1.06]",
                i === 0 && "p-7 sm:p-9",
                i === active ? "opacity-100" : "opacity-0",
              )}
            />
          ))}
        </Link>

        {/* Choose options — появляется при наведении */}
        <Link
          href={href}
          className="absolute bottom-9 left-1/2 z-10 -translate-x-1/2 translate-y-2 whitespace-nowrap rounded-md bg-foreground/70 px-5 py-2.5 text-xs font-semibold text-background opacity-0 backdrop-blur transition-all duration-300 hover:bg-foreground group-hover:translate-y-0 group-hover:opacity-100"
        >
          Choose options
        </Link>

        {/* Точки-индикаторы */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
            {images.map((src, i) => (
              <button
                key={src + i}
                type="button"
                aria-label={`View image ${i + 1}`}
                onClick={() => setActive(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === active ? "w-4 bg-foreground/70" : "w-1.5 bg-foreground/25 hover:bg-foreground/40",
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Светло-серая полоса с разделителем: имя + цена */}
      <Link
        href={href}
        className="group/title block bg-muted/60 px-4 py-5 text-center transition-colors hover:bg-muted"
      >
        <h3 className="font-display text-[15px] font-semibold leading-snug text-foreground transition-colors group-hover/title:text-brand">
          {product.name}
        </h3>
        <p className="mt-1.5 text-sm text-foreground">{formatPrice(product.price)}</p>
      </Link>
    </motion.article>
  );
}

/** Секция ковриков: коллаж «Explore Our MousePad» + 3 товара. */
export function MousepadSection() {
  return (
    <section className="border-t border-border bg-background">
      {/* Коллаж + заголовок */}
      <div className="container py-16 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[0.75fr_1.55fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-display text-5xl font-extrabold leading-[1.03] tracking-tight text-[#3a1a6e] sm:text-6xl">
              Explore Our
              <br />
              <span className="relative inline-block">
                <span className="relative z-10">MousePad</span>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-1 -z-0 h-4 bg-gradient-to-r from-gold/70 via-gold/50 to-gold/20"
                />
              </span>
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              Built with a high-performance SlimFlex HR base, this mousepad stays
              firmly in place for ultimate stability during intense gameplay.
            </p>
          </motion.div>

          {/* Коллаж 2×2 (крупнее) */}
          <div className="grid grid-cols-2 gap-5 sm:gap-6">
            <div className="flex flex-col gap-5 pt-8 sm:gap-6">
              <CollageCard
                src="/images/mousepads/collage-qisha.svg"
                aspect="aspect-[4/3]"
                alt="QISHA mousepad"
                label="QISHA"
              />
              <CollageCard
                src="/images/mousepads/collage-chunhua.svg"
                aspect="aspect-[4/3]"
                alt="CHUNHUA mousepad"
                label="CHUNHUA"
                labelDark
                delay={0.1}
              />
            </div>
            <div className="flex flex-col gap-5 sm:gap-6">
              <CollageCard
                src="/images/mousepads/collage-camo.svg"
                aspect="aspect-[3/4]"
                alt="Mousepad texture"
                delay={0.05}
              />
              <CollageCard
                src="/images/mousepads/collage-floral.svg"
                aspect="aspect-[3/4]"
                alt="Floral mousepad"
                delay={0.15}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Товары-коврики: QISHA · MA-GIC · CHUNHUA */}
      <div className="container pb-16 sm:pb-24">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
          {PADS.map((product, i) => (
            <MousepadCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
