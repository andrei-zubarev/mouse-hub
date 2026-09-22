"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/shared/reveal";
import { CompareSlider } from "@/components/shared/compare-slider";

/** «Find your perfect match» — слайдер сравнения двух стилей корпуса. */
export function PerfectMatch() {
  return (
    <section className="container py-16 sm:py-24">
      <Reveal className="flex flex-col gap-3">
        <span className="text-sm font-medium text-brand">
          Two side style options
        </span>
        <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Find your perfect match.
        </h2>
      </Reveal>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mt-12"
      >
        <CompareSlider
          before={{
            src: "/images/products/side-slits.svg",
            alt: "Side slits ultralight shell",
            caption: "Ultra lightweight",
            label: "Side Slits",
          }}
          after={{
            src: "/images/products/side-solid.svg",
            alt: "Solid sides shell",
            caption: "Sturdy. Clean.",
            label: "Solid Sides",
          }}
        />
      </motion.div>
    </section>
  );
}
