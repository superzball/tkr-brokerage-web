import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  // Static rendering for all locales is enabled per-page via setRequestLocale.
  experimental: {
    // next-intl works with Turbopack out of the box; nothing extra needed here.
  },
};

// Points at ./src/i18n/request.ts by default.
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
