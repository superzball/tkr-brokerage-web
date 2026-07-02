// src/components/conversion/LineChatWidget.tsx
// Persistent 24/7 LINE chat CTA across the public site. Floating button opens a
// small panel with a greeting + a deep link to the real LINE OA
// (contactInfo.lineHref). Client (toggle state).

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { contactInfo } from "@/config/contact";

const LINE_GREEN = "#06C755";

export function LineChatWidget() {
  const t = useTranslations("conversion.lineChat");
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 print:hidden">
      {open && (
        <div className="w-[300px] max-w-[calc(100vw-2.5rem)] rounded-2xl bg-white shadow-2xl border border-ink-100 overflow-hidden animate-fade-up">
          <div className="flex items-center gap-3 p-4 text-white" style={{ background: LINE_GREEN }}>
            <span className="w-9 h-9 rounded-full bg-white/20 inline-flex items-center justify-center font-700 text-sm">
              TKR
            </span>
            <div className="min-w-0">
              <p className="font-600 leading-tight">{t("title")}</p>
              <p className="text-xs text-white/85">{t("sub")}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("ariaClose")}
              className="ml-auto text-white/90 hover:text-white"
            >
              <Icon name="x" size={18} />
            </button>
          </div>
          <div className="p-4">
            <div className="rounded-2xl rounded-bl-sm bg-sky-50 px-3.5 py-2.5 text-sm text-ink-700">
              {t("greeting")}
            </div>
            <a
              href={contactInfo.lineHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 btn btn-md w-full text-white"
              style={{ background: LINE_GREEN }}
            >
              <Icon name="line" size={16} /> {t("openLine")}
            </a>
            <p className="mt-3 text-center text-xs text-ink-400">{t("hours")}</p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? t("ariaClose") : t("ariaOpen")}
        className={cn(
          "w-14 h-14 rounded-full shadow-xl text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95",
        )}
        style={{ background: LINE_GREEN }}
      >
        <Icon name={open ? "x" : "chat"} size={24} />
      </button>
    </div>
  );
}
