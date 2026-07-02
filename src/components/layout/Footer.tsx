"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { AppLink } from "@/components/ui/AppLink";
import { Icon } from "@/components/ui/Icon";
import { ManageCookiesLink } from "@/components/legal/ManageCookiesLink";
import { site } from "@/config/site";
import { contactInfo } from "@/config/contact";
import { FOOTER_SOCIAL } from "@/config/nav";
import { useVisibleFooterColumns } from "@/hooks/useNavVisibility";

export function Footer() {
  const t = useTranslations("footer");
  const tc = useTranslations("common");
  // Data-driven visibility: hidden footer links + emptied columns filtered out,
  // sharing the same flags as the navbar (NAV_VISIBILITY).
  const columns = useVisibleFooterColumns();

  return (
    <footer className="bg-ink-950 text-ink-200 mt-24">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="mb-4">
              <Image
                src={site.logos.monoWhite}
                alt={tc("brandAlt")}
                width={470}
                height={279}
                className="h-10 w-auto"
              />
            </div>
            <p className="text-sm text-ink-300 leading-relaxed max-w-xs">
              {t("tagline")}
            </p>
            {/* contact channels — values from contactInfo (single source) */}
            <ul className="mt-5 space-y-2.5 text-sm">
              <li>
                <a href={contactInfo.phoneHref} className="inline-flex items-center gap-2.5 text-ink-300 hover:text-white transition-colors">
                  <Icon name="phone" size={15} /> {contactInfo.phone}
                </a>
              </li>
              <li>
                <a href={contactInfo.lineHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 text-ink-300 hover:text-white transition-colors">
                  <Icon name="line" size={15} /> {contactInfo.line}
                </a>
              </li>
              <li>
                <a href={contactInfo.emailHref} className="inline-flex items-center gap-2.5 text-ink-300 hover:text-white transition-colors">
                  <Icon name="mail" size={15} /> {contactInfo.email}
                </a>
              </li>
              <li>
                <a href={contactInfo.googleMap} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-2.5 text-ink-300 hover:text-white transition-colors">
                  <Icon name="pin" size={15} className="mt-0.5 shrink-0" /> {contactInfo.addressShort}
                </a>
              </li>
            </ul>
            <div className="flex gap-3 mt-5">
              {FOOTER_SOCIAL.map((s) => (
                <a
                  key={s.icon}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-ink-800 hover:bg-brand-600 transition-colors inline-flex items-center justify-center text-ink-200 hover:text-white"
                >
                  <Icon name={s.icon} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.key} className="md:col-span-2">
              <h4 className="text-white font-600 text-sm mb-4">
                {t(`col.${col.key}`)}
              </h4>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((link, i) => (
                  <li key={`${link.key}-${i}`}>
                    <AppLink
                      href={link.href}
                      className="text-ink-300 hover:text-white transition-colors"
                    >
                      {t(`link.${link.key}`)}
                    </AppLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-ink-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-400">
          <span>{t("copyright")}</span>
          <span className="flex flex-wrap gap-x-5 gap-y-2">
            <AppLink href="/legal/privacy" className="hover:text-white">
              {t("legal.privacy")}
            </AppLink>
            <AppLink href="/legal/terms" className="hover:text-white">
              {t("legal.terms")}
            </AppLink>
            <AppLink href="/legal/cookies" className="hover:text-white">
              {t("legal.cookies")}
            </AppLink>
            <ManageCookiesLink className="hover:text-white" />
          </span>
        </div>
      </div>
    </footer>
  );
}
