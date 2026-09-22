import Link from "next/link";
import { SITE, SOCIAL_LINKS } from "@/lib/constants";
import { SOCIAL_ICON_MAP } from "@/components/icons";

/** Фразы бегущей строки. */
const MARQUEE_ITEMS = [
  SITE.announcement,
  "Free shipping on orders over $99",
  "Get 5% off your first order",
  "12-month worry-free warranty",
];

/** Одна группа фраз — дублируется дважды для бесшовного цикла. */
function MarqueeGroup() {
  return (
    <div className="flex shrink-0 items-center" aria-hidden>
      {MARQUEE_ITEMS.map((text, i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          <span className="px-6 font-medium tracking-wide text-white/90">{text}</span>
          <span className="text-white/40">•</span>
        </span>
      ))}
    </div>
  );
}

/** Верхняя фиолетовая полоса: соц-иконки + бегущая строка анонсов.
 *  pb-7 — фиолетовый «запас» снизу, на который наезжает белый хедер
 *  своими скруглёнными верхними углами. */
export function AnnouncementBar() {
  return (
    <div className="relative z-30 overflow-hidden bg-gradient-to-r from-[#2a1056] via-[#3c1f70] to-[#2a1056] pb-7 text-white">
      <div className="container relative flex h-10 items-center text-xs">
        {/* Соц-иконки */}
        <div className="relative z-10 hidden items-center gap-3.5 pr-5 sm:flex">
          {SOCIAL_LINKS.map((s) => {
            const Icon = SOCIAL_ICON_MAP[s.icon];
            return (
              <Link
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="text-white/70 transition hover:text-white"
              >
                <Icon className="h-3.5 w-3.5" />
              </Link>
            );
          })}
        </div>

        {/* Бегущая строка */}
        <Link
          href={SITE.discordUrl}
          aria-label={SITE.announcement}
          className="mask-fade-x flex flex-1 overflow-hidden"
        >
          <div className="flex animate-marquee [--marquee-duration:32s]">
            <MarqueeGroup />
            <MarqueeGroup />
          </div>
        </Link>
      </div>
    </div>
  );
}
