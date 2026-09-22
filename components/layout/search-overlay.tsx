"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Frown, X } from "lucide-react";
import { PRODUCTS } from "@/lib/products";
import { useUIStore } from "@/store/ui-store";
import { useLockBodyScroll } from "@/hooks/use-lock-body-scroll";
import { cn, formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

/** Мягкий «дорогой» ease — единый для всех движений дроуэра. */
const EASE = [0.22, 1, 0.36, 1] as const;

/** Быстрые ссылки-товары — рекомендации в шапке поиска. */
const QUICK_SLUGS = [
  "beast-miao",
  "strider",
  "sword",
  "huan",
  "beast-x-mini-pro",
  "beast-x-pro",
  "beast-x-max",
];

/** Сгруппированные рекомендации — как «Mousepad» / «Keyboard» на оригинале. */
const GROUPS: { heading: string; slugs: string[] }[] = [
  { heading: "Mousepad", slugs: ["qisha-mousepad", "magic-mousepad", "chunhua-mousepad"] },
  { heading: "Keyboard", slugs: ["huan63-he-keyboard", "ying75-he-keyboard"] },
];

/** Слова для «печатающегося» плейсхолдера в пустом поле. */
const TYPED_WORDS = ["Beast X Pro", "Beast Miao", "QISHA", "Sword", "HUAN63", "Strider"];

function bySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

/** Печатающаяся подсказка «Search for …» с миганием курсора. */
function useTypewriter(words: string[], active: boolean) {
  const [text, setText] = useState("");
  useEffect(() => {
    if (!active) {
      setText("");
      return;
    }
    let word = 0;
    let char = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const current = words[word];
      if (!deleting) {
        char += 1;
        setText(current.slice(0, char));
        if (char === current.length) {
          deleting = true;
          timer = setTimeout(tick, 1500);
          return;
        }
        timer = setTimeout(tick, 95);
      } else {
        char -= 1;
        setText(current.slice(0, char));
        if (char === 0) {
          deleting = false;
          word = (word + 1) % words.length;
          timer = setTimeout(tick, 320);
          return;
        }
        timer = setTimeout(tick, 45);
      }
    };

    timer = setTimeout(tick, 450);
    return () => clearTimeout(timer);
  }, [active, words]);

  return text;
}

/**
 * Правый дроуэр поиска: заголовок «Search», поле «Search for …»
 * с печатающейся подсказкой, рекомендованные товары-ссылки с группами
 * «Mousepad» / «Keyboard» и живые предиктивные результаты при вводе.
 */
