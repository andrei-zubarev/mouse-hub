"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Variant = "solid" | "glass";

const EASE = "transform 600ms cubic-bezier(0.33, 0, 0.13, 1)";

/**
 * Кнопка с анимацией заливки. `.btn-fill` — большой эллипс (border-radius 50%,
 * 150%×200%); изогнутый край даёт «волну». Заливка всегда движется СНИЗУ ВВЕРХ:
 * при наведении поднимается снизу и заполняет кнопку; при уходе курсора
 * продолжает идти вверх и выходит сверху, после чего мгновенно возвращается вниз
 * к старту. Радиус углов 6px.
 *
 * variant="solid"  — Learn More: белый фон + тёмный текст; заливка тёмная,
 *   текст на наведении белеет.
 * variant="glass"  — More: liquid glass (blur + белая рамка) + белый текст;
 *   заливка белая, текст на наведении темнеет.
 */
export function WaveGlassButton({
  href,
  label,
  variant = "solid",
  target,
  rel,
  className,
}: {
  href: string;
  label: string;
  variant?: Variant;
  target?: string;
  rel?: string;
  className?: string;
}) {
  const glass = variant === "glass";

  // Позиция эллипса (в % от его высоты): "76%" — спрятан снизу (старт);
  // "0%" — заполняет кнопку; "-76%" — ушёл вверх.
  const [ty, setTy] = useState("76%");
  const [animated, setAnimated] = useState(true);
  const [filled, setFilled] = useState(false);

  const handleEnd = () => {
    // Ушёл вверх — мгновенно (без анимации) вернуть вниз к старту,
    // чтобы следующая заливка снова шла снизу вверх.
    if (ty === "-76%") {
      setAnimated(false);
      setTy("76%");
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setAnimated(true)),
      );
    }
  };

  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      onMouseEnter={() => {
        setAnimated(true);
        setTy("0%"); // поднимается снизу и заполняет
        setFilled(true);
      }}
      onMouseLeave={() => {
        setAnimated(true);
        setTy("-76%"); // продолжает вверх и выходит сверху
        setFilled(false);
      }}
      className={cn(
        "group relative inline-flex min-w-[192px] items-center justify-center overflow-hidden rounded-[6px]",
        "border-2 border-white font-bold leading-none transition-colors duration-500 ease-[cubic-bezier(0.3,1,0.3,1)]",
        glass
          ? "px-5 py-[15px] text-sm text-white backdrop-blur-md"
          : "bg-white px-[26px] py-[18px] text-[15px] text-ink",
        filled ? (glass ? "text-ink" : "text-white") : undefined,
        className,
      )}
    >
      {/* Эллиптическая заливка — «волна», поднимается снизу вверх */}
      <span
        aria-hidden
        onTransitionEnd={handleEnd}
        className={cn(
          "pointer-events-none absolute left-[-25%] top-[-50%] h-[200%] w-[150%] rounded-[50%]",
          glass ? "bg-white" : "bg-ink",
        )}
        style={{
          transform: `translateY(${ty})`,
          transition: animated ? EASE : "none",
        }}
      />
      <span className="relative z-10">{label}</span>
    </Link>
  );
}
