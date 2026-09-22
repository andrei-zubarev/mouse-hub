import { Inter, Sora } from "next/font/google";

/**
 * Шрифты сайта через next/font/google (само-хостинг, без layout shift).
 * - Inter → body-текст, цены, мелкий UI                                (--font-inter)
 * - Sora  → заголовки, дисплейный текст (приятный современный гротеск) (--font-poppins)
 * CSS-переменные подключаются в tailwind.config.ts (fontFamily.sans / .display).
 */
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const poppins = Sora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800"],
});
