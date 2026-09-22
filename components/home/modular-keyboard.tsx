"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { KeyboardCard } from "@/components/product/keyboard-card";
import { KEYBOARD_PRODUCTS } from "@/lib/products";
import { WaveGlassButton } from "@/components/ui/wave-glass-button";

/** Тёмный баннер модульной клавиатуры + витрина клавиатур. */
export function ModularKeyboard() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);

  return (
    <section className="bg-background">
      {/* Баннер */}
      <div ref={ref} className="relative h-[72vh] min-h-[480px] w-full overflow-hidden bg-black">
        <motion.div style={{ scale }} className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/banners/hero-2.svg" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        </motion.div>

        {/* Контент по центру */}
        <div className="container relative flex h-full flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex max-w-3xl flex-col items-center"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold/80">
              HUAN63 HE Magnesium Alloy Keyboard
            </p>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.03] tracking-tight text-white sm:text-6xl">
              Modular by Design.
              <br />
              Built for Customization.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
              Watch how every detail is engineered for performance, durability,
              and effortless upgrades.
            </p>
            <div className="mt-8">
              <WaveGlassButton
                href="/products?category=keyboard"
                label="MORE"
                variant="glass"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Витрина клавиатур */}
      <div className="container py-16">
        <div className="mx-auto grid max-w-5xl gap-8 sm:gap-10 md:grid-cols-2">
          {KEYBOARD_PRODUCTS.map((product, i) => (
            <KeyboardCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
