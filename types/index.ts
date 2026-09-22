/**
 * Доменные типы MOUSE HUB.
 */

export type ProductCategory = "mouse" | "keyboard" | "mousepad" | "iem";

export type ProductBadge = "New" | "Limited" | "Hot" | "Sold Out" | null;

/** Иконка характеристики (мапится на lucide-иконку в ProductSpecs). */
export type SpecIcon =
  | "weight"
  | "sensor"
  | "battery"
  | "material"
  | "connection"
  | "polling"
  | "switches"
  | "layout"
  | "size";

export interface ProductSpec {
  icon: SpecIcon;
  label: string;
  value: string;
}

/** Вариант товара — цвет / исполнение. */
export interface ProductVariant {
  id: string;
  name: string;
  /** HEX для свотча цвета. */
  hex: string;
  /** Доп. наценка к базовой цене (по умолчанию 0). */
  priceDelta?: number;
  available?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  /** Короткий подзаголовок («Magnesium Alloy, Symmetrical»). */
  tagline: string;
  category: ProductCategory;
  /** Базовая цена в USD. */
  price: number;
  /** Старая (зачёркнутая) цена для распродаж. */
  compareAtPrice?: number;
  /** Префикс «From» как на оригинале. */
  fromPrice?: boolean;
  badge?: ProductBadge;
  description: string;
  highlights: string[];
  images: string[];
  /** Цвет плитки-подложки под фото (совпадает с фоном фотографии). */
  tint?: string;
  specs: ProductSpec[];
  variants: ProductVariant[];
  inStock: boolean;
  rating?: number;
  reviews?: number;
  featured?: boolean;
}

/** Позиция в корзине. */
export interface CartItem {
  /** Уникальный ключ строки корзины: `${productId}:${variantId}`. */
  key: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  variantId: string;
  variantName: string;
  price: number;
  quantity: number;
}

export interface Collection {
  id: string;
  title: string;
  tagline: string;
  href: string;
  image: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}
