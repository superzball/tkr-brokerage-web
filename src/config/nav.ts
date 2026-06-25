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
  insurance: "/insurance",
  promotions: "/promotions",
  reviews: "/reviews",
} as const;

/** Products hover dropdown (worker is featured). Each opens its "How it works"
 *  landing at /insurance/<key>, which then funnels into the quote / signup. */
export const PRODUCT_MENU: MenuItem<ProductMenuKey>[] = [
  { key: "worker", href: "/insurance/worker", icon: "star", featured: true },
  { key: "auto", href: "/insurance/auto", icon: "car" },
  { key: "travel", href: "/insurance/travel", icon: "plane" },
  { key: "health", href: "/insurance/health", icon: "heart" },
  { key: "fire", href: "/insurance/fire", icon: "flame" },
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
  { key: "allProducts", href: ROUTES.insurance },
  { key: "worker", href: ROUTES.worker },
  { key: "auto", href: ROUTES.auto },
  { key: "customer", href: ROUTES.customer },
  { key: "agency", href: ROUTES.agency },
  { key: "promotions", href: ROUTES.promotions },
  { key: "reviews", href: ROUTES.reviews },
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
      { key: "worker", href: "/insurance/worker" },
      { key: "auto", href: "/insurance/auto" },
      { key: "travel", href: "/insurance/travel" },
      { key: "health", href: "/insurance/health" },
      { key: "fire", href: "/insurance/fire" },
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
