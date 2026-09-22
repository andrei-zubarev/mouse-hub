import { Headset, Package, Users, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { SERVICE_HIGHLIGHTS } from "@/lib/constants";

const ICONS = {
  headset: Headset,
  package: Package,
  wrench: Wrench,
  users: Users,
} as const;

const LAST = SERVICE_HIGHLIGHTS.length - 1;

/**
 * Полоса сервисных преимуществ сразу под Discord-баннером: четыре колонки,
 * разделённые тонкими вертикальными линиями, иконка слева от текста.
 * По краям сетки линий и внутренних отступов нет — как в оригинале.
 */
export function ServiceHighlights() {
  return (
    <section className="border-t border-border bg-background">
      <div className="container py-8 sm:py-10">
        <RevealGroup className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICE_HIGHLIGHTS.map((item, i) => {
            const Icon = ICONS[item.icon as keyof typeof ICONS];
            return (
              <RevealItem
                key={item.title}
                className={cn(
                  "sm:px-7 lg:px-8",
                  // 2 колонки: линия у правой, без отступа у внешних краёв
                  i % 2 === 0 ? "sm:pl-0" : "sm:border-l sm:border-border sm:pr-0",
                  // 4 колонки: линия у всех, кроме первой
                  i === 0 ? "lg:border-l-0 lg:pl-0" : "lg:border-l lg:border-border",
                  i === LAST && "lg:pr-0",
                )}
              >
                <div className="flex items-start gap-3">
                  <Icon
                    className="mt-0.5 h-[18px] w-[18px] shrink-0 text-foreground"
                    strokeWidth={1.6}
                  />
                  <div className="min-w-0">
                    <h3 className="font-display text-[15px] font-bold leading-tight text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
