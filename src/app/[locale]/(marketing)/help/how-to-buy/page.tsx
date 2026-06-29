import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Chip } from "@/components/ui/Chip";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { StepGuide, type Step } from "@/components/help/StepGuide";
import { StillNeedHelp } from "@/components/help/StillNeedHelp";
import { ROUTES } from "@/config/nav";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.help" });
  return { title: t("title"), description: t("description") };
}

// Trust palette: one calm brand-blue treatment across the payment tiles.
const PAYMENTS: { icon: IconName; titleKey: string; noteKey: string; tone: string }[] = [
  { icon: "wallet", titleKey: "payFull", noteKey: "payFullNote", tone: "bg-sky-100 text-brand-600" },
  { icon: "creditcard", titleKey: "payCard", noteKey: "payCardNote", tone: "bg-sky-100 text-brand-600" },
  { icon: "qr", titleKey: "payQr", noteKey: "payQrNote", tone: "bg-sky-100 text-brand-600" },
];

export default async function HowToBuyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("help");
  // dynamic-key access within the `help` namespace (typed t() rejects variables)
  const tk = t as unknown as (key: string) => string;
  const steps = t.raw("howToBuy.steps") as Step[];

  return (
    <main>
      <section className="bg-hero border-b border-ink-100/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
          <Chip className="bg-white text-brand-700 shadow-card border border-brand-100 mb-4">
            <Icon name="cart" size={15} /> {t("howToBuy.title")}
          </Chip>
          <h1 className="font-display font-700 text-3xl sm:text-4xl text-ink-900 tracking-tight">
            {t("howToBuy.title")}
          </h1>
          <p className="mt-3 text-ink-600">{t("howToBuy.sub")}</p>
        </div>
      </section>

      {/* steps */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="card p-6 sm:p-8">
          <StepGuide steps={steps} />
        </div>
      </section>

      {/* payment options (mirrors the Phase 17 checkout options) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-4">
        <h2 className="font-display font-700 text-2xl text-ink-900">{t("howToBuy.paymentTitle")}</h2>
        <p className="mt-1 text-ink-500">{t("howToBuy.paymentSub")}</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          {PAYMENTS.map((p) => (
            <div key={p.titleKey} className="card p-5">
              <span className={`w-11 h-11 rounded-xl ${p.tone} flex items-center justify-center`}>
                <Icon name={p.icon} size={22} />
              </span>
              <h3 className="mt-3 font-600 text-ink-900">{tk(`howToBuy.${p.titleKey}`)}</h3>
              <p className="mt-1 text-sm text-ink-500">{tk(`howToBuy.${p.noteKey}`)}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-mint-50 border border-mint-100 px-4 py-3 text-sm text-mint-600">
          <Icon name="checkCircle" size={16} /> {t("howToBuy.instantNote")}
        </div>
      </section>

      {/* CTA into the quote flow */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-brand-600 to-ink-900 text-white p-8 text-center">
          <div className="absolute inset-0 bg-grid opacity-15" />
          <div className="relative">
            <h2 className="font-display font-700 text-2xl">{t("howToBuy.ctaTitle")}</h2>
            <p className="mt-1.5 text-white/80">{t("howToBuy.ctaDesc")}</p>
            <Button href={ROUTES.worker} variant="gold" size="lg" className="mt-5">
              {t("howToBuy.cta")} <Icon name="arrowRight" />
            </Button>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <StillNeedHelp />
      </section>
    </main>
  );
}
