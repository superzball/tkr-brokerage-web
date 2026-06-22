import { useTranslations } from "next-intl";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { AGENCY_STATS } from "@/config/agency";

export function AgencyStats() {
  const t = useTranslations("agency.stats");
  return (
    <div className="mt-7 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {AGENCY_STATS.map((s) => (
        <div key={s.key} className="card p-5 reveal">
          <div className="flex items-center justify-between">
            <span className="w-10 h-10 rounded-xl bg-sky-100 text-brand-600 inline-flex items-center justify-center">
              <Icon name={s.icon} />
            </span>
            <Chip className="bg-emerald-50 text-emerald-600 text-xs">
              {s.delta}
            </Chip>
          </div>
          <p className="mt-4 font-display font-700 text-3xl text-ink-900 tabnum">
            {s.value}
          </p>
          <p className="text-sm text-ink-500 mt-1">{t(s.key)}</p>
        </div>
      ))}
    </div>
  );
}
