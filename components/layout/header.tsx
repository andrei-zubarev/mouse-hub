"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, Search, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, SITE } from "@/lib/constants";
import { MouseHubLogo } from "@/components/icons";
import { Magnetic } from "@/components/shared/magnetic";
import { MegaMenuContent } from "@/components/layout/mega-menu";
import { useScrollPosition } from "@/hooks/use-scroll-position";
import { useUIStore } from "@/store/ui-store";
import { useAuthStore } from "@/store/auth-store";
import { useCart } from "@/hooks/use-cart";

/** Пункты с полноширинным мега-меню. */
const MEGA_LABELS = new Set([
  "Product",
  "Mouse",
  "Keyboard",
  "MousePad",
  "Support",
  "Software",
]);

// Кривые формы шапки:
//  · раскрытие/сдвиг — easeOutCirc,  · прозрачность — easeOutExpo.
const EASE_CIRC = [0.075, 0.82, 0.165, 1] as const;

// Длительность reveal по высоте. Открытие «с нуля» — чуть медленнее, чтобы
// ощущалось «дорого». Переключение между пунктами — короткий морф высоты:
// панель НЕ схлопывается и не ждёт, просто дотягивается до новой высоты.
const OPEN_DURATION = 0.62;
const SWITCH_DURATION = 0.34;
const CLOSE_DURATION = 0.4;

/** useLayoutEffect без SSR-варнинга — нужен, чтобы мерить до отрисовки. */
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Панель раскрывается по высоте (0 → h) сверху вниз — чистый reveal
 * на белом фоне, без просветов. Внутренние плитки вылетают справа со
 * стаггером.
 */
const panelContentVariants = {
  hidden: {},
  // custom = true при открытии «с нуля»: плитки стартуют чуть позже и с
  // большим интервалом — богатый, «дорогой» каскад под ритм reveal по
  // высоте. При переключении между пунктами задержка почти нулевая
  // (плитки трогаются сразу) — поэтому «кд» между вкладками не ощущается,
  // хотя сам полёт каждой плитки остаётся длинным и плавным.
  show: (openingFromClosed: boolean) => ({
    transition: {
      staggerChildren: openingFromClosed ? 0.085 : 0.045,
      delayChildren: openingFromClosed ? 0.16 : 0.05,
    },
  }),
};

