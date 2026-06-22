import { useTranslations } from "next-intl";
import { AppLink } from "@/components/ui/AppLink";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { ROUTES } from "@/config/nav";
import { TRACK_ORDER_NO } from "@/config/tracking";

export function TrackingHero() {
  const t = useTranslations("tracking");
  return (
    <section className="bg-hero border-b border-ink-100/70">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-9">
        <div className="flex items-center gap-2 text-sm text-ink-400 mb-3">
          <AppLink href={ROUTES.customer} className="hover:text-brand-600">
            {t("breadcrumb.customer")}
          </AppLink>
          <span className="opacity-50">
            <Icon name="chevR" />
          </span>
          <span className="text-ink-600">{t("breadcrumb.current")}</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-700 text-3xl sm:text-4xl text-ink-900 tracking-tight">
              {t("title")}
            </h1>
            <p className="mt-2 text-ink-600">
              {t("orderPrefix")}{" "}
              <span className="font-600 text-ink-900 tabnum">
                {TRACK_ORDER_NO}
              </span>{" "}
              · {t("orderInfo")}
            </p>
          </div>
          <Chip className="bg-white border border-brand-200 text-brand-700 shadow-card">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />{" "}
            {t("statusBadge")}
          </Chip>
        </div>
      </div>
    </section>
  );
}
