import Image from "next/image";
import { useTranslations } from "next-intl";
import { AppLink } from "@/components/ui/AppLink";
import { Icon } from "@/components/ui/Icon";
import { site } from "@/config/site";
import { FOOTER_COLUMNS, FOOTER_SOCIAL } from "@/config/nav";

export function Footer() {
  const t = useTranslations("footer");
  const tc = useTranslations("common");

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
            <div className="flex gap-3 mt-5">
              {FOOTER_SOCIAL.map((s) => (
                <span
                  key={s}
                  className="w-9 h-9 rounded-lg bg-ink-800 hover:bg-brand-600 transition-colors inline-flex items-center justify-center cursor-pointer text-ink-200 hover:text-white"
                >
                  <Icon name={s} />
                </span>
              ))}
            </div>
          </div>

          {FOOTER_COLUMNS.map((col) => (
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
          <span className="flex gap-5">
            <a href="#" className="hover:text-white">
              {t("legal.privacy")}
            </a>
            <a href="#" className="hover:text-white">
              {t("legal.terms")}
            </a>
            <a href="#" className="hover:text-white">
              {t("legal.pdpa")}
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
