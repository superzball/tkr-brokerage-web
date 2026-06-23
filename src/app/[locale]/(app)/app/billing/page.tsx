import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { roleCanAccess } from "@/lib/auth/guards";
import { getPolicies, getInvoices } from "@/lib/mock/seed";
import { PageHeader } from "@/components/app/PageHeader";
import { Forbidden } from "@/components/app/Forbidden";
import { BillingClient } from "@/components/app/business/BillingClient";

type Props = { params: Promise<{ locale: Locale }> };

export default async function BillingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSession();
  if (!user) return null;
  if (!roleCanAccess(user.role, "/app/billing")) return <Forbidden />;

  const t = await getTranslations("business");
  const policies = getPolicies(user.id);
  const invoices = getInvoices(policies.map((p) => p.id));

  return (
    <>
      <PageHeader title={t("billing.title")} description={t("billing.desc")} />
      <BillingClient
        invoices={invoices}
        policies={policies.map((p) => ({ id: p.id, policyNo: p.policyNo }))}
      />
    </>
  );
}
