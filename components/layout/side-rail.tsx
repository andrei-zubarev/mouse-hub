import Link from "next/link";
import { SITE, SOCIAL_LINKS } from "@/lib/constants";
import { SOCIAL_ICON_MAP } from "@/components/icons";

/**
 * Плавающая вертикальная плашка у левого края: соц-иконки + «GET 5% OFF».
 * Видна на больших экранах, парит поверх контента (как на оригинале).
 */
export function SideRail() {
  return (
    <aside className="fixed left-3 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-1.5 rounded-full border border-border bg-background/85 px-1.5 py-3 shadow-card backdrop-blur-md xl:flex">
      {SOCIAL_LINKS.map((s) => {
        const Icon = SOCIAL_ICON_MAP[s.icon];
        return (
          <Link
            key={s.label}
            href={s.href}
            aria-label={s.label}
            className="grid h-8 w-8 place-items-center rounded-full text-foreground/65 transition hover:bg-muted hover:text-foreground"
          >
            <Icon className="h-4 w-4" />
          </Link>
        );
      })}

      <span className="my-1 h-px w-5 bg-border" />

      <Link
        href={SITE.discordUrl}
        className="py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground transition hover:text-brand [writing-mode:vertical-rl] rotate-180"
      >
        Get 5% Off
      </Link>
    </aside>
  );
}
