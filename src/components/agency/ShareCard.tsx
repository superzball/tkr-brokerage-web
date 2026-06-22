import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";
import { ShareLink } from "./ShareLink";

export function ShareCard() {
  const t = useTranslations("agency.share");
  return (
    <div className="card p-6 reveal">
      <h3 className="font-600 text-ink-900 flex items-center gap-2">
        <span className="text-brand-600">
          <Icon name="link" />
        </span>{" "}
        {t("title")}
      </h3>
      <ShareLink />
      <div className="mt-4 flex items-center gap-4">
        <div className="w-24 h-24 rounded-xl bg-white border border-ink-100 p-1.5 shrink-0">
          <div
            className="w-full h-full rounded-lg bg-ink-900"
            style={{
              backgroundImage: "radial-gradient(#fff 28%,transparent 29%)",
              backgroundSize: "11px 11px",
            }}
          />
        </div>
        <div className="text-sm text-ink-600">
          <p className="font-600 text-ink-900 mb-1">{t("qrTitle")}</p>
          <p>{t("qrDesc")}</p>
        </div>
      </div>
    </div>
  );
}
