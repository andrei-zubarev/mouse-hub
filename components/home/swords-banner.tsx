"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { WaveGlassButton } from "@/components/ui/wave-glass-button";

/** Тёмный кинематографичный баннер коллаборации: контент внизу слева. */
export function SwordsBanner() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);

  return (
    <section
      ref={ref}
      className="relative h-[72vh] min-h-[480px] w-full overflow-hidden bg-black"
    >
      <motion.div style={{ scale }} className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/banners/feature-1.svg" alt="" className="h-full w-full object-cover" />
        {/* Затемнение для читаемости текста слева */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </motion.div>

      {/* Контент — внизу слева */}
      <div className="container relative flex h-full flex-col justify-end pb-14 sm:pb-20">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-4xl font-extrabold tracking-tight sm:text-6xl"
          style={{
            color: "transparent",
            WebkitTextStroke: "1.5px rgba(255,255,255,0.9)",
          }}
        >
          MOUSE HUB x The Swords
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
          className="mt-5 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base"
        >
          An exclusive collaboration with The Swords《JianLai》
          <br />
          Inspired by the timeless aesthetics of Wuxia.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
        >
          <div className="mt-8">
            <WaveGlassButton href="/products/sword" label="Learn More" variant="solid" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
