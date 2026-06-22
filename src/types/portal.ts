// src/types/portal.ts
// Central type contracts for the TKR product portals. Every mock query,
// table, and screen references these — keep this the single source of truth.

export type Role = 'business' | 'individual' | 'agent';
export type Locale = 'th' | 'en' | 'my' | 'lo';

export type InsuranceType = 'worker' | 'auto' | 'travel' | 'health' | 'fire';
export type PolicyStatus = 'active' | 'expiring' | 'expired' | 'pending';
export type ClaimStatus = 'submitted' | 'reviewing' | 'approved' | 'paid' | 'rejected';
export type InvoiceStatus = 'paid' | 'unpaid' | 'overdue';
export type LeadStage = 'new' | 'contacted' | 'quoted' | 'won' | 'lost';
export type Tier = 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
export type Nationality = 'พม่า' | 'ลาว' | 'กัมพูชา';

// ---- identity ----
export interface User {
  id: string;
  role: Role;
  name: string;
  email?: string;
  phone?: string;          // primary login for many users
  company?: string;        // business role only
  avatarColor?: string;    // for initials avatar
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
}

export interface AgentTierInfo {
  current: Tier;
  next?: Tier;
  progress: number;        // 0..1 toward next tier
  ytdPremium: number;      // THB sold YTD
  nextThreshold: number;   // THB needed for next tier
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
}
export interface NavSection {
  key?: string;            // optional section heading (i18n key); omit for top group
  items: NavItem[];
}
