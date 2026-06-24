import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { staffCan } from "@/lib/auth/rbac";
import { AdminForbidden } from "@/components/app/admin/AdminForbidden";
import { PageHeader } from "@/components/app/PageHeader";
import { PayoutsClient } from "@/components/app/admin/PayoutsClient";
import { getCommissions, getTeamOverrides } from "@/lib/mock/seed";

type Props = { params: Promise<{ locale: Locale }> };

export default async function PayoutsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSession();
  if (!user || !staffCan(user, "ops")) return <AdminForbidden />;

  const t = await getTranslations("admin.payouts");

  return (
    <>
      <PageHeader title={t("title")} description={t("desc")} />
      <PayoutsClient commissions={getCommissions()} overrides={getTeamOverrides()} />
    </>
  );
}
