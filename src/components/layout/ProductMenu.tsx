import { useTranslations } from "next-intl";
import { AppLink } from "@/components/ui/AppLink";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { PRODUCT_MENU } from "@/config/nav";
import { cn } from "@/lib/cn";

/** "ผลิตภัณฑ์" hover dropdown (CSS-only, group/prod). */
export function ProductMenu({ active }: { active: boolean }) {
  const t = useTranslations("nav");
  return (
    <div className="relative group/prod">
      <button
        className={cn("nav-link inline-flex items-center gap-1", active && "active")}
      >
        {t("products")}
        <Icon
          name="chevD"
          size={14}
          strokeWidth={2.4}
          className="transition-transform group-hover/prod:rotate-180"
        />
      </button>
      <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible translate-y-1 group-hover/prod:opacity-100 group-hover/prod:visible group-hover/prod:translate-y-0 transition-all duration-200 z-50">
        <div className="w-[340px] card p-2.5">
          {PRODUCT_MENU.map((item) => (
            <AppLink
              key={item.key}
              href={item.href}
              className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-sky-100 transition-colors"
            >
              <span
                className={cn(
                  "mt-0.5 inline-flex w-9 h-9 rounded-lg items-center justify-center shrink-0",
                  item.featured
                    ? "bg-brand-500 text-white"
                    : "bg-sky-100 text-brand-600",
                )}
              >
                <Icon name={item.icon} />
              </span>
              <span>
                <span className="block text-sm font-600 text-ink-900 flex items-center gap-1.5">
                  {t(`product.${item.key}.title`)}
                  {item.featured && (
                    <Chip className="bg-gold-100 text-gold-600 !py-0 !px-1.5 text-[0.62rem]">
                      {t("featured")}
                    </Chip>
                  )}
                </span>
                <span className="block text-xs text-ink-500 mt-0.5">
                  {t(`product.${item.key}.desc`)}
                </span>
              </span>
            </AppLink>
          ))}
        </div>
      </div>
    </div>
  );
}
