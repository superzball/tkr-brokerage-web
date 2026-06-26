import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { HelpFaq } from "@/components/help/HelpFaq";
import { StillNeedHelp } from "@/components/help/StillNeedHelp";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.help" });
  return { title: t("title"), description: t("description") };
}

export default async function HelpFaqPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("help");

  return (
    <main>
      <section className="bg-hero border-b border-ink-100/70">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-16 text-center">
          <Chip className="bg-white text-gold-600 shadow-card border border-gold-100 mb-4">
            <Icon name="help" size={15} /> {t("faqTitle")}
          </Chip>
          <h1 className="font-display font-700 text-3xl sm:text-4xl text-ink-900 tracking-tight">
            {t("faqTitle")}
          </h1>
          <p className="mt-3 text-ink-600">{t("faqSub")}</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <HelpFaq />
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <StillNeedHelp />
      </section>
    </main>
  );
}
