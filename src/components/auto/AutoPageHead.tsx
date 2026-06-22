import { useTranslations } from "next-intl";
import { AppLink } from "@/components/ui/AppLink";
import { Icon } from "@/components/ui/Icon";
import { FieldLabel, SelectField } from "@/components/ui/Field";
import { ROUTES } from "@/config/nav";
import { AUTO_FORM } from "@/config/insurance";

/** Static page header: breadcrumb, title, and the (demo) car lookup form. */
export function AutoPageHead() {
  const t = useTranslations("auto");
  const years = t.raw("form.years") as string[];
  const classes = t.raw("form.classes") as string[];

  return (
    <section className="bg-hero border-b border-ink-100/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-9">
        <div className="flex items-center gap-2 text-sm text-ink-400 mb-3">
          <AppLink href={ROUTES.home} className="hover:text-brand-600">
            {t("head.breadcrumbHome")}
          </AppLink>
          <span className="opacity-50">
            <Icon name="chevR" />
          </span>
          <span className="text-ink-600">{t("head.breadcrumbCurrent")}</span>
        </div>
        <h1 className="font-display font-700 text-3xl sm:text-4xl text-ink-900 tracking-tight">
          {t("head.title")}
        </h1>
        <p className="mt-2 text-ink-600">{t("head.subtitle")}</p>

        <div className="card p-4 sm:p-5 mt-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
            <div>
              <FieldLabel>{t("form.brand")}</FieldLabel>
              <SelectField>
                {AUTO_FORM.brands.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </SelectField>
            </div>
            <div>
              <FieldLabel>{t("form.model")}</FieldLabel>
              <SelectField>
                {AUTO_FORM.models.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </SelectField>
            </div>
            <div>
              <FieldLabel>{t("form.year")}</FieldLabel>
              <SelectField defaultValue={years[AUTO_FORM.defaultYearIndex]}>
                {years.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </SelectField>
            </div>
            <div>
              <FieldLabel>{t("form.coverageType")}</FieldLabel>
              <SelectField>
                {classes.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </SelectField>
            </div>
            <button className="btn btn-primary btn-md h-[46px]">
              {t("form.search")} <Icon name="search" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
