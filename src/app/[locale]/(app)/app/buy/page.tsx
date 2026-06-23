import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { roleCanAccess } from "@/lib/auth/guards";
import { getPolicy } from "@/lib/mock/seed";
import { PageHeader } from "@/components/app/PageHeader";
import { Forbidden } from "@/components/app/Forbidden";
import { Icon } from "@/components/ui/Icon";
import { WorkerFlow } from "@/components/worker/WorkerFlow";

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ renew?: string }>;
};

export default async function BuyPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { renew } = await searchParams;
  setRequestLocale(locale);

  const user = await getSession();
  if (!user) return null;
  if (!roleCanAccess(user.role, "/app/buy")) return <Forbidden />;

  const t = await getTranslations("business");
  const renewing = renew ? getPolicy(renew) : undefined;

  return (
    <>
      <PageHeader title={t("buy.title")} description={t("buy.desc")} />

      {renewing && renewing.holderId === user.id && (
        <div className="mb-4 flex items-center gap-2.5 rounded-xl bg-sky-100 p-3.5 text-sm text-brand-700">
          <Icon name="refresh" size={18} />
          {t("buy.renewNotice", { policyNo: renewing.policyNo })}
        </div>
      )}

      <div className="-mx-4 sm:-mx-6 lg:-mx-8">
        <WorkerFlow />
      </div>
    </>
  );
}
