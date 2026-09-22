"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ShoppingBag } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";
import type { Product, ProductVariant } from "@/types";

interface AddToCartButtonProps extends Omit<ButtonProps, "onClick" | "variant"> {
  product: Product;
  variant: ProductVariant;
  quantity?: number;
  /** Открывать ли корзину-дроуэр после добавления. */
  openCartOnAdd?: boolean;
  label?: string;
}

/** Кнопка «в корзину» с микро-анимацией подтверждения. */
export function AddToCartButton({
  product,
  variant,
  quantity = 1,
  openCartOnAdd = true,
  label = "Add to cart",
  className,
  ...props
}: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUIStore((s) => s.openCart);
  const [added, setAdded] = useState(false);

  if (!product.inStock) {
    return (
      <Button disabled variant="outline" className={cn("cursor-not-allowed", className)} {...props}>
        Sold Out
      </Button>
    );
  }

  function handleAdd() {
    addItem(product, variant, quantity);
    setAdded(true);
    if (openCartOnAdd) openCart();
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <Button onClick={handleAdd} className={cn("relative overflow-hidden", className)} {...props}>
      <AnimatePresence mode="wait" initial={false}>
        {added ? (
          <motion.span
            key="added"
            className="inline-flex items-center gap-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <Check className="h-4 w-4" /> Added
          </motion.span>
        ) : (
          <motion.span
            key="add"
            className="inline-flex items-center gap-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <ShoppingBag className="h-4 w-4" /> {label}
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
}
