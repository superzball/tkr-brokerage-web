import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { roleCanAccess } from "@/lib/auth/guards";
import { getPolicies, getWorkers } from "@/lib/mock/seed";
import { PageHeader } from "@/components/app/PageHeader";
import { Forbidden } from "@/components/app/Forbidden";
import { WorkersClient } from "@/components/app/business/WorkersClient";

type Props = { params: Promise<{ locale: Locale }> };

export default async function WorkersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSession();
  if (!user) return null;
  if (!roleCanAccess(user.role, "/app/workers")) return <Forbidden />;

  const t = await getTranslations("business");
  const policies = getPolicies(user.id);
  const workers = getWorkers(policies.map((p) => p.id));

  return (
    <>
      <PageHeader title={t("workers.title")} description={t("workers.desc")} />
      <WorkersClient
        workers={workers}
        policies={policies.map((p) => ({ id: p.id, policyNo: p.policyNo }))}
      />
    </>
  );
}
