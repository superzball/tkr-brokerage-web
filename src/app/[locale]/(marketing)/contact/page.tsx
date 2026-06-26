import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Chip } from "@/components/ui/Chip";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ContactForm } from "@/components/contact/ContactForm";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.contact" });
  return { title: t("title"), description: t("description") };
}

const METHODS: { icon: IconName; key: string; valueKey: string; noteKey?: string; href?: string; tone: string }[] = [
  { icon: "phone", key: "phone", valueKey: "phoneValue", noteKey: "phoneNote", href: "tel:021234567", tone: "bg-sky-100 text-brand-600" },
  { icon: "chat", key: "line", valueKey: "lineValue", noteKey: "lineNote", href: "https://line.me", tone: "bg-mint-50 text-mint-600" },
  { icon: "phone", key: "email", valueKey: "emailValue", noteKey: "emailNote", href: "mailto:hello@tkr.co.th", tone: "bg-gold-50 text-gold-600" },
];

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  // dynamic-key access for the methods map (typed t() rejects variables)
  const tk = t as unknown as (key: string) => string;

  return (
    <main>
      <section className="bg-hero border-b border-ink-100/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
          <Chip className="bg-white text-brand-700 shadow-card border border-brand-100 mb-4">
            <Icon name="headset" size={15} /> {t("hero.badge")}
          </Chip>
          <h1 className="font-display font-700 text-3xl sm:text-4xl text-ink-900 tracking-tight">
            {t("hero.title")}
          </h1>
          <p className="mt-3 text-ink-600 max-w-2xl">{t("hero.sub")}</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid gap-8 lg:grid-cols-[1fr_1.1fr] items-start">
        {/* left: methods + address + hours + map */}
        <div className="space-y-5">
          <h2 className="font-display font-700 text-xl text-ink-900">{t("methodsTitle")}</h2>
          <div className="space-y-3">
            {METHODS.map((m) => {
              const inner = (
                <span className="card card-hover p-4 flex items-center gap-3.5">
                  <span className={`w-11 h-11 rounded-xl ${m.tone} flex items-center justify-center shrink-0`}>
                    <Icon name={m.icon} size={20} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-ink-400">{tk(`methods.${m.key}`)}</span>
                    <span className="block font-600 text-ink-900">{tk(`methods.${m.valueKey}`)}</span>
                    {m.noteKey && <span className="block text-xs text-ink-500">{tk(`methods.${m.noteKey}`)}</span>}
                  </span>
                </span>
              );
              return m.href ? (
                <a key={m.key} href={m.href} className="block">{inner}</a>
              ) : (
                <div key={m.key}>{inner}</div>
              );
            })}
          </div>

          {/* address + hours */}
          <div className="card p-5 space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-brand-500 mt-0.5"><Icon name="pin" size={18} /></span>
              <div>
                <p className="text-xs text-ink-400">{t("methods.address")}</p>
                <p className="text-sm font-500 text-ink-800">{t("methods.addressValue")}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-brand-500 mt-0.5"><Icon name="clock" size={18} /></span>
              <div>
                <p className="text-xs text-ink-400">{t("methods.hours")}</p>
                <p className="text-sm font-500 text-ink-800">{t("methods.hoursValue")}</p>
              </div>
            </div>
            {/* map placeholder */}
            <div className="rounded-xl bg-sky-50 border border-ink-100 h-40 flex items-center justify-center text-ink-400">
              <span className="inline-flex items-center gap-2 text-sm"><Icon name="map" size={18} /> {t("mapPlaceholder")}</span>
            </div>
          </div>
        </div>

        {/* right: form */}
        <ContactForm />
      </section>

      {/* FAQ teaser */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="card p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-700 text-ink-900">{t("faqTeaser.title")}</h2>
            <p className="mt-1 text-sm text-ink-500">{t("faqTeaser.desc")}</p>
          </div>
          <Link href="/help/faq" className="btn btn-ghost btn-md shrink-0">
            <Icon name="help" size={16} /> {t("faqTeaser.cta")}
          </Link>
        </div>
      </section>
    </main>
  );
}
