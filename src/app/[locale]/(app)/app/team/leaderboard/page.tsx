import { setRequestLocale, getTranslations, getFormatter } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";
import { roleCanAccess } from "@/lib/auth/guards";
import { getDownline } from "@/lib/mock/seed";
import { PageHeader } from "@/components/app/PageHeader";
import { Forbidden } from "@/components/app/Forbidden";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type Props = { params: Promise<{ locale: Locale }> };

// Top-3 podium tiles (gold / silver / bronze) — gradient medal badges.
const MEDAL_TILE = [
  "bg-gradient-to-br from-gold-300 to-gold-500 text-white shadow-[0_6px_14px_-6px_rgba(232,156,18,0.65)]",
  "bg-gradient-to-br from-ink-200 to-ink-400 text-white shadow-[0_6px_14px_-6px_rgba(11,34,64,0.45)]",
  "bg-gradient-to-br from-peach-300 to-peach-500 text-white shadow-[0_6px_14px_-6px_rgba(210,87,12,0.55)]",
];

export default async function LeaderboardPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getSession();
  if (!user) return null;
  if (!roleCanAccess(user.role, "/app/team/leaderboard")) return <Forbidden />;

  const t = await getTranslations("team");
  const format = await getFormatter();
  const baht = (n: number) =>
    format.number(n, { style: "currency", currency: "THB", currencyDisplay: "narrowSymbol", maximumFractionDigits: 0 });

  const ranked = [...getDownline()].sort((a, b) => b.personalGwp - a.personalGwp);

  return (
    <>
      <PageHeader title={t("leaderboard.title")} description={t("leaderboard.desc")} />
      <div className="card divide-y divide-ink-50">
        {ranked.map((m, i) => (
          <div
            key={m.id}
            className={cn(
              "flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-sky-50/60",
              i === 0 && "bg-gold-50/50",
            )}
          >
            {i < 3 ? (
              <span className={cn("w-9 h-9 rounded-full flex items-center justify-center shrink-0", MEDAL_TILE[i])}>
                <Icon name="trophy" size={18} />
              </span>
            ) : (
              <span className="w-9 h-9 rounded-full bg-sky-100 text-ink-500 font-700 tabnum flex items-center justify-center shrink-0">
                {i + 1}
              </span>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-600 text-ink-900 truncate">{m.name}</p>
              <p className="text-xs text-ink-400">{t("common.gen", { n: m.generation })} · {m.rank}</p>
            </div>
            <span className="font-700 text-ink-900 tabnum">{baht(m.personalGwp)}</span>
          </div>
        ))}
      </div>
    </>
  );
}
