import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { staffCan } from "@/lib/auth/rbac";
import { AdminForbidden } from "@/components/app/admin/AdminForbidden";
import { PageHeader } from "@/components/app/PageHeader";
import { DebtorsClient } from "@/components/app/admin/DebtorsClient";
import { getTickets, crmCustomers } from "@/lib/mock/seed";

type Props = { params: Promise<{ locale: Locale }> };

// Fixed AR reference date so aging buckets match the seeded dueDates (the mock
// "today"). A real backend would use the server clock.
const TODAY = "2026-06-24";

export default async function DebtorsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await getSession();
  if (!user || !staffCan(user, "ops")) return <AdminForbidden />;
  const t = await getTranslations("admin.debtors");
  return (
    <>
      <PageHeader title={t("title")} description={t("desc")} />
      <DebtorsClient tickets={getTickets()} today={TODAY} customers={crmCustomers()} />
    </>
  );
}
