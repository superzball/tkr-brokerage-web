import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { AGENCY_GOAL_PROGRESS } from "@/config/agency";

export function NextRewardCard() {
  const t = useTranslations("agency.reward");
  return (
    <div className="card p-6 reveal bg-gradient-to-br from-ink-900 to-brand-800 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-15" />
      <div className="relative">
        <div className="flex items-center gap-2 text-gold-300">
          <Icon name="sparkle" />
          <span className="text-sm font-500">{t("label")}</span>
        </div>
        <h3 className="font-display font-700 text-xl mt-2">{t("title")}</h3>
        <p className="text-sm text-ink-100/80 mt-2">{t("desc")}</p>
        <div className="mt-5">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-ink-100/80">{t("current")}</span>
            <span className="font-600">{t("target")}</span>
          </div>
          <div className="h-2.5 rounded-full bg-white/15 overflow-hidden">
            <div
              className="h-full rounded-full sheen"
              style={{
                width: `${AGENCY_GOAL_PROGRESS}%`,
                background: "linear-gradient(90deg,#f6cf6b,#e89c12)",
              }}
            />
          </div>
        </div>
        <Button href="#tier" variant="gold" size="md" className="w-full mt-6">
          {t("cta")}
        </Button>
      </div>
    </div>
  );
}
