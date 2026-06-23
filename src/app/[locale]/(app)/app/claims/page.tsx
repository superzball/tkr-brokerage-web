import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { roleCanAccess } from "@/lib/auth/guards";
import { getPolicies, getClaims, getWorkers } from "@/lib/mock/seed";
import { PageHeader } from "@/components/app/PageHeader";
import { Forbidden } from "@/components/app/Forbidden";
import { ClaimsClient } from "@/components/app/business/ClaimsClient";

type Props = { params: Promise<{ locale: Locale }> };

export default async function ClaimsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSession();
  if (!user) return null;
  if (!roleCanAccess(user.role, "/app/claims")) return <Forbidden />;

  const t = await getTranslations("business");
  const policies = getPolicies(user.id);
  const policyIds = policies.map((p) => p.id);
  const claims = getClaims(policyIds);
  const workers = getWorkers(policyIds);

  return (
    <>
      <PageHeader title={t("claims.title")} description={t("claims.desc")} />
      <ClaimsClient
        claims={claims}
        policies={policies.map((p) => ({ id: p.id, policyNo: p.policyNo }))}
        workers={workers.map((w) => ({
          id: w.id,
          name: w.name,
          policyId: w.policyId,
        }))}
      />
    </>
  );
}
