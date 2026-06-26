import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ROUTES } from "@/config/nav";

const FEATURES: Array<{
  key: "expertise" | "compare" | "allInOne" | "support";
  icon: IconName;
  tile: string;
}> = [
  { key: "expertise", icon: "shieldCheck", tile: "bg-brand-50 text-brand-600" },
  { key: "compare", icon: "coins", tile: "bg-gold-100 text-gold-600" },
  { key: "allInOne", icon: "refresh", tile: "bg-mint-100 text-mint-600" },
  { key: "support", icon: "headset", tile: "bg-peach-100 text-peach-600" },
];

export function WhyTKR() {
  const t = useTranslations("home.why");

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="reveal">
          <Chip className="bg-mint-100 text-mint-600 mb-4">{t("badge")}</Chip>
          <h2
            className="font-display font-700 text-4xl sm:text-5xl text-ink-900 tracking-tight leading-[1.08]"
            style={{ textWrap: "balance" }}
          >
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-ink-600 leading-relaxed">{t("desc")}</p>
          <div className="mt-8 grid sm:grid-cols-2 gap-x-8 gap-y-7">
            {FEATURES.map((feature) => (
              <div key={feature.key} className="flex gap-3.5">
                <span className={`w-12 h-12 rounded-2xl ${feature.tile} inline-flex items-center justify-center shrink-0`}>
                  <Icon name={feature.icon} />
                </span>
                <div>
                  <h4 className="font-600 text-ink-900">
                    {t(`features.${feature.key}.title`)}
                  </h4>
                  <p className="text-sm text-ink-600 mt-1">
                    {t(`features.${feature.key}.desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="reveal">
          <div className="card card-lg p-8 bg-gradient-to-br from-sky-50 to-white">
            <div className="flex items-center gap-2 text-ink-400 text-sm font-500">
              <Icon name="trend" /> {t("steps.heading")}
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-4">
                <span className="w-9 h-9 rounded-full bg-brand-500 text-white font-600 inline-flex items-center justify-center text-sm">
                  1
                </span>
                <div className="flex-1">
                  <p className="font-600 text-ink-900">{t("steps.s1.title")}</p>
                  <p className="text-xs text-ink-500">{t("steps.s1.sub")}</p>
                </div>
              </div>
              <div className="ml-4 h-5 w-px bg-sky-200" />
              <div className="flex items-center gap-4">
                <span className="w-9 h-9 rounded-full bg-brand-500 text-white font-600 inline-flex items-center justify-center text-sm">
                  2
                </span>
                <div className="flex-1">
                  <p className="font-600 text-ink-900">{t("steps.s2.title")}</p>
                  <p className="text-xs text-ink-500">{t("steps.s2.sub")}</p>
                </div>
              </div>
              <div className="ml-4 h-5 w-px bg-sky-200" />
              <div className="flex items-center gap-4">
                <span className="w-9 h-9 rounded-full bg-mint-500 text-white inline-flex items-center justify-center">
                  <Icon name="check" />
                </span>
                <div className="flex-1">
                  <p className="font-600 text-ink-900">{t("steps.s3.title")}</p>
                  <p className="text-xs text-ink-500">{t("steps.s3.sub")}</p>
                </div>
              </div>
            </div>
            <Button
              href={ROUTES.tracking}
              variant="ghost"
              size="md"
              className="w-full mt-7"
            >
              {t("steps.cta")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
