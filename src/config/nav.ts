import type {
  FooterColumn,
  MenuItem,
  NavRoute,
  ProductMenuKey,
  ServiceMenuKey,
} from "@/types";
import type { TopNavItem } from "@/types/portal";
import { FEATURES } from "@/config/features";

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

/**
 * Public top nav (Phase 19, PUBLIC_NAV_ADDITIONS). Mega menus for Products /
 * About / Help; simple links for Articles / Contact. Right-side actions
 * (search / quote CTA / login / agent login) live in `publicNavActions`.
 * Additive — existing PRODUCT_MENU/SERVICE_MENU/ROUTES stay for other callers.
 * Labels resolve from the `topnav` message namespace.
 */
export const publicNav: TopNavItem[] = [
  {
    key: "products",
    featured: {
      key: "workerFlagship",
      href: "/insurance/worker",
      icon: "users",
      descKey: "workerFlagshipDesc",
      badgeKey: "flagship",
    },
    columns: [
      {
        key: "colWorker",
        links: [
          { key: "worker", href: "/insurance/worker", icon: "users", descKey: "workerDesc" },
          { key: "workerWallet", href: "/insurance/worker-wallet", icon: "wallet", descKey: "workerWalletDesc" },
        ],
      },
      {
        key: "colPersonal",
        links: [
          { key: "auto", href: "/insurance/auto", icon: "car", descKey: "autoDesc" },
          { key: "travel", href: "/insurance/travel", icon: "plane", descKey: "travelDesc" },
          { key: "health", href: "/insurance/health", icon: "heartPulse", descKey: "healthDesc" },
          { key: "fire", href: "/insurance/fire", icon: "flame", descKey: "fireDesc" },
        ],
      },
      {
        key: "colDigital",
        links: [
          { key: "lineConcierge", href: "/digital/line", icon: "chat", descKey: "lineDesc" },
          { key: "tracking", href: "/tracking", icon: "search", descKey: "trackingDesc" },
          // tax-deduction line only when the vertical is enabled
          ...(FEATURES.taxTools
            ? [{ key: "taxPlans", href: "/insurance/tax", icon: "piggy", descKey: "taxDesc" } as const]
            : []),
        ],
      },
    ],
  },
  {
    key: "about",
    columns: [
      {
        key: "colAbout",
        links: [
          { key: "whoWeAre", href: "/about", icon: "building", descKey: "whoWeAreDesc" },
          { key: "whyTkr", href: "/about/why", icon: "badgeCheck", descKey: "whyTkrDesc" },
          { key: "partners", href: "/about/partners", icon: "handshake", descKey: "partnersDesc" },
          { key: "agentJoin", href: "/about/agent", icon: "network", descKey: "agentJoinDesc" },
        ],
      },
    ],
  },
  {
    key: "help",
    columns: [
      {
        key: "colHelp",
        links: [
          { key: "howToBuy", href: "/help/how-to-buy", icon: "cart", descKey: "howToBuyDesc" },
          { key: "claimHelp", href: "/help/claims", icon: "clipboard", descKey: "claimHelpDesc" },
          { key: "faq", href: "/help/faq", icon: "help", descKey: "faqDesc" },
          { key: "contactHelp", href: "/contact", icon: "phone", descKey: "contactHelpDesc" },
        ],
      },
    ],
  },
  { key: "articles", href: "/articles" },
  { key: "contact", href: "/contact" },
];

/** Right-side public-nav actions, rendered separately by the Navbar.
 *  Note: the spec's `/quote` + `/search` pages are pending; until they exist the
 *  CTA routes into the flagship privacy-first quote flow (ROUTES.worker) and
 *  search resolves on the all-products page. */
export const publicNavActions = {
  search: { href: ROUTES.insurance, icon: "search" },
  quoteCta: { key: "getQuote", href: ROUTES.worker },
  login: { key: "login", href: "/login", icon: "user" },
  agent: { key: "agentLogin", href: "/login?role=agent" },
} as const;

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
