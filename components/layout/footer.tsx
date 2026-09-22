import Link from "next/link";
import {
  FOOTER_COLUMNS,
  LEGAL_LINKS,
  SITE,
  SOCIAL_LINKS,
} from "@/lib/constants";
import { SOCIAL_ICON_MAP, MouseHubLogo } from "@/components/icons";
import { PAYMENT_ICONS } from "@/components/payment-icons";

/**
 * Тёмный футер: бренд + соцсети слева, пять колонок ссылок справа,
 * ниже — отдельная полоса с копирайтом, юридическими ссылками и
 * бейджами платёжных систем (с фиолетовой подсветкой справа).
 */
export function Footer() {
  return (
    <footer className="bg-ink text-ink-foreground">
      {/* ───────── Основная сетка ───────── */}
      <div className="container grid gap-12 py-14 sm:py-16 lg:grid-cols-[minmax(220px,300px)_1fr] lg:gap-8">
        {/* Бренд + соцсети */}
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <MouseHubLogo className="h-7 w-7 text-gold" />
            <span aria-hidden className="h-6 w-px bg-white/25" />
            <span className="font-display text-[22px] font-extrabold tracking-tight text-white">
              {SITE.name}
            </span>
          </Link>

          <div className="mt-7 flex items-center gap-5">
            {SOCIAL_LINKS.map((s) => {
              const Icon = SOCIAL_ICON_MAP[s.icon];
              return (
                <Link
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="text-white/85 transition-colors duration-300 hover:text-white"
                >
                  <Icon className="h-[19px] w-[19px]" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Колонки ссылок */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="font-display text-[17px] font-bold text-white">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[15px] text-white/85 transition-colors duration-300 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ───────── Нижняя полоса ───────── */}
      <div className="relative overflow-hidden border-t border-white/[0.07]">
        {/* Фиолетовая подсветка правого нижнего угла */}
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-[70%] right-[6%] aspect-square w-[46%] rounded-full bg-brand/40 blur-[110px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-[40%] right-[26%] aspect-square w-[22%] rounded-full bg-brand/30 blur-[80px]"
        />

        <div className="container relative flex flex-col gap-6 py-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[13px] text-white/90">
              © {SITE.year} {SITE.name}.
            </p>
            <ul className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-2">
              {LEGAL_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[11.5px] text-white/70 transition-colors duration-300 hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Бейджи платёжных систем */}
          <ul className="flex flex-wrap items-center gap-1.5 lg:justify-end">
            {PAYMENT_ICONS.map(({ label, Icon }) => (
              <li key={label}>
                <Icon className="h-6 w-[38px]" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
