"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, Minimize2, Minus, Paperclip, Send, Smile } from "lucide-react";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/shared/magnetic";
import { PRODUCTS } from "@/lib/products";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";

/* ───────────────────────── База знаний бота ───────────────────────── */

interface BotReply {
  text: string;
  /** Показать кнопку перехода в Telegram-поддержку. */
  telegram?: boolean;
}

const TELEGRAM_URL = "https://t.me/mousehub_support";

/** Простые правила: ключевые слова → ответ. Первый совпавший побеждает. */
const RULES: Array<{ keywords: string[]; reply: string }> = [
  {
    keywords: ["hello", "hi", "hey", "привет", "здравств"],
    reply: "Hi! 👋 I'm the MOUSE HUB assistant. Ask me about shipping, returns, warranty, payments or picking the right gear.",
  },
  {
    keywords: ["ship", "delivery", "доставк", "отправ"],
    reply: "We ship worldwide within 1–2 business days with tracked delivery. Orders over $99 ship free; otherwise shipping is $9.",
  },
  {
    keywords: ["return", "refund", "возврат"],
    reply: "You can return any unused item within 30 days for a full refund — just contact us with your order number and we'll send a label.",
  },
  {
    keywords: ["warranty", "гарант", "broken", "defect", "не работает"],
    reply: "Every device is covered by a 12-month warranty against manufacturing defects. If something feels off, we'll repair or replace it.",
  },
  {
    keywords: ["pay", "payment", "paypal", "card", "оплат"],
    reply: "We accept Visa, Mastercard, Amex, PayPal, Apple Pay, Google Pay and more. AfterPay is available at checkout too.",
  },
  {
    keywords: ["track", "order status", "where is my", "заказ", "трек"],
    reply: "You can track your order from the Orders tab in your account, or via the tracking link in your shipping confirmation email.",
  },
  {
    keywords: ["discount", "promo", "coupon", "скидк", "промо"],
    reply: "We drop member-only offers and restock alerts in our Discord and newsletter — joining either is the best way to catch a deal.",
  },
  {
    keywords: ["mouse", "beast", "huan", "sword", "strider", "мыш"],
    reply: "For most hands the Beast X Pro is the sweet spot; Mini suits claw/fingertip grips, and HUAN is our softest hollow-magnesium shape. All run 8000 Hz wireless.",
  },
  {
    keywords: ["keyboard", "клавиатур", "he ", "hall"],
    reply: "Our HUAN63 and YING75 keyboards use Hall-effect switches with adjustable actuation and rapid trigger — great for both typing and ranked grinding.",
  },
  {
    keywords: ["pad", "mousepad", "chunhua", "qisha", "ковер", "коврик"],
    reply: "Mousepads come in Speed, Balance and Control surfaces on a 4 mm SlimFlex HR base. Speed for flicks, Control for precision — Balance if you want both.",
  },
  {
    keywords: ["software", "driver", "dpi", "polling"],
    reply: "No downloads needed — DPI, polling rate, lift-off distance and bindings are configured right in the browser via our Web Driver.",
  },
];

function botAnswer(input: string): BotReply {
  const q = input.toLowerCase();
  for (const rule of RULES) {
    if (rule.keywords.some((k) => q.includes(k))) return { text: rule.reply };
  }
  return {
    text: "Hmm, that one's beyond me 😅 But a human definitely can help — ping our support team on Telegram and they'll sort it out.",
    telegram: true,
  };
}

/* ───────────────────────── Типы сообщений ───────────────────────── */

interface ChatMessage {
  id: number;
  role: "bot" | "user";
  text: string;
  telegram?: boolean;
}

/** Готовые вопросы-подсказки под приветствием (как в референсе).
    Держим их короткими — каждая укладывается в одну строку, поэтому
    блок подсказок никогда не скроллится внутри окна чата. */
const QUICK_REPLIES = [
  "Track my order",
  "Shipping & delivery",
  "Return policy",
  "Which mouse fits a claw grip?",
];

const WELCOME: ChatMessage = {
  id: 0,
  role: "bot",
  text: "Hi! Welcome to MOUSE HUB. What can I help you find?",
};

/** Товар, который бот показывает карточкой в приветствии. */
const FEATURED_PRODUCT = PRODUCTS.find((p) => p.slug === "beast-x-pro");

/* ───────────────────────── Компонент ───────────────────────── */

/** Базовая «премиум»-кривая, общая для всех переходов внутри чата. */
const EASE = [0.16, 1, 0.3, 1] as const;

