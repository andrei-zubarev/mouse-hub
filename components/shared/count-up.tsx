"use client";

import { useEffect, useRef } from "react";
import { animate, useMotionValue } from "framer-motion";

interface CountUpProps {
  /** Конечное значение. */
  value: number;
  /** Форматирование промежуточных значений (по умолчанию — целое с разделителями). */
  format?: (v: number) => string;
  duration?: number;
  delay?: number;
  className?: string;
}

const defaultFormat = (v: number) => Math.round(v).toLocaleString("en-US");

/** Число, «пересчитывающееся» от 0 до value при монтировании. */
export function CountUp({
  value,
  format = defaultFormat,
  duration = 1.4,
  delay = 0,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);

  // format держим в ref, чтобы не перезапускать анимацию из-за новой ссылки на функцию.
  const formatRef = useRef(format);
  formatRef.current = format;

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = formatRef.current(v);
      },
    });
    return () => controls.stop();
  }, [motionValue, value, duration, delay]);

  return (
    <span ref={ref} className={className}>
      {format(0)}
    </span>
  );
}
