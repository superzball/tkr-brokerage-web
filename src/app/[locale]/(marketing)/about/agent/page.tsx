import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { AboutFaq, type QA } from "@/components/about/AboutFaq";
import { cmsCopy } from "@/lib/cms/page-copy";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.aboutAgent" });
  return { title: t("title"), description: t("description") };
}

// CTA targets (spec): new applicants → signup pre-set to the agent role;
// existing agents → the in-app team recruit tool.
const SIGNUP_AGENT = "/signup?role=agent";
const TEAM_RECRUIT = "/app/team/recruit";

type Benefit = { icon: IconName; title: string; desc: string };
type Step = { title: string; desc: string };
type EarnRow = { tier: string; note: string; rate: string };

export default async function AgentRecruitPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about.agent");
  const cms = cmsCopy("/about/agent", locale);

  const heroTitle = cms?.hero ?? t("hero.title");
  const heroSub = cms?.body ?? t("hero.sub");
  const benefits = t.raw("benefits.items") as Benefit[];
  const steps = t.raw("how.steps") as Step[];
  const earnRows = t.raw("earnings.rows") as EarnRow[];
  const compliance = t.raw("compliance.items") as string[];
  const faqItems = t.raw("faq.items") as QA[];

  return (
    <main>
      {/* hero */}
      <section className="bg-hero border-b border-ink-100/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 lg:py-20 text-center">
          <Chip className="bg-gold-100 text-gold-600 mb-4">
            <Icon name="sparkle" size={15} /> {t("hero.badge")}
          </Chip>
          <h1 className="font-display font-700 text-3xl sm:text-5xl text-ink-900 tracking-tight" style={{ textWrap: "balance" }}>
            {heroTitle}
          </h1>
          <p className="mt-4 text-lg text-ink-600 max-w-2xl mx-auto">{heroSub}</p>
          <div className="mt-7 flex flex-wrap gap-3 justify-center">
            <Button href={SIGNUP_AGENT} variant="primary" size="lg">
              {t("hero.apply")} <Icon name="arrowRight" />
            </Button>
            <Button href={TEAM_RECRUIT} variant="ghost" size="lg">
              {t("hero.existing")}
            </Button>
          </div>
        </div>
      </section>

      {/* honesty banner: licensed agency model, no join fee */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-7 relative">
        <div className="card p-5 sm:p-6 border-mint-200 bg-mint-50/70 flex items-start gap-3">
          <span className="shrink-0 w-9 h-9 rounded-full bg-mint-100 text-mint-600 inline-flex items-center justify-center">
            <Icon name="shieldCheck" size={18} />
          </span>
          <p className="text-sm text-ink-700 leading-relaxed">{t("note")}</p>
        </div>
      </section>

      {/* benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-display font-700 text-2xl sm:text-3xl text-ink-900 tracking-tight">{t("benefits.title")}</h2>
          <p className="mt-3 text-ink-600">{t("benefits.sub")}</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <div key={i} className="card card-hover p-6 reveal">
              <span className="w-12 h-12 rounded-2xl bg-gold-50 text-gold-600 flex items-center justify-center">
                <Icon name={b.icon} size={24} />
              </span>
              <h3 className="mt-4 font-700 text-ink-900">{b.title}</h3>
              <p className="mt-1.5 text-sm text-ink-600 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section className="bg-gradient-to-b from-mint-50/80 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
          <div className="text-center mb-10">
            <h2 className="font-display font-700 text-2xl sm:text-3xl text-ink-900 tracking-tight">{t("how.title")}</h2>
          </div>
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={i} className="card p-6 relative">
                <span className="w-9 h-9 rounded-full bg-brand-600 text-white font-700 inline-flex items-center justify-center tabnum">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-700 text-ink-900">{s.title}</h3>
                <p className="mt-1.5 text-sm text-ink-600 leading-relaxed">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* requirements: OIC license gate */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
        <div className="card card-lg p-7 sm:p-9">
          <div className="flex items-start gap-4">
            <span className="shrink-0 w-12 h-12 rounded-2xl bg-sky-100 text-brand-600 flex items-center justify-center">
              <Icon name="clipboard" size={24} />
            </span>
            <div>
              <h2 className="font-display font-700 text-xl sm:text-2xl text-ink-900">{t("requirements.title")}</h2>
              <p className="mt-2 text-ink-600 leading-relaxed">{t("requirements.desc")}</p>
              <p className="mt-3 text-sm text-ink-600 leading-relaxed">{t("requirements.license")}</p>
            </div>
          </div>
          <div className="mt-5 rounded-xl bg-gold-50 border border-gold-100 px-4 py-3 flex items-center gap-2 text-sm text-gold-700">
            <Icon name="lock" size={16} /> {t("requirements.gate")}
          </div>
        </div>
      </section>

      {/* earnings illustration — clearly labelled, not a guarantee */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-14">
        <div className="card card-lg p-7 sm:p-9">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="font-display font-700 text-xl sm:text-2xl text-ink-900">{t("earnings.title")}</h2>
            <Chip className="bg-gold-100 text-gold-700">
              <Icon name="info" size={14} /> {t("earnings.disclaimer")}
            </Chip>
          </div>
          <p className="mt-3 text-ink-600 leading-relaxed">{t("earnings.desc")}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {earnRows.map((r, i) => (
              <div key={i} className="rounded-2xl border border-ink-100 p-5">
                <p className="font-display font-700 text-lg text-ink-900">{r.tier}</p>
                <p className="mt-0.5 text-xs text-ink-500">{r.note}</p>
                <p className="mt-3 text-sm font-600 text-brand-600">{r.rate}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs text-ink-500">{t("earnings.footnote")}</p>
        </div>
      </section>

      {/* compliance commitments (non-negotiable) */}
      <section className="bg-ink-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="font-display font-700 text-2xl sm:text-3xl tracking-tight text-center mb-8">{t("compliance.title")}</h2>
          <ul className="space-y-3">
            {compliance.map((c, i) => (
              <li key={i} className="flex items-start gap-3 rounded-2xl bg-white/5 p-4">
                <span className="shrink-0 w-7 h-7 rounded-full bg-mint-500/20 text-mint-300 inline-flex items-center justify-center">
                  <Icon name="check" size={16} strokeWidth={2.4} />
                </span>
                <span className="text-ink-100 leading-relaxed">{c}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-center text-xs text-ink-400 max-w-2xl mx-auto">{t("compliance.legalNote")}</p>
        </div>
      </section>

      {/* agent FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
        <div className="text-center mb-8">
          <Chip className="bg-gold-100 text-gold-600 mb-4">
            <Icon name="help" size={15} /> {t("faq.title")}
          </Chip>
          <h2 className="font-display font-700 text-2xl sm:text-3xl text-ink-900 tracking-tight">{t("faq.title")}</h2>
        </div>
        <AboutFaq items={faqItems} />
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="card card-lg bg-gradient-to-r from-brand-600 to-brand-500 text-white p-9 sm:p-12 text-center">
          <h2 className="font-display font-700 text-2xl sm:text-3xl tracking-tight" style={{ textWrap: "balance" }}>
            {t("cta.title")}
          </h2>
          <p className="mt-3 text-brand-50">{t("cta.sub")}</p>
          <div className="mt-7 flex flex-wrap gap-3 justify-center">
            <Button href={SIGNUP_AGENT} variant="gold" size="lg">
              {t("cta.apply")} <Icon name="arrowRight" />
            </Button>
            <Button href={TEAM_RECRUIT} variant="ghost" size="lg" className="bg-white/10 text-white border-white/30">
              {t("cta.existing")}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
