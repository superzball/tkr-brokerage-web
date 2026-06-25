// src/types/portal.ts
// Central type contracts for the TKR product portals. Every mock query,
// table, and screen references these — keep this the single source of truth.

export type Role = 'business' | 'individual' | 'agent' | 'admin';
export type Locale = 'th' | 'en' | 'my' | 'lo';

// ---- RBAC for back-office (Phase 14) ----
export type StaffRole = 'superadmin' | 'ops' | 'content' | 'sales';

export type InsuranceType = 'worker' | 'auto' | 'travel' | 'health' | 'fire';
export type PolicyStatus = 'active' | 'expiring' | 'expired' | 'pending';
export type ClaimStatus = 'submitted' | 'reviewing' | 'approved' | 'paid' | 'rejected';
export type InvoiceStatus = 'paid' | 'unpaid' | 'overdue';
export type LeadStage = 'new' | 'contacted' | 'quoted' | 'won' | 'lost';
export type SaleStatus = 'issued' | 'pending' | 'cancelled';
export type Tier = 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
export type Nationality = 'พม่า' | 'ลาว' | 'กัมพูชา';
export type LicenseStatus = 'verified' | 'pending' | 'expired';

// ---- identity ----
export interface User {
  id: string;
  role: Role;
  name: string;
  email?: string;
  phone?: string;          // primary login for many users
  company?: string;        // business role only
  avatarColor?: string;    // for initials avatar
  // customer profile fields (admin CRM, Phase 14) — optional, for role business/individual
  taxId?: string;          // นิติบุคคล: เลขประจำตัวผู้เสียภาษี (13 หลัก)
  nationalId?: string;     // บุคคลธรรมดา: เลขบัตรประชาชน
  address?: string;        // billing / contact address
  contactPerson?: string;  // business: primary contact name
  note?: string;           // internal note (staff-only)
  // agent team fields (Phase 11.5)
  uplineId?: string;       // null/undefined = top of a tree
  rank?: Tier;
  licenseNo?: string;
  licenseStatus?: LicenseStatus;
  // back-office staff fields (Phase 14) — only set for role === 'admin'
  staffRole?: StaffRole;
  permissions?: string[];  // optional fine-grained override
}

// ---- shared insurance entities ----
export interface Policy {
  id: string;
  policyNo: string;
  type: InsuranceType;
  status: PolicyStatus;
  insurer: string;
  holderId: string;        // User.id
  premium: number;         // THB / year
  coverage: number;        // THB sum insured
  workersCount?: number;   // worker policies only
  startDate: string;       // ISO yyyy-mm-dd
  endDate: string;
}

export interface Worker {
  id: string;
  name: string;
  nationality: Nationality;
  passport: string;
  dob: string;
  job: string;
  policyId?: string;
  status: 'covered' | 'pending' | 'expired';
}

export interface Claim {
  id: string;
  claimNo: string;
  policyId: string;
  type: InsuranceType;
  claimant: string;
  amount: number;          // THB requested
  status: ClaimStatus;
  submittedDate: string;
  incident: string;        // TODO: move to i18n when wiring messages
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  policyId: string;
  amount: number;
  status: InvoiceStatus;
  issuedDate: string;
  dueDate: string;
}

export interface DocItem {
  id: string;
  name: string;            // TODO: i18n label
  kind: 'policy' | 'certificate' | 'receipt' | 'kyc';
  policyId?: string;
  date: string;
  sizeKb: number;
}

// ---- agent entities ----
export interface Client {
  id: string;
  name: string;
  type: 'business' | 'individual';
  policies: number;
  premiumYtd: number;
  since: string;
}

export interface Commission {
  id: string;
  period: string;          // yyyy-mm
  policyNo: string;
  clientName: string;
  base: number;            // premium the % applies to
  rate: number;            // percent, e.g. 12
  amount: number;          // THB earned
  status: 'pending' | 'paid';
}

export interface Lead {
  id: string;
  name: string;
  contact: string;
  interest: InsuranceType;
  stage: LeadStage;
  value: number;           // estimated premium THB
  createdDate: string;
  assignedTo?: string;     // downline member id; undefined = the agent themselves
}

// A policy the agent sold (on their own or on behalf of a client).
export interface AgentSale {
  id: string;
  date: string;            // ISO yyyy-mm-dd
  clientName: string;
  product: InsuranceType;
  premium: number;         // GWP, THB
  commission: number;      // THB earned
  status: SaleStatus;
}

export interface AgentTierInfo {
  current: Tier;
  next?: Tier;
  progress: number;        // 0..1 toward next tier
  ytdPremium: number;      // THB sold YTD
  nextThreshold: number;   // THB needed for next tier
}

