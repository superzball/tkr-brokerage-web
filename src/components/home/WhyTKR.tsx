import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ROUTES } from "@/config/nav";

const FEATURES: Array<{
  key: "expertise" | "compare" | "allInOne" | "support";
  icon: IconName;
  tile: string;
  surface: string;
}> = [
  { key: "expertise", icon: "shieldCheck", tile: "bg-brand-500 text-white", surface: "bg-brand-50/70 border-brand-100" },
  { key: "compare", icon: "coins", tile: "bg-gold-400 text-ink-900", surface: "bg-gold-50 border-gold-100" },
  { key: "allInOne", icon: "refresh", tile: "bg-mint-500 text-white", surface: "bg-mint-50 border-mint-100" },
  { key: "support", icon: "headset", tile: "bg-peach-400 text-white", surface: "bg-peach-50 border-peach-100" },
];

export function WhyTKR() {
  const t = useTranslations("home.why");

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-24">
      <div className="grid lg:grid-cols-12 gap-12 items-center">
        {/* editorial copy — wider column */}
        <div className="lg:col-span-7 reveal">
          <Chip className="bg-mint-100 text-mint-600 mb-4">{t("badge")}</Chip>
          <h2
            className="font-display font-700 text-4xl sm:text-5xl lg:text-[3.4rem] text-ink-900 tracking-tight leading-[1.04]"
            style={{ textWrap: "balance" }}
          >
            {t("title")}
          </h2>
          <span className="kw-swash mt-5" aria-hidden="true" />
          <p className="mt-5 text-lg text-ink-600 leading-relaxed max-w-xl">{t("desc")}</p>

          <div className="mt-9 grid sm:grid-cols-2 gap-4">
            {FEATURES.map((feature) => (
              <div
                key={feature.key}
                className={`rounded-2xl border ${feature.surface} p-5 transition-transform duration-200 hover:-translate-y-1`}
              >
                <span className={`w-11 h-11 rounded-xl ${feature.tile} inline-flex items-center justify-center shadow-card`}>
                  <Icon name={feature.icon} />
                </span>
                <h4 className="mt-3.5 font-700 text-ink-900">
                  {t(`features.${feature.key}.title`)}
                </h4>
                <p className="text-sm text-ink-600 mt-1 leading-relaxed">
                  {t(`features.${feature.key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* offset "live" steps panel — overlaps + elevated */}
        <div className="lg:col-span-5 reveal lg:pl-4">
          <div className="card card-lg p-0 overflow-hidden shadow-pop lg:rotate-1">
            <div className="relative bg-gradient-to-br from-brand-600 to-ink-900 px-7 py-6 text-white">
              <div className="absolute inset-0 bg-grid opacity-20" />
              <div className="relative flex items-center gap-2 text-white/80 text-sm font-500">
                <Icon name="trend" /> {t("steps.heading")}
              </div>
            </div>
            <div className="p-7 bg-gradient-to-b from-white to-sky-50">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-brand-500 text-white font-700 inline-flex items-center justify-center text-sm shadow-card shrink-0">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="font-600 text-ink-900">{t("steps.s1.title")}</p>
                    <p className="text-xs text-ink-500">{t("steps.s1.sub")}</p>
                  </div>
                </div>
                <div className="ml-5 h-5 w-px bg-gradient-to-b from-brand-300 to-gold-300" />
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-gold-400 text-ink-900 font-700 inline-flex items-center justify-center text-sm shadow-card shrink-0">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="font-600 text-ink-900">{t("steps.s2.title")}</p>
                    <p className="text-xs text-ink-500">{t("steps.s2.sub")}</p>
                  </div>
                </div>
                <div className="ml-5 h-5 w-px bg-gradient-to-b from-gold-300 to-mint-300" />
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-full bg-mint-500 text-white inline-flex items-center justify-center shadow-card shrink-0">
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
      </div>
    </section>
  );
}