export function SearchOverlay() {
  const router = useRouter();
  const open = useUIStore((s) => s.searchOpen);
  const close = useUIStore((s) => s.closeSearch);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  useLockBodyScroll(open);

  // Сброс состояния после закрытия (после exit-анимации).
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      setQuery("");
      setActive(0);
    }, 400);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => setActive(0), [query]);

  const typed = useTypewriter(TYPED_WORDS, open && query.trim() === "");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.category.includes(q),
    ).slice(0, 8);
  }, [query]);

  const quick = QUICK_SLUGS.map(bySlug).filter(Boolean) as Product[];

  function openProduct(slug: string) {
    close();
    router.push(`/products/${slug}`);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      close();
      return;
    }
    if (results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      openProduct(results[active].slug);
    }
  }

  const hasQuery = query.trim() !== "";

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Затемнение фона */}
          <motion.div
            className="fixed inset-0 z-[80] bg-black/45 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5, ease: EASE } }}
            transition={{ duration: 0.7, ease: EASE }}
            onClick={close}
          />

          {/* Панель — правый дроуэр, как корзина */}
          <motion.aside
            role="dialog"
            aria-label="Search"
            className="fixed inset-y-0 right-0 z-[81] flex w-full max-w-xl transform-gpu flex-col overflow-hidden rounded-l-[28px] border-l border-white/60 bg-background shadow-[-50px_0_140px_-25px_rgba(0,0,0,0.5)] will-change-transform"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%", transition: { duration: 0.6, ease: [0.5, 0, 0.75, 0] } }}
            transition={{ duration: 0.92, ease: EASE }}
          >
            <motion.div
              className="flex min-h-0 flex-1 flex-col"
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.95, ease: EASE, delay: 0.12 }}
            >
              {/* Шапка: заголовок + закрыть */}
              <div className="flex items-center justify-between gap-4 px-6 pt-6 sm:px-8">
                <h2 className="font-display text-2xl font-bold tracking-tight sm:text-[26px]">
                  Search
                </h2>
                <button
                  onClick={close}
                  aria-label="Close search"
                  className="group grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border transition-colors duration-300 hover:bg-muted"
                >
                  <X className="h-5 w-5 transition-transform duration-500 ease-premium group-hover:rotate-90" />
                </button>
              </div>

              {/* Поле поиска — серый скруглённый бокс */}
              <div className="px-6 pt-6 sm:px-8">
                <div className="relative flex items-center gap-3 rounded-xl bg-muted px-5 py-4">
                  <div className="relative flex-1">
                    <input
                      autoFocus
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={onKeyDown}
                      aria-label="Search"
                      className="w-full bg-transparent text-base font-medium leading-none text-foreground outline-none sm:text-lg"
                    />
                    {/* Печатающаяся подсказка поверх пустого поля */}
                    {!hasQuery && (
                      <span className="pointer-events-none absolute inset-0 flex items-center text-base font-medium leading-none text-muted-foreground sm:text-lg">
                        Search for&nbsp;
                        <span className="text-foreground/60">{typed}</span>
                        <span className="ml-0.5 inline-block h-[1.1em] w-px animate-caret bg-foreground/50" />
                      </span>
                    )}
                  </div>
                  <AnimatePresence>
                    {hasQuery && (
                      <motion.button
                        type="button"
                        onClick={() => setQuery("")}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: EASE }}
                        className="shrink-0 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                      >
                        Clear
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Контент */}
              <div className="min-h-0 flex-1 overflow-y-auto px-6 py-8 sm:px-8">
                <AnimatePresence mode="wait" initial={false}>
                  {!hasQuery ? (
                    <motion.div
                      key="recommendations"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="grid gap-9"
                    >
                      {/* Быстрые ссылки-товары */}
                      <ul className="grid gap-4">
                        {quick.map((p, i) => (
                          <RecItem key={p.id} href={`/products/${p.slug}`} onClick={close} index={i}>
                            {p.name.replace(/^MOUSE HUB\s+/, "").replace(/\s+Magnesium.*$/, "")}
                          </RecItem>
                        ))}
                      </ul>

                      {/* Группы: Mousepad / Keyboard */}
                      {GROUPS.map((g, gi) => {
                        const items = g.slugs.map(bySlug).filter(Boolean) as Product[];
                        if (items.length === 0) return null;
                        return (
                          <div key={g.heading} className="grid gap-4">
                            <p className="text-xs font-semibold uppercase leading-tight tracking-widest text-muted-foreground">
                              {g.heading}
                            </p>
                            <ul className="grid gap-2.5">
                              {items.map((p, i) => (
                                <RecItem
                                  key={p.id}
                                  href={`/products/${p.slug}`}
                                  onClick={close}
                                  index={quick.length + gi * 3 + i}
                                >
                                  {p.name
                                    .replace(/^MOUSE HUB\s+/, "")
                                    .replace(/\s+Gaming Mouse Pad$/, "")
                                    .replace(/\s+Mousepad$/, "")
                                    .replace(/\s+Keyboard$/, " Keyboard")}
                                </RecItem>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </motion.div>
                  ) : results.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="flex h-full flex-col items-center justify-center px-6 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.08, type: "spring", stiffness: 260, damping: 20 }}
                      >
                        <Frown className="h-14 w-14 text-foreground" strokeWidth={1.5} />
                      </motion.div>
                      <p className="mt-7 font-display text-[26px] font-bold leading-tight tracking-tight sm:text-3xl">
                        No results found for
                        <br />
                        &ldquo;{query}&rdquo;.
                      </p>
                      <p className="mt-4 max-w-[280px] text-sm leading-relaxed text-muted-foreground">
                        Check the spelling or use a different word or phrase.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.ul
                      key="results"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="flex flex-col divide-y divide-border/70"
                      role="listbox"
                    >
                      {results.map((p, i) => (
                        <li key={p.id}>
                          <Link
                            href={`/products/${p.slug}`}
                            onClick={close}
                            onMouseEnter={() => setActive(i)}
                            role="option"
                            aria-selected={i === active}
                            className={cn(
                              "group flex items-center gap-4 rounded-xl px-2 py-4 transition-colors",
                              i === active ? "bg-muted/70" : "hover:bg-muted/40",
                            )}
                          >
                            <span
                              className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted"
                              style={p.tint ? { backgroundColor: p.tint } : undefined}
                            >
                              <Image
                                src={p.images[0]}
                                alt={p.name}
                                fill
                                sizes="56px"
                                className="object-contain p-1.5 transition-transform duration-500 ease-premium group-hover:scale-105"
                              />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-semibold text-foreground">
                                {p.name}
                              </span>
                              <span className="block truncate text-xs text-muted-foreground">
                                {p.tagline}
                              </span>
                            </span>
                            <span className="shrink-0 text-sm font-bold text-foreground">
                              {formatPrice(p.price)}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/** Рекомендованная ссылка с «раскрывающимся» подчёркиванием (reversed-link). */
function RecItem({
  href,
  onClick,
  children,
  index,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
  index: number;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.04, duration: 0.5, ease: EASE }}
    >
      <Link
        href={href}
        onClick={onClick}
        className="group relative inline-block w-fit text-base font-medium leading-tight text-foreground sm:text-lg"
      >
        <span className="relative">
          {children}
          <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-foreground transition-transform duration-500 ease-premium group-hover:origin-left group-hover:scale-x-100" />
        </span>
      </Link>
    </motion.li>
  );
}