// ---- agent team / multi-tier override (Phase 11.5) ----
export interface DownlineMember {
  id: string;
  name: string;
  uplineId: string;               // who recruited them (their direct upline)
  generation: number;             // depth relative to the viewing agent (1 = direct)
  rank: Tier;
  licenseNo?: string;
  licenseStatus: LicenseStatus;   // override accrues ONLY when 'verified'
  personalGwp: number;            // their own sales this period (THB)
  directs: number;                // their own direct recruits
  joinedDate: string;
}

export interface TeamOverride {
  id: string;
  period: string;                 // yyyy-mm
  sourceName: string;             // downline member the override came from
  generation: number;
  baseGwp: number;                // the member's real GWP the % applies to
  rate: number;                   // percent for that generation
  amount: number;                 // THB earned (0 if source license not verified)
  status: 'pending' | 'paid';
}

// ---- system ----
export interface Notification {
  id: string;
  title: string;           // TODO: i18n
  time: string;            // ISO
  read: boolean;
  kind: 'policy' | 'claim' | 'billing' | 'system';
}

// ---- navigation ----
export interface NavItem {
  key: string;             // i18n key under the `nav` namespace
  href: string;
  icon: string;            // lucide-react icon name
  perm?: string;           // when set, item shows only if the user has it (RBAC)
}
export interface NavSection {
  key?: string;            // optional section heading (i18n key); omit for top group
  items: NavItem[];
  perm?: string;           // when set, section shows only if the user has it
}

// ============== admin entities (Phase 14) ==============
export type ArticleStatus = 'draft' | 'scheduled' | 'published';
export interface Article {
  id: string;
  title: string;
  slug: string;
  status: ArticleStatus;
  category: string;
  author: string;
  locales: Locale[];           // which languages are translated
  publishedAt?: string;
  seo: { metaTitle: string; metaDescription: string; ogImage?: string };
}

export type OrderStatus = 'draft' | 'awaiting_payment' | 'issued' | 'cancelled';
export type OrderChannel = 'phone' | 'walk_in' | 'line' | 'online';
export interface Order {
  id: string;
  orderNo: string;
  customerName: string;
  customerType: 'business' | 'individual';
  product: InsuranceType;
  premium: number;
  status: OrderStatus;
  channel: OrderChannel;
  createdBy: string;           // staff user id (on-behalf) or 'self'
  createdDate: string;
}

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  staffRole: StaffRole;
  status: 'active' | 'suspended';
  lastActive: string;
}

export type SupportTicketStatus = 'open' | 'pending' | 'resolved';
export interface SupportTicket {
  id: string;
  ref: string;
  customer: string;
  subject: string;
  status: SupportTicketStatus;
  priority: 'low' | 'medium' | 'high';
  updatedAt: string;
}

export interface ProductPlan {
  id: string;
  product: InsuranceType;
  planName: string;
  insurer: string;
  coverage: number;
  basePremium: number;
  active: boolean;
}

export interface AuditEntry {
  id: string;
  actor: string;               // staff name
  action: string;              // e.g. "ออกกรมธรรม์", "อนุมัติเคลม"
  target: string;              // e.g. policy/claim no
  time: string;
}

// ---- admin content management (Phase 14 build-out) ----
export interface CmsPage {
  id: string;
  path: string;                // public route, e.g. /worker-insurance
  title: string;
  hero: string;                // hero headline copy
  body: string;                // intro/body copy
  faqCount: number;
  updatedAt: string;
}

export interface Faq {
  id: string;
  pageId: string;              // which CmsPage it belongs to
  question: string;
  answer: string;
}

