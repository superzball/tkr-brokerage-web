import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
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

export default async function ClaimsHelpPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("help");
  const steps = t.raw("claims.steps") as Step[];

  return (
    <main>
      <section className="bg-hero border-b border-ink-100/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
          <Chip className="bg-white text-mint-600 shadow-card border border-mint-100 mb-4">
            <Icon name="clipboard" size={15} /> {t("claims.title")}
          </Chip>
          <h1 className="font-display font-700 text-3xl sm:text-4xl text-ink-900 tracking-tight">
            {t("claims.title")}
          </h1>
          <p className="mt-3 text-ink-600">{t("claims.sub")}</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="card p-6 sm:p-8">
          <StepGuide steps={steps} />
        </div>
      </section>

      {/* CTA → claim flow / status tracker */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-12">
        <div className="card p-7 sm:p-8 text-center">
          <h2 className="font-display font-700 text-2xl text-ink-900">{t("claims.ctaTitle")}</h2>
          <p className="mt-1.5 text-ink-500 max-w-lg mx-auto">{t("claims.ctaDesc")}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Button href="/app/claims" variant="primary" size="lg">
              <Icon name="clipboard" size={16} /> {t("claims.ctaFile")}
            </Button>
            <Link href={ROUTES.tracking} className="btn btn-ghost btn-lg">
              <Icon name="search" size={16} /> {t("claims.ctaTrack")}
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <StillNeedHelp />
      </section>
    </main>
  );
}
