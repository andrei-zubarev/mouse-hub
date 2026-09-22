import * as React from "react";

/**
 * Бейджи платёжных систем для футера.
 *
 * Каждая иконка — самодостаточный SVG в формате 38×24 (пропорции реальных
 * карточных бейджей) на белой подложке со скруглением 3px, как в оригинале.
 * Рисуем формами и текстом: файлы не тянем, внешних запросов нет.
 */

type BadgeProps = React.SVGProps<SVGSVGElement>;

/** Общая белая подложка бейджа. */
function Badge({
  children,
  label,
  ...rest
}: BadgeProps & { children: React.ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 38 24" role="img" aria-label={label} {...rest}>
      <rect width="38" height="24" rx="3" fill="#fff" />
      {children}
    </svg>
  );
}

/** Плотный узкий шрифт для вордмарков внутри бейджей. */
const WORD = {
  fontFamily:
    "'Helvetica Neue', Helvetica, Arial, sans-serif" as const,
  fontWeight: 700,
} as const;

export function VisaIcon(props: BadgeProps) {
  return (
    <Badge label="Visa" {...props}>
      <text
        x="19"
        y="16.5"
        textAnchor="middle"
        fontSize="10"
        letterSpacing="-0.3"
        fill="#1A1F71"
        fontStyle="italic"
        style={WORD}
      >
        VISA
      </text>
    </Badge>
  );
}

export function MastercardIcon(props: BadgeProps) {
  return (
    <Badge label="Mastercard" {...props}>
      <circle cx="15.5" cy="12" r="6.5" fill="#EB001B" />
      <circle cx="22.5" cy="12" r="6.5" fill="#F79E1B" />
      <path
        d="M19 6.6a6.5 6.5 0 0 0 0 10.8 6.5 6.5 0 0 0 0-10.8z"
        fill="#FF5F00"
      />
    </Badge>
  );
}

export function MaestroIcon(props: BadgeProps) {
  return (
    <Badge label="Maestro" {...props}>
      <circle cx="15.5" cy="11" r="6.2" fill="#EB001B" />
      <circle cx="22.5" cy="11" r="6.2" fill="#0099DF" />
      <path d="M19 5.8a6.2 6.2 0 0 0 0 10.4 6.2 6.2 0 0 0 0-10.4z" fill="#6C6BBD" />
      <text
        x="19"
        y="22.4"
        textAnchor="middle"
        fontSize="4.4"
        fill="#231F20"
        style={WORD}
      >
        maestro
      </text>
    </Badge>
  );
}

export function AmexIcon(props: BadgeProps) {
  return (
    <Badge label="American Express" {...props}>
      <rect x="1" y="1" width="36" height="22" rx="2.2" fill="#1F72CD" />
      <text
        x="19"
        y="10.6"
        textAnchor="middle"
        fontSize="5.2"
        letterSpacing="0.1"
        fill="#fff"
        style={WORD}
      >
        AMERICAN
      </text>
      <text
        x="19"
        y="17.4"
        textAnchor="middle"
        fontSize="5.2"
        letterSpacing="0.1"
        fill="#fff"
        style={WORD}
      >
        EXPRESS
      </text>
    </Badge>
  );
}

export function ApplePayIcon(props: BadgeProps) {
  return (
    <Badge label="Apple Pay" {...props}>
      {/* Надкушенное яблоко */}
      <path
        d="M13.28 9.02c-.62.04-1.35.43-1.78.95-.38.45-.7 1.15-.6 1.8.68.05 1.38-.36 1.79-.87.4-.5.66-1.18.59-1.88zM13.26 11.2c-.98-.06-1.82.55-2.29.55-.48 0-1.2-.53-1.97-.52-1.02.02-1.95.59-2.47 1.5-1.05 1.84-.27 4.56.76 6.05.5.73 1.1 1.55 1.9 1.52.75-.03 1.04-.49 1.96-.49.9 0 1.16.48 1.95.47.81-.02 1.34-.75 1.85-1.48.58-.85.82-1.67.83-1.71-.02-.01-1.6-.62-1.61-2.45-.02-1.54 1.25-2.27 1.31-2.31-.72-1.05-1.83-1.17-2.22-1.19z"
        transform="translate(0.5 -4.2) scale(0.78)"
        fill="#000"
      />
      <text x="19.2" y="16.6" fontSize="9" fill="#000" style={WORD}>
        Pay
      </text>
    </Badge>
  );
}

