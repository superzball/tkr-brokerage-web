// src/components/help/StillNeedHelp.tsx
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icon";
import { ROUTES } from "@/config/nav";

/** "Still need help?" block — links to /contact + the 24/7 LINE chat. */
export async function StillNeedHelp() {
  const t = await getTranslations("help");
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-r from-brand-600 to-brand-500 text-white p-7 sm:p-9 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
      <div className="absolute inset-0 bg-grid opacity-15" />
      <div className="relative">
        <h3 className="font-display font-700 text-2xl">{t("stillNeedHelp.title")}</h3>
        <p className="mt-1 text-white/80">{t("stillNeedHelp.desc")}</p>
      </div>
      <div className="relative flex flex-wrap gap-3 shrink-0">
        <Link href="/contact" className="btn btn-gold btn-md">
          <Icon name="phone" size={16} /> {t("stillNeedHelp.contact")}
        </Link>
        <Link href={ROUTES.line} className="btn bg-white text-brand-700 btn-md hover:bg-sky-50">
          <Icon name="chat" size={16} /> {t("stillNeedHelp.chat")}
        </Link>
      </div>
    </div>
  );
}
