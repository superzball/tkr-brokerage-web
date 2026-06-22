import { useTranslations } from "next-intl";
import { AppLink } from "@/components/ui/AppLink";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { ROUTES } from "@/config/nav";

/** Static page header (breadcrumb + title + 24h badge). */
export function WorkerPageHead() {
  const t = useTranslations("worker.head");
  return (
    <section className="bg-hero border-b border-ink-100/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-9">
        <div className="flex items-center gap-2 text-sm text-ink-400 mb-3">
          <AppLink href={ROUTES.home} className="hover:text-brand-600">
            {t("breadcrumbHome")}
          </AppLink>
          <span className="opacity-50">
            <Icon name="chevR" />
          </span>
          <span className="text-ink-600">{t("breadcrumbCurrent")}</span>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display font-700 text-3xl sm:text-4xl text-ink-900 tracking-tight">
              {t("title")}
            </h1>
            <p className="mt-2 text-ink-600">{t("subtitle")}</p>
          </div>
          <Chip className="bg-white border border-emerald-200 text-emerald-600 shadow-card">
            <Icon name="shieldCheck" /> {t("badge24h")}
          </Chip>
        </div>
      </div>
    </section>
  );
}
