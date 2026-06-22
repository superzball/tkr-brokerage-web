import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";
import { AGENCY_MEDIA } from "@/config/agency";

export function MediaCard() {
  const t = useTranslations("agency.media");
  return (
    <div className="card p-6 reveal">
      <h3 className="font-600 text-ink-900 flex items-center gap-2 mb-4">
        <span className="text-brand-600">
          <Icon name="image" />
        </span>{" "}
        {t("title")}
      </h3>
      <div className="space-y-2">
        {AGENCY_MEDIA.map((m) => (
          <a
            key={m.key}
            href="#"
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-sky-50 transition-colors group"
          >
            <span className="w-9 h-9 rounded-lg bg-sky-100 text-brand-600 inline-flex items-center justify-center shrink-0">
              <Icon name={m.icon} />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-sm font-600 text-ink-900 truncate">
                {t(`${m.key}.title`)}
              </span>
              <span className="block text-xs text-ink-400">
                {t(`${m.key}.meta`)}
              </span>
            </span>
            <span className="text-ink-300 group-hover:text-brand-600">
              <Icon name="download" />
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
