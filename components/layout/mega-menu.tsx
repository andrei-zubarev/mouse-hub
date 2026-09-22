"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { PRODUCTS } from "@/lib/products";
import type { Product } from "@/types";

const bySlug = (slug: string): Product | undefined =>
  PRODUCTS.find((p) => p.slug === slug);

/**
 * Каскадное появление блока внутри мега-меню: плитки ВЫЛЕТАЮТ СПРАВА
 * (translateX 44→0) + fade + проявление из размытия, со стаггером от
 * родителя. Длинная кривая-«выброс» (easeOutExpo) и заметный блюр дают
 * дорогое, плавное появление. Перелёт по X клипуется overflow-hidden
 * панели, поэтому горизонтального скролла страницы не возникает.
 */
const itemVariants = {
  hidden: { opacity: 0, x: 44, filter: "blur(8px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      x: { duration: 0.72, ease: [0.16, 1, 0.3, 1] },
      opacity: { duration: 0.5, ease: [0.19, 1, 0.22, 1] },
      filter: { duration: 0.56, ease: [0.16, 1, 0.3, 1] },
    },
  },
};

/** Обёртка-строитель каскада: motion.div с общими variants. */
function MItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

/** Контент мега-меню по названию пункта навигации. */
export function MegaMenuContent({
  label,
  onNavigate,
}: {
  label: string;
  onNavigate: () => void;
}) {
  switch (label) {
    case "Product":
      return <ProductMenu onNavigate={onNavigate} />;
    case "Mouse":
      return <MouseMenu onNavigate={onNavigate} />;
    case "Keyboard":
      return <KeyboardMenu onNavigate={onNavigate} />;
    case "MousePad":
      return <MousePadMenu onNavigate={onNavigate} />;
    case "Support":
      return <SupportMenu onNavigate={onNavigate} />;
    case "Software":
      return <SoftwareMenu onNavigate={onNavigate} />;
    default:
      return null;
  }
}

/* ───────────────────────── Общие куски ───────────────────────── */

function MiniProductCard({
  product,
  onNavigate,
  plain = false,
}: {
  product: Product;
  onNavigate: () => void;
  /** Без серой подложки (как первая карточка в оригинале). */
  plain?: boolean;
}) {
  const onSale =
    typeof product.compareAtPrice === "number" &&
    product.compareAtPrice > product.price;

  return (
    <Link
      href={`/products/${product.slug}`}
      onClick={onNavigate}
      className="group flex flex-col"
    >
      <div
        className={cn(
          "relative aspect-square overflow-hidden rounded-2xl",
          plain ? "bg-transparent" : "bg-muted/70",
        )}
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="300px"
          className="object-contain p-6 transition-transform duration-500 ease-premium group-hover:scale-105"
        />
      </div>
      <p className="mt-4 text-center text-[17px] font-medium leading-snug text-foreground">
        {product.name}
      </p>
      <p className="mt-1.5 text-center text-[15px]">
        {product.fromPrice && (
          <span className="mr-1 text-muted-foreground">From</span>
        )}
        <span className={onSale ? "text-price" : "text-foreground"}>
          {formatPrice(product.price)}
        </span>
        {onSale && (
          <span className="ml-1.5 text-muted-foreground line-through">
            {formatPrice(product.compareAtPrice!)}
          </span>
        )}
      </p>
    </Link>
  );
}

function MoreLink({
  href,
  children,
  onNavigate,
  arrowDown = false,
}: {
  href: string;
  children: React.ReactNode;
  onNavigate: () => void;
  /** Стрелка поворачивается вниз при наведении (для «View All Products»). */
  arrowDown?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="group inline-flex items-center gap-2 text-[15px] font-bold text-foreground"
    >
      {children}
      <ArrowRight
        className={cn(
          "h-[18px] w-[18px] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          arrowDown ? "group-hover:rotate-90" : "group-hover:translate-x-1",
        )}
      />
    </Link>
  );
}

/* ───────────────────────── Product ───────────────────────── */

const PRODUCT_CATEGORIES = [
  { label: "Gaming Mouse", href: "/products?category=mouse" },
  { label: "MousePad", href: "/products?category=mousepad" },
  { label: "Keyboard", href: "/products?category=keyboard" },
  { label: "Skates", href: "/products" },
  { label: "Grip Tape", href: "/products" },
];

