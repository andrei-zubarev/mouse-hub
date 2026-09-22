"use client";

import { useEffect, useState } from "react";

/**
 * Отдаёт текущий scrollY и флаг `scrolled` (прокрутили ли дальше порога).
 * Используется хедером для смены фона/тени при скролле.
 */
export function useScrollPosition(threshold = 24) {
  const [scrollY, setScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrollY(y);
      setScrolled(y > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return { scrollY, scrolled };
}
