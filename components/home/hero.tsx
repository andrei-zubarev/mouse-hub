"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Slide {
  image: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: { label: string; href: string };
}

const SLIDES: Slide[] = [
  {
    image: "/images/banners/hero-1.svg",
    eyebrow: "Limited Edition",
    title: "FEI REN ZAI",
    subtitle: "A collector's drop fusing wuxia artistry with featherweight magnesium engineering.",
    cta: { label: "Explore the drop", href: "/products/sword" },
  },
  {
    image: "/images/banners/feature-2.svg",
    eyebrow: "Magnesium Series",
    title: "YING · Carbon Edge",
    subtitle: "Carbon-fiber and magnesium-alloy precision, tuned for the highest level of play.",
    cta: { label: "Discover YING", href: "/products?category=mouse" },
  },
];

const AUTOPLAY_MS = 6500;

/** Hero-карусель с фоновым видео, кроссфейдом и авто-прокруткой. */
export function Hero() {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => setIndex((i) => (i + 1) % SLIDES.length), []);
  const prev = useCallback(() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    const id = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [next, index]);

  const slide = SLIDES[index];

  return (
    <section className="relative h-[64vh] min-h-[440px] w-full overflow-hidden bg-ink sm:h-[78vh]">
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.3, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={slide.image}
            src={slide.image}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Текстовый блок */}
      <div className="container relative flex h-full flex-col justify-end pb-16 sm:pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, ease: [0.3, 1, 0.3, 1] }}
            className="max-w-xl"
          >
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
              {slide.eyebrow}
            </span>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl">
              {slide.title}
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
              {slide.subtitle}
            </p>
            <Link
              href={slide.cta.href}
              className="group mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:gap-3 hover:bg-white/90"
            >
              {slide.cta.label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Навигация */}
        <div className="absolute bottom-16 right-4 flex items-center gap-3 sm:bottom-20 sm:right-8">
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/30 text-white transition hover:bg-white hover:text-ink"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full bg-white/40 transition-all duration-500",
                  i === index ? "w-8 bg-white" : "w-1.5 hover:bg-white/70",
                )}
              />
            ))}
          </div>
          <button
            onClick={next}
            aria-label="Next slide"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/30 text-white transition hover:bg-white hover:text-ink"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
