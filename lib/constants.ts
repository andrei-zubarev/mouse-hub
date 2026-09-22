import type { Collection, NavItem } from "@/types";

export const SITE = {
  name: "MOUSE HUB",
  announcement: "Join the MOUSE HUB Discord community!",
  region: "Austria (USD $)",
  discordUrl: "https://discord.com",
  year: 2026,
} as const;

/** Главная навигация хедера (с выпадающими подменю). */
export const NAV_ITEMS: NavItem[] = [
  {
    label: "Product",
    href: "/products",
    children: [
      { label: "All Products", href: "/products" },
      { label: "Mice", href: "/products?category=mouse" },
      { label: "Keyboards", href: "/products?category=keyboard" },
      { label: "MousePads", href: "/products?category=mousepad" },
    ],
  },
  {
    label: "Mouse",
    href: "/products?category=mouse",
    children: [
      { label: "Beast X Mini Pro", href: "/products/beast-x-mini-pro" },
      { label: "Beast X Pro", href: "/products/beast-x-pro" },
      { label: "Beast X Max", href: "/products/beast-x-max" },
      { label: "Beast Miao", href: "/products/beast-miao" },
      { label: "HUAN", href: "/products/huan" },
      { label: "Strider", href: "/products/strider" },
      { label: "Sword", href: "/products/sword" },
    ],
  },
  {
    label: "Keyboard",
    href: "/products?category=keyboard",
    children: [
      { label: "HUAN63 HE", href: "/products/huan63-he-keyboard" },
      { label: "YING75 HE", href: "/products/ying75-he-keyboard" },
    ],
  },
  { label: "IEM", href: "/products?category=iem" },
  {
    label: "MousePad",
    href: "/products?category=mousepad",
    children: [
      { label: "QISHA", href: "/products/qisha-mousepad" },
      { label: "CHUNHUA", href: "/products/chunhua-mousepad" },
      { label: "MA-GIC", href: "/products/magic-mousepad" },
    ],
  },
  { label: "Support", href: "#support" },
  { label: "Software", href: "#software" },
];

export const SOCIAL_LINKS = [
  { label: "X", href: "https://x.com", icon: "x" },
  { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
  { label: "YouTube", href: "https://youtube.com", icon: "youtube" },
  { label: "TikTok", href: "https://tiktok.com", icon: "tiktok" },
  { label: "Discord", href: "https://discord.com", icon: "discord" },
] as const;

/** Сетка коллекций под hero. */
export const COLLECTIONS: Collection[] = [
  {
    id: "beast-g",
    title: "Beast G Series",
    tagline: "Solid, Microcrystalline Composite",
    href: "/products?category=mouse",
    image: "/images/collections/beast-g.svg",
  },
  {
    id: "huan",
    title: "HUAN",
    tagline: "Soft, Hollow Magnesium",
    href: "/products/huan",
    image: "/images/collections/huan.svg",
  },
  {
    id: "beast-x",
    title: "Beast X Series",
    tagline: "Magnesium Alloy, Symmetrical",
    href: "/products?category=mouse",
    image: "/images/collections/beast-x.svg",
  },
  {
    id: "ying",
    title: "Ying",
    tagline: "Carbon Fiber, Magnesium Alloy",
    href: "/products?category=mouse",
    image: "/images/collections/ying.svg",
  },
  {
    id: "sword",
    title: "Sword",
    tagline: "Magnesium Alloy, Asymmetric",
    href: "/products/sword",
    image: "/images/collections/sword.svg",
  },
  {
    id: "strider",
    title: "Strider",
    tagline: "Ultralight, Ergonomic",
    href: "/products/strider",
    image: "/images/collections/strider.svg",
  },
  {
    id: "keyboard",
    title: "HE Keyboard",
    tagline: "Hall-Effect, Modular",
    href: "/products?category=keyboard",
    image: "/images/collections/keyboard.svg",
  },
  {
    id: "mousepad",
    title: "MousePad",
    tagline: "SlimFlex HR Base",
    href: "/products?category=mousepad",
    image: "/images/collections/mousepad.svg",
  },
  {
    id: "iem",
    title: "HUAN IEM",
    tagline: "In-Ear Monitor",
    href: "/products?category=iem",
    image: "/images/collections/iem.svg",
  },
];

/** Преимущества «Built with Magnesium». */
export const MAGNESIUM_FEATURES = [
  {
    title: "31g Ultra-Light",
    description: "Faster flicks, less fatigue.",
  },
  {
    title: "Solid & Stable",
    description: "A rigid shell for consistent grip and clicks.",
  },
  {
    title: "Cooler in Hand",
    description: "Comfort through long sessions.",
  },
  {
    title: "Premium Finish",
    description: "Metal texture, clean coating, lasting feel.",
  },
] as const;

/** Сервисные преимущества над футером. */
export const SERVICE_HIGHLIGHTS = [
  {
    title: "Customer service",
    description: "Always ready to help you get what you need.",
    icon: "headset",
  },
  {
    title: "Fast Shipping",
    description: "Fast delivery to over 103 countries.",
    icon: "package",
  },
  {
    title: "12-Month Warranty",
    description: "Rest easy with a 12 Month warranty covering any issues.",
    icon: "wrench",
  },
  {
    title: "AfterPay Available",
    description: "Personalise now, pay later with AfterPay.",
    icon: "users",
  },
] as const;

/** Колонки футера. */
export const FOOTER_COLUMNS = [
  {
    title: "Mouse",
    links: [
      { label: "HUAN", href: "/products/huan" },
      { label: "Beast X Mini Pro", href: "/products/beast-x-mini-pro" },
      { label: "Beast X Pro", href: "/products/beast-x-pro" },
      { label: "Beast X Max", href: "/products/beast-x-max" },
      { label: "Beast Miao", href: "/products/beast-miao" },
      { label: "Swords", href: "/products/sword" },
      { label: "Strider", href: "/products/strider" },
      { label: "YING", href: "/products?category=mouse" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "#contact" },
      { label: "FAQS", href: "#faq" },
      { label: "Download", href: "#download" },
      { label: "Reseller", href: "#reseller" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "About Us", href: "#about" },
      { label: "Discord", href: "https://discord.com" },
      { label: "News", href: "#news" },
    ],
  },
  {
    title: "Programs",
    links: [
      { label: "AFFILIATE", href: "#affiliate" },
      { label: "WL Testers", href: "#testers" },
      { label: "Review Program", href: "#reviews" },
    ],
  },
  {
    title: "Policy",
    links: [
      { label: "Shipping Policy", href: "#shipping" },
      { label: "Return Policy", href: "#return" },
      { label: "Warranty Policy", href: "#warranty" },
      { label: "Payment Method", href: "#payment" },
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Terms of Service", href: "#terms" },
    ],
  },
] as const;

/** Мелкие юридические ссылки в самом низу футера. */
export const LEGAL_LINKS = [
  { label: "Refund policy", href: "#return" },
  { label: "Privacy policy", href: "#privacy" },
  { label: "Terms of service", href: "#terms" },
  { label: "Contact information", href: "#contact" },
  { label: "Cookie preferences", href: "#cookies" },
] as const;
