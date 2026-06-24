// Custom 404 page. Rendered for unmatched localized paths (via the [...rest]
// catch-all) and for any notFound() thrown inside the [locale] subtree.
// i18n + on-brand; lives outside the app shell so it covers marketing + portal.

import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";

export default async function NotFound() {
  const t = await getTranslations("app.notFound");
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f6f9fe] px-6 py-16">
      <div className="text-center max-w-md">
        <p className="text-[clamp(72px,18vw,120px)] leading-none font-800 bg-gradient-to-br from-brand-500 to-brand-700 bg-clip-text text-transparent select-none">
          404
        </p>
        <h1 className="mt-3 text-2xl font-700 text-ink-900">{t("title")}</h1>
        <p className="mt-2.5 text-ink-500 leading-relaxed">{t("body")}</p>
        <div className="mt-7 flex justify-center">
          <Button href="/" variant="primary" size="md">
            {t("home")}
          </Button>
        </div>
      </div>
    </main>
  );
}
