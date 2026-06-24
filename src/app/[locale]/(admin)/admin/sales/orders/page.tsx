import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { staffCan } from "@/lib/auth/rbac";
import { AdminForbidden } from "@/components/app/admin/AdminForbidden";
import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/Button";
import { OrdersClient } from "@/components/app/admin/OrdersClient";
import { getOrders, getAgentSales } from "@/lib/mock/seed";

type Props = { params: Promise<{ locale: Locale }> };

export default async function OrdersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSession();
  if (!user || !staffCan(user, "sales")) return <AdminForbidden />;

  const t = await getTranslations("admin.orders");

  return (
    <>
      <PageHeader
        title={t("title")}
        description={t("desc")}
        actions={
          <Button href="/admin/sales/new" variant="primary" size="sm">
            {t("newCta")}
          </Button>
        }
      />
      <OrdersClient orders={getOrders()} agentSales={getAgentSales()} />
    </>
  );
}
