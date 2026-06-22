import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { CustomerHeader } from "@/components/customer/CustomerHeader";
import { StatCards } from "@/components/customer/StatCards";
import { PolicyList } from "@/components/customer/PolicyList";
import { OrderTimeline } from "@/components/customer/OrderTimeline";
import { NotifList } from "@/components/customer/NotifList";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.customer" });
  return { title: t("title"), description: t("description") };
}

export default async function CustomerPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <CustomerHeader />
      <StatCards />
      <div className="mt-6 grid lg:grid-cols-3 gap-6 items-start">
        <PolicyList />
        <div className="space-y-6">
          <OrderTimeline />
          <NotifList />
        </div>
      </div>
    </main>
  );
}
