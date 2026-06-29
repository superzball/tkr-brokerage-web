import { useTranslations } from "next-intl";
import { AppLink } from "@/components/ui/AppLink";
import { Chip } from "@/components/ui/Chip";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ROUTES } from "@/config/nav";

type SecondaryProduct = {
  key: "auto" | "travel" | "health" | "fire";
  icon: IconName;
  href: string;
  /** per-card accent so the grid isn't monochrome blue */
  tile: string;
  cta: string;
  bar: string;
};

// Trust palette: one calm brand-blue treatment across all four — the bento
// structure (tall dark feature + white cards) provides the interest, not colour
// noise. Icons differ by shape, not by hue.
const SECONDARY: SecondaryProduct[] = [
  { key: "auto", icon: "car", href: "/insurance/auto", tile: "bg-brand-50 text-brand-600", cta: "text-brand-600", bar: "from-brand-400 to-brand-600" },
  { key: "travel", icon: "plane", href: "/insurance/travel", tile: "bg-brand-50 text-brand-600", cta: "text-brand-600", bar: "from-brand-400 to-brand-600" },
  { key: "health", icon: "heart", href: "/insurance/health", tile: "bg-brand-50 text-brand-600", cta: "text-brand-600", bar: "from-brand-400 to-brand-600" },
  { key: "fire", icon: "flame", href: "/insurance/fire", tile: "bg-brand-50 text-brand-600", cta: "text-brand-600", bar: "from-brand-400 to-brand-600" },
];

export function ProductGrid() {
  const t = useTranslations("home.products");
  const workerFeatures = t.raw("worker.features") as string[];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 lg:pt-32 pb-8">
      {/* asymmetric header: left-aligned heading, right-aligned aside */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 reveal">
        <div className="max-w-xl">
          <Chip className="bg-brand-50 text-brand-700 mb-4">{t("badge")}</Chip>
          <h2 className="font-display font-700 text-4xl sm:text-5xl lg:text-5xl text-ink-900 tracking-tight leading-[1.05]">
            {t("title")}
          </h2>
          <span className="kw-swash mt-5" aria-hidden="true" />
        </div>
        <p className="lg:text-right text-md text-ink-500 lg:max-w-xs lg:pb-2">{t("subtitle")}</p>
      </div>

      <div className="mt-12 grid lg:grid-cols-3 gap-5">
        {/* Featured: worker — tall, dark, gold-accented */}
        <AppLink href={ROUTES.worker} className="lg:row-span-2 group reveal">
          <div className="card card-hover h-full p-7 relative overflow-hidden bg-gradient-to-br from-ink-900 to-brand-800 text-white border-0 shadow-pop">
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div
              className="absolute -bottom-16 -right-12 w-64 h-64 rounded-full blur-2xl"
              style={{
                background:
                  "radial-gradient(circle,rgba(242,183,54,.32),transparent 70%)",
              }}
            />
            <div
              className="absolute -top-20 -left-10 w-56 h-56 rounded-full blur-2xl"
              style={{
                background:
                  "radial-gradient(circle,rgba(31,102,238,.28),transparent 70%)",
              }}
            />
            <div className="relative">
              <div className="flex items-center justify-between">
                <span className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur inline-flex items-center justify-center ring-1 ring-white/20">
                  <Icon name="users" />
                </span>
                <Chip className="bg-gold-400 text-ink-900 font-700 shadow-gold">
                  {t("worker.badge")}
                </Chip>
              </div>
              <h3 className="mt-7 font-display font-700 text-3xl">
                {t("worker.title")}
              </h3>
              <p className="mt-3 text-ink-100/90 leading-relaxed">
                {t("worker.desc")}
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-ink-100">
                {workerFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-mint-500/25 text-mint-300 inline-flex items-center justify-center shrink-0">
                      <Icon name="check" size={13} />
                    </span>{" "}
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-8 inline-flex items-center gap-2 font-700 text-gold-300 group-hover:gap-3.5 transition-all">
                {t("worker.cta")} <Icon name="arrowRight" />
              </div>
            </div>
          </div>
        </AppLink>

        {/* secondary products — top accent bar + lifting card */}
        {SECONDARY.map((product) => (
          <AppLink key={product.key} href={product.href} className="group reveal">
            <div className="card card-hover h-full p-6 relative overflow-hidden shadow-pop">
              <span
                className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${product.bar}`}
                aria-hidden="true"
              />
              <span className={`w-12 h-12 rounded-2xl ${product.tile} inline-flex items-center justify-center transition-transform duration-200 group-hover:scale-105`}>
                <Icon name={product.icon} />
              </span>
              <h3 className="mt-4 font-600 text-lg text-ink-900">
                {t(`${product.key}.title`)}
              </h3>
              <p className="mt-1.5 text-sm text-ink-600 leading-relaxed">
                {t(`${product.key}.desc`)}
              </p>
              <div className={`mt-4 inline-flex items-center gap-1.5 text-sm font-600 ${product.cta} group-hover:gap-2.5 transition-all`}>
                {t(`${product.key}.cta`)} <Icon name="arrowRight" />
              </div>
            </div>
          </AppLink>
        ))}
      </div>
    </section>
  );
}
