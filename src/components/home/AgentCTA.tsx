import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { ROUTES } from "@/config/nav";

export function AgentCTA() {
  const t = useTranslations("home.agentCta");

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="card card-lg overflow-hidden relative reveal shadow-pop">
        <div className="grid lg:grid-cols-2">
          <div className="p-9 sm:p-12">
            <Chip className="bg-gold-100 text-gold-600 mb-4">
              <Icon name="sparkle" /> {t("badge")}
            </Chip>
            <h2
              className="font-display font-700 text-3xl sm:text-4xl lg:text-[2.75rem] text-ink-900 tracking-tight leading-[1.05]"
              style={{ textWrap: "balance" }}
            >
              {t("title")}
            </h2>
            <span className="kw-swash mt-4" aria-hidden="true" />
            <p className="mt-4 text-ink-600 leading-relaxed">{t("desc")}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href={ROUTES.agency} variant="primary" size="lg">
                {t("apply")} <Icon name="arrowRight" />
              </Button>
              <Button href={ROUTES.agency} variant="ghost" size="lg">
                {t("view")}
              </Button>
            </div>
          </div>

          <div className="relative bg-gradient-to-br from-brand-600 to-ink-900 p-9 sm:p-12 text-white flex flex-col justify-center">
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="relative grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/10 backdrop-blur p-5">
                <span className="text-gold-300">
                  <Icon name="trophy" />
                </span>
                <p className="mt-3 font-700 text-2xl tabnum">
                  {t("tiers.title")}
                </p>
                <p className="text-sm text-ink-100/80">{t("tiers.sub")}</p>
              </div>
              <div className="rounded-2xl bg-white/10 backdrop-blur p-5">
                <span className="text-gold-300">
                  <Icon name="plane" />
                </span>
                <p className="mt-3 font-700 text-2xl tabnum">
                  {t("trip.title")}
                </p>
                <p className="text-sm text-ink-100/80">{t("trip.sub")}</p>
              </div>
              <div className="rounded-2xl bg-white/10 backdrop-blur p-5 col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-ink-100/80">
                    {t("commission.label")}
                  </p>
                  <p className="font-700 text-xl text-gold-300">
                    {t("commission.value")}
                  </p>
                </div>
                <div className="h-2 rounded-full bg-white/15 overflow-hidden">
                  <div
                    className="h-full rounded-full sheen"
                    style={{
                      width: "80%",
                      background: "linear-gradient(90deg,#f6cf6b,#e89c12)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
