import { useTranslations } from "next-intl";
import { AnimatedCounter } from "./AnimatedCounter";

const STATS: Array<{
  key: "orgs" | "policies" | "founded" | "partners";
  plus: boolean;
}> = [
  { key: "orgs", plus: true },
  { key: "policies", plus: true },
  { key: "founded", plus: false },
  { key: "partners", plus: true },
];

export function TrustStats() {
  const t = useTranslations("home.stats");
  const partnerList = t.raw("partnerList") as string[];

  return (
    <section className="bg-ink-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
          {STATS.map((stat) => (
            <div key={stat.key} className="reveal">
              <p className="font-display font-700 text-4xl sm:text-5xl text-white tabnum">
                {/* count up the headline figures; the founded year stays literal */}
                {stat.plus ? (
                  <AnimatedCounter value={t(`${stat.key}.value`)} />
                ) : (
                  t(`${stat.key}.value`)
                )}
                {stat.plus && <span className="text-gold-400">+</span>}
              </p>
              <p className="mt-2 text-ink-300">{t(`${stat.key}.label`)}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-10 border-t border-ink-800">
          <p className="text-center text-sm text-ink-400 mb-7">
            {t("partnersHeading")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {partnerList.map((partner) => (
              <span
                key={partner}
                className="font-display font-700 text-xl text-ink-200/80"
              >
                {partner}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
