// src/components/auth/SocialButtons.tsx
// The 4 social sign-in buttons (LINE, Facebook, Google, TikTok) with
// brand-correct colors + glyphs. LINE & TikTok have no lucide match, so all
// four use inline brand SVGs here. When no role is known yet (login), clicking
// asks which role to continue as; signup passes its chosen role straight through.

"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Modal } from "@/components/app/Modal";
import { RoleCards } from "./RoleCards";
import { signInSocial } from "@/lib/auth/actions";
import { SOCIAL_PROVIDERS, type SocialProvider } from "@/lib/auth/mock";
import type { Locale, Role } from "@/types/portal";

const LABEL: Record<SocialProvider, string> = {
  line: "LINE",
  facebook: "Facebook",
  google: "Google",
  tiktok: "TikTok",
};

/** Brand glyphs (white on a colored chip, except Google's multicolor G). */
const GLYPH: Record<SocialProvider, React.ReactNode> = {
  facebook: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M13.5 21v-8h2.6l.4-3h-3V8.1c0-.87.27-1.46 1.5-1.46H17V4.06C16.4 3.98 15.5 3.9 14.5 3.9c-2.2 0-3.7 1.34-3.7 3.8V10H8.2v3h2.6v8h2.7z" />
    </svg>
  ),
  google: (
    <svg viewBox="0 0 24 24" width="20" height="20">
      <path fill="#4285F4" d="M21.6 12.2c0-.64-.06-1.25-.16-1.84H12v3.49h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.23c1.89-1.74 2.99-4.3 2.99-7.17z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.42l-3.23-2.5c-.9.6-2.04.95-3.39.95-2.61 0-4.82-1.76-5.61-4.13H3.05v2.59A10 10 0 0 0 12 22z" />
      <path fill="#FBBC05" d="M6.39 13.9a6 6 0 0 1 0-3.8V7.51H3.05a10 10 0 0 0 0 8.98l3.34-2.59z" />
      <path fill="#EA4335" d="M12 5.98c1.47 0 2.79.5 3.83 1.5l2.86-2.86C16.96 2.98 14.7 2 12 2A10 10 0 0 0 3.05 7.51l3.34 2.59C7.18 7.74 9.39 5.98 12 5.98z" />
    </svg>
  ),
  line: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M12 3C6.9 3 2.8 6.34 2.8 10.46c0 3.69 3.27 6.78 7.68 7.37.3.06.7.2.8.45.1.23.06.59.03.82l-.13.78c-.04.23-.18.9.79.49 0.97-.41 5.23-3.08 7.14-5.27 1.32-1.45 1.95-2.92 1.95-4.64C21.86 6.34 17.76 3 12 3zM8.4 12.86H6.6c-.26 0-.47-.21-.47-.47V8.78c0-.26.21-.47.47-.47.26 0 .47.21.47.47v3.14H8.4c.26 0 .47.21.47.47s-.21.47-.47.47zm1.86-.47c0 .26-.21.47-.47.47s-.47-.21-.47-.47V8.78c0-.26.21-.47.47-.47s.47.21.47.47v3.61zm4.2 0c0 .2-.13.38-.32.45a.47.47 0 0 1-.53-.17l-1.85-2.52v2.24c0 .26-.21.47-.47.47s-.47-.21-.47-.47V8.78c0-.2.13-.38.32-.44.2-.07.42 0 .53.17l1.86 2.52V8.78c0-.26.21-.47.47-.47s.47.21.47.47v3.61zm2.98-2.27c.26 0 .47.21.47.47s-.21.47-.47.47h-1.33v.86h1.33c.26 0 .47.21.47.47s-.21.47-.47.47h-1.8c-.26 0-.47-.21-.47-.47V8.78c0-.26.21-.47.47-.47h1.8c.26 0 .47.21.47.47s-.21.47-.47.47h-1.33v.86h1.33z" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M16.5 3c.3 2.06 1.46 3.3 3.5 3.43v2.36c-1.18.12-2.21-.27-3.42-1v4.94c0 5.02-5.47 6.59-7.67 3a4.5 4.5 0 0 1 4.6-6.95v2.42a5.6 5.6 0 0 0-.96-.07 1.97 1.97 0 0 0-.36 3.9c1.46.27 2.5-.62 2.5-2.05V3h1.81z" />
    </svg>
  ),
};

/** Brand chip background (Google is light with a border). */
const STYLE: Record<SocialProvider, string> = {
  facebook: "bg-[#1877F2] text-white border-transparent",
  google: "bg-white text-ink-800 border-ink-200",
  line: "bg-[#06C755] text-white border-transparent",
  tiktok: "bg-black text-white border-transparent",
};

export function SocialButtons({ role }: { role?: Role }) {
  const t = useTranslations("auth.social");
  const locale = useLocale() as Locale;
  const [pending, startTransition] = useTransition();
  const [chooser, setChooser] = useState<SocialProvider | null>(null);

  function go(provider: SocialProvider, chosen: Role) {
    setChooser(null);
    startTransition(() => signInSocial(locale, provider, chosen));
  }

  function onClick(provider: SocialProvider) {
    if (role) go(provider, role);
    else setChooser(provider); // login: ask which role first
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        {SOCIAL_PROVIDERS.map((p) => (
          <button
            key={p}
            type="button"
            disabled={pending}
            onClick={() => onClick(p)}
            aria-label={t("continueWith", { provider: LABEL[p] })}
            className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-600 transition-transform hover:-translate-y-px disabled:opacity-50 ${STYLE[p]}`}
          >
            {GLYPH[p]}
            <span>{LABEL[p]}</span>
          </button>
        ))}
      </div>

      <Modal
        open={chooser !== null}
        onClose={() => setChooser(null)}
        title={chooser ? t("chooseRole", { provider: LABEL[chooser] }) : ""}
      >
        <p className="text-sm text-ink-500 mb-4">{t("chooseRoleSub")}</p>
        <RoleCards
          className="grid-cols-1 sm:grid-cols-1"
          onPick={(r) => chooser && go(chooser, r)}
        />
      </Modal>
    </>
  );
}
