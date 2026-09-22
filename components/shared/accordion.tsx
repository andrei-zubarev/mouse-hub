"use client";

import { useState, type ReactNode } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  q: string;
  a: ReactNode;
}

/** Лёгкий аккордеон с плавной анимацией высоты (grid-rows trick). */
export function Accordion({
  items,
  defaultOpen = null,
  className,
}: {
  items: AccordionItem[];
  /** Индекс изначально раскрытого пункта, либо null. */
  defaultOpen?: number | null;
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);

  return (
    <div className={cn("divide-y divide-border border-y border-border", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-semibold text-foreground transition hover:text-brand"
            >
              <span>{item.q}</span>
              {isOpen ? (
                <Minus className="h-4 w-4 shrink-0 text-muted-foreground" />
              ) : (
                <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />
              )}
            </button>
            <div
              className={cn(
                "grid overflow-hidden transition-all duration-300 ease-premium",
                isOpen ? "grid-rows-[1fr] pb-4" : "grid-rows-[0fr]",
              )}
            >
              <div className="min-h-0 text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
