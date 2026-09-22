import { PRODUCTS } from "@/lib/products";

/** Статус заказа (мок-история для личного кабинета). */
export type OrderStatus = "delivered" | "transit" | "processing";

export interface OrderItem {
  slug: string;
  name: string;
  image: string;
  variantName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  /** ISO-дата оформления. */
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  shipping: number;
  total: number;
  trackingNumber?: string;
}

export const ORDER_STATUS_META: Record<
  OrderStatus,
  { label: string; className: string; dotClassName: string }
> = {
  delivered: {
    label: "Delivered",
    className: "bg-emerald-500/10 text-emerald-600",
    dotClassName: "bg-emerald-500",
  },
  transit: {
    label: "In transit",
    className: "bg-brand/10 text-brand",
    dotClassName: "bg-brand",
  },
  processing: {
    label: "Processing",
    className: "bg-gold/15 text-amber-600",
    dotClassName: "bg-gold",
  },
};

const bySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug);

const makeItem = (slug: string, quantity = 1): OrderItem | null => {
  const p = bySlug(slug);
  if (!p) return null;
  return {
    slug: p.slug,
    name: p.name,
    image: p.images[0],
    variantName: p.variants[0]?.name ?? "Default",
    price: p.price,
    quantity,
  };
};

const makeOrder = (
  id: string,
  date: string,
  status: OrderStatus,
  itemDefs: Array<[slug: string, qty: number]>,
  trackingNumber?: string,
): Order | null => {
  const items = itemDefs
    .map(([slug, qty]) => makeItem(slug, qty))
    .filter((i): i is OrderItem => i !== null);
  if (items.length === 0) return null;

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal >= 99 ? 0 : 9;
  return { id, date, status, items, shipping, total: subtotal + shipping, trackingNumber };
};

/** Детерминированная мок-история заказов (новые сверху). */
export const MOCK_ORDERS: Order[] = [
  makeOrder("WL-10394", "2026-06-24", "processing", [["huan", 1], ["qisha-mousepad", 1]]),
  makeOrder("WL-10287", "2026-06-11", "transit", [["ying75-he-keyboard", 1]], "1Z 8842 0X91 04"),
  makeOrder("WL-10102", "2026-05-19", "delivered", [["beast-x-max", 1], ["chunhua-mousepad", 2]], "1Z 5511 7A22 89"),
  makeOrder("WL-09876", "2026-04-02", "delivered", [["beast-x-mini-pro", 1]], "1Z 2209 4C10 35"),
].filter((o): o is Order => o !== null);

export const selectOrdersTotal = (orders: Order[]) =>
  orders.reduce((sum, o) => sum + o.total, 0);
