"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Галерея товара: крупное изображение с кроссфейдом + миниатюры/стрелки. */
export function ProductGallery({
  images,
  alt,
  className,
}: {
  images: string[];
  alt: string;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(0);

  const go = (next: number) => {
    setDir(next > index ? 1 : -1);
    setIndex((next + images.length) % images.length);
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted/40">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={index}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.4, ease: [0.3, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={images[index]}
              alt={alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="object-contain p-8"
            />
          </motion.div>
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => go(index - 1)}
              className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-background/80 text-foreground opacity-0 shadow-card backdrop-blur transition group-hover:opacity-100 hover:bg-background"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => go(index + 1)}
              className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-background/80 text-foreground opacity-0 shadow-card backdrop-blur transition group-hover:opacity-100 hover:bg-background"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => go(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                "relative aspect-square w-20 overflow-hidden rounded-xl border bg-muted/40 transition",
                i === index
                  ? "border-brand ring-2 ring-brand/30"
                  : "border-border hover:border-foreground/30",
              )}
            >
              <Image src={img} alt="" fill sizes="80px" className="object-contain p-2" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
