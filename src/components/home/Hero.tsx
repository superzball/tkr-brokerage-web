import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { Mascot } from "@/components/brand/Mascot";
import { AnimatedCounter } from "./AnimatedCounter";
import { FEATURES } from "@/config/features";
import { ROUTES } from "@/config/nav";
import { QuoteBar } from "./QuoteBar";

export function Hero() {
  const t = useTranslations("home");

  return (
    <section className="relative overflow-hidden pb-24">
      {/* layered warm backdrop: tinted wash + dot texture + soft colour blobs */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg,#f4f9ff 0%,#eef5ff 45%,#fef6ee 100%)",
        }}
      />
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div
        className="absolute -top-28 -right-20 w-[560px] h-[560px] rounded-full blur-3xl animate-float-slow"
        style={{ background: "radial-gradient(circle,rgba(31,102,238,.22),transparent 70%)" }}
      />
      <div
        className="absolute top-32 -left-24 w-[440px] h-[440px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle,rgba(20,173,118,.18),transparent 70%)" }}
      />
      <div
        className="absolute -bottom-16 right-1/4 w-[420px] h-[420px] rounded-full blur-3xl animate-float-slow"
        style={{ background: "radial-gradient(circle,rgba(246,159,18,.20),transparent 70%)" }}
      />
      <div
        className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle,rgba(255,138,60,.14),transparent 70%)" }}
      />

      {/* floating decorative chips */}
      <div
        className="hidden md:flex absolute top-28 left-[46%] z-10 chip bg-white text-gold-600 shadow-card border border-gold-100 animate-float-slow"
        aria-hidden="true"
      >
        <Icon name="sparkle" size={15} />
      </div>
      <div
        className="hidden lg:flex absolute bottom-40 left-[8%] z-10 chip bg-white text-mint-600 shadow-card border border-mint-100 animate-float-slow"
        style={{ animationDelay: ".8s" }}
        aria-hidden="true"
      >
        <Icon name="shieldCheck" size={15} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-20 lg:pt-24 lg:pb-28 grid lg:grid-cols-12 gap-12 items-center">
        {/* copy */}
        <div className="lg:col-span-6">
          <Chip className="bg-white text-brand-700 shadow-card border border-brand-100 mb-6 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-mint-500" /> {t("hero.badge")}
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
            className="mt-6 text-lg text-ink-600 leading-relaxed max-w-xl animate-fade-up"
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
            <Button href={ROUTES.auto} variant="gold" size="lg">
              {t("hero.ctaSecondary")}
            </Button>
          </div>
          {/* trust pills */}
          <div
            className="mt-9 flex flex-wrap items-center gap-2.5 animate-fade-up"
            style={{ animationDelay: ".15s" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-mint-100 px-3.5 py-1.5 text-sm text-ink-600 shadow-card">
              <span className="text-mint-600">
                <Icon name="shieldCheck" size={16} />
              </span>
              {t("hero.trustLicense")}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-brand-100 px-3.5 py-1.5 text-sm text-ink-600 shadow-card">
              <span className="text-brand-500">
                <Icon name="lock" size={16} />
              </span>
              {t("hero.trustEncryption")}
            </span>
          </div>
        </div>

        {/* visual: mascot (flagged) — otherwise the digital policy card stack */}
        <div
          className="lg:col-span-6 relative animate-fade-up"
          style={{ animationDelay: ".1s" }}
        >
          {FEATURES.mascot ? (
            <div className="relative mx-auto max-w-md aspect-square">
              <div
                className="absolute inset-6 rounded-full blur-2xl"
                style={{ background: "radial-gradient(circle,rgba(31,102,238,.18),transparent 70%)" }}
              />
              <Mascot
                title={t("hero.card.company")}
                className="relative z-10 w-full h-full drop-shadow-xl animate-float-slow"
              />
              <div className="card absolute top-2 -right-2 sm:right-2 z-20 p-3 w-44 rotate-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-mint-600">
                    <Icon name="checkCircle" />
                  </span>
                  <span className="text-ink-700 font-500">
                    {t("hero.card.issued")}
                  </span>
                </div>
              </div>
              <div className="card absolute -bottom-2 -left-2 sm:left-0 z-20 p-4 w-48 -rotate-2 animate-float-slow">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-lg bg-brand-500 text-white inline-flex items-center justify-center">
                    <Icon name="users" />
                  </span>
                  <div>
                    <p className="text-[0.7rem] text-ink-400">
                      {t("hero.card.workers")}
                    </p>
                    <p className="font-700 text-ink-900 tabnum leading-none text-lg">
                      248
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Digital policy card stack — the proven hero visual, shown while the
               placeholder mascot is hidden (FEATURES.mascot = false). */
            <div className="relative mx-auto max-w-md">
              <div className="card card-hover card-lg p-6 relative z-10 -rotate-1">
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
                  <Chip className="bg-mint-100 text-mint-600 text-xs">
                    {t("hero.card.active")}
                  </Chip>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-2xl bg-sky-100 py-3">
                    <p className="text-2xl font-700 text-brand-700 tabnum">
                      <AnimatedCounter value="248" />
                    </p>
                    <p className="text-[0.7rem] text-ink-500">
                      {t("hero.card.workers")}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-mint-50 py-3">
                    <p className="text-2xl font-700 text-mint-600 tabnum">500k</p>
                    <p className="text-[0.7rem] text-ink-500">
                      {t("hero.card.perCapita")}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-gold-50 py-3">
                    <p className="text-2xl font-700 text-gold-600 tabnum">
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
                    ฿<AnimatedCounter value="124,000" />
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
                    style={{ width: "72%", background: "linear-gradient(90deg,#f2b736,#e89c12)" }}
                  />
                </div>
              </div>

              <div className="card absolute -top-6 -right-4 p-3 w-44 -rotate-3 z-10">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-mint-600">
                    <Icon name="checkCircle" />
                  </span>
                  <span className="text-ink-700 font-500">
                    {t("hero.card.issued")}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* floating quote-entry card (shadow-lift), overlapping the next section */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 -mb-12 lg:-mb-16">
        <QuoteBar />
      </div>
    </section>
  );
}
