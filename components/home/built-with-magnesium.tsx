"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MAGNESIUM_FEATURES } from "@/lib/constants";

/** Секция «Built with Magnesium»: коллаж слева, преимущества справа. */
export function BuiltWithMagnesium() {
  return (
    <section className="container py-16 sm:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Визуал-коллаж */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-[540px]"
        >
          {/* Фиолетовое фото — повёрнутая карточка */}
          <div className="relative aspect-[4/5] rotate-[4deg] overflow-hidden rounded-[2rem] shadow-card-hover">
            <Image
              src="/images/series/mag-purple.svg"
              alt="Purple magnesium mouse on mousepad"
              fill
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover"
            />
          </div>

          {/* Золотая мышь на белой карточке — спереди слева, плавает.
              Наклон задаём через style motion-значением: Framer пишет inline
              transform и перебил бы Tailwind-класс -rotate-[…]. */}
          <motion.div
            style={{ rotate: -12 }}
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-8 top-[30%] w-[54%] overflow-hidden rounded-[1.4rem] bg-white shadow-card-hover sm:-left-16"
          >
            <div className="relative aspect-square">
              <Image
                src="/images/series/mag-gold.svg"
                alt="Gold ornate magnesium mouse"
                fill
                sizes="260px"
                className="object-contain p-2"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Контент */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-3xl font-extrabold tracking-tight text-[#3a1a6e] sm:text-5xl"
          >
            Built with Magnesium
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-gold-gradient"
          >
            Ultra-light speed. Solid control. Premium feel.
          </motion.p>

          <div className="mt-8 space-y-6">
            {MAGNESIUM_FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.08 }}
              >
                <h3 className="font-display text-base font-bold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