/** Главный хедер: лого · навигация с мега-меню · поиск/аккаунт/корзина. */
export function Header() {
  const { scrolled } = useScrollPosition(8);
  const openMobileMenu = useUIStore((s) => s.openMobileMenu);
  const openSearch = useUIStore((s) => s.openSearch);
  const openCart = useUIStore((s) => s.openCart);
  const openAccount = useUIStore((s) => s.openAccount);
  const { totalItems, hasHydrated } = useCart();
  const user = useAuthStore((s) => s.user);
  const authHydrated = useAuthStore((s) => s.hasHydrated);

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuOpen = activeMenu !== null;

  // Какое меню сейчас смонтировано. Обновляем синхронно во время рендера,
  // чтобы новый контент появился в том же кадре, что и клик (без «кд»).
  // Остаётся в DOM на время схлопывания и размонтируется по его окончании.
  const [rendered, setRendered] = useState<string | null>(null);
  if (activeMenu !== null && activeMenu !== rendered) setRendered(activeMenu);

  // Высота контента: анимируем height в пикселях, а не в "auto". Благодаря
  // этому переключение пунктов — один непрерывный морф высоты, без ожидания
  // exit-анимации предыдущей панели (раньше здесь был AnimatePresence
  // mode="wait": сначала полное схлопывание, только потом раскрытие).
  const measureRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  useIsoLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const sync = () => setContentHeight(el.offsetHeight);
    sync();
    // Догоняем изменения от загрузки шрифтов/картинок.
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [rendered]);

  // Отличаем открытие «с нуля» от переключения между пунктами: если прошлый
  // рендер панель была закрыта — это открытие (медленно), иначе переход (быстро).
  const wasOpenRef = useRef(false);
  const openingFromClosed = menuOpen && !wasOpenRef.current;
  useEffect(() => {
    wasOpenRef.current = menuOpen;
  }, [menuOpen]);

  // Закрытие панели по Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveMenu(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);


  return (
    <header
      className={cn(
        // Отступ постоянный (-mt-7), чтобы хедер не «прыгал» при скролле —
        // плавно меняются только скругление, тень и прозрачность уголков.
        "sticky top-0 z-40 -mt-7 w-full bg-background transition-[border-radius,box-shadow] duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
        // Сверху страницы белый хедер наезжает на фиолетовый announcement
        // скруглёнными верхними углами; при скролле углы плавно выпрямляются,
        // а скругление переходит на контент ниже (через «уголки-маски»).
        scrolled ? "rounded-none" : "rounded-t-3xl rounded-b-none",
        scrolled && !menuOpen ? "shadow-[0_10px_34px_rgba(0,0,0,0.08)]" : "shadow-none",
      )}
    >
      <div className="container flex h-20 items-center justify-between gap-4">
        {/* Лево: мобильное меню + лого */}
        <div className="flex items-center gap-2 lg:w-[180px]">
          <button
            type="button"
            onClick={openMobileMenu}
            aria-label="Open menu"
            className="grid h-10 w-10 place-items-center rounded-full text-foreground transition hover:bg-muted lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/" className="flex items-center gap-2" onClick={() => setActiveMenu(null)}>
            <MouseHubLogo className="h-7 w-7 text-foreground" />
            <span className="font-display text-lg font-extrabold tracking-tight text-foreground">
              {SITE.name}
            </span>
          </Link>
        </div>

        {/* Центр: навигация (десктоп) */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const hasMega = MEGA_LABELS.has(item.label);
            const isActive = activeMenu === item.label;

            // Текст пункта одинаков для кнопки и ссылки — без смены цвета.
            const inner = (
              <span className="flex items-center gap-1.5">
                {item.label}
                {hasMega && (
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-foreground/50 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      isActive && "rotate-180",
                    )}
                  />
                )}
              </span>
            );

            const baseCls =
              "relative flex items-center rounded-full px-3.5 py-2 text-[15px] font-medium text-foreground";

            // Точка-индикатор под текстом (как в оригинале: scale 0→1
            // при наведении и в раскрытом состоянии, currentColor).
            const dot = hasMega ? (
              <span
                aria-hidden
                className={cn(
                  "pointer-events-none absolute -bottom-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-current transition-transform duration-300 ease-[cubic-bezier(.7,0,.3,1)]",
                  isActive ? "scale-100" : "scale-0 group-hover:scale-100",
                )}
              />
            ) : null;

            return (
              <div key={item.label} className="group relative">
                {/* Пункт «плывёт» за курсором на мягкой пружине */}
                <Magnetic strength={0.25}>
                  {hasMega ? (
                    <button
                      type="button"
                      aria-expanded={isActive}
                      onClick={() =>
                        setActiveMenu(isActive ? null : item.label)
                      }
                      className={baseCls}
                    >
                      {inner}
                      {dot}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setActiveMenu(null)}
                      className={baseCls}
                    >
                      {inner}
                    </Link>
                  )}
                </Magnetic>
              </div>
            );
          })}
        </nav>

        {/* Право: утилиты */}
        <div className="flex items-center justify-end gap-1 lg:w-[180px]">
          <button
            type="button"
            onClick={openSearch}
            aria-label="Search"
            className="grid h-10 w-10 place-items-center rounded-full text-foreground transition hover:bg-muted"
          >
            <Search className="h-[18px] w-[18px]" />
          </button>
          {authHydrated && user ? (
            <Link
              href="/account"
              aria-label="Account"
              onClick={() => setActiveMenu(null)}
              className="hidden h-10 w-10 place-items-center rounded-full transition hover:opacity-85 sm:grid"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-xs font-bold text-white shadow-sm">
                {user.name.trim()[0]?.toUpperCase() ?? "W"}
              </span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={openAccount}
              aria-label="Account"
              className="hidden h-10 w-10 place-items-center rounded-full text-foreground transition hover:bg-muted sm:grid"
            >
              <User className="h-[18px] w-[18px]" />
            </button>
          )}
          <button
            type="button"
            onClick={openCart}
            aria-label="Cart"
            className="relative grid h-10 w-10 place-items-center rounded-full text-foreground transition hover:bg-muted"
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            <AnimatePresence>
              {hasHydrated && totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Уголки-маски (векторные SVG — идеально сглажены): при скролле
          скругляют верхние углы контента под хедером. Плавный fade по opacity. */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className={cn(
          "pointer-events-none absolute left-0 top-full h-7 w-7 transition-[opacity,transform] duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
          scrolled && !menuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0",
        )}
      >
        <path d="M0 0 H100 A100 100 0 0 0 0 100 Z" fill="hsl(var(--background))" />
      </svg>
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className={cn(
          "pointer-events-none absolute right-0 top-full h-7 w-7 transition-[opacity,transform] duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
          scrolled && !menuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0",
        )}
      >
        <path d="M100 0 H0 A100 100 0 0 1 100 100 Z" fill="hsl(var(--background))" />
      </svg>

      {/* Затемнение страницы — клик вне панели закрывает меню.
          Начинается СТРОГО ниже хедера (top-full), чтобы не затемнять
          и не «перекрашивать» верхнюю панель. */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mega-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.6, 0, 0.4, 1] }}
            onClick={() => setActiveMenu(null)}
            className="absolute left-0 right-0 top-full -z-10 hidden h-screen bg-foreground/[0.04] lg:block"
          />
        )}
      </AnimatePresence>

      {/* Полотно панели: белый фон + скруглённый низ + тень. Один и тот же
          элемент живёт всё время — при переключении пунктов он лишь
          дотягивает height до новой величины, а контент меняется сразу. */}
      <div className="absolute left-0 right-0 top-full hidden lg:block">
        <motion.div
          initial={false}
          animate={{ height: menuOpen ? contentHeight : 0 }}
          transition={{
            duration: menuOpen
              ? openingFromClosed
                ? OPEN_DURATION
                : SWITCH_DURATION
              : CLOSE_DURATION,
            ease: EASE_CIRC,
          }}
          onAnimationComplete={() => {
            if (!menuOpen) setRendered(null);
          }}
          className={cn(
            "overflow-hidden rounded-b-3xl bg-background transition-shadow duration-500",
            menuOpen
              ? "shadow-[0_28px_50px_rgba(0,0,0,0.10)]"
              : "pointer-events-none shadow-none",
          )}
        >
          <div ref={measureRef}>
            {rendered && (
              <motion.div
                key={rendered}
                variants={panelContentVariants}
                custom={openingFromClosed}
                initial="hidden"
                animate="show"
                aria-hidden={!menuOpen}
                className="container py-14 lg:py-16"
              >
                <MegaMenuContent
                  label={rendered}
                  onNavigate={() => setActiveMenu(null)}
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </header>
  );
}
