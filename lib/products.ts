import type { Product, ProductCategory } from "@/types";

/**
 * Каталог товаров MOUSE HUB.
 * Изображения — заранее подготовленные SVG-плейсхолдеры в /public/images.
 * Тексты описаний — авторские.
 */

const COLORS = {
  black: { id: "black", name: "Stealth Black", hex: "#101012" },
  white: { id: "white", name: "Arctic White", hex: "#f2f2f2" },
  purple: { id: "purple", name: "Royal Purple", hex: "#7c3aed" },
  pink: { id: "pink", name: "Sakura Pink", hex: "#f7b6c2" },
  mint: { id: "mint", name: "Mint", hex: "#c7ece0" },
  gold: { id: "gold", name: "Champagne Gold", hex: "#c9a96a" },
} as const;

const GOLD = COLORS.gold;

export const PRODUCTS: Product[] = [
  /* ───────────────────────────── Мыши ───────────────────────────── */
  {
    id: "beast-x-mini-pro",
    slug: "beast-x-mini-pro",
    name: "Beast X Mini Pro Magnesium Gaming Mouse",
    tagline: "Magnesium Alloy · Symmetrical · 34g",
    category: "mouse",
    price: 145,
    compareAtPrice: 149,
    fromPrice: true,
    badge: "Hot",
    description:
      "The smallest of the Beast X family. A 34g magnesium-alloy shell tuned for claw and fingertip grips, paired with the PAW 3950HS sensor and 8K wireless for zero-compromise precision.",
    highlights: [
      "34g ultra-light magnesium-alloy chassis",
      "PixArt PAW 3950HS — up to 30,000 DPI",
      "8000 Hz wireless polling rate",
      "Optical micro-switches rated for 100M clicks",
    ],
    images: [
      "/images/products/beast-x-mini-pro-1.svg",
      "/images/products/beast-x-mini-pro-2.svg",
      "/images/products/beast-x-mini-pro-3.svg",
    ],
    tint: "#f4f2f3",
    specs: [
      { icon: "weight", label: "Weight", value: "34 g" },
      { icon: "sensor", label: "Sensor", value: "PAW 3950HS" },
      { icon: "polling", label: "Polling", value: "8000 Hz" },
      { icon: "battery", label: "Battery", value: "Up to 90 h" },
      { icon: "connection", label: "Connection", value: "2.4G / Wired" },
      { icon: "material", label: "Material", value: "Magnesium Alloy" },
    ],
    variants: [COLORS.black, COLORS.white, COLORS.purple, COLORS.pink],
    inStock: true,
    rating: 4.9,
    reviews: 218,
    featured: true,
  },
  {
    id: "beast-x-pro",
    slug: "beast-x-pro",
    name: "Beast X Pro Magnesium Gaming Mouse",
    tagline: "Magnesium Alloy · Symmetrical · 39g",
    category: "mouse",
    price: 145,
    compareAtPrice: 149,
    fromPrice: true,
    badge: "Hot",
    description:
      "The all-rounder. Beast X Pro keeps the symmetrical silhouette esports players trust while shaving weight to 39g with a hollow magnesium frame and side slits.",
    highlights: [
      "39g symmetrical competition shape",
      "PixArt PAW 3950HS flagship sensor",
      "8000 Hz polling, 1000 IPS tracking",
      "Side-slit ventilation for a cooler grip",
    ],
    images: [
      "/images/products/beast-x-pro-1.svg",
      "/images/products/beast-x-pro-2.svg",
      "/images/products/beast-x-pro-3.svg",
    ],
    tint: "#f4f4f3",
    specs: [
      { icon: "weight", label: "Weight", value: "39 g" },
      { icon: "sensor", label: "Sensor", value: "PAW 3950HS" },
      { icon: "polling", label: "Polling", value: "8000 Hz" },
      { icon: "battery", label: "Battery", value: "Up to 100 h" },
      { icon: "connection", label: "Connection", value: "2.4G / Wired" },
      { icon: "material", label: "Material", value: "Magnesium Alloy" },
    ],
    variants: [COLORS.black, COLORS.white, COLORS.purple],
    inStock: true,
    rating: 4.9,
    reviews: 341,
    featured: true,
  },
  {
    id: "beast-x-max",
    slug: "beast-x-max",
    name: "Beast X Max Magnesium Gaming Mouse",
    tagline: "Magnesium Alloy · Symmetrical · 42g",
    category: "mouse",
    price: 145,
    compareAtPrice: 149,
    fromPrice: true,
    description:
      "For larger hands. Beast X Max scales the proven Beast X shape up while a magnesium build holds the total weight to just 42g — full palm support, featherweight feel.",
    highlights: [
      "42g large symmetrical body",
      "PixArt PAW 3950HS — 30,000 DPI",
      "8000 Hz wireless polling",
      "Full palm-grip ergonomics",
    ],
    images: [
      "/images/products/beast-x-max-1.svg",
      "/images/products/beast-x-max-2.svg",
      "/images/products/beast-x-max-3.svg",
    ],
    tint: "#f5f4f4",
    specs: [
      { icon: "weight", label: "Weight", value: "42 g" },
      { icon: "sensor", label: "Sensor", value: "PAW 3950HS" },
      { icon: "polling", label: "Polling", value: "8000 Hz" },
      { icon: "battery", label: "Battery", value: "Up to 110 h" },
      { icon: "connection", label: "Connection", value: "2.4G / Wired" },
      { icon: "material", label: "Material", value: "Magnesium Alloy" },
    ],
    variants: [COLORS.black, COLORS.white],
    inStock: true,
    rating: 4.8,
    reviews: 156,
    featured: true,
  },
  {
    id: "beast-miao",
    slug: "beast-miao",
    name: "MOUSE HUB Beast Miao Magnesium Gaming Mouse",
    tagline: "Magnesium Alloy · Hollow · 31g",
    category: "mouse",
    price: 145,
    compareAtPrice: 149,
    badge: "New",
    description:
      "The lightest Beast yet. At a staggering 31g, Beast Miao's skeletonised magnesium shell is built for players who want their hand to disappear into pure aim.",
    highlights: [
      "31g — the lightest magnesium Beast",
      "Skeletonised hollow shell",
      "PixArt PAW 3950HS sensor",
      "8000 Hz polling rate",
    ],
    images: [
      "/images/products/beast-miao-1.svg",
      "/images/products/beast-miao-2.svg",
      "/images/products/beast-miao-3.svg",
    ],
    tint: "#f4f3f4",
    specs: [
      { icon: "weight", label: "Weight", value: "31 g" },
      { icon: "sensor", label: "Sensor", value: "PAW 3950HS" },
      { icon: "polling", label: "Polling", value: "8000 Hz" },
      { icon: "battery", label: "Battery", value: "Up to 85 h" },
      { icon: "connection", label: "Connection", value: "2.4G / Wired" },
      { icon: "material", label: "Material", value: "Magnesium Alloy" },
    ],
    variants: [COLORS.black, COLORS.purple, COLORS.pink],
    inStock: true,
    rating: 5.0,
    reviews: 92,
    featured: true,
  },
  {
    id: "huan",
    slug: "huan",
    name: "HUAN Hollow Magnesium Gaming Mouse",
    tagline: "Hollow Magnesium · Symmetrical",
    category: "mouse",
    price: 159,
    fromPrice: true,
    badge: "Limited",
    description:
      "An open-frame statement piece. HUAN's intricate hollow magnesium lattice is as much sculpture as it is one of the lightest competition mice ever made.",
    highlights: [
      "Open-lattice hollow magnesium frame",
      "Sub-30g target weight",
      "Flagship optical sensor",
      "8000 Hz wireless",
    ],
    images: [
      "/images/products/huan-1.svg",
      "/images/products/huan-2.svg",
      "/images/products/huan-3.svg",
    ],
    specs: [
      { icon: "weight", label: "Weight", value: "29 g" },
      { icon: "sensor", label: "Sensor", value: "PAW 3950HS" },
      { icon: "polling", label: "Polling", value: "8000 Hz" },
      { icon: "battery", label: "Battery", value: "Up to 80 h" },
      { icon: "connection", label: "Connection", value: "2.4G / Wired" },
      { icon: "material", label: "Material", value: "Hollow Magnesium" },
    ],
    variants: [COLORS.black, GOLD, COLORS.purple],
    inStock: true,
    rating: 4.9,
    reviews: 64,
    featured: true,
  },
  {
    id: "strider",
    slug: "strider",
    name: "Strider Ergonomic Gaming Mouse",
    tagline: "Ergonomic · Right-Handed",
    category: "mouse",
    price: 139,
    fromPrice: true,
    description:
      "An ergonomic right-handed shape with a contoured thumb rest, tuned for comfort across long sessions without giving up the MOUSE HUB featherweight philosophy.",
    highlights: [
      "Ergonomic right-handed contour",
      "Lightweight magnesium build",
      "PixArt PAW 3950HS sensor",
      "8000 Hz polling",
    ],
    images: [
      "/images/products/strider-1.svg",
      "/images/products/strider-2.svg",
      "/images/products/strider-3.svg",
    ],
    specs: [
      { icon: "weight", label: "Weight", value: "47 g" },
      { icon: "sensor", label: "Sensor", value: "PAW 3950HS" },
      { icon: "polling", label: "Polling", value: "8000 Hz" },
      { icon: "battery", label: "Battery", value: "Up to 120 h" },
      { icon: "connection", label: "Connection", value: "2.4G / Wired" },
      { icon: "material", label: "Material", value: "Magnesium Alloy" },
    ],
    variants: [COLORS.black, COLORS.white],
    inStock: true,
    rating: 4.7,
    reviews: 73,
  },
  {
    id: "sword",
    slug: "sword",
    name: "Sword Magnesium Gaming Mouse",
    tagline: "Magnesium Alloy · Asymmetric",
    category: "mouse",
    price: 149,
    fromPrice: true,
    badge: "Limited",
    description:
      "Inspired by the wuxia aesthetics of《JianLai》. Sword's asymmetric magnesium body cuts through games with the same precision as a master swordsman.",
    highlights: [
      "Asymmetric competition shape",
      "Magnesium-alloy chassis",
      "Limited Sword edition finish",
      "8000 Hz wireless",
    ],
    images: [
      "/images/products/sword-1.svg",
      "/images/products/sword-2.svg",
      "/images/products/sword-3.svg",
    ],
    specs: [
      { icon: "weight", label: "Weight", value: "38 g" },
      { icon: "sensor", label: "Sensor", value: "PAW 3950HS" },
      { icon: "polling", label: "Polling", value: "8000 Hz" },
      { icon: "battery", label: "Battery", value: "Up to 95 h" },
      { icon: "connection", label: "Connection", value: "2.4G / Wired" },
      { icon: "material", label: "Material", value: "Magnesium Alloy" },
    ],
    variants: [COLORS.black, COLORS.purple, GOLD],
    inStock: true,
    rating: 4.9,
    reviews: 48,
    featured: true,
  },

  /* ─────────────────────────── Клавиатуры ─────────────────────────── */
  {
    id: "huan63-he-keyboard",
    slug: "huan63-he-keyboard",
    name: "HUAN63 HE Magnesium Alloy Keyboard",
    tagline: "60% · Hall-Effect · Wired",
    category: "keyboard",
    price: 269,
    description:
      "A modular 60% Hall-effect keyboard in a magnesium-alloy case. Adjustable actuation, rapid trigger and per-key tuning — built for customization down to the millimetre.",
    highlights: [
      "Hall-effect magnetic switches",
      "Adjustable actuation + rapid trigger",
      "Magnesium-alloy unibody case",
      "8000 Hz polling, full software control",
    ],
    images: [
      "/images/keyboards/huan63-1.svg",
      "/images/keyboards/huan63-2.svg",
    ],
    specs: [
      { icon: "layout", label: "Layout", value: "60%" },
      { icon: "switches", label: "Switches", value: "Hall-Effect" },
      { icon: "polling", label: "Polling", value: "8000 Hz" },
      { icon: "connection", label: "Connection", value: "Wired USB-C" },
      { icon: "material", label: "Material", value: "Magnesium Alloy" },
    ],
    variants: [COLORS.black, COLORS.white],
    inStock: true,
    rating: 4.8,
    reviews: 37,
  },
  {
    id: "ying75-he-keyboard",
    slug: "ying75-he-keyboard",
    name: "YING75 HE Forged Carbon Fiber Keyboard",
    tagline: "75% · Hall-Effect · Carbon Fiber",
    category: "keyboard",
    price: 239,
    fromPrice: true,
    badge: "Sold Out",
    description:
      "A 75% Hall-effect board wrapped in forged carbon fiber. Each plate carries a unique marbled pattern — no two YING75 are ever the same.",
    highlights: [
      "Forged carbon-fiber top plate",
      "Hall-effect adjustable actuation",
      "75% compact layout with arrows",
      "Gasket-mounted acoustics",
    ],
    images: [
      "/images/keyboards/ying75-1.svg",
      "/images/keyboards/ying75-2.svg",
    ],
    specs: [
      { icon: "layout", label: "Layout", value: "75%" },
      { icon: "switches", label: "Switches", value: "Hall-Effect" },
      { icon: "polling", label: "Polling", value: "8000 Hz" },
      { icon: "connection", label: "Connection", value: "Wired USB-C" },
      { icon: "material", label: "Material", value: "Carbon Fiber" },
    ],
    variants: [COLORS.black],
    inStock: false,
    rating: 4.9,
    reviews: 21,
  },

  /* ─────────────────────────── Коврики ─────────────────────────── */
  {
    id: "qisha-mousepad",
    slug: "qisha-mousepad",
    name: "MOUSE HUB QISHA 七殺 Mousepad",
    tagline: "SlimFlex HR Base · Control",
    category: "mousepad",
    price: 33.9,
    description:
      "A control-oriented cloth surface on the SlimFlex HR base that stays firmly in place through the fastest flicks. Stitched edges, washable, built to last.",
    highlights: ["SlimFlex HR non-slip base", "Control-type micro-textured cloth", "Stitched anti-fray edges", "900 × 400 mm"],
    images: ["/images/mousepads/qisha.svg"],
    tint: "#f2f2f3",
    specs: [
      { icon: "size", label: "Size", value: "900 × 400 mm" },
      { icon: "material", label: "Surface", value: "Control Cloth" },
      { icon: "layout", label: "Base", value: "SlimFlex HR" },
    ],
    variants: [COLORS.black],
    inStock: true,
    rating: 4.8,
    reviews: 54,
  },
  {
    id: "magic-mousepad",
    slug: "magic-mousepad",
    name: "MOUSE HUB MA-GIC Gaming Mouse Pad",
    tagline: "SlimFlex HR Base · Hybrid",
    category: "mousepad",
    price: 34.9,
    badge: "Sold Out",
    description:
      "A hybrid-speed surface with bold MA-GIC artwork. Balanced glide and stopping power for players who switch between tracking and flicking mid-fight.",
    highlights: ["Hybrid speed/control surface", "SlimFlex HR base", "Vivid sublimated artwork", "490 × 420 mm"],
    images: ["/images/mousepads/magic.svg"],
    tint: "#f2f2f3",
    specs: [
      { icon: "size", label: "Size", value: "490 × 420 mm" },
      { icon: "material", label: "Surface", value: "Hybrid Cloth" },
      { icon: "layout", label: "Base", value: "SlimFlex HR" },
    ],
    variants: [COLORS.black],
    inStock: false,
    rating: 4.7,
    reviews: 33,
  },
  {
    id: "chunhua-mousepad",
    slug: "chunhua-mousepad",
    name: "MOUSE HUB CHUNHUA Gaming Mouse Pad",
    tagline: "SlimFlex HR Base · Speed",
    category: "mousepad",
    price: 33.9,
    description:
      "A speed-type surface dressed in the CHUNHUA spring-blossom artwork. Fast, frictionless glide for low-sens players who live on wide swipes.",
    highlights: ["Speed-type smooth weave", "SlimFlex HR base", "CHUNHUA artwork", "490 × 420 mm"],
    // Порядок совпадает с variants: Pink → Blue → White.
    images: [
      "/images/mousepads/chunhua-pink.svg",
      "/images/mousepads/chunhua-blue.svg",
      "/images/mousepads/chunhua-white.svg",
    ],
    tint: "#f2f2f3",
    specs: [
      { icon: "size", label: "Size", value: "490 × 420 mm" },
      { icon: "material", label: "Surface", value: "Speed Cloth" },
      { icon: "layout", label: "Base", value: "SlimFlex HR" },
    ],
    variants: [
      { id: "pink", name: "Pink", hex: "#f6cdd4" },
      { id: "blue", name: "Blue", hex: "#a9c9ee" },
      { id: "white", name: "White", hex: "#f4f4f4" },
    ],
    inStock: true,
    rating: 4.8,
    reviews: 41,
  },
];

/* ───────────────────────── Хелперы выборки ───────────────────────── */

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((p) => p.featured);
}

/** Товары для шоукейса «Find your perfect match» (4 топовые мыши). */
export const SHOWCASE_PRODUCTS = PRODUCTS.filter((p) =>
  ["beast-x-pro", "beast-x-mini-pro", "beast-x-max", "beast-miao"].includes(p.id),
);

export const KEYBOARD_PRODUCTS = getProductsByCategory("keyboard");
export const MOUSEPAD_PRODUCTS = getProductsByCategory("mousepad");
