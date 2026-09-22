"use client";

import { useEffect } from "react";

/** Блокирует прокрутку body, пока открыт оверлей (дроуэр/модалка/меню). */
export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [locked]);
}
