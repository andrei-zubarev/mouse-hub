import type { Config } from "tailwindcss";

/**
 * Дизайн-система MOUSE HUB.
 * Палитра вынесена в CSS-переменные (app/globals.css) и пробрасывается сюда
 * через hsl(var(--token)) — это даёт единый источник правды по цветам.
 */
const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        // Тёмные секции (Swords, Modular, Discord, футер)
        ink: {
          DEFAULT: "hsl(var(--ink))",
          foreground: "hsl(var(--ink-foreground))",
        },
        // Брендовый фиолетовый (FEI REN ZAI, магниевая мышь, announcement-бар)
        brand: {
          DEFAULT: "hsl(var(--brand))",
          foreground: "hsl(var(--brand-foreground))",
          dark: "hsl(var(--brand-dark))",
        },
        // Золото/оранж — акцентный градиент «Ultra-light speed…»
        gold: {
          DEFAULT: "hsl(var(--gold))",
          foreground: "hsl(var(--gold-foreground))",
        },
        // Цвет цен на карточках
        price: "hsl(var(--price))",
      },
      fontFamily: {
        // body
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        // заголовки/дисплейный текст
        display: ["var(--font-poppins)", "var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)",
        "card-hover": "0 8px 16px rgba(0,0,0,0.06), 0 24px 48px rgba(0,0,0,0.12)",
        glow: "0 0 60px -15px hsl(var(--brand) / 0.6)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        // Плавное покачивание плитки при hover
        sway: {
          "0%, 100%": { transform: "rotate(0deg) scale(1)" },
          "30%": { transform: "rotate(-1.2deg) scale(1.02)" },
          "70%": { transform: "rotate(1.2deg) scale(1.02)" },
        },
        // Иконка «выходит в дверь» вправо и возвращается слева
        "door-exit": {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "45%": { transform: "translateX(14px)", opacity: "0" },
          "50%": { transform: "translateX(-14px)", opacity: "0" },
          "80%, 100%": { transform: "translateX(0)", opacity: "1" },
        },
        // Мигающий курсор в печатающейся подсказке поиска
        caret: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both",
        marquee: "marquee var(--marquee-duration,30s) linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        // Блик по полоске прогресса (стартовая позиция задаётся -translate-x-full)
        shimmer: "shimmer 2.4s ease-in-out infinite",
        // Медленное вращение градиентного кольца аватара
        "spin-slow": "spin 4s linear infinite",
        "door-exit": "door-exit 1.1s ease-in-out infinite",
        sway: "sway 1.8s ease-in-out infinite",
        caret: "caret 1.1s steps(1) infinite",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.16, 1, 0.3, 1)",
        jelly: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
