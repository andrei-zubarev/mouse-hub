"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BlueprintBg } from "@/components/shared/blueprint-bg";
import { Accordion } from "@/components/shared/accordion";
import { SPEC_ICONS } from "@/components/icons";
import type { Product } from "@/types";

/* ───────────────────────── Контент-данные ───────────────────────── */

const SIZES = [
  { key: "Mini", weight: "34 g", length: "112 mm", grip: "Claw · Fingertip" },
  { key: "Medium", weight: "39 g", length: "120 mm", grip: "Claw · Palm" },
  { key: "Large", weight: "42 g", length: "125 mm", grip: "Palm" },
];

const FEATURES = [
  { title: "Flagship PAW 3950HS sensor", text: "30,000 DPI, 750 IPS and pinpoint tracking on every surface." },
  { title: "8000 Hz wireless", text: "0.125 ms response over 2.4G — indistinguishable from wired." },
  { title: "Optical micro-switches", text: "Zero debounce, rated for 100M crisp, consistent clicks." },
  { title: "Magnesium-alloy shell", text: "Aerospace-grade rigidity at a featherweight class." },
];

const FAQS = [
  {
    q: "Which model should I choose?",
    a: "Pick by hand size and grip: Mini suits claw and fingertip grips, Medium is the all-round competition shape, and Large adds palm support for bigger hands.",
  },
  {
    q: "What is the difference between Mini, Medium and Max?",
    a: "They share the same internals and sensor — only the shell length, width and weight change to match different hand sizes.",
  },
  {
    q: "What is a Micro-satellite Composite dongle?",
    a: "A compact 8000 Hz receiver with an extended antenna design for a rock-solid, low-latency wireless link even in crowded RF environments.",
  },
  {
    q: "Does the mouse support 8K polling rate?",
    a: "Yes. With the bundled high-frequency dongle the mouse runs a true 8000 Hz polling rate, configurable down to 1000 Hz in the web driver.",
  },
];

/* ───────────────────────── Обёртка панели ───────────────────────── */

function Panel({
  children,
  className,
  tone = "muted",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "muted" | "ink" | "light";
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative overflow-hidden rounded-3xl",
        tone === "ink" && "bg-ink text-ink-foreground",
        tone === "muted" && "bg-muted",
        tone === "light" && "bg-gradient-to-br from-muted via-background to-muted",
        className,
      )}
    >
      {children}
    </motion.section>
  );
}

/* ───────────────────────── Главный компонент ───────────────────────── */