function ProductMenu({ onNavigate }: { onNavigate: () => void }) {
  const popular = [
    "beast-x-mini-pro",
    "beast-x-pro",
    "beast-x-max",
    "beast-miao",
  ]
    .map(bySlug)
    .filter(Boolean) as Product[];

  return (
    <div className="grid gap-16 lg:grid-cols-[300px_1fr]">
      {/* Левая колонка — коллекции */}
      <MItem className="flex flex-col">
        <p className="text-[15px] font-medium text-muted-foreground">Collections</p>
        <ul className="mt-6 space-y-2">
          {PRODUCT_CATEGORIES.map((c, i) => (
            <li key={c.label}>
              <Link
                href={c.href}
                onClick={onNavigate}
                className={cn(
                  "link-underline font-display text-[32px] font-bold leading-tight tracking-[-0.02em]",
                  i === 0 ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-auto border-t border-border pt-6">
          <MoreLink href="/products" onNavigate={onNavigate} arrowDown>
            View All Products
          </MoreLink>
        </div>
      </MItem>

      {/* Правая колонка — популярное */}
      <div>
        <MItem className="flex items-center justify-between">
          <p className="text-[15px] font-medium uppercase tracking-wide text-muted-foreground">
            Most Popular
          </p>
          <MoreLink href="/products?category=mouse" onNavigate={onNavigate}>
            All Gaming Mouse ({PRODUCTS.filter((p) => p.category === "mouse").length})
          </MoreLink>
        </MItem>
        <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {popular.map((p, i) => (
            <MItem key={p.id}>
              {/* Первая карточка — без серой подложки, как в оригинале. */}
              <MiniProductCard product={p} onNavigate={onNavigate} plain={i === 0} />
            </MItem>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Mouse ───────────────────────── */

const MOUSE_SERIES = [
  {
    title: "Beast G",
    links: [
      { label: "Beast G", href: "/products/beast-x-pro" },
      { label: "FEIRENZAI Limited Edition", href: "/products/sword" },
    ],
  },
  {
    title: "Beast X series",
    links: [
      { label: "Beast Mini Pro", href: "/products/beast-x-mini-pro" },
      { label: "Beast X Pro", href: "/products/beast-x-pro" },
      { label: "Beast Max", href: "/products/beast-x-max" },
      { label: "Beast Miao", href: "/products/beast-miao" },
    ],
  },
  { title: "Strider", links: [{ label: "Strider", href: "/products/strider" }] },
  { title: "SwordX", links: [{ label: "Sword", href: "/products/sword" }] },
  { title: "YING MG", links: [{ label: "HUAN", href: "/products/huan" }] },
];

function MouseMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-8 sm:grid-cols-3 lg:grid-cols-5">
        {MOUSE_SERIES.map((s) => (
          <MItem key={s.title}>
            <p className="font-display text-base font-bold text-foreground">{s.title}</p>
            <ul className="mt-3 space-y-2.5">
              {s.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    onClick={onNavigate}
                    className="link-underline text-sm text-muted-foreground hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </MItem>
        ))}
      </div>

      <MItem className="flex items-center justify-between border-t border-border pt-5">
        <Link
          href="/products/huan"
          onClick={onNavigate}
          className="link-underline font-display text-base font-bold text-foreground"
        >
          HUAN
        </Link>
        <MoreLink href="/products?category=mouse" onNavigate={onNavigate}>
          All Mouse
        </MoreLink>
      </MItem>
    </div>
  );
}

/* ───────────────────────── Keyboard ───────────────────────── */

const KEYBOARD_LINKS = [
  { label: "HUAN63 HE", href: "/products/huan63-he-keyboard" },
  { label: "YING63 HE", href: "/products/ying75-he-keyboard" },
  { label: "YING75 HE", href: "/products/ying75-he-keyboard" },
];

function FeatureCard({
  href,
  image,
  title,
  subtitle,
  soldOut,
  onNavigate,
}: {
  href: string;
  image: string;
  title: string;
  subtitle: string;
  soldOut?: boolean;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-muted/70 p-6 transition hover:bg-muted"
    >
      {soldOut && (
        <span className="absolute left-4 top-4 z-10 rounded-full bg-[#e11d48] px-2.5 py-1 text-[10px] font-bold uppercase text-white">
          Sold Out
        </span>
      )}
      <div className="relative h-32 w-full sm:h-40">
        <Image src={image} alt={title} fill sizes="320px" className="object-contain" />
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="font-display text-xl font-extrabold tracking-tight text-foreground">
            {title}
          </p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <ArrowRight className="h-5 w-5 text-foreground transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function KeyboardMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
      <MItem>
        <ul className="space-y-3.5">
          {KEYBOARD_LINKS.map((l) => (
            <li key={l.label}>
              <Link
                href={l.href}
                onClick={onNavigate}
                className="link-underline font-display text-lg font-bold text-foreground"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </MItem>
      <div className="grid gap-5 sm:grid-cols-2">
        <MItem>
          <FeatureCard
            href="/products/ying75-he-keyboard"
            image="/images/keyboards/ying75-1.svg"
            title="YING 75"
            subtitle="Forged Carbon Fiber HE Keyboard"
            soldOut
            onNavigate={onNavigate}
          />
        </MItem>
        <MItem>
          <FeatureCard
            href="/products/huan63-he-keyboard"
            image="/images/keyboards/huan63-1.svg"
            title="HUAN 63"
            subtitle="Magnesium Alloys HE Keyboard"
            onNavigate={onNavigate}
          />
        </MItem>
      </div>
    </div>
  );
}

/* ───────────────────────── MousePad ───────────────────────── */

const MOUSEPAD_CARDS = [
  { slug: "qisha-mousepad", title: "QISHA 七殺", image: "/images/mousepads/qisha.svg" },
  { slug: "chunhua-mousepad", title: "CHUNHUA", image: "/images/mousepads/chunhua.svg" },
  { slug: "magic-mousepad", title: "MA-GIC", image: "/images/mousepads/magic.svg", soldOut: true },
];

function MousePadMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
      {MOUSEPAD_CARDS.map((c) => (
        <MItem key={c.slug} className="h-full">
          <FeatureCard
            href={`/products/${c.slug}`}
            image={c.image}
            title={c.title}
            subtitle="SlimFlex HR Mousepad"
            soldOut={c.soldOut}
            onNavigate={onNavigate}
          />
        </MItem>
      ))}
    </div>
  );
}

/* ───────────────────────── Support ───────────────────────── */

const SUPPORT_LINKS = [
  { label: "FAQs", href: "#faq" },
  { label: "Contact", href: "#contact" },
  { label: "Online Reseller", href: "#reseller" },
  { label: "Official Online Store", href: "/products" },
];

function SupportMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
      {SUPPORT_LINKS.map((l) => (
        <MItem key={l.label}>
          <Link
            href={l.href}
            onClick={onNavigate}
            className="link-underline font-display text-lg font-bold text-foreground"
          >
            {l.label}
          </Link>
        </MItem>
      ))}
    </div>
  );
}

/* ───────────────────────── Software ───────────────────────── */

const SOFTWARE_CARDS = [
  { title: "MOUSE", image: "/images/collections/beast-x.svg", accent: true },
  { title: "YING63", image: "/images/keyboards/ying75-1.svg" },
  { title: "YING75", image: "/images/keyboards/ying75-2.svg" },
  { title: "HUAN63", image: "/images/keyboards/huan63-1.svg" },
  { title: "HUAN IEM", image: "/images/collections/iem.svg" },
];

function SoftwareMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
      {SOFTWARE_CARDS.map((c) => (
        <MItem key={c.title} className="h-full">
          <Link
            href="#software"
            onClick={onNavigate}
            className={
              "group flex h-full flex-col justify-between overflow-hidden rounded-2xl p-5 transition " +
              (c.accent
                ? "bg-gradient-to-br from-brand to-brand-dark text-white"
                : "bg-muted/70 text-foreground hover:bg-muted")
            }
          >
            <div className="relative h-24 w-full">
              <Image src={c.image} alt={c.title} fill sizes="220px" className="object-contain" />
            </div>
            <div className="mt-4">
              <p className="font-display text-base font-extrabold tracking-tight">{c.title}</p>
              <span
                className={
                  "mt-0.5 inline-flex items-center gap-1 text-xs " +
                  (c.accent ? "text-white/80" : "text-muted-foreground")
                }
              >
                Connect
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </MItem>
      ))}
    </div>
  );
}
