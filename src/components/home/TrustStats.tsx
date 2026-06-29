import { useTranslations } from "next-intl";
import { AnimatedCounter } from "./AnimatedCounter";

// Headline trust NUMBERS only. The partner-insurer logos + credential proof
// points (OIC license, claims-paid rate) live in TrustCredentials below — kept
// distinct so the two bands don't repeat the same figure or logo wall. (The
// `partners` stat is intentionally omitted here; partners are shown as the logo
// wall in TrustCredentials.)
const STATS: Array<{
  key: "orgs" | "policies" | "founded";
  plus: boolean;
}> = [
  { key: "orgs", plus: true },
  { key: "policies", plus: false },
  { key: "founded", plus: false },
];

export function TrustStats() {
  const t = useTranslations("home.stats");
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
              <span className="text-gradient">
                <AnimatedCounter value={t(`${featured.key}.value`)} />+
              </span>
            </p>
            <p className="mt-3 text-xl text-ink-700">{t(`${featured.key}.label`)}</p>
            <span className="mt-5 block h-1 w-24 rounded-full bg-gradient-to-r from-gold-400 to-gold-500" aria-hidden="true" />
          </div>

          {/* supporting stat cards */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-5">
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
      </div>
    </section>
  );
}
