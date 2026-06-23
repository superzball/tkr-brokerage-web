import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { roleCanAccess } from "@/lib/auth/guards";
import { PageHeader } from "@/components/app/PageHeader";
import { Forbidden } from "@/components/app/Forbidden";
import { Icon } from "@/components/ui/Icon";
import { MediaCard } from "@/components/agency/MediaCard";
import { ShareLink } from "@/components/agency/ShareLink";

type Props = { params: Promise<{ locale: Locale }> };

/** Personal referral link card (reuses the agency ShareLink + share copy). */
function ReferralCard() {
  const t = useTranslations("agency.share");
  return (
    <div className="card p-6 h-fit">
      <h3 className="font-600 text-ink-900 flex items-center gap-2 mb-1">
        <span className="text-brand-600">
          <Icon name="link" />
        </span>
        {t("title")}
      </h3>
      <p className="text-sm text-ink-500">{t("qrDesc")}</p>
      <ShareLink />
    </div>
  );
}

export default async function MarketingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSession();
  if (!user) return null;
  if (!roleCanAccess(user.role, "/app/marketing")) return <Forbidden />;

  const t = await getTranslations("agent");

  return (
    <>
      <PageHeader title={t("marketing.title")} description={t("marketing.desc")} />
      <div className="grid gap-6 lg:grid-cols-2 items-start">
        <MediaCard />
        <ReferralCard />
      </div>
    </>
  );
}
