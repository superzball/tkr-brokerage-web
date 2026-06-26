// src/components/app/Modal.tsx
// Centered dialog with backdrop, Escape-to-close, and body scroll lock.

"use client";

import { useEffect, useId, useRef } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { cn } from "@/lib/cn";

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  const t = useTranslations("app");
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  // Move focus into the dialog and trap Tab within it while open.
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

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
    >
      <div
        className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className={cn(
          "relative card card-lg w-full max-w-lg max-h-[85vh] overflow-auto outline-none",
          className,
        )}
      >
        <div className="sticky top-0 z-10 bg-[var(--ui-card-bg)] flex items-center justify-between p-5 border-b border-ink-100">
          <h2 id={titleId} className="text-lg font-700 text-ink-900">{title}</h2>
          <button
            onClick={onClose}
            aria-label={t("close")}
            className="w-8 h-8 rounded-lg text-ink-500 hover:bg-ink-50 flex items-center justify-center"
          >
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
        {footer && (
          <div className="sticky bottom-0 z-10 bg-[var(--ui-card-bg)] flex justify-end gap-2 p-5 border-t border-ink-100">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