export type MediaKind = 'image' | 'doc' | 'video';
export interface MediaAsset {
  id: string;
  name: string;
  kind: MediaKind;
  sizeKb: number;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Redirect {
  id: string;
  from: string;
  to: string;
  code: 301 | 302;
}

// ---- admin commission rules (Phase 14 build-out) ----
export interface CommissionRule {
  id: string;
  product: InsuranceType;
  tier: Tier;
  rate: number;                // percent
  active: boolean;
}

// ============================ CRM OPS CORE (Phase 15) ============================
// Worker-insurance fulfillment (MOU / MOTI24 → underwriter "Thip" / ทิพยประกันภัย).
// The credit wallet + ledger are INTERNAL ONLY — admin/finance see them, customers never do.
export type CrmProduct = 'MOU' | 'MOTI24';                 // worker-insurance products
export type Duration = '3_months' | '6_months' | '1_year' | '15_months';
export type TicketStatus =
  'draft' | 'pending_send' | 'sent_to_thip' | 'thip_processing' | 'completed' | 'rejected';
export type TicketPaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded';
export type PaymentMethod =
  'bank_transfer' | 'direct_transfer' | 'k_shop' | 'cash' | 'credit_card' | 'other';
export type TicketPriority = 'low' | 'normal' | 'high' | 'urgent';
export type CreditType = 'credit' | 'debit';
export type AmendmentType =
  'edit_name' | 'edit_address' | 'edit_birthdate' | 'edit_id_number'
  | 'edit_coverage_start' | 'edit_coverage_duration' | 'cancel_policy';

export interface PricingTier { product: CrmProduct; duration: Duration; basePrice: number; } // THB/person

// internal-only credit/AR profile per business customer (NOT shown to customers)
export interface CustomerCreditProfile {
  customerId: string;
  currentCredit: number;       // wallet balance; NEGATIVE = outstanding exposure
  allowedOverdueDays: number;  // per-customer AR grace period
  creditLimit?: number;
}

export interface PolicyTicket {
  id: string;
  ticketNumber: string;        // TKR-YYYYMMDD-XXXX
  status: TicketStatus;
  customerId: string;
  product: CrmProduct;
  duration: Duration;
  coverageStart: string;
  headcount: number;
  discountPerPerson: number;
  totalPrice: number;          // = (basePrice − discount) × headcount
  paymentStatus: TicketPaymentStatus;
  paidAmount: number;
  priority: TicketPriority;
  assignedTo?: string;
  dueDate?: string;            // coverageStart/created + allowedOverdueDays
  recipientFile?: string;      // insured list sent to underwriter
  thipStaffName?: string;
  thipNote?: string;
  thipFile?: string;
  thipUpdatedAt?: string;      // set when the underwriter submits the public staff-verify form
  issuedCount?: number;        // # of IssuedPolicy rows produced from this ticket
  publicToken: string;         // signed/expiring (mock)
  customerCode: string;        // 6-digit code shown to customer for status check
  createdBy: string;
  createdAt: string;
}

export interface CrmPayment {
  id: string;
  paymentDate: string;
  customerId: string;
  ticketId: string;
  amount: number;
  method: PaymentMethod;
  referenceNumber?: string;
  status: 'confirmed' | 'pending';
  slip?: string;
}

export interface CreditTransaction {
  id: string;
  customerId: string;
  ticketId?: string;
  type: CreditType;            // debit on ticket-create, credit on payment
  amount: number;
  balanceAfter: number;        // running balance (append-only ledger)
  description: string;
  createdAt: string;
}

export interface AmendmentTicket {
  id: string;
  amendmentType: AmendmentType;
  customerRef: string;         // existing customer name OR free-typed
  policyNumbers: string[];
  hasCost: boolean;
  pricePerPolicy: number;
  totalCost: number;
  thipStaffName?: string;
  thipNote?: string;
  createdBy: string;
  createdAt: string;
}

export interface IssuedPolicy {
  id: string;
  policyNumber: string;
  insuredIdNumber: string;
  ticketId: string;
  product: CrmProduct;
  customerId: string;
  startDate: string;
  expiryDate: string;
  issuedAt: string;
  issuedBy: string;
  pdfUrl?: string;
}

// ============== conversion & trust layer (Phase 17) ==============
// D2C UX upgrade — coupons, social proof, plain-language glossary, installments,
// partner trust signals. Mock-only; sample reviews are PLACEHOLDERS until real,
// consented customer feedback exists. TKR keeps its agent channel throughout.
export type CouponDiscountType = 'percent' | 'fixed';
export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: CouponDiscountType;
  value: number;                 // percent or THB
  minSpend?: number;
  products: (InsuranceType | 'all')[];
  paymentCondition?: string;     // e.g. "บัตรเครดิต ผ่อน 0% 3 เดือน"
  expiry: string;
  active: boolean;
}

export interface Review {
  id: string;
  authorLabel: string;           // masked, e.g. "ลูกค้า TKR" — PLACEHOLDER
  channel: 'survey' | 'social';
  product: InsuranceType;
  text: string;                  // PLACEHOLDER copy
  reaction: 'heart' | 'like' | 'celebrate';
  date: string;
}

export interface InsurerPartner { id: string; name: string; logo?: string; }

export interface GlossaryTerm {
  term: string;
  plain: string;                 // plain-Thai explanation
}

export interface InstallmentPlan {
  months: number;                // 0 = pay in full
  rate: number;                  // percent; 0 = interest-free
  label: string;
}

// Channel the customer picks at quote/checkout — TKR's edge over pure D2C.
export type SalesChannel = 'self' | 'agent';
