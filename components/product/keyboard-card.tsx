"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { SPEC_ICONS } from "@/components/icons";
import { ProductBadgePill } from "@/components/ui/badge";
import { useUIStore } from "@/store/ui-store";
import type { Product, SpecIcon } from "@/types";

const FOOTER_SPEC_ICONS: SpecIcon[] = ["material", "connection", "layout"];

/** Карточка клавиатуры (Image #36): фото на белом сверху, серая карточка
 *  с именем/ценой и 3 спеками (Material/Connection/Layout) снизу. */
export function KeyboardCard({ product, index = 0 }: { product: Product; index?: number }) {
  const openQuickView = useUIStore((s) => s.openQuickView);
  const [active, setActive] = useState(0);
  const mediaRef = useRef<HTMLDivElement>(null);
  const images = product.images;

  function handleMove(e: React.MouseEvent) {
    const el = mediaRef.current;
    if (!el || images.length < 2) return;
    const rect = el.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const idx = Math.min(images.length - 1, Math.max(0, Math.floor(ratio * images.length)));
    if (idx !== active) setActive(idx);
  }

  const picked = FOOTER_SPEC_ICONS.map((ic) => product.specs.find((s) => s.icon === ic)).filter(Boolean);
  const footerSpecs = (picked.length >= 3 ? picked : product.specs).slice(0, 3) as Product["specs"];
  const href = `/products/${product.slug}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: "spring", stiffness: 170, damping: 22, mass: 0.9, delay: index * 0.1 }}
      className="group flex flex-col"
    >
      {/* Фото на белом */}
      <div
        ref={mediaRef}
        onMouseMove={handleMove}
        onMouseLeave={() => setActive(0)}
        className="relative aspect-[16/9] w-full"
      >
        {product.badge && (
          <div className="absolute left-1/2 top-2 z-10 -translate-x-1/2">
            <ProductBadgePill label={product.badge} />
          </div>
        )}

        <Link href={href} className="absolute inset-0 block">
          {images.map((src, i) => (
            <Image
              key={src + i}
              src={src}
              alt={i === 0 ? product.name : ""}
              aria-hidden={i !== 0}
              fill
              sizes="(max-width: 768px) 90vw, 45vw"
              className={cn(
                "object-contain p-6 transition-all duration-500 ease-jelly sm:p-8",
                i === active ? "scale-100 opacity-100" : "scale-95 opacity-0",
              )}
            />
          ))}
        </Link>

        <button
          type="button"
          onClick={() => openQuickView(product)}
          aria-label="Quick view"
          className="absolute right-3 top-3 z-10 grid h-10 w-10 scale-75 place-items-center rounded-full bg-background/70 text-foreground opacity-0 shadow-card backdrop-blur-md transition-all duration-300 ease-jelly hover:scale-100 hover:bg-background group-hover:scale-100 group-hover:opacity-100"
        >
          <Eye className="h-[18px] w-[18px]" />
        </button>

        {images.length > 1 && (
          <div className="absolute bottom-1 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
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

      {/* Инфо-карточка */}
      <div className="mt-4 rounded-2xl bg-muted/50 px-6 pb-5 pt-5">
        <Link href={href} className="group/title block text-center">
          <h3 className="font-display text-lg font-bold tracking-tight text-foreground transition-colors group-hover/title:text-brand">
            {product.name}
          </h3>
          <p className="mt-1 text-sm font-semibold text-[#8a6d2f]">
            {product.fromPrice && (
              <span className="mr-1 text-xs font-normal text-muted-foreground">From</span>
            )}
            {formatPrice(product.price)}
          </p>
        </Link>

        <div className="mt-5 grid grid-cols-3 divide-x divide-border border-t border-border pt-4">
          {footerSpecs.map((spec) => {
            const Icon = SPEC_ICONS[spec.icon];
            return (
              <div key={spec.label} className="flex items-center justify-center gap-2 px-1">
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0 leading-tight">
                  <p className="truncate text-[11px] font-semibold text-[#8a6d2f]">{spec.label}</p>
                  <p className="truncate text-[10px] text-muted-foreground">{spec.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.article>
  );
}
