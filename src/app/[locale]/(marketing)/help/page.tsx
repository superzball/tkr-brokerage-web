import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Chip } from "@/components/ui/Chip";
import { Icon, type IconName } from "@/components/ui/Icon";
import { HelpFaq } from "@/components/help/HelpFaq";
import { StillNeedHelp } from "@/components/help/StillNeedHelp";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.help" });
  return { title: t("title"), description: t("description") };
}

const CARDS: { href: string; icon: IconName; titleKey: string; descKey: string; tone: string }[] = [
  { href: "/help/how-to-buy", icon: "cart", titleKey: "cards.howToBuyTitle", descKey: "cards.howToBuyDesc", tone: "bg-sky-100 text-brand-600" },
  { href: "/help/claims", icon: "clipboard", titleKey: "cards.claimsTitle", descKey: "cards.claimsDesc", tone: "bg-mint-50 text-mint-600" },
  { href: "/help/faq", icon: "help", titleKey: "cards.faqTitle", descKey: "cards.faqDesc", tone: "bg-gold-50 text-gold-600" },
];

export default async function HelpPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("help");

  return (
    <main>
      <section className="bg-hero border-b border-ink-100/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 lg:py-20 text-center">
          <Chip className="bg-white text-brand-700 shadow-card border border-brand-100 mb-4">
            <Icon name="headset" size={15} /> {t("hero.badge")}
          </Chip>
          <h1 className="font-display font-700 text-3xl sm:text-5xl text-ink-900 tracking-tight">
            {t("hero.title")}
          </h1>
          <p className="mt-3 text-lg text-ink-600">{t("hero.sub")}</p>
        </div>
      </section>

      {/* topic cards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 lg:-mt-10 relative">
        <div className="grid gap-5 sm:grid-cols-3">
          {CARDS.map((c) => (
            <Link key={c.href} href={c.href} className="card card-hover p-6 group">
              <span className={`w-12 h-12 rounded-2xl ${c.tone} flex items-center justify-center`}>
                <Icon name={c.icon} size={24} />
              </span>
              <h2 className="mt-4 font-700 text-ink-900 group-hover:text-brand-700 transition-colors">
                {t(c.titleKey)}
              </h2>
              <p className="mt-1.5 text-sm text-ink-500 leading-relaxed">{t(c.descKey)}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-600 text-brand-600">
                <Icon name="arrowRight" size={15} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* popular FAQ teaser */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-700 text-2xl text-ink-900">{t("popularTitle")}</h2>
          <Link href="/help/faq" className="text-sm font-600 text-brand-600 hover:underline inline-flex items-center gap-1">
            {t("categories.all")} <Icon name="arrowRight" size={15} />
          </Link>
        </div>
        <HelpFaq search={false} limit={5} />
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <StillNeedHelp />
      </section>
    </main>
  );
}
