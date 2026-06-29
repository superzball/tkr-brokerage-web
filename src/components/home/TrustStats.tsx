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
  const featured = STATS[0]!;
  const rest = STATS.slice(1);

  return (
    <section className="bg-ink-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-10" />
      {/* warm gold glow so the dark band isn't flat blue */}
      <div
        className="absolute -top-24 right-[12%] w-[420px] h-[420px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle,rgba(242,183,54,.18),transparent 70%)" }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 left-[8%] w-[380px] h-[380px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle,rgba(20,173,118,.14),transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-24">
        {/* asymmetric: one oversized featured figure + three smaller */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          <div className="lg:col-span-5 reveal">
            <p className="font-display font-700 text-7xl sm:text-8xl text-white tabnum leading-none">
              <AnimatedCounter value={t(`${featured.key}.value`)} />
              <span className="text-gold-400">+</span>
            </p>
            <p className="mt-3 text-xl text-ink-200">{t(`${featured.key}.label`)}</p>
            <span className="mt-5 block h-1 w-24 rounded-full bg-gradient-to-r from-gold-400 to-gold-500" aria-hidden="true" />
          </div>

          <div className="lg:col-span-7 grid sm:grid-cols-3 gap-6">
            {rest.map((stat) => (
              <div key={stat.key} className="reveal rounded-2xl bg-white/[0.06] border border-white/10 p-6">
                <p className="font-display font-700 text-4xl sm:text-5xl text-white tabnum leading-none">
                  {stat.plus ? (
                    <AnimatedCounter value={t(`${stat.key}.value`)} />
                  ) : (
                    t(`${stat.key}.value`)
                  )}
                  {stat.plus && <span className="text-gold-400">+</span>}
                </p>
                <p className="mt-2.5 text-ink-300 text-sm">{t(`${stat.key}.label`)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* partners — scrolling marquee strip */}
        <div className="mt-16 pt-10 border-t border-ink-800">
          <p className="text-center text-sm text-ink-400 mb-7">
            {t("partnersHeading")}
          </p>
          <div className="marquee-mask overflow-hidden">
            <div className="marquee-track gap-x-12">
              {[...partnerList, ...partnerList].map((partner, i) => (
                <span
                  key={`${partner}-${i}`}
                  className="font-display font-700 text-xl text-ink-200/70 px-1 whitespace-nowrap"
                  aria-hidden={i >= partnerList.length}
                >
                  {partner}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
