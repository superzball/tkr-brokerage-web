import { useTranslations } from "next-intl";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/cn";
import { TRACK_ITEM_BADGE, TRACK_ITEMS } from "@/config/tracking";

export function ItemList() {
  const t = useTranslations("tracking");

  return (
    <div className="card p-6 reveal">
      <h3 className="font-600 text-ink-900 mb-1">{t("itemsTitle")}</h3>
      <p className="text-sm text-ink-500 mb-4">{t("itemsSubtitle")}</p>
      <div className="space-y-2.5">
        {TRACK_ITEMS.map((it) => {
          const badge = TRACK_ITEM_BADGE[it.state];
          const name = t(`items.${it.key}`);
          return (
            <div
              key={it.key}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-sky-50"
            >
              <span className="w-8 h-8 rounded-full bg-sky-100 text-brand-600 inline-flex items-center justify-center text-xs font-600 shrink-0">
                {name.slice(0, 1)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-600 text-ink-900 truncate">{name}</p>
                <p className="text-xs text-ink-400 tabnum">{it.pp}</p>
              </div>
              <Chip className={cn("text-xs shrink-0", badge.cls)}>
                {t(`itemStatus.${it.state}`)}
              </Chip>
            </div>
          );
        })}
      </div>
      <button className="btn btn-ghost btn-sm w-full mt-4">
        {t("viewAll")}
      </button>
    </div>
  );
}
