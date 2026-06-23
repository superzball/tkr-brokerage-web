import { useTranslations } from "next-intl";
import { AppLink } from "@/components/ui/AppLink";
import { Chip } from "@/components/ui/Chip";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ROUTES } from "@/config/nav";

type SecondaryProduct = {
  key: "auto" | "travel" | "health" | "fire";
  icon: IconName;
  href: string;
};

const SECONDARY: SecondaryProduct[] = [
  { key: "auto", icon: "car", href: "/insurance/auto" },
  { key: "travel", icon: "plane", href: "/insurance/travel" },
  { key: "health", icon: "heart", href: "/insurance/health" },
  { key: "fire", icon: "flame", href: "/insurance/fire" },
];

export function ProductGrid() {
  const t = useTranslations("home.products");
  const workerFeatures = t.raw("worker.features") as string[];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 lg:pt-32 pb-8">
      <div className="text-center max-w-2xl mx-auto reveal">
        <Chip className="bg-brand-50 text-brand-600 mb-3">{t("badge")}</Chip>
        <h2 className="font-display font-700 text-3xl sm:text-4xl text-ink-900 tracking-tight">
          {t("title")}
        </h2>
        <p className="mt-3 text-ink-600">{t("subtitle")}</p>
      </div>

      <div className="mt-12 grid lg:grid-cols-3 gap-5">
        {/* Featured: worker */}
        <AppLink href={ROUTES.worker} className="lg:row-span-2 group reveal">
          <div className="card card-hover h-full p-7 relative overflow-hidden bg-gradient-to-br from-ink-900 to-brand-800 text-white border-0">
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div
              className="absolute -bottom-16 -right-12 w-64 h-64 rounded-full blur-2xl"
              style={{
                background:
                  "radial-gradient(circle,rgba(242,183,54,.28),transparent 70%)",
              }}
            />
            <div className="relative">
              <div className="flex items-center justify-between">
                <span className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur inline-flex items-center justify-center">
                  <Icon name="users" />
                </span>
                <Chip className="bg-gold-400 text-ink-900 font-700">
                  {t("worker.badge")}
                </Chip>
              </div>
              <h3 className="mt-7 font-display font-700 text-2xl">
                {t("worker.title")}
              </h3>
              <p className="mt-3 text-ink-100/90 leading-relaxed">
                {t("worker.desc")}
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-ink-100">
                {workerFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5">
                    <span className="text-gold-300">
                      <Icon name="check" />
                    </span>{" "}
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-8 inline-flex items-center gap-2 font-600 text-gold-300 group-hover:gap-3 transition-all">
                {t("worker.cta")} <Icon name="arrowRight" />
              </div>
            </div>
          </div>
        </AppLink>

        {/* secondary products */}
        {SECONDARY.map((product) => (
          <AppLink key={product.key} href={product.href} className="group reveal">
            <div className="card card-hover h-full p-6">
              <span className="w-12 h-12 rounded-xl bg-sky-100 text-brand-600 inline-flex items-center justify-center">
                <Icon name={product.icon} />
              </span>
              <h3 className="mt-4 font-600 text-lg text-ink-900">
                {t(`${product.key}.title`)}
              </h3>
              <p className="mt-1.5 text-sm text-ink-600 leading-relaxed">
                {t(`${product.key}.desc`)}
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-600 text-brand-600 group-hover:gap-2.5 transition-all">
                {t(`${product.key}.cta`)} <Icon name="arrowRight" />
              </div>
            </div>
          </AppLink>
        ))}
      </div>
    </section>
  );
}
