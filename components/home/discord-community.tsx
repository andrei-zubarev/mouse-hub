"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { DiscordIcon } from "@/components/icons";
import { SITE } from "@/lib/constants";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Широкий тёмный баннер «Join Our Discord Community».
 * Пропорции как в оригинале: почти во всю ширину контейнера, 2.66:1,
 * текстовый блок прижат к левому-нижнему углу. Кликается вся карточка.
 */
export function DiscordCommunity() {
  return (
    <section className="container py-8 sm:py-12">
      <Link
        href={SITE.discordUrl}
        aria-label="Join our Discord community"
        className="group block"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-[2rem] bg-ink sm:aspect-[2/1] lg:aspect-[2.66/1]"
        >
          {/* Брендовое свечение справа + мягкая подсветка снизу слева */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-[8%] top-1/2 aspect-square w-[48%] -translate-y-1/2 rounded-full bg-brand/25 blur-[110px] transition-all duration-700 ease-premium group-hover:bg-brand/35"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-[20%] -left-[6%] aspect-square w-[34%] rounded-full bg-brand/15 blur-[100px]"
          />
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-[0.05]" />

          {/* Глиф Discord как водяной знак — визуальный якорь правой половины */}
          <DiscordIcon
            aria-hidden
            className="pointer-events-none absolute right-[4%] top-1/2 h-auto w-[38%] -translate-y-1/2 text-white/[0.07] transition-transform duration-700 ease-premium group-hover:scale-[1.03]"
          />

          {/* Текстовый блок — прижат влево-вниз, как в оригинале */}
          <div className="relative flex flex-col pb-[9%] pl-[7%] pr-[7%] lg:pl-[9%]">
            <motion.span
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
              className="text-[clamp(0.6rem,0.68vw,0.85rem)] font-semibold uppercase tracking-[0.35em] text-gold"
            >
              {SITE.name}
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.16 }}
              className="mt-[0.6em] max-w-[13ch] font-display text-[clamp(2rem,4.1vw,4.6rem)] font-extrabold italic leading-[0.95] tracking-[-0.02em] text-white"
            >
              Join Our Discord Community
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: EASE, delay: 0.24 }}
              className="mt-[1.1em] max-w-[52ch] text-[clamp(0.78rem,0.82vw,1rem)] leading-relaxed text-white/80"
            >
              Get early access to product launches, exclusive giveaways, and connect
              directly with our team and fellow gamers. Be part of the {SITE.name} family!
            </motion.p>
          </div>
        </motion.div>
      </Link>
    </section>
  );
}
