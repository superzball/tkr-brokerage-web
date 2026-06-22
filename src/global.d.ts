import type { routing } from "@/i18n/routing";
import type messages from "@/messages/th.json";

/**
 * Type-safe i18n: `th.json` is the source-of-truth message shape, and the
 * locale union comes from routing. This makes `useTranslations` keys and
 * `<Link href>` locales checked at compile time.
 */
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
