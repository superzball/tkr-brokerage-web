import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { TrackingHero } from "@/components/tracking/TrackingHero";
import { ProgressOverview } from "@/components/tracking/ProgressOverview";
import { TrackTimeline } from "@/components/tracking/TrackTimeline";
import { ItemList } from "@/components/tracking/ItemList";
import { NotifyCard } from "@/components/tracking/NotifyCard";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.tracking" });
  return { title: t("title"), description: t("description") };
}

export default async function TrackingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <TrackingHero />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <ProgressOverview />
        <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
          <TrackTimeline />
          <div className="space-y-6">
            <ItemList />
            <NotifyCard />
          </div>
        </div>
      </div>
    </>
  );
}
