"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/** Базовый easing «премиум» — совпадает с transitionTimingFunction.premium в Tailwind. */
const EASE = [0.16, 1, 0.3, 1] as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Задержка появления, сек. */
  delay?: number;
  /** Смещение по Y на старте, px. */
  y?: number;
  /** Доля видимости для триггера. */
  amount?: number;
  once?: boolean;
}

/** Появление снизу-вверх при попадании в вьюпорт. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  amount = 0.3,
  once = true,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const staggerChild: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/** Контейнер для каскадного появления детей (используй RevealItem внутри). */
export function RevealGroup({
  children,
  className,
  amount = 0.2,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={staggerChild}>
      {children}
    </motion.div>
  );
}
