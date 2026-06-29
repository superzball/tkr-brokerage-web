import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { staffCan } from "@/lib/auth/rbac";
import { AdminForbidden } from "@/components/app/admin/AdminForbidden";
import { PageHeader } from "@/components/app/PageHeader";
import {
  LoyaltyRedemptionsClient,
  type RedemptionRow,
} from "@/components/app/admin/LoyaltyRedemptionsClient";
import { getRedemptions, getReward, getAllCustomers } from "@/lib/mock/seed";

type Props = { params: Promise<{ locale: Locale }> };

export default async function LoyaltyRedemptionsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSession();
  if (!user || !staffCan(user, "ops")) return <AdminForbidden />;

  const t = await getTranslations("loyalty.admin.redeem");
  const customers = getAllCustomers();
  const rows: RedemptionRow[] = getRedemptions().map((r) => ({
    id: r.id,
    customerName: customers.find((c) => c.id === r.customerId)?.name ?? r.customerId,
    rewardKey: getReward(r.rewardId)?.name ?? r.rewardId,
    pointsSpent: r.pointsSpent,
    code: r.code,
    status: r.status,
    date: r.date,
  }));

  return (
    <>
      <PageHeader title={t("title")} description={t("desc")} />
      <LoyaltyRedemptionsClient initial={rows} />
    </>
  );
}
