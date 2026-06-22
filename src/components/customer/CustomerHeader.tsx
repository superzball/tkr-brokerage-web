import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ROUTES } from "@/config/nav";

export function CustomerHeader() {
  const t = useTranslations("customer");
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 reveal">
      <div className="flex items-center gap-4">
        <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-ink-800 text-white inline-flex items-center justify-center font-display font-700 text-xl">
          {t("header.avatar")}
        </span>
        <div>
          <p className="text-sm text-ink-500">{t("header.welcome")}</p>
          <h1 className="font-display font-700 text-2xl text-ink-900">
            {t("header.name")}
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <button className="relative w-11 h-11 rounded-xl bg-white border border-ink-100 inline-flex items-center justify-center text-ink-600 hover:text-brand-600">
          <Icon name="bell" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500" />
        </button>
        <Button href={ROUTES.worker} variant="primary" size="md">
          <Icon name="plus" /> {t("header.newPolicy")}
        </Button>
      </div>
    </div>
  );
}
