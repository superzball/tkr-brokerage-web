import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { roleCanAccess } from "@/lib/auth/guards";
import { getLoyalty, getPointsLedger, getRewards } from "@/lib/mock/seed";
import { earnRules } from "@/config/loyalty";
import { PageHeader } from "@/components/app/PageHeader";
import { Forbidden } from "@/components/app/Forbidden";
import { RewardsClient } from "@/components/app/rewards/RewardsClient";

type Props = { params: Promise<{ locale: Locale }> };

export default async function RewardsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSession();
  if (!user) return null;
  if (!roleCanAccess(user.role, "/app/rewards")) return <Forbidden />;

  const t = await getTranslations("loyalty");
  const ledger = getPointsLedger(user.id);
  const referralCode = `TKR-${user.id.replace(/[^a-zA-Z0-9]/g, "").slice(-5).toUpperCase() || "GUEST"}`;
  const lockedTags = ledger.some((e) => e.source === "profile_complete") ? ["profile_complete"] : [];

  return (
    <>
      <PageHeader title={t("hub.title")} description={t("hub.desc")} />
      <RewardsClient
        customerId={user.id}
        isGuest={user.status === "guest"}
        seedAccount={getLoyalty(user.id) ?? null}
        seedLedger={ledger}
        rewards={getRewards()}
        earnRules={earnRules}
        lockedTags={lockedTags}
        referralCode={referralCode}
      />
    </>
  );
}
