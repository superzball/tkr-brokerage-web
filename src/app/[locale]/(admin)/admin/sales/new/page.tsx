import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { staffCan } from "@/lib/auth/rbac";
import { AdminForbidden } from "@/components/app/admin/AdminForbidden";
import { PageHeader } from "@/components/app/PageHeader";
import { NewOrderClient } from "@/components/app/admin/NewOrderClient";
import { getProductPlans, getAllCustomers } from "@/lib/mock/seed";

type Props = { params: Promise<{ locale: Locale }> };

export default async function NewOrderPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSession();
  if (!user || !staffCan(user, "sales")) return <AdminForbidden />;

  const t = await getTranslations("admin.newOrder");

  return (
    <>
      <PageHeader title={t("title")} description={t("desc")} />
      <NewOrderClient
        plans={getProductPlans()}
        customers={getAllCustomers().map((c) => c.name)}
      />
    </>
  );
}
