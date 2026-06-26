import type { IconName } from "@/components/ui/Icon";

/** A primary nav entry (label resolved from the `nav` message namespace by key). */
export interface NavRoute {
  key: string;
  href: string;
}

/** Keys of the Products / Digital Services dropdowns (drive `nav.product.*` / `nav.service.*`). */
export type ProductMenuKey = "worker" | "auto" | "travel" | "health" | "fire";
export type ServiceMenuKey = "wallet" | "line" | "tracking";

/** An item inside a hover dropdown (Products / Digital Services). */
export interface MenuItem<K extends string = string> {
  key: K;
  href: string;
  icon: IconName;
  /** The worker product is visually featured (filled icon + "เด่น" badge). */
  featured?: boolean;
}

/** Footer column + link keys (drive `footer.col.*` / `footer.link.*`). */
export type FooterColKey = "products" | "services" | "company";
export type FooterLinkKey =
  | "worker"
  | "auto"
  | "travel"
  | "health"
  | "fire"
  | "customer"
  | "wallet"
  | "line"
  | "tracking"
  | "applyAgent"
  | "agencyCenter"
  | "about"
  | "contact";

/** A footer link column. */
export interface FooterColumn {
  key: FooterColKey;
  links: Array<{ key: FooterLinkKey; href: string }>;
}

/** The five insurance lines offered by the home quote bar. */
export type InsuranceTabId = "worker" | "auto" | "travel" | "health" | "fire";

export type QuoteFieldType = "text" | "number" | "select";

/** Keys under `home.quote.fields`. */
export type QuoteFieldKey =
  | "workerCount"
  | "workerNat"
  | "autoModel"
  | "autoYear"
  | "travelDest"
  | "travelDays"
  | "healthAge"
  | "healthBudget"
  | "fireProp"
  | "fireSum";

/** A single field in the quote bar. All text (label/placeholder/options) lives in messages. */
export interface QuoteFieldConfig {
  /** message key under `home.quote.fields` */
  key: QuoteFieldKey;
  type: QuoteFieldType;
  /** number of <option>s (their labels come from `home.quote.fields.<key>.options`) */
  optionCount?: number;
}

export interface QuoteTabConfig {
  id: InsuranceTabId;
  /** internal route or "#" placeholder */
  href: string;
  fields: QuoteFieldConfig[];
}

/* ---- Worker insurance flow ---- */

export type WorkerPlanId = "basic" | "standard" | "premium";

/** A coverage plan. Money values are numbers (formatted via next-intl); the
 *  plan name + "included/not included" text live in the `worker` messages. */
export interface WorkerPlan {
  id: WorkerPlanId;
  /** ฿ premium per worker per year */
  per: number;
  /** ฿ death / disability sum insured */
  life: number;
  /** ฿ medical sum insured */
  medical: number;
  /** repatriation (ส่งกลับประเทศ) included? */
  repatriation: boolean;
  recommended?: boolean;
}

export type WorkerMode = "single" | "bulk";

/** Nationality codes; display names live in `worker.nat.*`. */
export type NationalityCode = "mm" | "la" | "vn";

/** Honorific prefix on a worker's name. */
export type TitlePrefix = "MR." | "MS." | "MRS." | "MISS";

/** A single-entry worker row (sample/seed data). Age is derived from `dob`. */
export interface SingleWorker {
  title: TitlePrefix | "";
  name: string;
  passport: string;
  nat: NationalityCode;
  dob: string;
  job: string;          // ลักษณะงาน (work category)
  occupation: string;   // อาชีพ (specific job title)
  address: string;      // ที่อยู่ปัจจุบัน
  phone: string;        // เบอร์โทร
}

/** Which cell a bulk validation error highlights. */
export type BulkErrorField = "pp" | "dob" | "nat";
/** Error message key under `worker.bulk.errors`. */
export type BulkErrorKey = "passport" | "age" | "nationality";

/** A sample row in the bulk-upload validation table. */
export interface BulkRow {
  ok: boolean;
  name: string;
  pp: string;
  nat: NationalityCode | null;
  dob: string;
  err?: BulkErrorField;
  errKey?: BulkErrorKey;
}

export type PaymentMethodId = "promptpay" | "transfer" | "card";

/* ---- Auto (car insurance comparison) ---- */

