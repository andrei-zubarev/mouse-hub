"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Доступная модалка на базе Radix (фокус-трап, Esc, портал). Анимация — через data-state + Tailwind. */
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-[100] bg-gradient-to-b from-black/55 to-black/70 backdrop-blur-xl",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:duration-500 data-[state=closed]:duration-300 data-[state=open]:ease-[cubic-bezier(0.3,1,0.3,1)]",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    hideClose?: boolean;
  }
>(({ className, children, hideClose, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    {/* Центрирование через flex-обёртку — чтобы zoom-анимация шла из центра,
        а не от угла (translate-центрирование конфликтует с transform-анимацией). */}
    <div className="pointer-events-none fixed inset-0 z-[101] grid place-items-center p-4 sm:p-6">
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "pointer-events-auto relative w-full max-w-4xl",
          "rounded-[1.75rem] border border-white/70 bg-background shadow-[0_40px_120px_-24px_rgba(0,0,0,0.55)] ring-1 ring-black/5",
          // Плавно из центра: масштаб + фейд (open .5s, close .35s), фирменный ease
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-90 data-[state=closed]:zoom-out-95 data-[state=open]:duration-500 data-[state=closed]:duration-[350ms] data-[state=open]:ease-[cubic-bezier(0.3,1,0.3,1)] data-[state=closed]:ease-[cubic-bezier(0.3,1,0.3,1)]",
          "focus:outline-none",
          className,
        )}
        {...props}
      >
        {children}
        {!hideClose && (
          <DialogPrimitive.Close className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-muted text-foreground transition hover:bg-foreground hover:text-background animate-in fade-in fill-mode-both duration-300 [animation-delay:550ms]">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </div>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("font-display text-xl font-bold", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
};
