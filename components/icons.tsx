import * as React from "react";
import {
  Weight,
  Crosshair,
  BatteryFull,
  Layers,
  Wifi,
  Gauge,
  ToggleLeft,
  LayoutGrid,
  Ruler,
  type LucideIcon,
} from "lucide-react";
import type { SpecIcon } from "@/types";

/** Маппинг ключа характеристики на lucide-иконку. */
export const SPEC_ICONS: Record<SpecIcon, LucideIcon> = {
  weight: Weight,
  sensor: Crosshair,
  battery: BatteryFull,
  material: Layers,
  connection: Wifi,
  polling: Gauge,
  switches: ToggleLeft,
  layout: LayoutGrid,
  size: Ruler,
};

type SvgProps = React.SVGProps<SVGSVGElement>;

/* ───────── Соц-иконки (в lucide нет TikTok/Discord/X-glyph) ───────── */

export function XIcon(props: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.65l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function InstagramIcon(props: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zm0 3.68A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4zm6.41-10.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44z" />
    </svg>
  );
}

export function YouTubeIcon(props: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6z" />
    </svg>
  );
}

export function TikTokIcon(props: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M16.6 5.82a4.28 4.28 0 0 1-1.06-2.82h-3.3v13.16a2.59 2.59 0 1 1-2.59-2.59c.27 0 .53.04.78.12v-3.37a5.94 5.94 0 0 0-.78-.05 5.96 5.96 0 1 0 5.96 5.96V8.9a7.5 7.5 0 0 0 4.37 1.4V7a4.3 4.3 0 0 1-3.38-1.18z" />
    </svg>
  );
}

export function DiscordIcon(props: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.32 4.94A19.8 19.8 0 0 0 15.4 3.4a13.7 13.7 0 0 0-.63 1.28 18.3 18.3 0 0 0-5.51 0A13.6 13.6 0 0 0 8.62 3.4 19.74 19.74 0 0 0 3.7 4.94 20.27 20.27 0 0 0 .2 18.61a19.9 19.9 0 0 0 6.03 3.04 14.7 14.7 0 0 0 1.29-2.1 12.9 12.9 0 0 1-2.03-.98c.17-.12.34-.25.5-.38a14.18 14.18 0 0 0 12.06 0c.16.14.33.26.5.38a12.86 12.86 0 0 1-2.04.98 14.5 14.5 0 0 0 1.29 2.1 19.84 19.84 0 0 0 6.04-3.04 20.25 20.25 0 0 0-3.51-13.67zM8.02 15.33c-1.18 0-2.16-1.09-2.16-2.42S6.82 10.5 8.02 10.5s2.18 1.09 2.16 2.41c0 1.33-.97 2.42-2.16 2.42zm7.96 0c-1.18 0-2.16-1.09-2.16-2.42s.96-2.41 2.16-2.41 2.18 1.09 2.16 2.41c0 1.33-.96 2.42-2.16 2.42z" />
    </svg>
  );
}

export const SOCIAL_ICON_MAP: Record<string, (p: SvgProps) => React.JSX.Element> = {
  x: XIcon,
  instagram: InstagramIcon,
  youtube: YouTubeIcon,
  tiktok: TikTokIcon,
  discord: DiscordIcon,
};

/** Минималистичный лого-знак бренда (стилизованная «X»). */
export function MouseHubLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <path
        d="M8 8l24 24M32 8L8 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