/** Плавающий чат техподдержки: бот на частые вопросы + эскалация в Telegram. */
export function SupportChat() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const nextId = useRef(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  const user = useAuthStore((s) => s.user);
  const authHydrated = useAuthStore((s) => s.hasHydrated);
  const openAccount = useUIStore((s) => s.openAccount);

  // Диалог начат, как только появилось хотя бы одно сообщение пользователя.
  const started = messages.some((m) => m.role === "user");

  // Автопрокрутка к последнему сообщению.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, open]);

  function send(text: string) {
    const clean = text.trim();
    if (!clean || typing) return;

    setMessages((m) => [...m, { id: nextId.current++, role: "user", text: clean }]);
    setInput("");
    setTyping(true);

    // Небольшая «человеческая» задержка перед ответом бота.
    const reply = botAnswer(clean);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        { id: nextId.current++, role: "bot", text: reply.text, telegram: reply.telegram },
      ]);
    }, 900 + Math.random() * 500);
  }

  // Каскад внутренних блоков: появляются снизу вверх со стаггером,
  // чтобы открытие ощущалось «дорогим» и живым.
  const panelStagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.14 } },
  };
  const blockVariants = {
    hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.5, ease: EASE },
    },
    // Приветствие уходит вверх с размытием, когда диалог начался.
    exit: {
      opacity: 0,
      y: -14,
      filter: "blur(5px)",
      transition: { duration: 0.32, ease: [0.7, 0, 0.84, 0] as const },
    },
  };

  // Полоса подсказок: чипы разлетаются по одному (справа налево), и только
  // потом полоса схлопывается по высоте — поле ввода плавно съезжает вниз.
  const quickWrapVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
    exit: {
      height: 0,
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        height: { duration: 0.44, ease: EASE, delay: 0.2 },
        opacity: { duration: 0.3, delay: 0.2 },
      },
    },
  };
  const chipVariants = {
    hidden: { opacity: 0, y: 14, filter: "blur(5px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.45, ease: EASE },
    },
    exit: {
      opacity: 0,
      y: -12,
      scale: 0.94,
      filter: "blur(4px)",
      transition: { duration: 0.3, ease: [0.7, 0, 0.84, 0] as const },
    },
  };

  return (
    <>
      {/* Окно чата */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 26, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 130, damping: 24, mass: 1 }}
            className={cn(
              "fixed bottom-24 right-4 z-[65] flex origin-bottom-right flex-col overflow-hidden rounded-[28px] border border-border bg-background shadow-card-hover transition-[width,height] duration-500 ease-premium sm:right-6",
              expanded
                ? "h-[min(82vh,740px)] w-[calc(100vw-2rem)] max-w-2xl"
                : "h-[min(76vh,600px)] w-[calc(100vw-2rem)] max-w-md",
            )}
          >
            {/* Мягкая аура сверху — как у оригинального ассистента */}
            <div
              aria-hidden
              className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-brand/20 blur-3xl"
            />

            <motion.div
              variants={panelStagger}
              initial="hidden"
              animate="show"
              className="relative flex h-full flex-col"
            >
              {/* Шапка: слева вход/аватар, справа развернуть + свернуть */}
              <motion.div
                variants={blockVariants}
                className="flex items-center justify-between px-5 pb-3 pt-5"
              >
                {authHydrated && user ? (
                  <Link
                    href="/account"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-full bg-foreground py-2 pl-2 pr-4 text-background transition hover:opacity-90"
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-xs font-bold text-white">
                      {user.name.trim()[0]?.toUpperCase() ?? "W"}
                    </span>
                    <span className="text-sm font-semibold">{user.name.split(" ")[0]}</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={openAccount}
                    className="rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition hover:opacity-90 active:scale-95"
                  >
                    Sign in
                  </button>
                )}

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setExpanded((e) => !e)}
                    aria-label={expanded ? "Collapse chat" : "Expand chat"}
                    className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  >
                    {expanded ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Minimize chat"
                    className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>

              {/* Лента диалога */}
              <div
                ref={scrollRef}
                className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 pb-2 pt-2"
              >
                {/* Приветствие + карточка товара (только пока диалог не начат).
                    AnimatePresence — чтобы блок не исчезал рывком, а уходил
                    вверх с размытием, когда пользователь задал вопрос. */}
                <AnimatePresence>
                  {!started && (
                    <motion.div
                      key="intro"
                      variants={blockVariants}
                      exit="exit"
                      className="flex flex-col gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <p className="flex-1 pt-1 text-[15px] leading-relaxed text-foreground">
                          {WELCOME.text}
                        </p>
                        {FEATURED_PRODUCT && (
                          <Link
                            href={`/products/${FEATURED_PRODUCT.slug}`}
                            onClick={() => setOpen(false)}
                            className="group w-32 shrink-0 rounded-2xl border border-border bg-background p-2.5 shadow-card transition hover:shadow-card-hover"
                          >
                            <div className="relative aspect-square overflow-hidden rounded-xl bg-muted/60">
                              <Image
                                src={FEATURED_PRODUCT.images[0]}
                                alt={FEATURED_PRODUCT.name}
                                fill
                                sizes="128px"
                                className="object-contain p-2 transition-transform duration-500 ease-premium group-hover:scale-105"
                              />
                            </div>
                            <p className="mt-2 text-center text-[11px] font-medium leading-tight text-foreground">
                              {FEATURED_PRODUCT.name}
                            </p>
                          </Link>
                        )}
                      </div>

                      <p className="text-[11px] leading-relaxed text-muted-foreground">
                        Your messages are visible to MOUSE HUB for the provision and
                        improvement of the services. See{" "}
                        <Link href="/#privacy" onClick={() => setOpen(false)} className="link-underline text-foreground">
                          privacy policy
                        </Link>
                        .
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Сообщения диалога */}
                {messages
                  .filter((m) => !(m.id === WELCOME.id && !started))
                  .map((m) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 170, damping: 24, mass: 0.9 }}
                      className={cn("flex flex-col gap-2", m.role === "user" ? "items-end" : "items-start")}
                    >
                      <div
                        className={cn(
                          "max-w-[85%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed",
                          m.role === "user"
                            ? "rounded-br-md bg-foreground text-background"
                            : "rounded-bl-md bg-muted text-foreground",
                        )}
                      >
                        {m.text}
                      </div>

                      {/* Эскалация в Telegram, когда бот не знает ответа */}
                      {m.telegram && (
                        <motion.a
                          href={TELEGRAM_URL}
                          target="_blank"
                          rel="noreferrer"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.35, type: "spring", stiffness: 160, damping: 22 }}
                          className="inline-flex items-center gap-2 rounded-full bg-[#2AABEE] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:brightness-110 active:scale-95"
                        >
                          <Send className="h-3.5 w-3.5" />
                          Contact support on Telegram
                        </motion.a>
                      )}
                    </motion.div>
                  ))}

                {/* Индикатор набора */}
                {typing && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 self-start rounded-2xl rounded-bl-md bg-muted px-4 py-3"
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                        className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60"
                      />
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Быстрые вопросы-подсказки (только пока диалог не начат).
                  Без собственного скролла: подсказки короткие и всегда
                  видны целиком. При клике чипы разлетаются по одному, полоса
                  схлопывается, и на её месте появляется ответ бота. */}
              <AnimatePresence>
                {!started && (
                  <motion.div
                    key="quick"
                    variants={quickWrapVariants}
                    exit="exit"
                    className="shrink-0 overflow-hidden"
                  >
                    <div className="flex flex-wrap items-center gap-1.5 px-5 pb-3 pt-1">
                      {QUICK_REPLIES.map((q) => (
                        <motion.button
                          key={q}
                          variants={chipVariants}
                          type="button"
                          onClick={() => send(q)}
                          whileHover={{ y: -1 }}
                          whileTap={{ scale: 0.96 }}
                          transition={{ type: "spring", stiffness: 420, damping: 26 }}
                          className="rounded-full border border-border bg-background px-3.5 py-1.5 text-left text-[12.5px] font-medium text-foreground transition-colors hover:border-foreground/30 hover:bg-muted"
                        >
                          {q}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Ввод — большое закруглённое поле «Ask anything…» */}
              <motion.form
                variants={blockVariants}
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="shrink-0 flex items-center gap-2 px-4 pb-4 pt-1"
              >
                <div className="flex flex-1 items-center gap-2 rounded-full border border-border bg-background px-3 py-2 shadow-card transition focus-within:border-foreground/30 focus-within:ring-2 focus-within:ring-foreground/10">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted-foreground">
                    <Paperclip className="h-[18px] w-[18px]" />
                  </span>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask anything…"
                    className="h-8 flex-1 bg-transparent text-[14px] outline-none placeholder:text-muted-foreground"
                  />
                  <button
                    type="submit"
                    aria-label="Send message"
                    disabled={!input.trim() || typing}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-foreground text-background transition hover:opacity-90 active:scale-90 disabled:opacity-30"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </motion.form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Кнопка-лаунчер: пилюля со смайлом + «Chat» — как в референсе.
          Внешний слой — появление; Magnetic тянет за курсором. */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20, mass: 0.9, delay: 0.7 }}
        className="fixed bottom-5 right-4 z-[65] sm:right-6"
      >
        <Magnetic strength={0.3}>
          <motion.button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close support chat" : "Open support chat"}
            initial="rest"
            animate="rest"
            whileHover="hover"
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="group relative flex h-12 items-center gap-2 overflow-hidden rounded-full border border-border bg-background pl-3.5 pr-5 text-foreground shadow-card"
          >
            {/* Плавная заливка фона на hover — как hover:bg-muted у иконок шапки */}
            <motion.span
              aria-hidden
              variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none absolute inset-0 rounded-full bg-muted"
            />
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="relative"
                >
                  <Minus className="h-[20px] w-[20px]" />
                </motion.span>
              ) : (
                <motion.span
                  key="chat"
                  initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="relative"
                >
                  <Smile className="h-[20px] w-[20px]" />
                </motion.span>
              )}
            </AnimatePresence>
            <span className="relative text-[15px] font-medium">Chat</span>
          </motion.button>
        </Magnetic>
      </motion.div>
    </>
  );
}
