import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";

export function NotifyCard() {
  const t = useTranslations("tracking.notify");
  return (
    <div className="card p-6 reveal bg-gradient-to-br from-sky-50 to-white">
      <div className="flex items-center gap-2 text-brand-600 mb-2">
        <Icon name="info" />
        <p className="font-600 text-ink-900">{t("title")}</p>
      </div>
      <p className="text-sm text-ink-600 leading-relaxed">{t("desc")}</p>
    </div>
  );
}
