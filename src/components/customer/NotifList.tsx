import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";
import { CUSTOMER_NOTIFS, NOTIF_COLOR } from "@/config/customer";

export function NotifList() {
  const t = useTranslations("customer");

  return (
    <div className="card p-6 reveal">
      <h3 className="font-600 text-ink-900 mb-4 flex items-center gap-2">
        <span className="text-brand-600">
          <Icon name="bell" />
        </span>{" "}
        {t("notifsTitle")}
      </h3>
      <div className="space-y-3">
        {CUSTOMER_NOTIFS.map((n) => (
          <div
            key={n.key}
            className="flex gap-3 p-3 rounded-xl hover:bg-sky-50 transition-colors"
          >
            <span
              className={`w-9 h-9 rounded-lg inline-flex items-center justify-center shrink-0 ${NOTIF_COLOR[n.color]}`}
            >
              <Icon name={n.icon} />
            </span>
            <div>
              <p className="text-sm font-600 text-ink-900">
                {t(`notifs.${n.key}.t`)}
              </p>
              <p className="text-xs text-ink-500 mt-0.5">
                {t(`notifs.${n.key}.d`)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