export function GooglePayIcon(props: BadgeProps) {
  return (
    <Badge label="Google Pay" {...props}>
      {/* Многоцветная «G» */}
      <g transform="translate(4 5.6) scale(0.53)">
        <path
          fill="#4285F4"
          d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3.01c-1.07.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.72-4.95H1.27v3.11A12 12 0 0 0 12 24z"
        />
        <path
          fill="#FBBC05"
          d="M5.28 14.28a7.2 7.2 0 0 1 0-4.56V6.61H1.27a12 12 0 0 0 0 10.78l4.01-3.11z"
        />
        <path
          fill="#EA4335"
          d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44A11.53 11.53 0 0 0 12 0 12 12 0 0 0 1.27 6.61l4.01 3.11C6.22 6.88 8.87 4.77 12 4.77z"
        />
      </g>
      <text x="19.4" y="16.6" fontSize="9" fill="#5F6368" style={WORD}>
        Pay
      </text>
    </Badge>
  );
}

export function PayPalIcon(props: BadgeProps) {
  return (
    <Badge label="PayPal" {...props}>
      {/* Две «P» уступами — узнаваемый знак PayPal */}
      <path
        d="M9.6 5.2h5.9c2.9 0 4.6 1.5 4.2 4.2-.4 2.9-2.5 4.4-5.5 4.4h-2.1l-.8 5h-3.6l1.9-13.6z"
        fill="#002F86"
      />
      <path
        d="M13.9 8.6h5.9c2.9 0 4.6 1.5 4.2 4.2-.4 2.9-2.5 4.4-5.5 4.4h-2.1l-.8 5h-3.6l1.9-13.6z"
        fill="#009CDE"
      />
    </Badge>
  );
}

export function DinersIcon(props: BadgeProps) {
  return (
    <Badge label="Diners Club" {...props}>
      <circle cx="19" cy="12" r="8.4" fill="#0079BE" />
      <circle cx="19" cy="12" r="6.4" fill="#fff" />
      <path
        d="M19 6.6a5.4 5.4 0 0 0 0 10.8V6.6z"
        fill="#0079BE"
      />
      <path d="M19 7.9a4.1 4.1 0 0 1 0 8.2V7.9z" fill="#0079BE" />
      <circle cx="19" cy="12" r="2.1" fill="#fff" />
    </Badge>
  );
}

export function DiscoverIcon(props: BadgeProps) {
  return (
    <Badge label="Discover" {...props}>
      <path d="M14 24h24V13.4C31.4 18.6 22.9 22.1 14 24z" fill="#F48120" />
      <text
        x="19"
        y="12.4"
        textAnchor="middle"
        fontSize="5.6"
        letterSpacing="-0.1"
        fill="#231F20"
        style={WORD}
      >
        DISCOVER
      </text>
      <circle cx="26.6" cy="8.4" r="2.4" fill="#F48120" />
    </Badge>
  );
}

export function JcbIcon(props: BadgeProps) {
  return (
    <Badge label="JCB" {...props}>
      {[
        { x: 4.4, fill: "#0E4C96", letter: "J" },
        { x: 14.4, fill: "#BE0034", letter: "C" },
        { x: 24.4, fill: "#008C44", letter: "B" },
      ].map((b) => (
        <React.Fragment key={b.letter}>
          <rect x={b.x} y="3.4" width="9.2" height="17.2" rx="2.4" fill={b.fill} />
          <text
            x={b.x + 4.6}
            y="14.6"
            textAnchor="middle"
            fontSize="7"
            fill="#fff"
            style={WORD}
          >
            {b.letter}
          </text>
        </React.Fragment>
      ))}
    </Badge>
  );
}

export function UnionPayIcon(props: BadgeProps) {
  return (
    <Badge label="UnionPay" {...props}>
      <path d="M6.6 2.6h8.2l-2.4 18.8H4.2L6.6 2.6z" fill="#E21836" />
      <path d="M14.9 2.6h8.2l-2.4 18.8h-8.2l2.4-18.8z" fill="#00447C" />
      <path d="M23.2 2.6h8.2l-2.4 18.8H20.8l2.4-18.8z" fill="#007B84" />
      <text
        x="19"
        y="15.2"
        textAnchor="middle"
        fontSize="5.2"
        fill="#fff"
        style={WORD}
      >
        UnionPay
      </text>
    </Badge>
  );
}

/** Порядок и состав — как в футере оригинала. */
export const PAYMENT_ICONS: Array<{
  label: string;
  Icon: (p: BadgeProps) => React.JSX.Element;
}> = [
  { label: "American Express", Icon: AmexIcon },
  { label: "Apple Pay", Icon: ApplePayIcon },
  { label: "Diners Club", Icon: DinersIcon },
  { label: "Discover", Icon: DiscoverIcon },
  { label: "Google Pay", Icon: GooglePayIcon },
  { label: "JCB", Icon: JcbIcon },
  { label: "Maestro", Icon: MaestroIcon },
  { label: "Mastercard", Icon: MastercardIcon },
  { label: "PayPal", Icon: PayPalIcon },
  { label: "UnionPay", Icon: UnionPayIcon },
  { label: "Visa", Icon: VisaIcon },
];
