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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-20">
      {/* contained, clearly-styled band — elevated panel so the section reads as
          a proper container (not a bare strip on white) */}
      <div className="relative overflow-hidden rounded-[2rem] sec-sky border border-brand-100/70 shadow-pop p-8 sm:p-12">
        {/* soft warm glow accent */}
        <div
          className="absolute -top-20 right-[8%] w-[360px] h-[360px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle,rgba(246,159,18,.16),transparent 70%)" }}
          aria-hidden="true"
        />

        <div className="relative grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* oversized featured gold figure */}
          <div className="lg:col-span-5">
            <p className="font-display font-700 text-7xl sm:text-8xl tabnum leading-none">
              <span className="text-gold-gradient">
                <AnimatedCounter value={t(`${featured.key}.value`)} />+
              </span>
            </p>
            <p className="mt-3 text-xl text-ink-700">{t(`${featured.key}.label`)}</p>
            <span className="mt-5 block h-1 w-24 rounded-full bg-gradient-to-r from-gold-400 to-gold-500" aria-hidden="true" />
          </div>

          {/* three stat cards */}
          <div className="lg:col-span-7 grid sm:grid-cols-3 gap-5">
            {rest.map((stat) => (
              <div key={stat.key} className="card card-hover bg-white/80 backdrop-blur-sm p-6">
                <p className="font-display font-700 text-4xl sm:text-5xl text-ink-900 tabnum leading-none">
                  {stat.plus ? (
                    <AnimatedCounter value={t(`${stat.key}.value`)} />
                  ) : (
                    t(`${stat.key}.value`)
                  )}
                  {stat.plus && <span className="text-gold-500">+</span>}
                </p>
                <p className="mt-2.5 text-ink-500 text-sm">{t(`${stat.key}.label`)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* partners — scrolling marquee strip, inside the band */}
        <div className="relative mt-12 pt-8 border-t border-brand-100/70">
          <p className="text-center text-sm text-ink-400 mb-6">
            {t("partnersHeading")}
          </p>
          <div className="marquee-mask overflow-hidden">
            <div className="marquee-track gap-x-12">
              {[...partnerList, ...partnerList].map((partner, i) => (
                <span
                  key={`${partner}-${i}`}
                  className="font-display font-700 text-xl text-ink-300 px-1 whitespace-nowrap"
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
