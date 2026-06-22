import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { WorkerPageHead } from "@/components/worker/WorkerPageHead";
import { WorkerFlow } from "@/components/worker/WorkerFlow";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.worker" });
  return { title: t("title"), description: t("description") };
}

export default async function WorkerInsurancePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <WorkerPageHead />
      <WorkerFlow />
    </main>
  );
}
