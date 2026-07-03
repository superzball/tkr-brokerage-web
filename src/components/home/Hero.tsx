"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { Mascot } from "@/components/brand/Mascot";
import { HomeBanners } from "@/components/home/HomeBanners";
import { AnimatedCounter } from "./AnimatedCounter";
import { FEATURES } from "@/config/features";
import { ROUTES } from "@/config/nav";
import { QuoteBar } from "./QuoteBar";
import { getActiveHomeBanners, getWorkerFlowUI } from "@/lib/mock/seed";
import { WorkerFlowUI } from "@/types";

export function Hero() {
  const t = useTranslations("home");
  const l = useTranslations("learn");
  const [workerFlow, setWorkerFlow] = useState<WorkerFlowUI>(() => ({
    ...getWorkerFlowUI(),
  }));
  return (
    <section className="relative overflow-hidden pb-24">
      {/* Restrained Trust backdrop: a calm white→soft-blue wash + a faint dot
          texture. No coloured blobs, no floating accent chips — the structure
          and type weight carry the hero. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg,#f4f8ff 0%,#eef4fc 52%,#f6f9fe 100%)",
        }}
      />
      <div className="absolute inset-0 bg-grid opacity-60" />
      {/* two soft brand-tinted washes for depth (no mint/gold/peach) */}
      <div
        className="absolute -top-32 -right-24 w-[620px] h-[620px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle,rgba(31,102,238,.14),transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -left-28 w-[520px] h-[520px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle,rgba(11,34,64,.07),transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-20 lg:pt-24 lg:pb-28 grid lg:grid-cols-12 gap-12 items-center">
        {/* copy */}
        <div className="lg:col-span-6">
          <Chip className="bg-white text-brand-700 shadow-card border border-brand-100 mb-6 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-brand-500" />{" "}
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
            className="mt-6 text-lg text-ink-600 leading-relaxed max-w-xl animate-fade-up"
            style={{ animationDelay: ".05s" }}
          >
            {t.rich("hero.subtitle", {
              strong: (chunks) => (
                <strong className="text-ink-800 font-600">{chunks}</strong>
              ),
            })}
          </p>
          {/* Edit later */}
          {workerFlow.showInputMethod ? (
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
          ) : (
            <div
              className="mt-8 flex flex-wrap gap-3 animate-fade-up"
              style={{ animationDelay: ".1s" }}
            >
              <Button href={ROUTES.workerMou} variant="primary" size="lg" target="_blank">
                {l("common.startQuoteMou")} <Icon name="arrowRight" />
              </Button>
              <Button href={ROUTES.worker24} variant="gold" size="lg" target="_blank">
                {l("common.startQuote24")} <Icon name="arrowRight" />
              </Button>
            </div>
          )}
          {/* trust pills */}
          <div
            className="mt-9 flex flex-wrap items-center gap-2.5 animate-fade-up"
            style={{ animationDelay: ".15s" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white border border-ink-100 px-3.5 py-1.5 text-sm text-ink-600 shadow-card">
              <span className="text-brand-600">
                <Icon name="shieldCheck" size={16} />
              </span>
              {t("hero.trustLicense")}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white border border-ink-100 px-3.5 py-1.5 text-sm text-ink-600 shadow-card">
              <span className="text-brand-600">
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
                style={{
                  background:
                    "radial-gradient(circle,rgba(31,102,238,.18),transparent 70%)",
                }}
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
              <div className="card card-hover card-lg p-6 relative z-10 shadow-pop ring-1 ring-brand-100/70">
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
                  <Chip className="bg-brand-50 text-brand-700 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-mint-500" />
                    {t("hero.card.active")}
                  </Chip>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-2xl bg-sky-100 py-3">
                    <p className="text-2xl font-700 text-brand-700 tabnum">
                      <AnimatedCounter value=">1M+" />
                    </p>
                    <p className="text-[0.7rem] text-ink-500">
                      {t("hero.card.workers")}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-sky-50 py-3">
                    <p className="text-2xl font-700 text-ink-900 tabnum">
                      150K
                    </p>
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
                <div className="mt-4 flex items-center justify-between text-sm mb-6">
                  {/* <span className="text-ink-500">
                    {t("hero.card.totalPremium")}
                  </span>
                  <span className="font-700 text-ink-900 text-lg tabnum">
                    ฿<AnimatedCounter value="124,000" />
                  </span> */}
                </div>
              </div>

              <div className="card absolute -bottom-8 -left-6 z-20 p-4 w-56 animate-float-slow">
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

              <div className="card absolute -top-6 -right-4 p-3 w-44 z-10">
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
      {/* <div className="relative max-w-6xl mx-auto px-4 sm:px-6 -mb-12 lg:-mb-16">
        <QuoteBar />
      </div> */}
      <HomeBanners banners={getActiveHomeBanners()} />
    </section>
  );
}