export function ProductStory({ product }: { product: Product }) {
  const [size, setSize] = useState(1);
  const heroImg = product.images[0];
  const cardSpecs = product.specs.slice(0, 3);

  return (
    <div className="container flex flex-col gap-5 pb-4 pt-2 sm:gap-6">
      {/* Three Sizes */}
      <Panel tone="light" className="min-h-[280px] sm:min-h-[360px]">
        <BlueprintBg className="text-foreground/[0.07]" />
        <div className="relative flex h-full min-h-[280px] flex-col justify-end p-8 sm:min-h-[360px] sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            One shape, three fits
          </p>
          <h2 className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-6xl">
            Three Sizes
          </h2>
        </div>
      </Panel>

      {/* Choose your fit (dark) */}
      <Panel tone="ink" className="p-8 sm:p-12">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                Personalised ergonomics
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Choose your fit.
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60">
                Swap between three shells and a palette of finishes. Same Beast
                internals — dialled in to your hand and your style.
              </p>
            </div>

            {/* Размеры-табы */}
            <div className="flex gap-2">
              {SIZES.map((s, i) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setSize(i)}
                  className={cn(
                    "rounded-full px-4 py-2 text-xs font-semibold transition",
                    i === size
                      ? "bg-white text-ink"
                      : "bg-white/10 text-white/70 hover:bg-white/20",
                  )}
                >
                  {s.key}
                </button>
              ))}
            </div>

            {/* Цветовые точки */}
            <div className="flex items-center gap-2.5">
              {product.variants.map((v) => (
                <span
                  key={v.id}
                  title={v.name}
                  className="h-6 w-6 rounded-full ring-1 ring-white/20"
                  style={{ backgroundColor: v.hex }}
                />
              ))}
            </div>
          </div>

          {/* Карточка спецификаций выбранного размера */}
          <div className="relative">
            <div className="relative mx-auto aspect-square max-w-[280px] sm:max-w-[340px]">
              <Image
                src={heroImg}
                alt={product.name}
                fill
                sizes="340px"
                className="object-contain drop-shadow-2xl"
              />
            </div>
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="font-display text-sm font-bold">
                {product.name.split(" ").slice(0, 2).join(" ")} {SIZES[size].key}
              </p>
              <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-white/40">Weight</p>
                  <p className="text-sm font-semibold">{SIZES[size].weight}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-white/40">Length</p>
                  <p className="text-sm font-semibold">{SIZES[size].length}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-white/40">Grip</p>
                  <p className="text-[11px] font-semibold leading-tight">{SIZES[size].grip}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Panel>

      {/* A New Material Experience */}
      <Panel tone="muted" className="min-h-[320px] sm:min-h-[420px]">
        <BlueprintBg className="text-foreground/[0.06]" />
        <div className="relative flex min-h-[320px] max-w-lg flex-col justify-center p-8 sm:min-h-[420px] sm:p-14">
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
            A New Material Experience.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            A forged magnesium-alloy unibody delivers aerospace rigidity at a
            fraction of the weight. The result is a shell that stays planted and
            cool through the longest sessions — without ever feeling heavy.
          </p>
        </div>
      </Panel>

      {/* Built for Competitive Play */}
      <Panel tone="muted" className="min-h-[320px] sm:min-h-[420px]">
        <BlueprintBg className="text-foreground/[0.06]" />
        <div className="relative flex min-h-[320px] max-w-lg flex-col justify-center p-8 sm:min-h-[420px] sm:p-14">
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
            Built for Competitive Play.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Flagship sensor, 8000 Hz wireless and optical switches combine into a
            tool tuned for one thing: winning duels. Every gram and every
            millisecond is engineered out of your way.
          </p>
        </div>
      </Panel>

      {/* Сетка фич 2×2 */}
      <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
        {FEATURES.map((f) => (
          <Panel key={f.title} tone="muted" className="min-h-[200px]">
            <BlueprintBg className="text-foreground/[0.05]" />
            <div className="relative flex h-full min-h-[200px] flex-col justify-end p-7">
              <h3 className="font-display text-xl font-bold tracking-tight">{f.title}</h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">{f.text}</p>
            </div>
          </Panel>
        ))}
      </div>

      {/* Crisp Clicks. Clean Control. */}
      <Panel tone="muted" className="min-h-[320px] sm:min-h-[420px]">
        <BlueprintBg className="text-foreground/[0.06]" />
        <div className="relative flex min-h-[320px] max-w-lg flex-col justify-center p-8 sm:min-h-[420px] sm:p-14">
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
            Crisp Clicks.
            <br />
            Clean Control.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Pre-tensioned optical main buttons fire the instant you do — no
            debounce delay, no double-clicks, just a consistent, tactile snap
            shot after shot.
          </p>
        </div>
      </Panel>

      {/* Unique Cat Dongle (heading right) */}
      <Panel tone="muted" className="min-h-[320px] sm:min-h-[420px]">
        <BlueprintBg className="text-foreground/[0.06]" />
        <div className="relative flex min-h-[320px] flex-col items-end justify-center p-8 text-right sm:min-h-[420px] sm:p-14">
          <div className="max-w-md">
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
              Unique Cat Dongle.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              A pocketable 8000 Hz receiver with an extended antenna for a
              rock-solid link — wrapped in a playful design you will actually want
              on your desk.
            </p>
          </div>
        </div>
      </Panel>

      {/* Instant customization */}
      <Panel tone="muted" className="min-h-[260px]">
        <BlueprintBg className="text-foreground/[0.06]" />
        <div className="relative flex min-h-[260px] flex-col items-center justify-center gap-5 p-8 text-center sm:p-12">
          <div className="max-w-xl">
            <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-4xl">
              Instant customization. No downloads.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Adjust DPI, polling rate, lift-off distance and button mapping
              straight from the browser. Plug in, tune, play.
            </p>
          </div>
          <Button variant="default" size="lg">
            Open Web Driver
          </Button>
        </div>
      </Panel>

      {/* FAQ */}
      <section className="mx-auto w-full max-w-3xl px-1 py-12 sm:py-16">
        <h2 className="mb-8 text-center font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          FAQs
        </h2>
        <Accordion items={FAQS} />
      </section>

      {/* Спецификации (плашка) */}
      <Panel tone="muted" className="p-8 sm:p-12">
        <h2 className="font-display text-2xl font-bold tracking-tight">
          Technical specifications
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {product.specs.map((spec) => {
            const Icon = SPEC_ICONS[spec.icon];
            return (
              <div
                key={spec.label}
                className="flex items-center gap-3 rounded-2xl border border-border bg-background p-4"
              >
                <Icon className="h-5 w-5 shrink-0 text-brand" />
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    {spec.label}
                  </p>
                  <p className="truncate text-sm font-semibold">{spec.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      {/* Limited Edition CTA */}
      <Panel tone="ink" className="min-h-[260px]">
        <BlueprintBg className="text-white/[0.06]" />
        <div className="relative flex min-h-[260px] flex-col items-center justify-center gap-5 p-8 text-center sm:p-12">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
              Limited Edition?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              Collaboration drops sell out fast. Join the community to get early
              access and restock alerts before anyone else.
            </p>
          </div>
          <Button variant="outline-light" size="lg" className="gap-2">
            Join the drop <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Panel>
    </div>
  );
}
