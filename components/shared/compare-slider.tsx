"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface CompareImage {
  src: string;
  alt: string;
  /** Мелкая подпись сверху (серая). */
  caption?: string;
  /** Крупная жирная подпись снизу. */
  label?: string;
}

/** Стартовая позиция intro-анимации (слева) и её длительность. */
const INTRO_FROM = 6;
const INTRO_DURATION = 1100;
/** Ждём, пока секция закончит свой reveal (0.8s), и только потом едем. */
const INTRO_DELAY = 550;

/** easeOutBack с мягким «перелётом» — привлекает внимание к слайдеру. */
function easeOutBack(t: number) {
  const c1 = 1.1;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

/**
 * Слайдер сравнения двух изображений с перетаскиваемым разделителем.
 * Перетаскивание мышью/тачем + управление стрелками с клавиатуры.
 * При первом появлении в вьюпорте разделитель выезжает слева в центр
 * (один раз), показывая, что слайдер интерактивный.
 */
export function CompareSlider({
  before,
  after,
  className,
  initial = 50,
}: {
  before: CompareImage;
  after: CompareImage;
  className?: string;
  initial?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(INTRO_FROM);
  const [dragging, setDragging] = useState(false);
  const introRaf = useRef<number | null>(null);
  const introPlayed = useRef(false);

  const cancelIntro = useCallback(() => {
    if (introRaf.current != null) {
      cancelAnimationFrame(introRaf.current);
      introRaf.current = null;
    }
    introPlayed.current = true;
  }, []);

  // Intro: разделитель плавно едет слева в центр при первом показе секции.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Уважаем prefers-reduced-motion: сразу ставим слайдер в исходную позицию.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      introPlayed.current = true;
      setPos(initial);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || introPlayed.current) return;
        introPlayed.current = true;
        io.disconnect();
        const start = performance.now() + INTRO_DELAY;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / INTRO_DURATION);
          if (t > 0) setPos(INTRO_FROM + (initial - INTRO_FROM) * easeOutBack(t));
          if (t < 1) introRaf.current = requestAnimationFrame(tick);
          else {
            introRaf.current = null;
            setPos(initial);
          }
        };
        introRaf.current = requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (introRaf.current != null) cancelAnimationFrame(introRaf.current);
    };
  }, [initial]);

  const setFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0]?.clientX : e.clientX;
      if (clientX != null) setFromClientX(clientX);
    };
    const stop = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("mouseup", stop);
    window.addEventListener("touchend", stop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", stop);
      window.removeEventListener("touchend", stop);
    };
  }, [dragging, setFromClientX]);

  return (
    <div className={className}>
      <div
        ref={containerRef}
        className={cn(
          "relative select-none overflow-hidden rounded-[2rem] border border-transparent bg-gradient-to-b from-muted to-muted/40",
        )}
        onMouseDown={(e) => {
          cancelIntro();
          setDragging(true);
          setFromClientX(e.clientX);
        }}
        onTouchStart={(e) => {
          cancelIntro();
          setDragging(true);
          const x = e.touches[0]?.clientX;
          if (x != null) setFromClientX(x);
        }}
      >
        {/* Нижний слой — «after» (правая половина) */}
        <div className="relative aspect-[16/11] sm:aspect-[2.9/1]">
          <Image
            src={after.src}
            alt={after.alt}
            fill
            sizes="100vw"
            priority={false}
            className="origin-center scale-[1.5] object-contain object-center p-0 sm:scale-[1.95]"
          />
        </div>

        {/* Верхний слой — «before» (обрезается по позиции разделителя) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <div className="relative h-full w-full">
            <Image
              src={before.src}
              alt={before.alt}
              fill
              sizes="100vw"
              className="origin-center scale-[1.5] object-contain object-center p-0 sm:scale-[1.95]"
            />
          </div>
        </div>

        {/* Разделитель + ручка — белые, полоски «III» фиолетовые.
            `left` НЕ анимируем через CSS: позиция должна кадр в кадр совпадать
            с clipPath картинки — иначе линия отстаёт от intro и от курсора. */}
        <div
          className={cn(
            "group/handle pointer-events-none absolute inset-y-0 z-10 w-px -translate-x-1/2 will-change-[left]",
            "bg-gradient-to-b from-white/0 via-white/90 to-white/0",
            "transition-[background,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            dragging
              ? "via-white shadow-[0_0_14px_rgba(255,255,255,0.7)]"
              : "via-white/90",
          )}
          style={{ left: `${pos}%` }}
        >
          <button
            type="button"
            aria-label="Drag to compare"
            aria-valuenow={Math.round(pos)}
            aria-valuemin={0}
            aria-valuemax={100}
            role="slider"
            tabIndex={0}
            onMouseDown={(e) => {
              e.stopPropagation();
              cancelIntro();
              setDragging(true);
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              cancelIntro();
              setDragging(true);
            }}
            onKeyDown={(e) => {
              cancelIntro();
              if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 4));
              if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 4));
            }}
            className={cn(
              "pointer-events-auto absolute left-1/2 top-1/2 grid h-11 w-7 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full bg-white text-brand shadow-card transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
              dragging
                ? "scale-110 shadow-[0_4px_20px_rgba(0,0,0,0.22)] ring-2 ring-white/60"
                : "hover:scale-105 hover:shadow-lg",
            )}
          >
            <span
              className={cn(
                "relative text-[13px] font-bold tracking-tight transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                dragging ? "scale-x-125" : "group-hover/handle:scale-x-110",
              )}
            >
              III
            </span>
          </button>
        </div>

        {/* Подписи внутри рамки: при перетаскивании плавно размываются и исчезают */}
        <div
          className={cn(
            "pointer-events-none absolute bottom-5 left-6 z-20 text-left transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:bottom-8 sm:left-10",
            dragging
              ? "translate-y-1 scale-95 opacity-0 blur-md"
              : "translate-y-0 scale-100 opacity-100 blur-0",
          )}
        >
          {before.caption && (
            <p className="text-xs text-muted-foreground sm:text-sm">
              {before.caption}
            </p>
          )}
          {before.label && (
            <p className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {before.label}
            </p>
          )}
        </div>
        <div
          className={cn(
            "pointer-events-none absolute bottom-5 right-6 z-20 text-right transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:bottom-8 sm:right-10",
            dragging
              ? "translate-y-1 scale-95 opacity-0 blur-md"
              : "translate-y-0 scale-100 opacity-100 blur-0",
          )}
        >
          {after.caption && (
            <p className="text-xs text-muted-foreground sm:text-sm">
              {after.caption}
            </p>
          )}
          {after.label && (
            <p className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {after.label}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
