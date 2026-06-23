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

const MEDAL = ["text-gold-500", "text-ink-400", "text-amber-700"];

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
          <div key={m.id} className="flex items-center gap-4 px-5 py-3.5">
            <span className={cn("w-7 text-center font-700 tabnum", i < 3 ? MEDAL[i] : "text-ink-400")}>
              {i < 3 ? <Icon name="trophy" size={18} /> : i + 1}
            </span>
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
