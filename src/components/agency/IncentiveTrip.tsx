import { useTranslations } from "next-intl";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { AGENCY_GOAL_PROGRESS, AGENCY_LEADERBOARD } from "@/config/agency";

const MEDAL: Record<number, string> = {
  1: "bg-gold-400 text-white",
  2: "bg-slate-300 text-white",
  3: "bg-amber-600 text-white",
};

export function IncentiveTrip() {
  const t = useTranslations("agency.trip");
  const lb = useTranslations("agency.leaderboard");

  return (
    <section className="mt-8 card overflow-hidden reveal">
      <div className="grid lg:grid-cols-2">
        {/* campaign */}
        <div className="relative min-h-[300px] bg-gradient-to-br from-brand-600 to-ink-900 text-white p-8 flex flex-col justify-between overflow-hidden">
          <div
            className="absolute inset-0 opacity-25"
            style={{
              background:
                "radial-gradient(120px 120px at 80% 20%,#fff,transparent),radial-gradient(180px 180px at 20% 90%,rgba(242,183,54,.6),transparent)",
            }}
          />
          <div className="relative">
            <Chip className="bg-white/15 backdrop-blur text-white">
              <Icon name="plane" /> {t("badge")}
            </Chip>
            <h2 className="font-display font-700 text-3xl mt-4">{t("title")}</h2>
            <p className="text-ink-100/90 mt-2 max-w-sm">{t("desc")}</p>
          </div>
          <div className="relative mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-ink-100/80">{t("progressLabel")}</span>
              <span className="font-700 text-gold-300">
                {AGENCY_GOAL_PROGRESS}%
              </span>
            </div>
            <div className="h-3 rounded-full bg-white/15 overflow-hidden">
              <div
                className="h-full rounded-full sheen"
                style={{
                  width: `${AGENCY_GOAL_PROGRESS}%`,
                  background: "linear-gradient(90deg,#f6cf6b,#e89c12)",
                }}
              />
            </div>
            <p className="text-xs text-ink-100/70 mt-2">{t("remaining")}</p>
          </div>
        </div>

        {/* leaderboard */}
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-600 text-lg text-ink-900 flex items-center gap-2">
              <span className="text-gold-500">
                <Icon name="medal" />
              </span>{" "}
              {lb("title")}
            </h3>
            <span className="text-xs text-ink-400">{lb("updated")}</span>
          </div>
          <div className="space-y-2">
            {AGENCY_LEADERBOARD.map((p) => {
              const name = lb(`r${p.rank}`);
              return (
                <div
                  key={p.rank}
                  className={cn(
                    "flex items-center gap-3 p-2.5 rounded-xl",
                    p.you
                      ? "bg-brand-50 ring-1 ring-brand-200"
                      : "hover:bg-sky-50",
                  )}
                >
                  <span
                    className={cn(
                      "w-7 h-7 rounded-full inline-flex items-center justify-center font-700 text-sm shrink-0",
                      MEDAL[p.rank] ?? "bg-sky-100 text-ink-500",
                    )}
                  >
                    {p.rank}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-sky-100 text-brand-600 inline-flex items-center justify-center text-xs font-600 shrink-0">
                    {name.slice(0, 1)}
                  </span>
                  <span
                    className={cn(
                      "flex-1 text-sm text-ink-900 truncate",
                      p.you ? "font-700" : "font-500",
                    )}
                  >
                    {name}
                    {p.you && (
                      <span className="text-xs text-brand-600 font-500">
                        {" "}
                        {lb("you")}
                      </span>
                    )}
                  </span>
                  <span className="text-sm font-600 text-ink-700 tabnum">
                    ฿{p.sales}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
