import type {
  AutoPlan,
  BulkRow,
  NationalityCode,
  PaymentMethodId,
  QuoteTabConfig,
  SingleWorker,
  WorkerFaqItem,
} from "@/types";
import type { IconName } from "@/components/ui/Icon";
import { ROUTES } from "./nav";

/**
 * Home quote-bar structure (was the QUOTE/LABELS/HREF objects in index.html).
 * Field/option/tab/CTA *text* lives in the `home.quote` message namespace —
 * only the shape (field types, option counts, target route) lives here.
 */
export const QUOTE_TABS: QuoteTabConfig[] = [
  {
    id: "worker",
    href: ROUTES.worker,
    fields: [
      { key: "workerCount", type: "number" },
      { key: "workerNat", type: "select", optionCount: 3 },
    ],
  },
  {
    id: "auto",
    href: ROUTES.auto,
    fields: [
      { key: "autoModel", type: "text" },
      { key: "autoYear", type: "select", optionCount: 5 },
    ],
  },
  {
    id: "travel",
    href: "/insurance/travel",
    fields: [
      { key: "travelDest", type: "text" },
      { key: "travelDays", type: "number" },
    ],
  },
  {
    id: "pa",
    href: "/insurance/pa",
    fields: [
      { key: "paAge", type: "number" },
      { key: "paBudget", type: "select", optionCount: 3 },
    ],
  },
  {
    id: "fire",
    href: "/insurance/fire",
    fields: [
      { key: "fireProp", type: "select", optionCount: 4 },
      { key: "fireSum", type: "number" },
    ],
  },
];

/* ============================================================
   Worker insurance flow (was the PLANS / state / BULK_ROWS
   objects in assets/worker.js). Money values are numbers —
   formatted with next-intl. All display text lives in messages.
   ============================================================ */

/** Worker insurance is underwritten by ทิพยประกันภัย ONLY, as a SINGLE package
 *  covering both illness (IPD/OPD) and accident. There is deliberately no
 *  choose-insurer / choose-plan step in the worker flow — personal lines
 *  (auto/travel/pa/fire) keep the multi-insurer registry.
 *  Coverage numbers are contractual — verify against the ทิพย policy wording
 *  before go-live. Display text lives in the `worker.package` messages. */
export const workerInsurancePlan = {
  /** insurerPartners id (seed) — บริษัท ทิพยประกันภัย จำกัด (มหาชน) */
  insurerId: "thip",
  singlePackage: true,
  /** ฿ premium per worker per year */
  per: 500,
  /** ฿ inpatient (IPD) max per policy year */
  ipdMax: 150_000,
  /** ฿ outpatient (OPD) per visit */
  opdPerVisit: 1_000,
  /** OPD visits max per policy year */
  opdMaxVisits: 15,
  ageMin: 1,
  ageMax: 99,
  /** cashless at network hospitals — no advance payment */
  noAdvancePayment: true,
  /** link out — the list changes; never render it ourselves */
  hospitalNetworkUrl: "https://www.dhipaya.co.th/th/hospital",
} as const;

/** FAQ for worker insurance (customer-supplied). Ordered; q/a text lives in
 *  `worker.faq.items.<id>` messages. `inFlow` marks the compact subset shown
 *  inside the purchase flow before payment. NOTE: the worker package covers
 *  BOTH illness and accident — do not "fix" the FAQ to drop illness cover. */
export const workerInsuranceFaq: WorkerFaqItem[] = [
  { id: "insurer", inFlow: true },
  { id: "coverage", inFlow: true },
  { id: "noAdvance", inFlow: true },
  { id: "hospitals", inFlow: true },
  { id: "age" },
  { id: "claimDocs" },
  { id: "applyDocs" },
];

/** Nationality options for the single-entry form select. */
export const WORKER_NATIONALITIES: NationalityCode[] = ["mm", "la", "vn"];

/** Pre-filled sample worker (single mode, first row). */
export const WORKER_SAMPLE: SingleWorker = {
  title: "MR.",
  name: "Aung Min",
  passport: "MB1234567",
  nat: "mm",
  dob: "1992-03-14",
  job: "ก่อสร้าง",
  occupation: "ช่างก่อสร้าง",
  address: "",
  phone: "",
};

/** Honorific options for the worker name prefix. */
export const TITLE_PREFIXES = ["MR.", "MS.", "MRS.", "MISS"] as const;

/** Bulk-upload demo: aggregate counts + the sample validation rows. */
export const WORKER_BULK = {
  valid: 245,
  error: 3,
  total: 248,
  rows: [
    { ok: true, name: "Aung Ko Latt", pp: "MB2847163", nat: "mm", dob: "1990-06-12" },
    { ok: true, name: "Somsak Phomma", pp: "LA1938472", nat: "la", dob: "1988-11-03" },
    {
      ok: false,
      name: "Thant Zin Oo",
      pp: "—",
      nat: "mm",
      dob: "1995-02-20",
      err: "pp",
      errKey: "passport",
    },
    { ok: true, name: "Win Htut", pp: "MB7261540", nat: "mm", dob: "1993-09-28" },
    {
      ok: false,
      name: "Bounmy Sengdao",
      pp: "LA8473625",
      nat: "la",
      dob: "2014-01-15",
      err: "dob",
      errKey: "age",
    },
    { ok: true, name: "Thida Aung", pp: "MB3948271", nat: "mm", dob: "1991-07-19" },
    {
      ok: false,
      name: "Vannak Pich",
      pp: "KH1029384",
      nat: null,
      dob: "1989-04-04",
      err: "nat",
      errKey: "nationality",
    },
    { ok: true, name: "Khamla Volavong", pp: "LA5647382", nat: "la", dob: "1994-12-08" },
  ] satisfies BulkRow[],
};

/** Payment options on the Pay step. */
export const PAYMENT_METHODS: Array<{ id: PaymentMethodId; icon: IconName }> = [
  { id: "promptpay", icon: "qr" },
  { id: "transfer", icon: "building" },
  { id: "card", icon: "creditcard" },
];

/* ============================================================
   Auto insurance comparison (was the PLANS array + car form
   in auto.html). Insurer names + feature chips live in the
   `auto.plans.<id>` messages; numbers/flags live here.
   ============================================================ */

export const AUTO_PLANS: AutoPlan[] = [
  { id: "viriyah", price: 14200, type: "garage", rating: 4.7, reviews: 2140, sum: 700000, deduct: null, best: true },
  { id: "dhipaya", price: 15800, type: "dealer", rating: 4.8, reviews: 1860, sum: 750000, deduct: null },
  { id: "bangkok", price: 13600, type: "garage", rating: 4.5, reviews: 3210, sum: 650000, deduct: 2000, value: true },
  { id: "muangthai", price: 16400, type: "dealer", rating: 4.6, reviews: 1540, sum: 800000, deduct: null },
  { id: "southeast", price: 14900, type: "garage", rating: 4.3, reviews: 980, sum: 700000, deduct: 1000 },
  { id: "thanachart", price: 15200, type: "dealer", rating: 4.4, reviews: 1120, sum: 720000, deduct: null },
];

/** Car-form select options that are proper nouns (same in every locale).
 *  Years + coverage classes are localized via `auto.form.years` / `.classes`. */
export const AUTO_FORM = {
  brands: ["Toyota", "Honda", "Mazda", "Isuzu", "Mercedes-Benz"],
  models: ["Yaris Ativ", "Vios", "Corolla Altis", "Camry"],
  /** index of the pre-selected year option */
  defaultYearIndex: 2,
} as const;
