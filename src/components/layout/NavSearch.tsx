"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icon";
import { ROUTES } from "@/config/nav";

/**
 * Friendly-zone navbar search (Phase 19). A compact icon button that expands
 * into an inline field; submitting routes to the all-products page with the
 * term as a query param (the page safely ignores unknown params — no new route
 * or backend). Open state is controlled by the Navbar so the center links can
 * yield room while searching. Collapses on Escape / empty blur.
 */
export function NavSearch({
  open,
  onOpen,
  onClose,
}: {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const t = useTranslations("topnav");
  const router = useRouter();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    router.push(
      term ? `${ROUTES.insurance}?q=${encodeURIComponent(term)}` : ROUTES.insurance,
    );
    onClose();
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={onOpen}
        aria-label={t("search")}
        aria-expanded={false}
        className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-ink-600 hover:bg-sky-100 hover:text-brand-600 transition-colors"
      >
        <Icon name="search" size={19} />
      </button>
    );
  }

  return (
    <form
      onSubmit={submit}
      role="search"
      className="flex items-center gap-1.5 h-9 pl-3 pr-1 rounded-full bg-sky-50 border border-brand-200 focus-within:border-brand-500 transition-colors"
    >
      <Icon name="search" size={17} className="text-brand-500 shrink-0" />
      <input
        ref={inputRef}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onBlur={() => !q && onClose()}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setQ("");
            onClose();
          }
        }}
        placeholder={t("searchPlaceholder")}
        aria-label={t("search")}
        className="w-48 xl:w-64 bg-transparent text-sm text-ink-900 placeholder:text-ink-400 outline-none"
      />
      <button
        type="submit"
        aria-label={t("search")}
        className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-brand-500 text-white hover:bg-brand-600 transition-colors shrink-0"
      >
        <Icon name="arrowRight" size={15} />
      </button>
    </form>
  );
}
