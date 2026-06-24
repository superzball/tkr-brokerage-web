import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { staffCan } from "@/lib/auth/rbac";
import { AdminForbidden } from "@/components/app/admin/AdminForbidden";
import { PageHeader } from "@/components/app/PageHeader";
import { ProductsClient } from "@/components/app/admin/ProductsClient";
import { getProductPlans } from "@/lib/mock/seed";

type Props = { params: Promise<{ locale: Locale }> };

export default async function ProductsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await getSession();
  if (!user || !staffCan(user, "superadmin")) return <AdminForbidden />;
  const t = await getTranslations("admin.plans");
  return (
    <>
      <PageHeader title={t("title")} description={t("desc")} />
      <ProductsClient initial={getProductPlans()} />
    </>
  );
}
