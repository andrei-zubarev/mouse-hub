import { cn } from "@/lib/utils";

/**
 * Декоративный «чертёжный» фон: тонкая сетка ромбов с
 * прицелами. Управляется цветом текста родителя (stroke = currentColor).
 */
export function BlueprintBg({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="bp-diamonds"
            width="240"
            height="240"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M120 12 L228 120 L120 228 L12 120 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle cx="120" cy="120" r="36" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M120 78 V162 M78 120 H162" stroke="currentColor" strokeWidth="1" />
            <circle cx="12" cy="120" r="3.5" fill="currentColor" />
            <circle cx="228" cy="120" r="3.5" fill="currentColor" />
            <circle cx="120" cy="12" r="3.5" fill="currentColor" />
            <circle cx="120" cy="228" r="3.5" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bp-diamonds)" />
      </svg>
    </div>
  );
}
