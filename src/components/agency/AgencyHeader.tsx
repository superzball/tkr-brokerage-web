import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";

export function AgencyHeader() {
  const t = useTranslations("agency");
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 reveal">
      <div className="flex items-center gap-4">
        <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-ink-800 text-white inline-flex items-center justify-center font-display font-700 text-xl">
          {t("header.avatar")}
        </span>
        <div>
          <p className="text-sm text-ink-500">{t("header.greeting")}</p>
          <h1 className="font-display font-700 text-2xl text-ink-900">
            {t("header.name")}
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Chip className="bg-white shadow-card border border-gold-300 text-gold-600">
          <Icon name="trophy" /> {t("header.tierBadge")}
        </Chip>
        <Button href="#tools" variant="primary" size="md">
          {t("header.tools")}
        </Button>
      </div>
    </div>
  );
}
