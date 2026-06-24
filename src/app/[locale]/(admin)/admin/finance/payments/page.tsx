import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { staffCan } from "@/lib/auth/rbac";
import { AdminForbidden } from "@/components/app/admin/AdminForbidden";
import { PageHeader } from "@/components/app/PageHeader";
import { PaymentsClient } from "@/components/app/admin/PaymentsClient";
import { getCrmPayments, getTickets, getCreditLedger, crmCustomers } from "@/lib/mock/seed";

type Props = { params: Promise<{ locale: Locale }> };

export default async function PaymentsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await getSession();
  if (!user || !staffCan(user, "ops")) return <AdminForbidden />;
  const t = await getTranslations("admin.payments");
  return (
    <>
      <PageHeader title={t("title")} description={t("desc")} />
      <PaymentsClient
        payments={getCrmPayments()}
        tickets={getTickets()}
        seedLedger={getCreditLedger()}
        customers={crmCustomers()}
      />
    </>
  );
}
