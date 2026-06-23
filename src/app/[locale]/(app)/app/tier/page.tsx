import { setRequestLocale, getTranslations, getFormatter } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { roleCanAccess } from "@/lib/auth/guards";
import { getAgentTier, teamStats } from "@/lib/mock/seed";
import { AGENCY_TIERS } from "@/config/agency";
import { PageHeader } from "@/components/app/PageHeader";
import { Forbidden } from "@/components/app/Forbidden";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type Props = { params: Promise<{ locale: Locale }> };

export default async function TierPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSession();
  if (!user) return null;
  if (!roleCanAccess(user.role, "/app/tier")) return <Forbidden />;

  const t = await getTranslations("agent");
  const tt = await getTranslations("agency.tiers");
  const tm = await getTranslations("team");
  const format = await getFormatter();
  const baht = (n: number) =>
    format.number(n, {
      style: "currency",
      currency: "THB",
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0,
    });

  const tier = getAgentTier();
  const team = teamStats();
  const combined = tier.ytdPremium + team.teamGwp;
  const curKey = tier.current.toLowerCase();
  const curIdx = AGENCY_TIERS.findIndex((x) => x.key === curKey);
  const percent = Math.round(tier.progress * 100);

  return (
    <>
      <PageHeader
        title={t("tier.title")}
        description={t("tier.desc")}
        actions={
          <StatusBadge tone="warning">{tier.current}</StatusBadge>
        }
      />

      {/* current tier + progress */}
      <section className="card p-6 mb-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-3">
          <div>
            <p className="text-sm text-ink-500">{t("tier.currentTier")}</p>
            <p className="font-display font-700 text-2xl text-ink-900">
              {tier.current}
            </p>
          </div>
          <p className="text-sm font-600 text-brand-700">
            {tier.next
              ? t("tier.progressTo", { percent, next: tier.next })
              : t("tier.maxTier")}
          </p>
        </div>
        <div className="h-2.5 rounded-full bg-sky-100 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${percent}%`,
              background: "linear-gradient(90deg,#1f66ee,#e89c12)",
            }}
          />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 text-sm">
          <div className="flex justify-between">
            <span className="text-ink-500">{t("tier.ytd")}</span>
            <span className="font-600 text-ink-900 tabnum">{baht(tier.ytdPremium)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-500">{t("tier.nextAt")}</span>
            <span className="font-600 text-ink-900 tabnum">{baht(tier.nextThreshold)}</span>
          </div>
        </div>
      </section>

      {/* personal + team combined volume (Phase 11.5) */}
      <section className="card p-6 mb-6">
        <h2 className="font-700 text-ink-900">{tm("tier.combinedTitle")}</h2>
        <p className="mt-1 text-sm text-ink-500">{tm("tier.note")}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-ink-100 p-4">
            <p className="text-sm text-ink-500">{tm("tier.personal")}</p>
            <p className="mt-1.5 text-xl font-700 text-ink-900 tabnum">{baht(tier.ytdPremium)}</p>
          </div>
          <div className="rounded-xl border border-ink-100 p-4">
            <p className="text-sm text-ink-500">{tm("tier.team")}</p>
            <p className="mt-1.5 text-xl font-700 text-ink-900 tabnum">{baht(team.teamGwp)}</p>
          </div>
          <div className="rounded-xl border-2 border-brand-200 bg-sky-50 p-4">
            <p className="text-sm text-brand-700">{tm("tier.combined")}</p>
            <p className="mt-1.5 text-xl font-700 text-brand-700 tabnum">{baht(combined)}</p>
          </div>
        </div>
      </section>

      {/* benefits per tier */}
      <h2 className="font-700 text-ink-900 mb-4">{t("tier.benefitsTitle")}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {AGENCY_TIERS.map((tierDef, i) => {
          const isCur = i === curIdx;
          const done = i < curIdx;
          const next = i === curIdx + 1;
          const perks = tt.raw(`${tierDef.key}.perks`) as string[];
          return (
            <div
              key={tierDef.key}
              className={cn(
                "rounded-2xl p-5 border-2 relative",
                isCur
                  ? "border-gold-400 bg-gold-50"
                  : next
                    ? "border-brand-200 bg-sky-50"
                    : "border-ink-100 bg-white",
              )}
            >
              {isCur && (
                <span className="chip bg-gold-400 text-ink-900 absolute -top-2.5 left-5 text-xs font-700">
                  {t("tier.youAreHere")}
                </span>
              )}
              {next && (
                <span className="chip bg-brand-500 text-white absolute -top-2.5 left-5 text-xs">
                  {t("tier.nextStep")}
                </span>
              )}
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "w-10 h-10 rounded-xl inline-flex items-center justify-center",
                    isCur
                      ? "bg-gold-400 text-white"
                      : done
                        ? "bg-brand-500 text-white"
                        : "bg-sky-100 text-brand-600",
                  )}
                >
                  <Icon name={tierDef.icon} />
                </span>
                {done && (
                  <span className="text-emerald-500">
                    <Icon name="checkCircle" />
                  </span>
                )}
              </div>
              <p className="mt-3 font-display font-700 text-lg text-ink-900">
                {tt(`${tierDef.key}.name`)}
              </p>
              <p className="text-xs text-ink-500">
                {t("tier.cumulative")} {tt(`${tierDef.key}.threshold`)}
              </p>
              <p className="mt-3 font-700 text-2xl text-brand-700 tabnum">
                {tierDef.comm}
                <span className="text-xs font-500 text-ink-400"> {t("tier.commLabel")}</span>
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-ink-600">
                {perks.map((p) => (
                  <li key={p} className="flex items-center gap-1.5">
                    <span className="text-emerald-500 shrink-0">
                      <Icon name="check" size={14} />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </>
  );
}
