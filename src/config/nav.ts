import type {
  FooterColumn,
  MenuItem,
  NavRoute,
  ProductMenuKey,
  ServiceMenuKey,
} from "@/types";
import type { TopNavItem } from "@/types/portal";
import { FEATURES } from "@/config/features";
import { contactInfo } from "@/config/contact";

/** Canonical route map (was the `L` object in nav.js, now localized routes). */
export const ROUTES = {
  home: "/",
  worker: "/worker-insurance",
  workerMou: "https://member.tkrbroker.com",
  worker24: "https://24tkr.com",
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
  { key: "pa", href: "/insurance/pa", icon: "shieldPlus" },
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
          { key: "pa", href: "/insurance/pa", icon: "shieldPlus", descKey: "paDesc" },
          { key: "fire", href: "/insurance/fire", icon: "flame", descKey: "fireDesc" },
        ],
      },
      {
        key: "colDigital",
        links: [
          { key: "lineConcierge", href: ROUTES.line, icon: "chat", descKey: "lineDesc" },
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
          { key: "reviews", href: ROUTES.reviews, icon: "star", descKey: "reviewsDesc" }, // social proof (Phase 17)
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
  { key: "promotions", href: ROUTES.promotions }, // deals/coupons (Phase 17) — conversion driver
  { key: "articles", href: "/articles" },
  { key: "contact", href: "/contact" },
];

/** Right-side public-nav actions, rendered separately by the Navbar.
 *  Note: the spec's `/quote` + `/search` pages are pending; until they exist the
 *  CTA routes into the flagship privacy-first quote flow (ROUTES.worker) and
 *  search resolves on the all-products page. `renew` has no standalone /renew
 *  page; it routes into the authenticated quick-renew flow (the (app) guard
 *  sends anonymous visitors through /login first). */
export const publicNavActions = {
  search: { href: ROUTES.insurance, icon: "search" },
  quoteCta: { key: "getQuote", href: ROUTES.worker },
  renew: { key: "renew", href: "/app/buy?intent=renew", icon: "refresh" }, // member quick-renew (Phase 17)
  login: { key: "login", href: "/login", icon: "user" },
  agent: { key: "agentLogin", href: "/login?role=agent" },
} as const;

/**
 * Right-side actions that admin may turn on/off + schedule (NAV_VISIBILITY),
 * keyed under `action:<name>` in the nav-visibility settings. `search` and
 * `login` are intentionally EXCLUDED — they are core (never expose an easy way
 * to remove sign-in), so they always render regardless of settings.
 */
export const TOGGLEABLE_ACTIONS = ["renew", "agent", "quoteCta"] as const;
export type ToggleableAction = (typeof TOGGLEABLE_ACTIONS)[number];

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
      { key: "pa", href: "/insurance/pa" },
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
      { key: "applyAgent", href: "/about/agent" },
      { key: "agencyCenter", href: ROUTES.agency },
      { key: "about", href: "/about" },
      { key: "contact", href: "/contact" },
    ],
  },
];

/** Social links shown in the footer — hrefs come from contactInfo (single source). */
export const FOOTER_SOCIAL = [
  { icon: "facebook", label: "Facebook", href: contactInfo.facebook },
  { icon: "tiktok", label: "TikTok", href: contactInfo.tiktok },
  { icon: "line", label: "LINE", href: contactInfo.lineHref },
] as const;
