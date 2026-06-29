import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { DataRequestForm } from "@/components/legal/DataRequestForm";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.legalDataRequest" });
  return { title: t("title"), description: t("description") };
}

export default async function DataRequestPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal.dataRequest");

  return (
    <main>
      <section className="bg-hero border-b border-ink-100/70">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
          <Chip className="bg-white text-brand-700 shadow-card border border-brand-100 mb-4">
            <Icon name="clipboard" size={15} /> {t("badge")}
          </Chip>
          <h1 className="font-display font-700 text-3xl sm:text-4xl text-ink-900 tracking-tight">
            {t("title")}
          </h1>
          <p className="mt-3 text-ink-600">{t("intro")}</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <DataRequestForm />
      </section>
    </main>
  );
}
