"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Категории-серии: горизонтальный скролл-ряд карточек.
 * Первая карточка «активная» — серая плашка охватывает и фото, и подпись;
 * у остальных плашка только вокруг фото, подпись — ниже на белом.
 * Фон подобран под цвет фото товара, чтобы изображение бесшовно сливалось.
 */
interface Series {
  title: string;
  count: number;
  subtitle: string;
  image: string;
  bg: string;
  href: string;
}

const SERIES: Series[] = [
  { title: "Beast G Series", count: 2, subtitle: "Solid, Microcrystalline Composite", image: "/images/collections/beast-g.svg", bg: "#f4f4f3", href: "/products?category=mouse" },
  { title: "HUAN", count: 1, subtitle: "Solid, Stainless Magnesium", image: "/images/collections/huan.svg", bg: "#f4f3f4", href: "/products/huan" },
  { title: "Beast X Series", count: 4, subtitle: "Magnesium Alloy, Symmetrical mouse", image: "/images/collections/beast-x.svg", bg: "#f3f0ef", href: "/products?category=mouse" },
  { title: "Ying", count: 2, subtitle: "Carbon Fiber / Magnesium Alloy, Symmetrical", image: "/images/collections/ying.svg", bg: "#f3f3f3", href: "/products?category=mouse" },
  { title: "Sword", count: 2, subtitle: "Ergo mouse, Magnesium alloy", image: "/images/collections/sword.svg", bg: "#f5f4f4", href: "/products/sword" },
  { title: "Strider", count: 1, subtitle: "Magnesium alloy, symmetrical", image: "/images/collections/strider.svg", bg: "#f4f3f2", href: "/products/strider" },
  { title: "He Keyboard", count: 2, subtitle: "The world's first forged carbon fiber HE keyboard", image: "/images/collections/keyboard.svg", bg: "#f3f2f3", href: "/products?category=keyboard" },
  { title: "MousePad", count: 5, subtitle: "Dive into the game with every sound", image: "/images/collections/mousepad.svg", bg: "#f4f3f4", href: "/products?category=mousepad" },
  { title: "HUAN IEM", count: 1, subtitle: "1DD + 8BA Hybrid IEM", image: "/images/collections/iem.svg", bg: "#f3f2f3", href: "/products?category=iem" },
  { title: "Skates", count: 12, subtitle: "Collection for the exceptional", image: "/images/collections/skates.svg", bg: "#f5f3f5", href: "/products" },
  { title: "Grip Tape", count: 8, subtitle: "Grip where you need it most", image: "/images/collections/grip-tape.svg", bg: "#f6f4f5", href: "/products" },
];

/** Лента серий: горизонтальный скролл с кнопками слева/справа. */
export function CollectionGrid() {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const update = useCallback(() => {
    const el = rowRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    update();
    const el = rowRef.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scroll = (dir: 1 | -1) => {
    const el = rowRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  const leftStop = canLeft ? "transparent 0, #000 3rem" : "#000 0";
  const rightStop = canRight ? "#000 calc(100% - 3rem), transparent 100%" : "#000 100%";
  const mask = `linear-gradient(to right, ${leftStop}, ${rightStop})`;

  return (
    <section className="group/carousel relative py-8 sm:py-12">
      <div className="container relative">
        <div
          ref={rowRef}
          style={{ WebkitMaskImage: mask, maskImage: mask }}
          className="no-scrollbar flex snap-x gap-5 overflow-x-auto pb-7 pt-4"
        >
          {SERIES.map((s, i) => (
            <SeriesCard key={s.title} series={s} index={i} />
          ))}
        </div>

        {/* Кнопки скролла — слева видна после прокрутки, справа — до конца. */}
        {canLeft && <CarouselButton side="left" onClick={() => scroll(-1)} />}
        {canRight && <CarouselButton side="right" onClick={() => scroll(1)} />}
      </div>
    </section>
  );
}

function CarouselButton({
  side,
  onClick,
}: {
  side: "left" | "right";
  onClick: () => void;
}) {
  const Icon = side === "left" ? ArrowLeft : ArrowRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Scroll left" : "Scroll right"}
      className={[
        "absolute top-[36%] z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full",
        "border border-border bg-background text-foreground shadow-card",
        "opacity-0 transition-all duration-300 ease-jelly hover:scale-105 hover:bg-muted",
        "group-hover/carousel:opacity-100 focus-visible:opacity-100",
        side === "left" ? "left-1 sm:left-3" : "right-1 sm:right-3",
      ].join(" ")}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}

function SeriesCard({ series, index }: { series: Series; index: number }) {
  const featured = index === 0;

  const image = (
    <div
      className={cn("relative aspect-square w-full", !featured && "rounded-[1.75rem]")}
      style={!featured ? { backgroundColor: series.bg } : undefined}
    >
      <Image
        src={series.image}
        alt={series.title}
        fill
        sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 24vw"
        className="object-contain p-5 transition-transform duration-700 ease-premium group-hover:scale-[1.06]"
      />
    </div>
  );

  const label = (
    <div className="px-2 text-center">
      <h3 className="font-display text-lg font-extrabold tracking-tight text-foreground">
        {series.title}
        <sup className="ml-0.5 align-super text-[11px] font-bold text-brand">
          {series.count}
        </sup>
      </h3>
      <p className="mx-auto mt-1 line-clamp-2 min-h-[2.4em] max-w-[280px] text-xs font-medium text-muted-foreground">
        {series.subtitle}
      </p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: "spring", stiffness: 180, damping: 22, mass: 0.9, delay: (index % 6) * 0.05 }}
      className="w-[85%] shrink-0 snap-start sm:w-[45%] lg:w-[24%]"
    >
      <Link href={series.href} className="group block h-full">
        {featured ? (
          // Активная карточка: серая плашка охватывает фото + подпись.
          <div
            className="flex h-full flex-col rounded-[1.75rem] pb-5 transition-transform duration-500 ease-jelly hover:-translate-y-1.5"
            style={{ backgroundColor: series.bg }}
          >
            {image}
            <div className="mt-1">{label}</div>
          </div>
        ) : (
          // Обычная карточка: плашка только вокруг фото, подпись ниже на белом.
          <div className="flex h-full flex-col transition-transform duration-500 ease-jelly hover:-translate-y-1.5">
            {image}
            <div className="mt-4">{label}</div>
          </div>
        )}
      </Link>
    </motion.div>
  );
}
