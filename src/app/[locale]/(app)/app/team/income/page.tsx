import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { roleCanAccess } from "@/lib/auth/guards";
import { getTeamOverrides, getDownline, teamStats } from "@/lib/mock/seed";
import { PageHeader } from "@/components/app/PageHeader";
import { Forbidden } from "@/components/app/Forbidden";
import { TeamIncomeClient } from "@/components/app/team/TeamIncomeClient";

type Props = { params: Promise<{ locale: Locale }> };

export default async function TeamIncomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSession();
  if (!user) return null;
  if (!roleCanAccess(user.role, "/app/team/income")) return <Forbidden />;

  const t = await getTranslations("team");
  const pendingMembers = getDownline().filter((m) => m.licenseStatus !== "verified");

  return (
    <>
      <PageHeader title={t("income.title")} description={t("income.desc")} />
      <TeamIncomeClient
        overrides={getTeamOverrides()}
        pendingMembers={pendingMembers}
        total={teamStats().overrideIncome}
      />
    </>
  );
}
