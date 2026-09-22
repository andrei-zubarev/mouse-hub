import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Объединяет классы Tailwind, корректно разрешая конфликты. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Форматирует цену в формате оригинала: «$145.00 USD». */
export function formatPrice(
  amount: number,
  opts: { withCurrency?: boolean } = {},
) {
  const { withCurrency = true } = opts;
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
  return withCurrency ? `${formatted} USD` : formatted;
}

/** Плавная прокрутка к секции по id (для якорей хедера). */
export function scrollToId(id: string) {
  if (typeof document === "undefined") return;
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}
