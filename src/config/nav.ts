import type {
  FooterColumn,
  MenuItem,
  NavRoute,
  ProductMenuKey,
  ServiceMenuKey,
} from "@/types";

/** Canonical route map (was the `L` object in nav.js, now localized routes). */
export const ROUTES = {
  home: "/",
  worker: "/worker-insurance",
  auto: "/auto",
  customer: "/customer",
  agency: "/agency",
  wallet: "/wallet",
  line: "/line",
  tracking: "/tracking",
} as const;

/** Products hover dropdown (worker is featured). travel/health/fire are "#" stubs. */
export const PRODUCT_MENU: MenuItem<ProductMenuKey>[] = [
  { key: "worker", href: ROUTES.worker, icon: "star", featured: true },
  { key: "auto", href: ROUTES.auto, icon: "car" },
  { key: "travel", href: "#", icon: "plane" },
  { key: "health", href: "#", icon: "heart" },
  { key: "fire", href: "#", icon: "flame" },
];

/** Digital Services hover dropdown. */
export const SERVICE_MENU: MenuItem<ServiceMenuKey>[] = [
  { key: "wallet", href: ROUTES.wallet, icon: "wallet" },
  { key: "line", href: ROUTES.line, icon: "chat" },
  { key: "tracking", href: ROUTES.tracking, icon: "truck" },
];

/** Full ordered list for the mobile drawer. */
export const MOBILE_NAV: NavRoute[] = [
  { key: "home", href: ROUTES.home },
  { key: "worker", href: ROUTES.worker },
  { key: "auto", href: ROUTES.auto },
  { key: "customer", href: ROUTES.customer },
  { key: "agency", href: ROUTES.agency },
  { key: "wallet", href: ROUTES.wallet },
  { key: "line", href: ROUTES.line },
  { key: "tracking", href: ROUTES.tracking },
];

/** Which page keys highlight each dropdown trigger as active. */
export const PRODUCT_ACTIVE_KEYS = ["worker", "auto"];
export const SERVICE_ACTIVE_KEYS = ["wallet", "line", "tracking"];

/** Footer link columns (labels from the `footer.link` namespace). */
export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    key: "products",
    links: [
      { key: "worker", href: ROUTES.worker },
      { key: "auto", href: ROUTES.auto },
      { key: "travel", href: "#" },
      { key: "health", href: "#" },
      { key: "fire", href: "#" },
    ],
  },
  {
    key: "services",
    links: [
      { key: "customer", href: ROUTES.customer },
      { key: "wallet", href: ROUTES.wallet },
      { key: "line", href: ROUTES.line },
      { key: "tracking", href: ROUTES.tracking },
    ],
  },
  {
    key: "company",
    links: [
      { key: "applyAgent", href: ROUTES.agency },
      { key: "agencyCenter", href: ROUTES.agency },
      { key: "about", href: "#" },
      { key: "contact", href: "#" },
    ],
  },
];

/** Social glyphs shown in the footer. */
export const FOOTER_SOCIAL = ["facebook", "line", "phone"] as const;