export type AutoRepairType = "garage" | "dealer";
export type AutoSort = "price" | "coverage" | "rating";
export type AutoPlanId =
  | "viriyah"
  | "dhipaya"
  | "bangkok"
  | "muangthai"
  | "southeast"
  | "thanachart";

/** Car-insurance plan. Text (insurer name, features) lives in `auto.plans.<id>`. */
export interface AutoPlan {
  id: AutoPlanId;
  /** ฿ annual premium */
  price: number;
  type: AutoRepairType;
  rating: number;
  reviews: number;
  /** ฿ coverage sum */
  sum: number;
  /** ฿ deductible; null = none (ไม่มี) */
  deduct: number | null;
  best?: boolean;
  value?: boolean;
}

/* ---- Customer center ---- */

export type PolicyStatus = "active" | "expiring" | "expired";

export type CustomerPolicyId = "worker" | "auto" | "health" | "travel" | "fire";

/** A held policy (sample data). Text lives in `customer.policies.<id>`. */
export interface CustomerPolicy {
  id: CustomerPolicyId;
  status: PolicyStatus;
  icon: IconName;
  /** ฿ annual premium */
  premium: number;
  /** policy number (alphanumeric, not localized) */
  no: string;
}

export type TimelineState = "done" | "current" | "pending";
export interface TimelineStep {
  key: "s1" | "s2" | "s3" | "s4";
  state: TimelineState;
}

export type NotifColor = "amber" | "mint" | "brand";
export interface NotifItem {
  key: "n1" | "n2" | "n3";
  icon: IconName;
  color: NotifColor;
}

/* ---- Agency dashboard ---- */

/** The four loyalty tiers, in ascending order. Names/thresholds/perks live in
 *  `agency.tiers.<key>`; the ฿M threshold + commission % drive the tier logic. */
export type AgencyTierKey = "silver" | "gold" | "platinum" | "diamond";
export interface AgencyTier {
  key: AgencyTierKey;
  /** ฿ millions of cumulative sales required to reach this tier */
  from: number;
  /** commission rate display string (e.g. "24%") */
  comm: string;
  /** accent hex (unused for layout, kept for parity with the original data) */
  color: string;
  icon: IconName;
}

/** A top-of-dashboard KPI card. Value/delta are pre-formatted display strings
 *  (the figures are abbreviated, e.g. "฿8.42M"); the label lives in messages. */
export interface AgencyStat {
  key: "sales" | "commission" | "clients" | "policies";
  icon: IconName;
  value: string;
  delta: string;
}

/** A leaderboard row. Name lives in `agency.leaderboard.r<rank>`. */
export interface LeaderboardRow {
  rank: 1 | 2 | 3 | 4 | 5;
  /** abbreviated ฿M sales display (without the ฿ glyph) */
  sales: string;
  /** the current agent's own row */
  you: boolean;
}

export type DownlineKey = "d1" | "d2" | "d3" | "d4";
/** A downline (sub-agent) row. Name lives in `agency.downline.<key>`. */
export interface DownlineRow {
  key: DownlineKey;
  /** tier key (drives the chip colour + reuses `agency.tiers.<tier>.name`) */
  tier: "gold" | "silver";
  /** abbreviated ฿M sales display (without the ฿ glyph) */
  sales: string;
  clients: number;
  /** growth display string (e.g. "+9%") */
  trend: string;
}

export type MediaKey = "brochure" | "social" | "video" | "deck";
/** A marketing-media row. Title/meta live in `agency.media.<key>`. */
export interface MediaItem {
  key: MediaKey;
  icon: IconName;
}

/* ---- Policy-issuance tracking ---- */

export type TrackState = "done" | "current" | "pending";

export type TrackStageKey = "s1" | "s2" | "s3" | "s4" | "s5";
/** A stage in the issuance timeline. Title/time/desc live in `tracking.stages.<key>`. */
export interface TrackStage {
  key: TrackStageKey;
  state: TrackState;
}

export type TrackItemKey = "i1" | "i2" | "i3" | "i4" | "i5";
/** A per-worker issuance row. Name lives in `tracking.items.<key>`. */
export interface TrackItem {
  key: TrackItemKey;
  /** passport number (alphanumeric, not localized) */
  pp: string;
  state: TrackState;
}
