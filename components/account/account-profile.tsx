"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";

const PROVIDER_LABEL = {
  email: "Email",
  shop: "Shop",
  google: "Google",
} as const;

type SavePhase = "idle" | "saving" | "saved";

/** Профиль: редактирование контактов и подписки, mock-сохранение в стор. */
export function AccountProfile() {
  const { user, updateProfile } = useAuthStore();

  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    country: user?.country ?? "Austria",
    newsletter: user?.newsletter ?? false,
  });
  const [phase, setPhase] = useState<SavePhase>("idle");

  if (!user) return null;

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setPhase("idle");
  };

  const save = () => {
    if (phase !== "idle") return;
    setPhase("saving");
    setTimeout(() => {
      updateProfile(form);
      setPhase("saved");
      setTimeout(() => setPhase("idle"), 2200);
    }, 750);
  };

  const fieldClass =
    "h-12 w-full rounded-xl border border-input bg-background px-4 text-[15px] outline-none transition placeholder:text-muted-foreground focus:border-brand focus:ring-2 focus:ring-brand/25";

  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <section className="rounded-3xl border border-border p-6 sm:p-8">
        <h2 className="font-display text-lg font-bold">Personal details</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          This information is used for shipping and order updates.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
          className="mt-6 grid gap-4 sm:grid-cols-2"
        >
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Full name
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className={fieldClass}
              placeholder="Jane Doe"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className={fieldClass}
              placeholder="you@example.com"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Phone
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              className={fieldClass}
              placeholder="+43 660 000 000"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Country
            <input
              value={form.country}
              onChange={(e) => set("country", e.target.value)}
              className={fieldClass}
              placeholder="Austria"
            />
          </label>

          <label className="flex cursor-pointer select-none items-center gap-2.5 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={form.newsletter}
              onChange={(e) => set("newsletter", e.target.checked)}
              className="peer sr-only"
            />
            <span
              className={cn(
                "grid h-[18px] w-[18px] place-items-center rounded-[5px] border transition-all duration-200",
                form.newsletter
                  ? "border-brand bg-brand text-white"
                  : "border-foreground/30 bg-background",
              )}
            >
              {form.newsletter && <Check className="h-3 w-3" strokeWidth={3} />}
            </span>
            Email me with news and offers
          </label>

          <div className="mt-2 flex items-center gap-4 sm:col-span-2">
            <Button type="submit" variant="brand" size="lg" disabled={phase === "saving"} className="min-w-[160px]">
              <AnimatePresence mode="wait" initial={false}>
                {phase === "saving" ? (
                  <motion.span
                    key="saving"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="inline-flex items-center gap-2"
                  >
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                  </motion.span>
                ) : phase === "saved" ? (
                  <motion.span
                    key="saved"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="inline-flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" /> Saved
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Save changes
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </form>
      </section>

      {/* Данные аккаунта */}
      <section className="h-fit rounded-3xl border border-border p-6 sm:p-8">
        <h2 className="font-display text-lg font-bold">Account</h2>
        <dl className="mt-4 flex flex-col gap-4 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">Signed in with</dt>
            <dd className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 font-medium">
              <BadgeCheck className="h-3.5 w-3.5 text-brand" />
              {PROVIDER_LABEL[user.provider]}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">Member since</dt>
            <dd className="font-medium">
              {new Date(user.joinedAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">Newsletter</dt>
            <dd className="font-medium">{user.newsletter ? "Subscribed" : "Off"}</dd>
          </div>
        </dl>
        <p className="mt-6 rounded-xl bg-muted px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          This is a demo account stored locally in your browser — no data leaves
          your device.
        </p>
      </section>
    </div>
  );
}
