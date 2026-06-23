import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { roleCanAccess } from "@/lib/auth/guards";
import { getDownline } from "@/lib/mock/seed";
import { PageHeader } from "@/components/app/PageHeader";
import { Forbidden } from "@/components/app/Forbidden";
import { TeamSalesClient } from "@/components/app/team/TeamSalesClient";

type Props = { params: Promise<{ locale: Locale }> };

export default async function TeamSalesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSession();
  if (!user) return null;
  if (!roleCanAccess(user.role, "/app/team/sales")) return <Forbidden />;

  const t = await getTranslations("team");

  return (
    <>
      <PageHeader title={t("sales.title")} description={t("sales.desc")} />
      <TeamSalesClient members={getDownline()} period="2026-06" />
    </>
  );
}
