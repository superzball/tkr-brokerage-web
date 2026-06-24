import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { staffCan } from "@/lib/auth/rbac";
import { AdminForbidden } from "@/components/app/admin/AdminForbidden";
import { PageHeader } from "@/components/app/PageHeader";
import { IssuedReportClient } from "@/components/app/admin/IssuedReportClient";
import { getIssuedPolicies, getTickets, crmCustomers } from "@/lib/mock/seed";

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ ticket?: string }>;
};

export default async function IssuedPoliciesPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { ticket } = await searchParams;
  setRequestLocale(locale);
  const user = await getSession();
  if (!user || !staffCan(user, "ops")) return <AdminForbidden />;
  const t = await getTranslations("admin.issued");
  return (
    <>
      <PageHeader title={t("title")} description={t("desc")} />
      <IssuedReportClient
        seedIssued={getIssuedPolicies()}
        tickets={getTickets()}
        customers={crmCustomers()}
        initialTicket={ticket ?? ""}
      />
    </>
  );
}
