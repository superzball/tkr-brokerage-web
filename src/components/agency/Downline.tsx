import { useTranslations } from "next-intl";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/cn";
import { AGENCY_DOWNLINE } from "@/config/agency";

export function Downline() {
  const t = useTranslations("agency.downline");
  const tt = useTranslations("agency.tiers");

  return (
    <div className="lg:col-span-2 card p-6 reveal">
      <h2 className="font-600 text-lg text-ink-900 mb-1">{t("title")}</h2>
      <p className="text-sm text-ink-500 mb-5">{t("subtitle")}</p>
      <div className="space-y-2.5">
        <div className="hidden sm:grid grid-cols-[1.6fr_1fr_1fr_0.8fr] gap-3 px-3 pb-2 text-xs font-500 text-ink-400">
          <span>{t("cols.agent")}</span>
          <span>{t("cols.sales")}</span>
          <span>{t("cols.clients")}</span>
          <span className="text-right">{t("cols.growth")}</span>
        </div>
        {AGENCY_DOWNLINE.map((d) => {
          const name = t(`${d.key}.name`);
          return (
            <div
              key={d.key}
              className="grid grid-cols-2 sm:grid-cols-[1.6fr_1fr_1fr_0.8fr] gap-3 items-center px-3 py-3 rounded-xl hover:bg-sky-50 transition-colors"
            >
              <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
                <span className="w-8 h-8 rounded-full bg-sky-100 text-brand-600 inline-flex items-center justify-center text-xs font-600">
                  {name.slice(0, 1)}
                </span>
                <div>
                  <p className="text-sm font-600 text-ink-900">{name}</p>
                  <Chip
                    className={cn(
                      "text-[0.62rem] !py-0 !px-1.5",
                      d.tier === "gold"
                        ? "bg-gold-100 text-gold-600"
                        : "bg-sky-100 text-ink-500",
                    )}
                  >
                    {tt(`${d.tier}.name`)}
                  </Chip>
                </div>
              </div>
              <span className="text-sm font-600 text-ink-700 tabnum">
                ฿{d.sales}
              </span>
              <span className="text-sm text-ink-600 tabnum">{d.clients}</span>
              <span className="text-sm font-600 text-emerald-600 text-right tabnum">
                {d.trend}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
