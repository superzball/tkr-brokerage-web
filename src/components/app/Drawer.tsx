// src/components/app/Drawer.tsx
// Slide-in side panel (right or left). Used for the mobile sidebar and for
// side forms/detail panels. Escape-to-close + backdrop + scroll lock.

"use client";

import { useEffect, useRef } from "react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { cn } from "@/lib/cn";

export function Drawer({
  open,
  onClose,
  side = "right",
  className,
  label,
  children,
}: {
  open: boolean;
  onClose: () => void;
  side?: "left" | "right";
  className?: string;
  /** Accessible name for the dialog (e.g. "Navigation menu"). */
  label?: string;
  children: React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Move focus into the drawer on open and trap Tab within it.
  useFocusTrap(panelRef, open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <div
      className={cn("fixed inset-0 z-50", !open && "pointer-events-none")}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-ink-950/40 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className={cn(
          "absolute top-0 h-full w-[82%] max-w-[340px] bg-white shadow-card-lg flex flex-col outline-none transition-transform duration-300",
          side === "right" ? "right-0" : "left-0",
          open
            ? "translate-x-0"
            : side === "right"
              ? "translate-x-full"
              : "-translate-x-full",
          className,
        )}
        role="dialog"
        aria-modal="true"
        aria-label={label}
      >
        {children}
      </div>
    </div>
  );
}
