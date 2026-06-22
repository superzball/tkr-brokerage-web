import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { ROUTES } from "@/config/nav";
import { QuoteBar } from "./QuoteBar";

export function Hero() {
  const t = useTranslations("home");

  return (
    <section className="relative bg-hero overflow-hidden pb-24">
      <div className="absolute inset-0 bg-grid opacity-60" />
      <div
        className="absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle,rgba(31,102,238,.20),transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-20 lg:pt-24 lg:pb-28 grid lg:grid-cols-12 gap-12 items-center">
        {/* copy */}
        <div className="lg:col-span-6">
          <Chip className="bg-white text-brand-700 shadow-card border border-brand-100 mb-6 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />{" "}
            {t("hero.badge")}
          </Chip>
          <h1
            className="font-display font-700 text-[2.6rem] leading-[1.08] sm:text-6xl text-ink-900 tracking-tight animate-fade-up"
            style={{ textWrap: "balance" }}
          >
            {t.rich("hero.title", {
              br: () => <br />,
              grad: (chunks) => <span className="text-gradient">{chunks}</span>,
            })}
          </h1>
          <p
            className="mt-6 text-lg text-ink-600 leading-relaxed max-w-xxl animate-fade-up"
            style={{ animationDelay: ".05s" }}
          >
            {t.rich("hero.subtitle", {
              strong: (chunks) => (
                <strong className="text-ink-800 font-600">{chunks}</strong>
              ),
            })}
          </p>
          <div
            className="mt-8 flex flex-wrap gap-3 animate-fade-up"
            style={{ animationDelay: ".1s" }}
          >
            <Button href={ROUTES.worker} variant="primary" size="lg">
              {t("hero.ctaPrimary")} <Icon name="arrowRight" />
            </Button>
            <Button href={ROUTES.auto} variant="ghost" size="lg">
              {t("hero.ctaSecondary")}
            </Button>
          </div>
          <div
            className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-ink-500 animate-fade-up"
            style={{ animationDelay: ".15s" }}
          >
            <span className="flex items-center gap-2">
              <span className="text-emerald-600">
                <Icon name="shieldCheck" />
              </span>{" "}
              {t("hero.trustLicense")}
            </span>
            <span className="flex items-center gap-2">
              <span className="text-emerald-600">
                <Icon name="lock" />
              </span>{" "}
              {t("hero.trustEncryption")}
            </span>
          </div>
        </div>

        {/* visual: digital policy card stack */}
        <div
          className="lg:col-span-6 relative animate-fade-up"
          style={{ animationDelay: ".1s" }}
        >
          <div className="relative mx-auto max-w-md">
            <div className="card card-lg p-6 relative z-10 -rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-xl bg-brand-500 text-white inline-flex items-center justify-center">
                    <Icon name="shield" />
                  </span>
                  <div>
                    <p className="text-xs text-ink-400 font-500">
                      {t("hero.card.policyType")}
                    </p>
                    <p className="font-600 text-ink-900">
                      {t("hero.card.company")}
                    </p>
                  </div>
                </div>
                <Chip className="bg-emerald-50 text-emerald-600 text-xs">
                  {t("hero.card.active")}
                </Chip>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl bg-sky-100 py-3">
                  <p className="text-2xl font-700 text-brand-700 tabnum">248</p>
                  <p className="text-[0.7rem] text-ink-500">
                    {t("hero.card.workers")}
                  </p>
                </div>
                <div className="rounded-xl bg-sky-100 py-3">
                  <p className="text-2xl font-700 text-brand-700 tabnum">500k</p>
                  <p className="text-[0.7rem] text-ink-500">
                    {t("hero.card.perCapita")}
                  </p>
                </div>
                <div className="rounded-xl bg-sky-100 py-3">
                  <p className="text-2xl font-700 text-brand-700 tabnum">
                    {t("hero.card.coverageValue")}
                  </p>
                  <p className="text-[0.7rem] text-ink-500">
                    {t("hero.card.coverage")}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-ink-500">
                  {t("hero.card.totalPremium")}
                </span>
                <span className="font-700 text-ink-900 text-lg tabnum">
                  ฿124,000
                </span>
              </div>
            </div>

            <div className="card absolute -bottom-8 -left-6 z-20 p-4 w-56 rotate-2 animate-float-slow">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-lg bg-gold-100 text-gold-600 inline-flex items-center justify-center">
                  <Icon name="trophy" />
                </span>
                <div>
                  <p className="text-xs text-ink-400">
                    {t("hero.card.agentStatus")}
                  </p>
                  <p className="font-600 text-ink-900 text-sm">Platinum</p>
                </div>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-sky-200 overflow-hidden">
                <div
                  className="h-full rounded-full sheen"
                  style={{
                    width: "72%",
                    background: "linear-gradient(90deg,#f2b736,#e89c12)",
                  }}
                />
              </div>
            </div>

            <div className="card absolute -top-6 -right-4 z-0 p-3 w-44 -rotate-3 sm:block z-10">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-emerald-600">
                  <Icon name="checkCircle" />
                </span>
                <span className="text-ink-700 font-500">
                  {t("hero.card.issued")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* insurance picker bar */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 -mb-12 lg:-mb-16">
        <QuoteBar />
      </div>
    </section>
  );
}
