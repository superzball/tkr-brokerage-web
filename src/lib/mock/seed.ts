// src/lib/mock/seed.ts
// Realistic seed data so every portal screen renders populated and clickable.
// Thai names, real-looking policy numbers, THB amounts. No backend.
// Access data only through the helpers at the bottom so a real API can replace
// them later without touching screens.

import type {
  User, Policy, Worker, Claim, Invoice, DocItem,
  Client, Commission, Lead, AgentTierInfo, Notification, Role,
  DownlineMember, TeamOverride, InsuranceType, LeadStage,
  AgentSale, SaleStatus,
  Article, Order, StaffUser, SupportTicket, ProductPlan, AuditEntry,
  CmsPage, Faq, MediaAsset, Redirect, CommissionRule,
  CrmProduct, Duration, PricingTier, CustomerCreditProfile,
  PolicyTicket, CrmPayment, CreditTransaction, AmendmentTicket, IssuedPolicy,
  Coupon, HomeBanner, Review, InsurerPartner, GlossaryTerm, InstallmentPlan,
  PlanCard, FitQuestion, CheckoutOption, TaxDeductionCap,
  LoyaltyAccount, PointsEntry, Reward, Redemption,
  ConsentRecord, LegalPolicy, LegalPolicyKind, DataSubjectRequest,
  NavSetting,
} from '@/types/portal';
import { memberTierOf, FEATURES_LOYALTY } from '@/config/loyalty';

// ============================ USERS (demo accounts) ============================
export const users: User[] = [
  { id: 'u_biz',   role: 'business',   name: 'คุณสมชาย เจริญทรัพย์', company: 'บริษัท ไทยเจริญ ก่อสร้าง จำกัด', email: 'business@tkr.demo', phone: '081-000-0001', avatarColor: '#1f66ee' },
  { id: 'u_indiv', role: 'individual', name: 'คุณนภัสสร วงศ์ดี',       email: 'me@tkr.demo',       phone: '081-000-0002', avatarColor: '#0f52c7' },
  { id: 'u_agent', role: 'agent',      name: 'คุณธนกร พาณิชย์',         email: 'agent@tkr.demo',    phone: '081-000-0003', avatarColor: '#e89c12', rank: 'Gold', licenseNo: 'B-0099123', licenseStatus: 'verified' },
  { id: 'u_admin', role: 'admin',      name: 'คุณกานต์ ผู้ดูแลระบบ',     email: 'admin@tkr.demo',    phone: '081-000-0004', staffRole: 'superadmin', avatarColor: '#0b2a6b' },
  // additional staff identities (login-able) so RBAC can be demoed per staffRole
  { id: 'u_ops',     role: 'admin', name: 'คุณปาริชาต ฝ่ายปฏิบัติการ', email: 'ops@tkr.demo',     phone: '081-000-0005', staffRole: 'ops',     avatarColor: '#0f7a52' },
  { id: 'u_content', role: 'admin', name: 'คุณธีรเดช คอนเทนต์',        email: 'content@tkr.demo', phone: '081-000-0006', staffRole: 'content', avatarColor: '#8a4bd1' },
  { id: 'u_sales',   role: 'admin', name: 'คุณรัตติกาล ฝ่ายขาย',       email: 'sales@tkr.demo',   phone: '081-000-0007', staffRole: 'sales',   avatarColor: '#c2410c' },
];

// ============================ POLICIES ============================
export const policies: Policy[] = [
  // business — mostly worker insurance + one fire
  { id: 'p1', policyNo: 'TKR-W-2026-004821', type: 'worker', status: 'active',   insurer: 'ทิพยประกันภัย',    holderId: 'u_biz', premium: 124000, coverage: 500000,  workersCount: 248, startDate: '2026-01-15', endDate: '2027-01-14' },
  { id: 'p2', policyNo: 'TKR-W-2026-004955', type: 'worker', status: 'expiring', insurer: 'ทิพยประกันภัย',    holderId: 'u_biz', premium: 36000,  coverage: 500000,  workersCount: 72,  startDate: '2025-07-10', endDate: '2026-07-09' },
  { id: 'p3', policyNo: 'TKR-F-2026-001203', type: 'fire',   status: 'active',   insurer: 'กรุงเทพประกันภัย',  holderId: 'u_biz', premium: 18500,  coverage: 8000000, startDate: '2026-03-01', endDate: '2027-02-28' },
  // individual — personal lines
  { id: 'p4', policyNo: 'TKR-A-2026-022104', type: 'auto',   status: 'active',   insurer: 'วิริยะประกันภัย',   holderId: 'u_indiv', premium: 14200, coverage: 1000000, startDate: '2026-02-20', endDate: '2027-02-19' },
  { id: 'p5', policyNo: 'TKR-PA-2026-008877', type: 'pa', status: 'active',   insurer: 'เมืองไทยประกันภัย', holderId: 'u_indiv', premium: 22000, coverage: 1500000, startDate: '2026-01-01', endDate: '2026-12-31' },
  { id: 'p6', policyNo: 'TKR-T-2026-031590', type: 'travel', status: 'expired',  insurer: 'MSIG',             holderId: 'u_indiv', premium: 1850,  coverage: 2000000, startDate: '2026-04-02', endDate: '2026-04-16' },
];

// ============================ WORKERS (business) ============================
export const workers: Worker[] = [
  { id: 'w1', name: 'Aung Min',      nationality: 'พม่า',    passport: 'MB1234567', dob: '1992-03-14', job: 'ก่อสร้าง',  policyId: 'p1', status: 'covered' },
  { id: 'w2', name: 'Thuza Win',     nationality: 'พม่า',    passport: 'MB2345678', dob: '1995-08-22', job: 'ก่อสร้าง',  policyId: 'p1', status: 'covered' },
  { id: 'w3', name: 'Somsak Vilay',  nationality: 'ลาว',     passport: 'LA8821345', dob: '1990-11-02', job: 'ช่างไม้',   policyId: 'p1', status: 'covered' },
  { id: 'w4', name: 'Chan Dara',     nationality: 'กัมพูชา', passport: 'KH5567812', dob: '1993-06-19', job: 'ก่อสร้าง',  policyId: 'p1', status: 'covered' },
  { id: 'w5', name: 'Khin Maung',    nationality: 'พม่า',    passport: 'MB3456789', dob: '1988-01-30', job: 'ขนส่ง',     policyId: 'p2', status: 'covered' },
  { id: 'w6', name: 'Bounmy Sysouk', nationality: 'ลาว',     passport: 'LA7712908', dob: '1996-09-12', job: 'ก่อสร้าง',  policyId: 'p2', status: 'covered' },
  { id: 'w7', name: 'Nyein Aye',     nationality: 'พม่า',    passport: 'MB4567890', dob: '1994-12-05', job: 'ก่อสร้าง',  policyId: undefined, status: 'pending' },
  { id: 'w8', name: 'Vannak Sok',    nationality: 'กัมพูชา', passport: 'KH6678923', dob: '1991-04-27', job: 'ช่างเชื่อม', policyId: undefined, status: 'pending' },
];

// ============================ CLAIMS ============================
export const claims: Claim[] = [
  { id: 'c1', claimNo: 'CLM-2026-10231', policyId: 'p1', type: 'worker', claimant: 'Aung Min',       amount: 45000, status: 'reviewing', submittedDate: '2026-06-08', incident: 'อุบัติเหตุระหว่างทำงานที่ไซต์ก่อสร้าง' },
  { id: 'c2', claimNo: 'CLM-2026-09887', policyId: 'p1', type: 'worker', claimant: 'Somsak Vilay',   amount: 12000, status: 'approved',  submittedDate: '2026-05-21', incident: 'ค่ารักษาพยาบาลผู้ป่วยใน 2 คืน' },
  { id: 'c3', claimNo: 'CLM-2026-08412', policyId: 'p4', type: 'auto',   claimant: 'คุณนภัสสร วงศ์ดี', amount: 28500, status: 'paid',      submittedDate: '2026-04-30', incident: 'เฉี่ยวชนกันชนหลัง ซ่อมศูนย์บริการ' },
];

// ============================ INVOICES ============================
export const invoices: Invoice[] = [
  { id: 'i1', invoiceNo: 'INV-2026-0641', policyId: 'p1', amount: 124000, status: 'paid',   issuedDate: '2026-01-10', dueDate: '2026-01-25' },
  { id: 'i2', invoiceNo: 'INV-2026-0742', policyId: 'p2', amount: 36000,  status: 'unpaid', issuedDate: '2026-06-12', dueDate: '2026-07-09' },
  { id: 'i3', invoiceNo: 'INV-2026-0588', policyId: 'p3', amount: 18500,  status: 'paid',   issuedDate: '2026-02-25', dueDate: '2026-03-01' },
  { id: 'i4', invoiceNo: 'INV-2026-0503', policyId: 'p4', amount: 14200,  status: 'paid',   issuedDate: '2026-02-15', dueDate: '2026-02-20' },
  { id: 'i5', invoiceNo: 'INV-2026-0399', policyId: 'p5', amount: 22000,  status: 'overdue',issuedDate: '2025-12-20', dueDate: '2026-01-01' },
];

// ============================ DOCUMENTS ============================
export const documents: DocItem[] = [
  { id: 'd1', name: 'กรมธรรม์ประกันแรงงานต่างด้าว (248 คน)', kind: 'policy',      policyId: 'p1', date: '2026-01-15', sizeKb: 842 },
  { id: 'd2', name: 'หนังสือรับรองการคุ้มครอง',              kind: 'certificate', policyId: 'p1', date: '2026-01-15', sizeKb: 210 },
  { id: 'd3', name: 'ใบเสร็จรับเงิน INV-2026-0641',          kind: 'receipt',     policyId: 'p1', date: '2026-01-25', sizeKb: 96  },
  { id: 'd4', name: 'กรมธรรม์ประกันรถยนต์ชั้น 1',            kind: 'policy',      policyId: 'p4', date: '2026-02-20', sizeKb: 540 },
];

// ============================ AGENT: CLIENTS ============================
export const clients: Client[] = [
  { id: 'cl1', name: 'บริษัท ไทยเจริญ ก่อสร้าง จำกัด', type: 'business',   policies: 3, premiumYtd: 178500, since: '2024-03-01' },
  { id: 'cl2', name: 'บริษัท สยามโลจิสติกส์ จำกัด',     type: 'business',   policies: 2, premiumYtd: 92000,  since: '2024-09-12' },
  { id: 'cl3', name: 'ร้าน ก.รุ่งเรืองวัสดุ',           type: 'business',   policies: 1, premiumYtd: 24000,  since: '2025-06-20' },
  { id: 'cl4', name: 'คุณวีรพล สุขสันต์',               type: 'individual', policies: 2, premiumYtd: 36200,  since: '2025-01-08' },
  { id: 'cl5', name: 'คุณพิมพ์ชนก ใจงาม',               type: 'individual', policies: 1, premiumYtd: 14200,  since: '2025-11-15' },
];

// ============================ AGENT: COMMISSIONS ============================
export const commissions: Commission[] = [
  { id: 'cm1', period: '2026-06', policyNo: 'TKR-W-2026-004821', clientName: 'บริษัท ไทยเจริญ ก่อสร้าง จำกัด', base: 124000, rate: 12, amount: 14880, status: 'pending' },
  { id: 'cm2', period: '2026-05', policyNo: 'TKR-W-2026-004702', clientName: 'บริษัท สยามโลจิสติกส์ จำกัด',     base: 56000,  rate: 12, amount: 6720,  status: 'paid' },
  { id: 'cm3', period: '2026-05', policyNo: 'TKR-A-2026-021880', clientName: 'คุณวีรพล สุขสันต์',               base: 14200,  rate: 10, amount: 1420,  status: 'paid' },
  { id: 'cm4', period: '2026-04', policyNo: 'TKR-F-2026-001190', clientName: 'ร้าน ก.รุ่งเรืองวัสดุ',           base: 24000,  rate: 10, amount: 2400,  status: 'paid' },
  { id: 'cm5', period: '2026-04', policyNo: 'TKR-H-2026-008601', clientName: 'คุณพิมพ์ชนก ใจงาม',               base: 22000,  rate: 10, amount: 2200,  status: 'paid' },
];

// ============================ AGENT: LEADS ============================
// Hand-authored "interesting" leads (varied stages + assigned demos) kept at
// the front, then a deterministic bulk so the pipeline holds ~1,200 records —
// enough to prove the list scales (paginate/filter/sort server-style).
const baseLeads: Lead[] = [
  { id: 'l1', name: 'บริษัท บูรพา ขนส่ง จำกัด',  contact: '086-221-3344', interest: 'worker', stage: 'new',       value: 88000, createdDate: '2026-06-18' },
  { id: 'l2', name: 'หจก. รุ่งโรจน์ ก่อสร้าง',   contact: '089-552-1100', interest: 'worker', stage: 'contacted', value: 145000, createdDate: '2026-06-14', assignedTo: 'd1' },
  { id: 'l3', name: 'คุณอาทิตย์ แสงทอง',         contact: '081-334-7788', interest: 'auto',   stage: 'quoted',    value: 16500, createdDate: '2026-06-10', assignedTo: 'd2' },
  { id: 'l4', name: 'บริษัท นครชัย พลาสติก',     contact: '092-110-9988', interest: 'fire',   stage: 'quoted',    value: 31000, createdDate: '2026-06-05' },
  { id: 'l5', name: 'คุณมณีรัตน์ ทองคำ',         contact: '083-447-2299', interest: 'pa', stage: 'won',       value: 24000, createdDate: '2026-05-28' },
  { id: 'l6', name: 'ร้าน สมหวัง การช่าง',       contact: '087-665-1122', interest: 'worker', stage: 'lost',      value: 42000, createdDate: '2026-05-20' },
];

// Deterministic generator (index-based, NO randomness) so the server and client
// bundles build the identical array — avoids hydration mismatch.
const LEAD_NAME_POOL = [
  'บริษัท ไทยรุ่งเรือง', 'หจก. ศรีสมบูรณ์', 'ร้าน ก้าวหน้าพาณิชย์', 'บริษัท สยามอุตสาหกรรม',
  'คุณประเสริฐ ทรัพย์มาก', 'คุณสุภาพร ดีงาม', 'บริษัท เจริญยนต์', 'หจก. มงคลก่อสร้าง',
  'คุณวีระศักดิ์ ใจกล้า', 'ร้าน รวมมิตรวัสดุ', 'บริษัท บางกอกโลจิสติกส์', 'คุณอรทัย พูนสุข',
];
const LEAD_INTERESTS: InsuranceType[] = ['worker', 'auto', 'travel', 'pa', 'fire'];
const LEAD_STAGES_GEN: LeadStage[] = ['new', 'contacted', 'quoted', 'won', 'lost'];
const LEAD_ASSIGNEES: (string | undefined)[] = ['d1', 'd2', 'd5', 'd7', undefined, undefined, undefined, undefined];

function genLeads(n: number): Lead[] {
  const out: Lead[] = [];
  for (let i = 0; i < n; i++) {
    const name = LEAD_NAME_POOL[i % LEAD_NAME_POOL.length]!;
    const seq = Math.floor(i / LEAD_NAME_POOL.length) + 1;
    const month = 1 + ((i * 3) % 6); // 2026-01 .. 2026-06
    const day = 1 + (i % 28);
    out.push({
      id: `lg-${i + 1}`,
      name: `${name} ${seq}`,
      contact: `08${i % 9}-${String(100 + (i % 900)).padStart(3, '0')}-${String(1000 + (i % 9000)).padStart(4, '0')}`,
      interest: LEAD_INTERESTS[i % LEAD_INTERESTS.length]!,
      stage: LEAD_STAGES_GEN[(i * 7) % LEAD_STAGES_GEN.length]!,
      value: 5000 + ((i * 131) % 200) * 1000,
      createdDate: `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      assignedTo: LEAD_ASSIGNEES[i % LEAD_ASSIGNEES.length],
    });
  }
  return out;
}

export const leads: Lead[] = [...baseLeads, ...genLeads(1200)];

// ============================ AGENT: TIER ============================
export const agentTier: AgentTierInfo = {
  current: 'Gold',
  next: 'Platinum',
  progress: 0.72,
  ytdPremium: 1080000,
  nextThreshold: 1500000,
};

// ============================ NOTIFICATIONS ============================
export const notifications: Notification[] = [
  { id: 'n1', title: 'กรมธรรม์ TKR-W-2026-004955 จะหมดอายุใน 17 วัน', time: '2026-06-22T09:10:00+07:00', read: false, kind: 'policy' },
  { id: 'n2', title: 'เคลม CLM-2026-10231 อยู่ระหว่างพิจารณา',        time: '2026-06-21T16:40:00+07:00', read: false, kind: 'claim' },
  { id: 'n3', title: 'ใบแจ้งหนี้ INV-2026-0742 ครบกำหนด 9 ก.ค.',      time: '2026-06-20T11:00:00+07:00', read: true,  kind: 'billing' },
];

// ============================ QUERY HELPERS ============================
// Screens call these — never import the raw arrays directly into a page.
export const getUser = (role: Role) => users.find(u => u.role === role)!;
export const getPolicies = (userId: string) => policies.filter(p => p.holderId === userId);
export const getPolicy = (id: string) => policies.find(p => p.id === id);
export const getWorkers = (policyIds: string[]) =>
  workers.filter(w => !w.policyId || policyIds.includes(w.policyId));
export const getClaims = (policyIds: string[]) => claims.filter(c => policyIds.includes(c.policyId));
export const getInvoices = (policyIds: string[]) => invoices.filter(i => policyIds.includes(i.policyId));
export const getDocuments = (policyIds: string[]) =>
  documents.filter(d => !d.policyId || policyIds.includes(d.policyId));
export const getNotifications = () => notifications;

// agent
export const getClients = () => clients;
export const getCommissions = () => commissions;
export const getLeads = () => leads;
export const getAgentTier = () => agentTier;

// dashboard aggregates
export function businessStats(userId: string) {
  const ps = getPolicies(userId);
  const ids = ps.map(p => p.id);
  return {
    activePolicies: ps.filter(p => p.status === 'active').length,
    workersCovered: ps.reduce((s, p) => s + (p.workersCount ?? 0), 0),
    expiringSoon: ps.filter(p => p.status === 'expiring').length,
    openClaims: getClaims(ids).filter(c => c.status !== 'paid' && c.status !== 'rejected').length,
  };
}
export function individualStats(userId: string) {
  const ps = getPolicies(userId);
  const ids = ps.map(p => p.id);
  return {
    activePolicies: ps.filter(p => p.status === 'active').length,
    renewalsDue: ps.filter(p => p.status === 'expiring' || p.status === 'expired').length,
    openClaims: getClaims(ids).filter(c => c.status !== 'paid' && c.status !== 'rejected').length,
  };
}
export function agentStats() {
  const monthCommission = commissions
    .filter(c => c.period === '2026-06')
    .reduce((s, c) => s + c.amount, 0);
  return {
    commissionThisMonth: monthCommission,
    tier: agentTier.current,
    activeClients: clients.length,
    openLeads: leads.filter(l => l.stage !== 'won' && l.stage !== 'lost').length,
  };
}

// ============================ AGENT TEAM / MULTI-TIER OVERRIDE (Phase 11.5) ============================
// Compliant model: override income accrues on the downline's REAL policy sales
// (GWP), only for members whose OIC license is verified. No recruitment fees.

/** Override rate by generation; gen >= 4 uses tailRate (unlimited depth). */
export const overrideSchedule = { gen1: 5, gen2: 3, gen3: 2, tailRate: 1 }; // percent
export const overrideRate = (gen: number) =>
  gen === 1 ? overrideSchedule.gen1
  : gen === 2 ? overrideSchedule.gen2
  : gen === 3 ? overrideSchedule.gen3
  : overrideSchedule.tailRate;

export const downline: DownlineMember[] = [
  { id: 'd1', name: 'คุณศุภชัย มั่งมี',     uplineId: 'u_agent', generation: 1, rank: 'Silver', licenseNo: 'B-0101001', licenseStatus: 'verified', personalGwp: 320000, directs: 2, joinedDate: '2025-02-10' },
  { id: 'd2', name: 'คุณรัชนี ทองสุข',      uplineId: 'u_agent', generation: 1, rank: 'Silver', licenseNo: 'B-0101002', licenseStatus: 'verified', personalGwp: 210000, directs: 1, joinedDate: '2025-03-22' },
  { id: 'd3', name: 'คุณกนกพร ใจดี',        uplineId: 'd1',      generation: 2, rank: 'Silver', licenseNo: 'B-0101003', licenseStatus: 'verified', personalGwp: 180000, directs: 0, joinedDate: '2025-05-01' },
  { id: 'd4', name: 'คุณวิทยา ตั้งใจ',      uplineId: 'd1',      generation: 2, rank: 'Silver', licenseNo: undefined,   licenseStatus: 'pending',  personalGwp: 0,      directs: 1, joinedDate: '2026-06-12' },
  { id: 'd5', name: 'คุณเอกพงษ์ รุ่งเรือง', uplineId: 'd2',      generation: 2, rank: 'Silver', licenseNo: 'B-0101005', licenseStatus: 'verified', personalGwp: 140000, directs: 1, joinedDate: '2025-06-18' },
  { id: 'd6', name: 'คุณอำพล สดใส',         uplineId: 'd4',      generation: 3, rank: 'Silver', licenseNo: 'B-0101006', licenseStatus: 'verified', personalGwp: 95000,  directs: 0, joinedDate: '2025-09-03' },
  { id: 'd7', name: 'คุณมาลี พูนผล',        uplineId: 'd5',      generation: 3, rank: 'Silver', licenseNo: 'B-0101007', licenseStatus: 'verified', personalGwp: 60000,  directs: 1, joinedDate: '2025-11-20' },
  { id: 'd8', name: 'คุณธวัช ก้าวหน้า',     uplineId: 'd7',      generation: 4, rank: 'Silver', licenseNo: 'B-0101008', licenseStatus: 'verified', personalGwp: 30000,  directs: 0, joinedDate: '2026-01-15' },
];

/** Override earnings for the current period. d4 (pending license) yields 0. */
export const teamOverrides: TeamOverride[] = [
  { id: 'ov1', period: '2026-06', sourceName: 'คุณศุภชัย มั่งมี',     generation: 1, baseGwp: 320000, rate: 5, amount: 16000, status: 'pending' },
  { id: 'ov2', period: '2026-06', sourceName: 'คุณรัชนี ทองสุข',      generation: 1, baseGwp: 210000, rate: 5, amount: 10500, status: 'pending' },
  { id: 'ov3', period: '2026-06', sourceName: 'คุณกนกพร ใจดี',        generation: 2, baseGwp: 180000, rate: 3, amount: 5400,  status: 'pending' },
  { id: 'ov4', period: '2026-06', sourceName: 'คุณเอกพงษ์ รุ่งเรือง', generation: 2, baseGwp: 140000, rate: 3, amount: 4200,  status: 'pending' },
  { id: 'ov5', period: '2026-06', sourceName: 'คุณอำพล สดใส',         generation: 3, baseGwp: 95000,  rate: 2, amount: 1900,  status: 'pending' },
  { id: 'ov6', period: '2026-06', sourceName: 'คุณมาลี พูนผล',        generation: 3, baseGwp: 60000,  rate: 2, amount: 1200,  status: 'pending' },
  { id: 'ov7', period: '2026-06', sourceName: 'คุณธวัช ก้าวหน้า',     generation: 4, baseGwp: 30000,  rate: 1, amount: 300,   status: 'pending' },
  // คุณวิทยา ตั้งใจ (gen2): license pending → 0 override until verified.
];

export const getDownline = () => downline;
export const getTeamOverrides = () => teamOverrides;

/** Nested tree from the flat list (unlimited depth). */
export interface TeamNode extends DownlineMember { children: TeamNode[]; }
export function buildDownlineTree(rootId = 'u_agent'): TeamNode[] {
  const make = (uplineId: string): TeamNode[] =>
    downline.filter(m => m.uplineId === uplineId)
            .map(m => ({ ...m, children: make(m.id) }));
  return make(rootId);
}

export function teamStats() {
  const verified = downline.filter(m => m.licenseStatus === 'verified');
  return {
    directCount: downline.filter(m => m.uplineId === 'u_agent').length,
    teamSize: downline.length,
    pendingLicense: downline.filter(m => m.licenseStatus === 'pending').length,
    teamGwp: verified.reduce((s, m) => s + m.personalGwp, 0),
    overrideIncome: teamOverrides.reduce((s, o) => s + o.amount, 0),
    deepestGeneration: Math.max(...downline.map(m => m.generation)),
  };
}

// ============================ LEADS QUERY (server-style, swap-ready) ============================
// These mirror a real `GET /leads?...` contract: filter + sort + paginate, plus
// an aggregate summary. Today they run in-memory over the passed array; a real
// backend would replace the bodies with a DB query (same inputs/outputs).
export type LeadSort = 'recent' | 'value' | 'name';

export type LeadQuery = {
  page?: number;          // 0-based
  pageSize?: number;
  q?: string;             // matches name / contact
  stage?: LeadStage;      // omit = any stage
  assignedTo?: string;    // omit = anyone · 'self' = unassigned (the agent) · else a member id
  sort?: LeadSort;
};

function filterLeads(all: Lead[], { q, stage, assignedTo }: LeadQuery): Lead[] {
  let rows = all;
  if (stage) rows = rows.filter(l => l.stage === stage);
  if (assignedTo === 'self') rows = rows.filter(l => !l.assignedTo);
  else if (assignedTo) rows = rows.filter(l => l.assignedTo === assignedTo);
  if (q && q.trim()) {
    const s = q.trim().toLowerCase();
    rows = rows.filter(l => l.name.toLowerCase().includes(s) || l.contact.includes(s));
  }
  return rows;
}

export function queryLeads(all: Lead[], query: LeadQuery = {}): { rows: Lead[]; total: number } {
  const { page = 0, pageSize = 25, sort = 'recent' } = query;
  const rows = [...filterLeads(all, query)].sort((a, b) =>
    sort === 'value' ? b.value - a.value
    : sort === 'name' ? a.name.localeCompare(b.name, 'th')
    : b.createdDate.localeCompare(a.createdDate),
  );
  const start = page * pageSize;
  return { rows: rows.slice(start, start + pageSize), total: rows.length };
}

// ============================ AGENT SALES (production history) ============================
const baseSales: AgentSale[] = [
  { id: 's1', date: '2026-06-19', clientName: 'บริษัท ไทยเจริญ ก่อสร้าง จำกัด', product: 'worker', premium: 124000, commission: 14880, status: 'issued' },
  { id: 's2', date: '2026-06-15', clientName: 'บริษัท สยามโลจิสติกส์ จำกัด',     product: 'worker', premium: 56000,  commission: 6720,  status: 'issued' },
  { id: 's3', date: '2026-06-10', clientName: 'คุณวีรพล สุขสันต์',               product: 'auto',   premium: 14200,  commission: 1420,  status: 'issued' },
  { id: 's4', date: '2026-06-04', clientName: 'ร้าน ก.รุ่งเรืองวัสดุ',           product: 'fire',   premium: 24000,  commission: 2400,  status: 'pending' },
  { id: 's5', date: '2026-05-28', clientName: 'คุณพิมพ์ชนก ใจงาม',               product: 'pa', premium: 22000,  commission: 2200,  status: 'issued' },
  { id: 's6', date: '2026-05-12', clientName: 'บริษัท สยามโลจิสติกส์ จำกัด',     product: 'travel', premium: 8500,   commission: 850,   status: 'cancelled' },
];

const SALE_CLIENTS = [
  'บริษัท ไทยเจริญ ก่อสร้าง จำกัด', 'บริษัท สยามโลจิสติกส์ จำกัด', 'ร้าน ก.รุ่งเรืองวัสดุ',
  'คุณวีรพล สุขสันต์', 'คุณพิมพ์ชนก ใจงาม', 'หจก. รุ่งโรจน์ ก่อสร้าง',
];
const SALE_STATUSES: SaleStatus[] = ['issued', 'issued', 'issued', 'pending', 'cancelled'];

function genSales(n: number): AgentSale[] {
  const out: AgentSale[] = [];
  for (let i = 0; i < n; i++) {
    const product = LEAD_INTERESTS[i % LEAD_INTERESTS.length]!;
    const premium = 8000 + ((i * 97) % 140) * 1000;
    // Spread across 2025–2026 so ~1-year renewals fall due across the calendar.
    const year = 2025 + (i % 2);
    const month = 1 + ((i * 5) % 12);
    const day = 1 + (i % 27);
    out.push({
      id: `sg-${i + 1}`,
      date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      clientName: SALE_CLIENTS[i % SALE_CLIENTS.length]!,
      product,
      premium,
      commission: Math.round(premium * (product === 'worker' ? 0.12 : 0.1)),
      status: SALE_STATUSES[i % SALE_STATUSES.length]!,
    });
  }
  return out;
}

export const agentSales: AgentSale[] = [...baseSales, ...genSales(28)];

export const getAgentSales = () => agentSales;

export function agentSalesStats() {
  const live = agentSales.filter(s => s.status !== 'cancelled');
  return {
    gwpThisMonth: live.filter(s => s.date.startsWith('2026-06')).reduce((s, x) => s + x.premium, 0),
    policiesSold: agentSales.filter(s => s.status === 'issued').length,
    pending: agentSales.filter(s => s.status === 'pending').length,
    commissionYtd: live.reduce((s, x) => s + x.commission, 0),
  };
}

/**
 * Agent's book of business due for renewal: issued sales whose 1-year mark falls
 * within `withinDays` of `now`. (A real backend would track real policy dates.)
 */
export function agentRenewals(now: Date, withinDays = 90) {
  return agentSales
    .filter(s => s.status === 'issued')
    .map(s => {
      const d = new Date(s.date);
      d.setFullYear(d.getFullYear() + 1);
      const renewalDate = d.toISOString().slice(0, 10);
      const days = Math.ceil((d.getTime() - now.getTime()) / 86_400_000);
      return { sale: s, renewalDate, days };
    })
    .filter(r => r.days >= 0 && r.days <= withinDays)
    .sort((a, b) => a.days - b.days);
}

/** Per-stage count + ฿ value for the board headers / pipeline cards. */
export function leadStageSummary(
  all: Lead[],
  query: Pick<LeadQuery, 'q' | 'assignedTo'> = {},
): Record<LeadStage, { count: number; value: number }> {
  const out: Record<LeadStage, { count: number; value: number }> = {
    new: { count: 0, value: 0 },
    contacted: { count: 0, value: 0 },
    quoted: { count: 0, value: 0 },
    won: { count: 0, value: 0 },
    lost: { count: 0, value: 0 },
  };
  for (const l of filterLeads(all, query)) {
    out[l.stage].count += 1;
    out[l.stage].value += l.value;
  }
  return out;
}

// ============================ ADMIN / BACK-OFFICE (Phase 14) ============================
export const articles: Article[] = [
  {
    id: 'a1', title: 'ประกันแรงงานต่างด้าวปี 2569 ต้องรู้อะไรบ้าง', slug: 'foreign-worker-insurance-2026',
    status: 'published', category: 'ความรู้ประกัน', author: 'ทีม TKR', locales: ['th', 'en'], publishedAt: '2026-06-01',
    cover: 'brand', readMinutes: 5,
    excerpt: 'นายจ้างต้องเตรียมเอกสารอะไร คุ้มครองอะไรบ้าง และซื้อออนไลน์อย่างไรให้ออกกรมธรรม์ได้ทันที',
    seo: { metaTitle: 'ประกันแรงงานต่างด้าว 2569 | TKR', metaDescription: 'คู่มือฉบับสมบูรณ์เรื่องประกันแรงงานต่างด้าวสำหรับนายจ้าง' },
    body: [
      'ประกันแรงงานต่างด้าวเป็นสิ่งที่นายจ้างต้องจัดให้ลูกจ้างตามที่กฎหมายกำหนด เพื่อคุ้มครองค่ารักษาพยาบาลจากอุบัติเหตุและการเจ็บป่วย รวมถึงค่าชดเชยและค่าส่งกลับประเทศในกรณีจำเป็น',
      'เอกสารที่ต้องเตรียมมีเพียงสำเนาพาสปอร์ตและใบอนุญาตทำงานของแรงงาน พร้อมข้อมูลนายจ้าง เมื่อกรอกข้อมูลและชำระเบี้ยแล้ว ระบบจะออกกรมธรรม์ให้ภายใน 24 ชั่วโมง',
      'TKR ช่วยให้นายจ้างซื้อประกันแรงงานได้ทั้งแบบทีละคนหรือยกชุดหลักพันคนผ่านไฟล์ Excel และจัดการเพิ่ม-ลดรายชื่อแรงงานระหว่างปีได้เองผ่านพอร์ทัล',
      'ก่อนตัดสินใจ ควรเปรียบเทียบวงเงินคุ้มครอง ค่ารักษาพยาบาลต่อครั้ง และเงื่อนไขการส่งกลับประเทศ เพื่อเลือกแผนที่เหมาะกับลักษณะงานและจำนวนแรงงานของคุณ',
    ],
  },
  {
    id: 'a2', title: '5 ข้อควรรู้ก่อนต่ออายุประกันรถยนต์', slug: 'car-insurance-renewal-tips',
    status: 'published', category: 'ประกันรถยนต์', author: 'ทีม TKR', locales: ['th'], publishedAt: '2026-05-18',
    cover: 'mint', readMinutes: 4,
    excerpt: 'ต่อประกันรถอย่างไรให้ได้ความคุ้มครองที่ใช่ในราคาที่คุ้มที่สุด',
    seo: { metaTitle: 'ต่อประกันรถยนต์อย่างไรให้คุ้ม | TKR', metaDescription: 'เคล็ดลับเลือกและต่อประกันรถยนต์' },
    body: [
      'ก่อนต่ออายุ ลองทบทวนการใช้งานรถในปีที่ผ่านมาว่าเปลี่ยนไปหรือไม่ เช่น ระยะทางขับขี่ ผู้ขับขี่หลัก หรือสถานที่จอด เพราะปัจจัยเหล่านี้มีผลต่อเบี้ยและความคุ้มครองที่เหมาะสม',
      'เปรียบเทียบเบี้ยจากหลายบริษัทเสมอ ความคุ้มครองชั้นเดียวกันอาจมีเบี้ยและเงื่อนไขต่างกันมาก การเทียบในที่เดียวช่วยให้เห็นภาพรวมและเลือกได้คุ้มที่สุด',
      'ตรวจสอบทุนประกันให้สอดคล้องกับมูลค่ารถปัจจุบัน ทุนสูงเกินไปทำให้จ่ายเบี้ยแพงโดยไม่จำเป็น ส่วนทุนต่ำเกินไปอาจได้ค่าสินไหมไม่พอ',
      'อย่าลืมดูเรื่องค่าเสียหายส่วนแรก (Deductible) และเครือข่ายอู่/ศูนย์ซ่อม ที่ส่งผลต่อความสะดวกเวลาเคลมจริง',
      'สุดท้าย ต่อก่อนหมดอายุเสมอเพื่อให้ความคุ้มครองต่อเนื่อง ไม่มีช่วงที่รถขาดประกัน',
    ],
  },
  {
    id: 'a5', title: 'เลือกแผนประกันอุบัติเหตุ (PA) อย่างไรให้เหมาะกับคุณ', slug: 'choosing-pa-insurance',
    status: 'published', category: 'ประกันอุบัติเหตุ', author: 'ทีม TKR', locales: ['th', 'en'], publishedAt: '2026-05-02',
    cover: 'peach', readMinutes: 6,
    excerpt: 'ทุนประกัน ค่ารักษาจากอุบัติเหตุ หรือชดเชยรายได้ — เข้าใจความต่างก่อนเลือกแผนที่ใช่',
    seo: { metaTitle: 'เลือกประกันอุบัติเหตุ (PA) | TKR', metaDescription: 'แนวทางเลือกแผนประกันอุบัติเหตุ (PA) ให้เหมาะกับไลฟ์สไตล์และงบประมาณ' },
    body: [
      'ประกันอุบัติเหตุ (PA) คุ้มครองการเสียชีวิต สูญเสียอวัยวะ และทุพพลภาพจากอุบัติเหตุ พร้อมทุนประกันก้อนใหญ่ในเบี้ยที่จับต้องได้ เหมาะกับทุกคนที่ต้องการความอุ่นใจในชีวิตประจำวัน',
      'ควรพิจารณาวงเงินค่ารักษาพยาบาลต่อครั้งจากอุบัติเหตุ (อบ.) ให้เพียงพอกับค่ารักษาจริง และดูว่าครอบคลุมทั้งผู้ป่วยในและผู้ป่วยนอกจากอุบัติเหตุหรือไม่',
      'หากเป็นเสาหลักของครอบครัวหรือทำงานที่มีความเสี่ยง ควรเลือกแผนที่มีเงินชดเชยรายได้ระหว่างพักรักษาตัว (ค่าชดเชยรายวัน) เพื่อลดผลกระทบด้านรายได้',
      'เปรียบเทียบทุนประกัน วงเงินค่ารักษา ข้อยกเว้น และความคุ้มครองเสริม เช่น อุบัติเหตุจากรถจักรยานยนต์ ก่อนตัดสินใจ เพื่อให้ได้แผนที่สมดุลทั้งความคุ้มครองและงบประมาณ',
    ],
  },
  {
    id: 'a6', title: 'ขั้นตอนการเคลมประกันให้ได้รับเงินไว', slug: 'fast-claim-guide',
    status: 'published', category: 'เคลม', author: 'ทีม TKR', locales: ['th'], publishedAt: '2026-04-20',
    cover: 'gold', readMinutes: 4,
    excerpt: 'เตรียมเอกสารให้ครบและทำตามขั้นตอน เพื่อให้เคลมผ่านเร็วที่สุด',
    seo: { metaTitle: 'ขั้นตอนการเคลมประกัน | TKR', metaDescription: 'วิธีเตรียมเอกสารและยื่นเคลมให้ได้รับเงินไว' },
    body: [
      'สิ่งแรกเมื่อเกิดเหตุคือแจ้งเคลมทันทีผ่านแอปหรือ LINE ของ TKR พร้อมถ่ายภาพความเสียหายและจดรายละเอียดเหตุการณ์ วันเวลา และสถานที่',
      'เตรียมเอกสารให้ครบตั้งแต่ต้น เช่น สำเนากรมธรรม์ บัตรประชาชน ใบเสร็จค่ารักษา หรือใบแจ้งความ (กรณีอุบัติเหตุ) จะช่วยให้การพิจารณาไม่สะดุด',
      'ติดตามสถานะเคลมได้ตลอดผ่านพอร์ทัลลูกค้า ระบบจะแสดงไทม์ไลน์ตั้งแต่ยื่นเรื่อง กำลังพิจารณา จนถึงอนุมัติและโอนเงิน',
      'หากเอกสารไม่ครบ เจ้าหน้าที่จะแจ้งให้ส่งเพิ่มผ่านช่องทางเดิม การตอบกลับไวช่วยให้ได้รับเงินเร็วขึ้น',
    ],
  },
  {
    id: 'a7', title: 'ผ่อนเบี้ยประกัน 0% ทำได้อย่างไร', slug: 'installment-0-percent',
    status: 'published', category: 'การชำระเงิน', author: 'ทีม TKR', locales: ['th'], publishedAt: '2026-04-05',
    cover: 'sky', readMinutes: 3,
    excerpt: 'จ่ายเต็ม บัตรเครดิตผ่อน 0% หรือสแกน QR — เลือกวิธีที่สะดวกและได้ความคุ้มครองทันที',
    seo: { metaTitle: 'ผ่อนเบี้ยประกัน 0% | TKR', metaDescription: 'ทางเลือกการชำระเบี้ยประกันและการผ่อน 0%' },
    body: [
      'TKR รองรับการชำระเบี้ยหลายช่องทาง ทั้งจ่ายเต็มจำนวน ผ่อน 0% ผ่านบัตรเครดิตที่ร่วมรายการ และสแกนจ่ายผ่าน QR พร้อมเพย์',
      'การผ่อน 0% ช่วยกระจายภาระค่าเบี้ยเป็นรายเดือนโดยไม่มีดอกเบี้ย เหมาะกับเบี้ยก้อนใหญ่ เช่น ประกันอุบัติเหตุ (PA) หรือประกันรถชั้น 1',
      'ไม่ว่าจะเลือกวิธีใด เมื่อชำระสำเร็จระบบจะยืนยันความคุ้มครองทันที และส่งกรมธรรม์ให้ทางอีเมลและในพอร์ทัล',
    ],
  },
  {
    id: 'a8', title: 'เครือข่ายอู่และโรงพยาบาลของ TKR', slug: 'garage-hospital-network',
    status: 'published', category: 'ความรู้ประกัน', author: 'ทีม TKR', locales: ['th'], publishedAt: '2026-03-22',
    cover: 'brand', readMinutes: 3,
    excerpt: 'ใช้บริการอู่ในเครือและโรงพยาบาลคู่สัญญาได้สะดวก ไม่ต้องสำรองจ่าย',
    seo: { metaTitle: 'เครือข่ายอู่และโรงพยาบาล | TKR', metaDescription: 'รายละเอียดเครือข่ายอู่ซ่อมและโรงพยาบาลคู่สัญญา' },
    body: [
      'การใช้อู่ในเครือหรือศูนย์ซ่อมมาตรฐานช่วยให้ซ่อมรถได้สะดวกและไม่ต้องสำรองจ่าย เพราะบริษัทประกันจ่ายตรงให้กับอู่',
      'สำหรับประกันอุบัติเหตุ (PA) การเข้ารับบริการในโรงพยาบาลคู่สัญญาสามารถใช้สิทธิ์แบบไม่ต้องสำรองจ่าย เพียงแสดงบัตรและยืนยันตัวตน',
      'ตรวจสอบรายชื่อเครือข่ายล่าสุดได้ในพอร์ทัลลูกค้า หรือสอบถามทีมงานผ่าน LINE ได้ตลอด 24 ชั่วโมง',
    ],
  },
  {
    id: 'a3', title: 'Worker Wallet คืออะไร ใช้งานอย่างไร', slug: 'what-is-worker-wallet', status: 'scheduled', category: 'ผลิตภัณฑ์', author: 'ทีม TKR', locales: ['th', 'my', 'lo'], publishedAt: '2026-07-01', seo: { metaTitle: 'Worker Wallet | TKR', metaDescription: 'กระเป๋าดิจิทัลสำหรับแรงงาน' } },
  { id: 'a4', title: 'ร่างประกาศโปรโมชั่นกลางปี', slug: 'mid-year-promo', status: 'draft', category: 'โปรโมชั่น', author: 'ทีม TKR', locales: ['th'], seo: { metaTitle: '', metaDescription: '' } },
];

export const orders: Order[] = [
  { id: 'o1', orderNo: 'ORD-2026-1188', customerName: 'บริษัท บูรพา ขนส่ง จำกัด', customerType: 'business', product: 'worker', premium: 88000, status: 'awaiting_payment', channel: 'phone', createdBy: 'u_admin', createdDate: '2026-06-20' },
  { id: 'o2', orderNo: 'ORD-2026-1175', customerName: 'คุณอาทิตย์ แสงทอง', customerType: 'individual', product: 'auto', premium: 16500, status: 'issued', channel: 'line', createdBy: 'u_admin', createdDate: '2026-06-15' },
  { id: 'o3', orderNo: 'ORD-2026-1162', customerName: 'ร้าน ก.รุ่งเรืองวัสดุ', customerType: 'business', product: 'fire', premium: 24000, status: 'issued', channel: 'walk_in', createdBy: 'u_admin', createdDate: '2026-06-09' },
  { id: 'o4', orderNo: 'ORD-2026-1150', customerName: 'คุณมณีรัตน์ ทองคำ', customerType: 'individual', product: 'pa', premium: 24000, status: 'draft', channel: 'phone', createdBy: 'u_admin', createdDate: '2026-06-05' },
];

export const staffUsers: StaffUser[] = [
  { id: 's1', name: 'คุณกานต์ ผู้ดูแลระบบ', email: 'admin@tkr.demo', staffRole: 'superadmin', status: 'active', lastActive: '2026-06-23' },
  { id: 's2', name: 'คุณปาริชาต ฝ่ายปฏิบัติการ', email: 'ops@tkr.demo', staffRole: 'ops', status: 'active', lastActive: '2026-06-22' },
  { id: 's3', name: 'คุณธีรเดช คอนเทนต์', email: 'content@tkr.demo', staffRole: 'content', status: 'active', lastActive: '2026-06-21' },
  { id: 's4', name: 'คุณรัตติกาล ฝ่ายขาย', email: 'sales@tkr.demo', staffRole: 'sales', status: 'suspended', lastActive: '2026-05-30' },
];

export const tickets: SupportTicket[] = [
  { id: 't1', ref: 'TKT-2026-3391', customer: 'บริษัท ไทยเจริญ ก่อสร้าง จำกัด', subject: 'ขอแก้ไขรายชื่อแรงงานในกรมธรรม์', status: 'open', priority: 'high', updatedAt: '2026-06-23' },
  { id: 't2', ref: 'TKT-2026-3380', customer: 'คุณนภัสสร วงศ์ดี', subject: 'สอบถามขั้นตอนเคลมประกันรถ', status: 'pending', priority: 'medium', updatedAt: '2026-06-22' },
  { id: 't3', ref: 'TKT-2026-3361', customer: 'คุณวีรพล สุขสันต์', subject: 'ขอใบเสร็จย้อนหลัง', status: 'resolved', priority: 'low', updatedAt: '2026-06-20' },
];

export const productPlans: ProductPlan[] = [
  // Worker insurance = single ทิพยประกันภัย package (illness IPD/OPD + accident).
  // Exactly ONE active worker plan — keep the old Plus row only as inactive history.
  { id: 'pp1', product: 'worker', planName: 'แพ็กเกจแรงงานต่างด้าว (เจ็บป่วย + อุบัติเหตุ)', insurer: 'ทิพยประกันภัย', coverage: 150000, basePremium: 500, active: true },
  { id: 'pp2', product: 'worker', planName: 'แรงงาน Plus (ยกเลิก)', insurer: 'วิริยะประกันภัย',  coverage: 1000000, basePremium: 850,  active: false },
  { id: 'pp3', product: 'auto',   planName: 'รถยนต์ชั้น 1',      insurer: 'วิริยะประกันภัย',  coverage: 1000000, basePremium: 14200, active: true },
  { id: 'pp4', product: 'pa', planName: 'PA อุบัติเหตุส่วนบุคคล',    insurer: 'เมืองไทยประกันภัย', coverage: 1500000, basePremium: 22000, active: true },
  { id: 'pp5', product: 'fire',   planName: 'อัคคีภัยธุรกิจ',    insurer: 'กรุงเทพประกันภัย',  coverage: 8000000, basePremium: 18500, active: false },
];

export const auditLog: AuditEntry[] = [
  { id: 'au1', actor: 'คุณกานต์ ผู้ดูแลระบบ', action: 'สร้างออเดอร์แทนลูกค้า', target: 'ORD-2026-1188', time: '2026-06-20T14:22:00+07:00' },
  { id: 'au2', actor: 'คุณปาริชาต ฝ่ายปฏิบัติการ', action: 'อนุมัติเคลม', target: 'CLM-2026-09887', time: '2026-06-21T10:05:00+07:00' },
  { id: 'au3', actor: 'คุณธีรเดช คอนเทนต์', action: 'เผยแพร่บทความ', target: 'foreign-worker-insurance-2026', time: '2026-06-01T09:00:00+07:00' },
  { id: 'au4', actor: 'คุณกานต์ ผู้ดูแลระบบ', action: 'เผยแพร่นโยบายความเป็นส่วนตัว', target: 'privacy v2026.1', time: '2026-01-01T00:00:00+07:00' },
  { id: 'au5', actor: 'คุณปาริชาต ฝ่ายปฏิบัติการ', action: 'ดำเนินการคำขอข้อมูลส่วนบุคคล', target: 'DSR-2026-0005', time: '2026-06-02T13:15:00+07:00' },
];

// helpers
export const getArticles = () => articles;
/** Public site: only published articles, newest first. */
export const getPublishedArticles = () =>
  articles
    .filter((a) => a.status === 'published')
    .sort((a, b) => (a.publishedAt && b.publishedAt ? (a.publishedAt < b.publishedAt ? 1 : -1) : 0));
/** Public site: a single published article by slug (draft/scheduled stay hidden). */
export const getPublishedArticle = (slug: string) =>
  articles.find((a) => a.slug === slug && a.status === 'published');
/** Distinct categories across published articles (for the list filter). */
export const getArticleCategories = () =>
  [...new Set(getPublishedArticles().map((a) => a.category))];
export const getOrders = () => orders;
export const getStaff = () => staffUsers;
export const getSupportTickets = () => tickets;
export const getProductPlans = () => productPlans;
export const getAuditLog = () => auditLog;
export const getAllPolicies = () => policies;   // admin sees platform-wide
export const getAllClaims = () => claims;
export const getAllCustomers = () => users.filter(u => u.role === 'business' || u.role === 'individual');

export function adminStats() {
  const gwp = policies.reduce((s, p) => s + p.premium, 0);
  return {
    gwp,                                                   // gross written premium
    activePolicies: policies.filter(p => p.status === 'active').length,
    pendingClaims: claims.filter(c => c.status === 'submitted' || c.status === 'reviewing').length,
    openTickets: tickets.filter(t => t.status !== 'resolved').length,
    draftArticles: articles.filter(a => a.status !== 'published').length,
  };
}

// ============================ ADMIN CONTENT (Phase 14 build-out) ============================
export const cmsPages: CmsPage[] = [
  { id: 'cp1', path: '/',                 title: 'หน้าแรก',              hero: 'ประกันที่เข้าใจคนทำงาน',                 body: 'TKR ช่วยให้นายจ้างและแรงงานเข้าถึงประกันที่จำเป็นได้ง่าย รวดเร็ว และโปร่งใส', faqCount: 3, updatedAt: '2026-06-18' },
  { id: 'cp2', path: '/worker-insurance', title: 'ประกันแรงงานต่างด้าว', hero: 'คุ้มครองแรงงานครบ จบในที่เดียว',          body: 'ซื้อประกันแรงงานต่างด้าวออนไลน์ ออกกรมธรรม์ไว พร้อมระบบจัดการรายชื่อแรงงาน', faqCount: 4, updatedAt: '2026-06-15' },
  { id: 'cp3', path: '/auto',             title: 'ประกันรถยนต์',         hero: 'ประกันรถที่เปรียบเทียบได้จริง',           body: 'เทียบเบี้ยจากหลายบริษัทในที่เดียว เลือกแผนที่ใช่สำหรับคุณ',                  faqCount: 2, updatedAt: '2026-06-10' },
  { id: 'cp4', path: '/customer',         title: 'สำหรับลูกค้า',          hero: 'จัดการกรมธรรม์ของคุณได้ทุกที่',           body: 'ดูกรมธรรม์ เคลม และชำระเบี้ยได้จากที่เดียว',                                  faqCount: 2, updatedAt: '2026-06-08' },
  { id: 'cp5', path: '/agency',           title: 'สำหรับตัวแทน',          hero: 'เติบโตไปกับ TKR',                          body: 'เครื่องมือครบสำหรับตัวแทนและทีมขาย พร้อมระบบคอมมิชชั่นโปร่งใส',               faqCount: 3, updatedAt: '2026-06-05' },
  { id: 'cp6', path: '/about',            title: 'รู้จักเรา',             hero: 'ประกันที่เข้าใจคนทำงาน',                  body: 'TKR คือนายหน้าประกันภัยที่ได้รับใบอนุญาต จุดเด่นคือประกันแรงงานต่างด้าวสำหรับนายจ้าง ควบคู่กับประกันส่วนบุคคล', faqCount: 0, updatedAt: '2026-06-29' },
  { id: 'cp7', path: '/about/why',        title: 'ทำไมต้อง TKR',          hero: 'ทำไมต้องเลือก TKR',                        body: 'เชี่ยวชาญประกันแรงงานต่างด้าว เทียบหลายบริษัทในที่เดียว และเครื่องมือดิจิทัลที่ทำให้เรื่องประกันง่ายขึ้น', faqCount: 0, updatedAt: '2026-06-29' },
  { id: 'cp8', path: '/about/partners',   title: 'บริษัทประกันพันธมิตร',   hero: 'บริษัทประกันที่เราทำงานด้วย',               body: 'ในฐานะนายหน้า เราเป็นพันธมิตรกับบริษัทประกันชั้นนำ เพื่อให้คุณเปรียบเทียบทางเลือกและเลือกที่ใช่', faqCount: 0, updatedAt: '2026-06-29' },
  { id: 'cp9', path: '/about/agent',      title: 'ร่วมเป็นตัวแทน',         hero: 'สร้างรายได้กับ TKR',                       body: 'เป็นตัวแทนประกัน TKR ที่ได้รับใบอนุญาต รับคอมมิชชั่นจากยอดขายจริง โมเดลตัวแทนที่ถูกต้อง ไม่มีค่าสมัคร', faqCount: 5, updatedAt: '2026-06-29' },
  // Legal pages (Phase 21) — body is CMS-editable placeholder; real wording is
  // drafted/approved by counsel (see the "legal review" TODO on each page).
  { id: 'cp10', path: '/legal/privacy', title: 'นโยบายความเป็นส่วนตัว (PDPA)', hero: 'นโยบายความเป็นส่วนตัว', body: 'นโยบายนี้อธิบายว่าเราเก็บ ใช้ และเปิดเผยข้อมูลส่วนบุคคลของคุณ (รวมถึงข้อมูลแรงงาน) อย่างไร ภายใต้ พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562', faqCount: 0, updatedAt: '2026-06-29' },
  { id: 'cp11', path: '/legal/terms',   title: 'ข้อกำหนดการใช้งาน',         hero: 'ข้อกำหนดการใช้งาน',     body: 'ข้อกำหนดการใช้บริการแพลตฟอร์ม TKR บทบาทของเราในฐานะนายหน้าประกันภัยที่ได้รับใบอนุญาต และข้อจำกัดความรับผิด', faqCount: 0, updatedAt: '2026-06-29' },
  { id: 'cp12', path: '/legal/cookies', title: 'นโยบายคุกกี้',              hero: 'นโยบายคุกกี้',          body: 'เราใช้คุกกี้เพื่อให้เว็บไซต์ทำงานได้ วิเคราะห์การใช้งาน และทำการตลาด คุณจัดการความยินยอมได้ตลอดเวลา', faqCount: 0, updatedAt: '2026-06-29' },
];

export const faqs: Faq[] = [
  { id: 'f1', pageId: 'cp2', question: 'ซื้อประกันแรงงานต่างด้าวต้องใช้เอกสารอะไรบ้าง', answer: 'ใช้สำเนาพาสปอร์ตและใบอนุญาตทำงานของแรงงาน พร้อมข้อมูลนายจ้าง' },
  { id: 'f2', pageId: 'cp2', question: 'ออกกรมธรรม์ใช้เวลานานไหม',                       answer: 'เมื่อชำระเบี้ยแล้ว ระบบจะออกกรมธรรม์ภายใน 24 ชั่วโมง' },
  { id: 'f3', pageId: 'cp2', question: 'เพิ่ม-ลดรายชื่อแรงงานระหว่างปีได้หรือไม่',          answer: 'ได้ ผ่านระบบจัดการแรงงานในพอร์ทัลของนายจ้าง' },
  { id: 'f4', pageId: 'cp3', question: 'เทียบเบี้ยประกันรถยนต์อย่างไร',                    answer: 'กรอกข้อมูลรถและความต้องการ ระบบจะแสดงเบี้ยจากหลายบริษัทให้เลือก' },
  { id: 'f5', pageId: 'cp1', question: 'TKR คืออะไร',                                     answer: 'แพลตฟอร์มประกันสำหรับนายจ้าง แรงงาน และบุคคลทั่วไป' },
];

export const mediaAssets: MediaAsset[] = [
  { id: 'm1', name: 'hero-worker.jpg',        kind: 'image', sizeKb: 248, uploadedBy: 'คุณธีรเดช คอนเทนต์', uploadedAt: '2026-06-18' },
  { id: 'm2', name: 'brochure-worker-2026.pdf', kind: 'doc', sizeKb: 1840, uploadedBy: 'คุณธีรเดช คอนเทนต์', uploadedAt: '2026-06-12' },
  { id: 'm3', name: 'og-default.png',         kind: 'image', sizeKb: 96,  uploadedBy: 'ทีม TKR',           uploadedAt: '2026-06-01' },
  { id: 'm4', name: 'explainer-wallet.mp4',   kind: 'video', sizeKb: 15200, uploadedBy: 'ทีม TKR',         uploadedAt: '2026-05-28' },
  { id: 'm5', name: 'logo-tkr.png',           kind: 'image', sizeKb: 42,  uploadedBy: 'ทีม TKR',           uploadedAt: '2026-05-20' },
  { id: 'm6', name: 'agency-tiers.png',       kind: 'image', sizeKb: 180, uploadedBy: 'คุณธีรเดช คอนเทนต์', uploadedAt: '2026-05-15' },
];

export const redirects: Redirect[] = [
  { id: 'r1', from: '/insurance', to: '/worker-insurance', code: 301 },
  { id: 'r2', from: '/promo',     to: '/insurance/worker',  code: 302 },
  { id: 'r3', from: '/agent',     to: '/agency',            code: 301 },
];

export const commissionRules: CommissionRule[] = [
  { id: 'cr1', product: 'worker', tier: 'Silver',   rate: 8,  active: true },
  { id: 'cr2', product: 'worker', tier: 'Gold',     rate: 10, active: true },
  { id: 'cr3', product: 'worker', tier: 'Platinum', rate: 12, active: true },
  { id: 'cr4', product: 'auto',   tier: 'Gold',     rate: 12, active: true },
  { id: 'cr5', product: 'auto',   tier: 'Platinum', rate: 14, active: true },
  { id: 'cr6', product: 'pa', tier: 'Gold',     rate: 15, active: true },
  { id: 'cr7', product: 'fire',   tier: 'Diamond',  rate: 16, active: false },
];

export const getCmsPages = () => cmsPages;
export const getFaqs = (pageId?: string) =>
  pageId ? faqs.filter(f => f.pageId === pageId) : faqs;
export const getMedia = () => mediaAssets;
export const getRedirects = () => redirects;

// ============================ LEGAL & PDPA (Phase 21) ============================
// Versioned policies (privacy/terms/cookies) with effective dates. The CURRENT
// version is the latest published one per kind — captured into every ConsentRecord
// so consent is always tied to the wording the subject actually agreed to.
export const legalPolicies: LegalPolicy[] = [
  { id: 'lp_priv_2026_1', kind: 'privacy', version: '2026.1', effectiveDate: '2026-01-01', status: 'published', summary: 'ฉบับเริ่มต้นปี 2026 — โครงสร้างตาม PDPA (รอตรวจทานโดยที่ปรึกษากฎหมาย)' },
  { id: 'lp_priv_2025_1', kind: 'privacy', version: '2025.1', effectiveDate: '2025-03-01', status: 'published', summary: 'ฉบับปี 2025 (แทนที่แล้ว)' },
  { id: 'lp_terms_2026_1', kind: 'terms',   version: '2026.1', effectiveDate: '2026-01-01', status: 'published', summary: 'ข้อกำหนดการใช้งานฉบับปี 2026' },
  { id: 'lp_cook_2026_1',  kind: 'cookies', version: '2026.1', effectiveDate: '2026-01-01', status: 'published', summary: 'นโยบายคุกกี้ฉบับปี 2026 — 3 หมวด: จำเป็น/วิเคราะห์/การตลาด' },
];

/** Latest published version string for a policy kind (the one in force). */
export const currentPolicyVersion = (kind: LegalPolicyKind): string =>
  legalPolicies
    .filter((p) => p.kind === kind && p.status === 'published')
    .sort((a, b) => (a.effectiveDate < b.effectiveDate ? 1 : -1))[0]?.version ?? '—';

export const getLegalPolicies = () => legalPolicies;

// Append-only consent audit (mock). A real backend keeps one row per grant/
// withdraw; the consent center + admin view read the latest per (subject, type).
export const consentRecords: ConsentRecord[] = [
  { id: 'cs1', subjectId: 'u_indiv',     type: 'pdpa_service', granted: true,  policyVersion: '2026.1', source: 'signup',         timestamp: '2026-02-14T09:12:00+07:00' },
  { id: 'cs2', subjectId: 'u_indiv',     type: 'marketing',    granted: true,  policyVersion: '2026.1', source: 'signup',         timestamp: '2026-02-14T09:12:00+07:00' },
  { id: 'cs3', subjectId: 'u_business',  type: 'pdpa_service', granted: true,  policyVersion: '2026.1', source: 'signup',         timestamp: '2026-01-20T14:30:00+07:00' },
  { id: 'cs4', subjectId: 'u_business',  type: 'marketing',    granted: false, policyVersion: '2026.1', source: 'consent_center', timestamp: '2026-05-02T11:05:00+07:00' },
  { id: 'cs5', subjectId: '0812345678',  type: 'pdpa_service', granted: true,  policyVersion: '2026.1', source: 'guest_checkout',  timestamp: '2026-06-18T16:40:00+07:00' },
];

/** All consent records (newest first), optionally for one subject. */
export const getConsents = (subjectId?: string) =>
  [...consentRecords]
    .filter((c) => !subjectId || c.subjectId === subjectId)
    .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

/** Latest record per consent type for a subject (the current effective state). */
export const getConsentState = (subjectId: string): Record<string, ConsentRecord> => {
  const out: Record<string, ConsentRecord> = {};
  for (const c of getConsents(subjectId)) if (!out[c.type]) out[c.type] = c;
  return out;
};

export const dataSubjectRequests: DataSubjectRequest[] = [
  { id: 'dsr1', ref: 'DSR-2026-0007', subject: 'คุณนภัสสร วงศ์ดี', contact: '0898765432',      kind: 'access', status: 'in_progress', createdAt: '2026-06-20', note: 'ขอสำเนาข้อมูลส่วนบุคคลทั้งหมด' },
  { id: 'dsr2', ref: 'DSR-2026-0006', subject: 'คุณวีรพล สุขสันต์', contact: 'weeraphol@example.com', kind: 'delete', status: 'new',         createdAt: '2026-06-24' },
  { id: 'dsr3', ref: 'DSR-2026-0005', subject: 'บริษัท ไทยเจริญ ก่อสร้าง จำกัด', contact: '021234567', kind: 'export', status: 'resolved',    createdAt: '2026-05-30' },
];

export const getDataRequests = () => dataSubjectRequests;
export const getCommissionRules = () => commissionRules;

// ============================ CRM OPS CORE (Phase 15) ============================
// Worker-insurance fulfillment (MOU / MOTI24 → underwriter "Thip").
// Credit wallet + ledger are INTERNAL ONLY — never surface in a customer portal.

// ---- pricing config (source of truth; per-customer discounts handle variance) ----
export const pricingTiers: PricingTier[] = [
  { product: 'MOU',    duration: '3_months',  basePrice: 590 },
  { product: 'MOU',    duration: '6_months',  basePrice: 990 },
  { product: 'MOU',    duration: '1_year',    basePrice: 1790 },
  { product: 'MOU',    duration: '15_months', basePrice: 2290 },
  { product: 'MOTI24', duration: '3_months',  basePrice: 590 },
  { product: 'MOTI24', duration: '6_months',  basePrice: 990 },
  { product: 'MOTI24', duration: '1_year',    basePrice: 1790 },
  { product: 'MOTI24', duration: '15_months', basePrice: 2290 },
];
export const basePrice = (p: CrmProduct, d: Duration) =>
  pricingTiers.find(t => t.product === p && t.duration === d)?.basePrice ?? 0;
export const ticketTotal = (p: CrmProduct, d: Duration, discount: number, headcount: number) =>
  Math.max(0, basePrice(p, d) - discount) * headcount;

const DURATION_MONTHS: Record<Duration, number> = {
  '3_months': 3, '6_months': 6, '1_year': 12, '15_months': 15,
};
/** Coverage expiry = start + duration − 1 day (ISO yyyy-mm-dd). */
export function coverageExpiry(startIso: string, d: Duration): string {
  const start = new Date(startIso);
  if (Number.isNaN(start.getTime())) return startIso;
  const end = new Date(start);
  end.setMonth(end.getMonth() + DURATION_MONTHS[d]);
  end.setDate(end.getDate() - 1);
  return end.toISOString().slice(0, 10);
}

export const creditProfiles: CustomerCreditProfile[] = [
  { customerId: 'u_biz', currentCredit: -47700, allowedOverdueDays: 7,  creditLimit: 200000 },
  { customerId: 'cl2',   currentCredit: -37600, allowedOverdueDays: 15, creditLimit: 150000 },
];

export const policyTickets: PolicyTicket[] = [
  { id: 'tk1', ticketNumber: 'TKR-20260115-A3F9', status: 'completed',     customerId: 'u_biz', product: 'MOU',    duration: '1_year',   coverageStart: '2026-01-20', headcount: 50, discountPerPerson: 90,  totalPrice: 85000, paymentStatus: 'paid',    paidAmount: 85000, priority: 'normal', dueDate: '2026-01-27', publicToken: 'tok_8f2a…', customerCode: '418205', createdBy: 'u_admin', createdAt: '2026-01-15' },
  { id: 'tk2', ticketNumber: 'TKR-20260610-B7C2', status: 'sent_to_thip',  customerId: 'u_biz', product: 'MOTI24', duration: '6_months', coverageStart: '2026-06-20', headcount: 30, discountPerPerson: 0,   totalPrice: 29700, paymentStatus: 'pending', paidAmount: 0,     priority: 'high',   dueDate: '2026-06-27', publicToken: 'tok_2b9d…', customerCode: '739114', createdBy: 'u_admin', createdAt: '2026-06-10' },
  { id: 'tk3', ticketNumber: 'TKR-20260618-C1D8', status: 'draft',         customerId: 'u_biz', product: 'MOU',    duration: '6_months', coverageStart: '2026-07-01', headcount: 20, discountPerPerson: 90,  totalPrice: 18000, paymentStatus: 'pending', paidAmount: 0,     priority: 'normal', dueDate: '2026-07-08', publicToken: 'tok_5e1c…', customerCode: '205837', createdBy: 'u_admin', createdAt: '2026-06-18' },
  { id: 'tk4', ticketNumber: 'TKR-20260605-D4E6', status: 'thip_processing',customerId: 'cl2',  product: 'MOTI24', duration: '1_year',   coverageStart: '2026-06-15', headcount: 40, discountPerPerson: 100, totalPrice: 67600, paymentStatus: 'partial', paidAmount: 30000, priority: 'urgent', dueDate: '2026-06-30', publicToken: 'tok_9a3f…', customerCode: '660421', createdBy: 'u_admin', createdAt: '2026-06-05' },
];

export const crmPayments: CrmPayment[] = [
  { id: 'cp1', paymentDate: '2026-01-22', customerId: 'u_biz', ticketId: 'tk1', amount: 85000, method: 'bank_transfer', referenceNumber: 'TXN-118842', status: 'confirmed' },
  { id: 'cp2', paymentDate: '2026-06-12', customerId: 'cl2',   ticketId: 'tk4', amount: 30000, method: 'k_shop',        referenceNumber: 'KS-558210',  status: 'confirmed' },
];

// append-only ledger: debit on ticket-create, credit on payment (net 0 when paid)
export const creditLedger: CreditTransaction[] = [
  { id: 'ct1', customerId: 'u_biz', ticketId: 'tk1', type: 'debit',  amount: 85000, balanceAfter: -85000, description: 'ซื้อตั๋วประกัน #TKR-20260115-A3F9 (MOU 1 ปี 50 คน)', createdAt: '2026-01-15' },
  { id: 'ct2', customerId: 'u_biz', ticketId: 'tk1', type: 'credit', amount: 85000, balanceAfter: 0,      description: 'คืนเครดิตจากการชำระตั๋วประกัน #TKR-20260115-A3F9', createdAt: '2026-01-22' },
  { id: 'ct3', customerId: 'u_biz', ticketId: 'tk2', type: 'debit',  amount: 29700, balanceAfter: -29700, description: 'ซื้อตั๋วประกัน #TKR-20260610-B7C2 (MOTI24 6 เดือน 30 คน)', createdAt: '2026-06-10' },
  { id: 'ct4', customerId: 'u_biz', ticketId: 'tk3', type: 'debit',  amount: 18000, balanceAfter: -47700, description: 'ซื้อตั๋วประกัน #TKR-20260618-C1D8 (MOU 6 เดือน 20 คน)', createdAt: '2026-06-18' },
  { id: 'ct5', customerId: 'cl2',   ticketId: 'tk4', type: 'debit',  amount: 67600, balanceAfter: -67600, description: 'ซื้อตั๋วประกัน #TKR-20260605-D4E6 (MOTI24 1 ปี 40 คน)', createdAt: '2026-06-05' },
  { id: 'ct6', customerId: 'cl2',   ticketId: 'tk4', type: 'credit', amount: 30000, balanceAfter: -37600, description: 'คืนเครดิตบางส่วนจากการชำระ #TKR-20260605-D4E6', createdAt: '2026-06-12' },
];

export const amendmentTickets: AmendmentTicket[] = [
  { id: 'am1', amendmentType: 'edit_name', customerRef: 'บริษัท ไทยเจริญ ก่อสร้าง จำกัด', policyNumbers: ['MOU-2026-000118', 'MOU-2026-000119'], hasCost: true, pricePerPolicy: 50, totalCost: 100, createdBy: 'u_admin', createdAt: '2026-02-02' },
  { id: 'am2', amendmentType: 'cancel_policy', customerRef: 'คุณวีรพล สุขสันต์ (นอกระบบ)', policyNumbers: ['MOTI24-2026-002041'], hasCost: false, pricePerPolicy: 0, totalCost: 0, createdBy: 'u_admin', createdAt: '2026-05-19' },
];

// tk1 (completed) issued 50 policies; seed a few representative rows.
export const issuedPolicies: IssuedPolicy[] = [
  { id: 'ip1', policyNumber: 'MOU-2026-000118', insuredIdNumber: 'MB1234567', ticketId: 'tk1', product: 'MOU', customerId: 'u_biz', startDate: '2026-01-20', expiryDate: '2027-01-19', issuedAt: '2026-01-23', issuedBy: 'u_admin' },
  { id: 'ip2', policyNumber: 'MOU-2026-000119', insuredIdNumber: 'MB2345678', ticketId: 'tk1', product: 'MOU', customerId: 'u_biz', startDate: '2026-01-20', expiryDate: '2027-01-19', issuedAt: '2026-01-23', issuedBy: 'u_admin' },
  { id: 'ip3', policyNumber: 'MOU-2026-000120', insuredIdNumber: 'LA8821345', ticketId: 'tk1', product: 'MOU', customerId: 'u_biz', startDate: '2026-01-20', expiryDate: '2027-01-19', issuedAt: '2026-01-23', issuedBy: 'u_admin' },
];

// ---- helpers ----
export const getTickets = () => policyTickets;          // policy (CRM) tickets — support inbox uses getSupportTickets
export const getTicket = (id: string) => policyTickets.find(t => t.id === id);
export const getTicketByNumber = (no: string) => policyTickets.find(t => t.ticketNumber === no);
export const getCrmPayments = () => crmPayments;
export const getCreditLedger = (customerId?: string) =>
  customerId ? creditLedger.filter(c => c.customerId === customerId) : creditLedger;
export const getCreditProfile = (customerId: string) => creditProfiles.find(c => c.customerId === customerId);
export const getAmendments = () => amendmentTickets;
export const getIssuedPolicies = (ticketId?: string) =>
  ticketId ? issuedPolicies.filter(p => p.ticketId === ticketId) : issuedPolicies;

// AR aging: bucket each unpaid/partial ticket by dueDate vs today
export function debtorAging(today = new Date('2026-06-24')) {
  const open = policyTickets.filter(t => t.paymentStatus !== 'paid' && t.paymentStatus !== 'refunded');
  const bucketOf = (due?: string) => {
    if (!due) return 'not_due';
    const days = Math.floor((today.getTime() - new Date(due).getTime()) / 86400000);
    if (days < 0) return 'not_due';
    if (days === 0) return 'due_today';
    if (days <= 3) return 'overdue_1_3';
    return 'overdue_gt_3';
  };
  return open.map(t => ({
    ticket: t,
    remaining: t.totalPrice - t.paidAmount,
    bucket: bucketOf(t.dueDate),
  }));
}
export function debtorsByCustomer(today = new Date('2026-06-24')) {
  const rows = debtorAging(today);
  const map = new Map<string, number>();
  rows.forEach(r => map.set(r.ticket.customerId, (map.get(r.ticket.customerId) ?? 0) + r.remaining));
  return [...map.entries()].map(([customerId, outstanding]) => ({ customerId, outstanding }));
}

export function creditDashboard() {
  return {
    lowCredit: creditProfiles.filter(c => c.currentCredit > -1000 && c.currentCredit < 0).length,
    negativeCredit: creditProfiles.filter(c => c.currentCredit < 0).length,
    totalOutstanding: creditProfiles.reduce((s, c) => s + Math.min(0, c.currentCredit), 0),
  };
}

// resolve a CRM customerId → display name (business users prefer company name;
// clients carry their own name). Falls back to the raw id for unknown refs.
export function crmCustomerName(id: string): string {
  const u = users.find(x => x.id === id);
  if (u) return u.company ?? u.name;
  const c = clients.find(x => x.id === id);
  return c?.name ?? id;
}
// customers that carry an internal credit wallet (the AR-tracked accounts)
export const crmCustomers = () =>
  creditProfiles.map(p => ({ id: p.customerId, name: crmCustomerName(p.customerId) }));

// ============================ CONVERSION & TRUST (Phase 17) ============================
// D2C UX upgrade. Coupons/installments/glossary are real config; reviews + trust
// stats are PLACEHOLDERS to be replaced with real, consented, verifiable content.
export const coupons: Coupon[] = [
  { id: 'cpn1', code: 'TKRWORKER300', description: 'ลด ฿300 ต่อกรมธรรม์ประกันแรงงานต่างด้าว', discountType: 'fixed', value: 300, minSpend: 5000, products: ['worker'], expiry: '2026-12-31', active: true },
  { id: 'cpn2', code: 'EVFIRST10',    description: 'ลด 10% ประกันรถ EV ลูกค้าใหม่', discountType: 'percent', value: 10, products: ['auto'], paymentCondition: 'บัตรเครดิต ผ่อน 0% นาน 3 เดือน', expiry: '2026-09-30', active: true },
  { id: 'cpn3', code: 'TRAVEL150',    description: 'ลด ฿150 ประกันเดินทาง', discountType: 'fixed', value: 150, products: ['travel'], expiry: '2026-08-31', active: false },
];

// PLACEHOLDER home banners — SAMPLE campaign copy only, NOT real promo terms.
// CMS-driven (admin → /admin/content/banners). Each slide deep-links into an
// existing flow (worker product, promotions hub, auto compare). Backgrounds are
// Trust-palette CSS gradients until rights-cleared campaign images exist.
export const homeBanners: HomeBanner[] = [
  {
    id: 'hb1',
    title: 'ดูแลทีมแรงงานต่างด้าวครบในที่เดียว',
    subtitle: 'ออกกรมธรรม์เป็นชุด ต่ออายุ และจัดการเอกสารได้เองทั้งหมด (ตัวอย่างเนื้อหา)',
    gradient: 'linear-gradient(120deg,#0b2240 0%,#143a6b 48%,#1f66ee 100%)',
    ctaLabel: 'ดูประกันแรงงานต่างด้าว',
    ctaHref: '/worker-insurance',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    active: true,
    sortOrder: 1,
  },
  {
    id: 'hb2',
    title: 'รวมโปรโมชั่นและคูปองส่วนลด',
    subtitle: 'โค้ดส่วนลดตัวอย่างสำหรับลูกค้าใหม่ — ดูเงื่อนไขทั้งหมดในหน้าโปรโมชั่น (ตัวอย่างเนื้อหา)',
    gradient: 'linear-gradient(120deg,#143a6b 0%,#1f66ee 60%,#3b82f6 100%)',
    ctaLabel: 'ดูโปรโมชั่นทั้งหมด',
    ctaHref: '/promotions',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    active: true,
    sortOrder: 2,
  },
  {
    id: 'hb3',
    title: 'เทียบเบี้ยประกันรถยนต์ออนไลน์',
    subtitle: 'เห็นเบี้ยจากหลายบริษัททันที เลือกแผนที่ใช่ในไม่กี่นาที (ตัวอย่างเนื้อหา)',
    gradient: 'linear-gradient(120deg,#0b2240 0%,#1f3a5f 50%,#c9962f 140%)',
    ctaLabel: 'เทียบเบี้ยประกันรถยนต์',
    ctaHref: '/auto',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    active: true,
    sortOrder: 3,
  },
];

// PLACEHOLDER reviews — replace with real, consented TKR customer feedback.
export const reviews: Review[] = [
  { id: 'rv1', authorLabel: 'ลูกค้า TKR (สำรวจหลังบริการ)', channel: 'survey', product: 'worker', text: 'ออกกรมธรรม์แรงงานเป็นชุดได้เร็ว ไม่ต้องเดินเอกสารเอง', reaction: 'heart', date: '2026-05-30' },
  { id: 'rv2', authorLabel: 'ลูกค้า TKR (สำรวจหลังบริการ)', channel: 'survey', product: 'auto',   text: 'เทียบราคาเองได้ เห็นเบี้ยทันที ไม่มีใครโทรตาม', reaction: 'like', date: '2026-05-12' },
  { id: 'rv3', authorLabel: 'ตัวแทน TKR', channel: 'survey', product: 'worker', text: 'พอร์ทัลตัวแทนดูยอดทีมและคอมมิชชั่นได้ในที่เดียว', reaction: 'celebrate', date: '2026-04-20' },
];

// Real licensed-insurer partner list (31). Names are the proper Thai legal names
// — keep as-is (don't translate). Every partner has a real, rights-cleared logo
// in /public/partner-logos/<id>.png plus a `shortName` (brand shown under/next to
// the logo). `group` lets the UI show them sensibly; `featured` marks the few
// surfaced first (home/shared logo wall). De-duped from the original 32-name list:
// emart→jaymart, msi→msig, bci→kpi merged; wannai removed (no such company).
export const insurerPartners: InsurerPartner[] = [
  { id: 'thip',        name: 'บริษัท ทิพยประกันภัย จำกัด (มหาชน)', shortName: 'ทิพยประกันภัย', group: 1, featured: true, logo: '/partner-logos/thip.png' },
  { id: 'viriyah',     name: 'บริษัท วิริยะประกันภัย จำกัด (มหาชน)', shortName: 'วิริยะประกันภัย', group: 1, featured: true, logo: '/partner-logos/viriyah.png' },
  { id: 'indara',      name: 'บริษัท อินทรประกันภัย จำกัด (มหาชน)', shortName: 'อินทรประกันภัย', group: 1, logo: '/partner-logos/indara.png' },
  { id: 'thaipaiboon', name: 'บริษัท ไทยไพบูลย์ประกันภัย จำกัด (มหาชน)', shortName: 'ไทยไพบูลย์ประกันภัย', group: 1, logo: '/partner-logos/thaipaiboon.png' },
  { id: 'muangthai',   name: 'บริษัท เมืองไทยประกันภัย จำกัด (มหาชน)', shortName: 'เมืองไทยประกันภัย', group: 1, featured: true, logo: '/partner-logos/muangthai.png' },
  { id: 'bki',         name: 'บริษัท กรุงเทพประกันภัย จำกัด (มหาชน)', shortName: 'กรุงเทพประกันภัย', group: 1, featured: true, logo: '/partner-logos/bki.png' },
  { id: 'bui',         name: 'บริษัท บางกอกสหประกันภัย จำกัด (มหาชน)', shortName: 'บางกอกสหประกันภัย', group: 1, logo: '/partner-logos/bui.png' },
  { id: 'lmg',         name: 'บริษัท แอลเอ็มจี ประกันภัย จำกัด (มหาชน)', shortName: 'LMG ประกันภัย', group: 1, logo: '/partner-logos/lmg.png' },
  { id: 'thaivivat',   name: 'บริษัท ประกันภัยไทยวิวัฒน์ จำกัด (มหาชน)', shortName: 'ไทยวิวัฒน์ประกันภัย', group: 1, logo: '/partner-logos/thaivivat.png' },
  { id: 'kwi',         name: 'บริษัท เคดับบลิวไอ ประกันภัย จำกัด (มหาชน)', shortName: 'KWI ประกันภัย', group: 1, logo: '/partner-logos/kwi.png' },

  { id: 'tune',        name: 'บริษัท ทูนประกันภัย จำกัด (มหาชน)', shortName: 'ทูนประกันภัย', group: 2, logo: '/partner-logos/tune.png' },
  { id: 'thanachart',  name: 'บริษัท ธนชาตประกันภัย จำกัด (มหาชน)', shortName: 'ธนชาตประกันภัย', group: 2, logo: '/partner-logos/thanachart.png' },
  { id: 'thaipat',     name: 'บริษัท ไทยพัฒนาประกันภัย จำกัด (มหาชน)', shortName: 'ไทยพัฒนาประกันภัย', group: 2, logo: '/partner-logos/thaipat.png' },
  { id: 'ergo',        name: 'บริษัท เออร์โกประกันภัย (ประเทศไทย) จำกัด (มหาชน)', shortName: 'เออร์โกประกันภัย', group: 2, logo: '/partner-logos/ergo.png' },
  { id: 'tokiomarine', name: 'บริษัท คุ้มภัยโตเกียวมารีนประกันภัย (ประเทศไทย) จำกัด (มหาชน)', shortName: 'โตเกียวมารีนประกันภัย', group: 2, logo: '/partner-logos/tokiomarine.png' },
  { id: 'aig',         name: 'บริษัท เอไอจี ประกันภัย (ประเทศไทย) จำกัด (มหาชน)', shortName: 'AIG ประกันภัย', group: 2, logo: '/partner-logos/aig.png' },
  { id: 'msig',        name: 'บริษัท เอ็มเอสไอจี ประกันภัย (ประเทศไทย) จำกัด (มหาชน)', shortName: 'MSIG ประกันภัย', group: 2, featured: true, logo: '/partner-logos/msig.png' },
  { id: 'deves',       name: 'บริษัท เทเวศประกันภัย จำกัด (มหาชน)', shortName: 'เทเวศประกันภัย', group: 2, logo: '/partner-logos/deves.png' },

  { id: 'rvp',         name: 'บริษัท กลางคุ้มครองผู้ประสบภัยจากรถ จำกัด', shortName: 'บริษัทกลางฯ', group: 3, logo: '/partner-logos/rvp.png' },
  { id: 'navakij',     name: 'บริษัท นวกิจประกันภัย จำกัด (มหาชน)', shortName: 'นวกิจประกันภัย', group: 3, logo: '/partner-logos/navakij.png' },
  { id: 'fwd',         name: 'บริษัท เอฟดับบลิวดี ประกันภัย จำกัด (มหาชน)', shortName: 'FWD ประกันภัย', group: 3, logo: '/partner-logos/fwd.png' },
  { id: 'tsi',         name: 'บริษัท ไทยเศรษฐกิจ ประกันภัย จำกัด (มหาชน)', shortName: 'ไทยเศรษฐกิจประกันภัย', group: 3, logo: '/partner-logos/tsi.png' },
  { id: 'pacificcross',name: 'บริษัท แปซิฟิค ครอส ประกันสุขภาพ จำกัด (มหาชน)', shortName: 'แปซิฟิค ครอส', group: 3, logo: '/partner-logos/pacificcross.png' },
  { id: 'sahasamakkee',name: 'บริษัท ชับบ์สามัคคีประกันภัย จำกัด (มหาชน)', shortName: 'ชับบ์สามัคคีประกันภัย', group: 3, logo: '/partner-logos/sahasamakkee.png' },
  { id: 'ioi',         name: 'บริษัท ไอโออิ กรุงเทพ ประกันภัย จำกัด (มหาชน)', shortName: 'ไอโออิ กรุงเทพ', group: 3, logo: '/partner-logos/ioi.png' },
  { id: 'allianz',     name: 'บริษัท อลิอันซ์ อยุธยา ประกันภัย จำกัด (มหาชน)', shortName: 'อลิอันซ์ อยุธยา', group: 3, featured: true, logo: '/partner-logos/allianz.png' },
  { id: 'sompo',       name: 'บริษัท ซมโปะ ประกันภัย (ประเทศไทย) จำกัด (มหาชน)', shortName: 'ซมโปะ ประกันภัย', group: 3, logo: '/partner-logos/sompo.png' },
  { id: 'mittare',     name: 'บริษัท มิตรแท้ประกันภัย จำกัด (มหาชน)', shortName: 'มิตรแท้ประกันภัย', group: 3, logo: '/partner-logos/mittare.png' },
  { id: 'liberty',     name: 'บริษัท ลิเบอร์ตี้ประกันภัย จำกัด (มหาชน)', shortName: 'ลิเบอร์ตี้ประกันภัย', group: 3, logo: '/partner-logos/liberty.png' },
  { id: 'kpi',         name: 'บริษัท กรุงไทยพานิชประกันภัย จำกัด (มหาชน)', shortName: 'กรุงไทยพานิช (KPI)', group: 3, logo: '/partner-logos/kpi.png' },
  { id: 'jaymart',     name: 'บริษัท เจมาร์ท ประกันภัย จำกัด (มหาชน)', shortName: 'เจมาร์ท ประกันภัย', group: 3, logo: '/partner-logos/jaymart.png' },
];

/** Total partner count — the single source for any "partner count" figure. */
export const insurerPartnerCount = insurerPartners.length; // 31

/** Brand display name for logo tiles/walls — strips the legal prefix/suffix off
 *  the full company name (e.g. "บริษัท ทิพยประกันภัย จำกัด (มหาชน)" → "ทิพยประกันภัย").
 *  Display-only; the stored `name` keeps the full legal name. */
export const insurerShortName = (name: string) =>
  name
    .replace(/^บริษัท\s+/, '')
    .replace(/\s*\(ประเทศไทย\)\s*/, ' ')
    .replace(/\s*จำกัด\s*\(มหาชน\)\s*$/, '')
    .replace(/\s*\(มหาชน\)\s*$/, '')
    .replace(/\s*จำกัด\s*$/, '')
    .trim();

export const glossary: GlossaryTerm[] = [
  { term: 'ทุนประกัน', plain: 'จำนวนเงินสูงสุดที่บริษัทจะจ่ายเมื่อเกิดเหตุ' },
  { term: 'ค่าเสียหายส่วนแรก (Deductible)', plain: 'ส่วนที่เราต้องจ่ายเองก่อน บริษัทจ่ายส่วนที่เหลือ' },
  { term: 'ความคุ้มครอง', plain: 'เหตุการณ์หรือความเสียหายที่กรมธรรม์นี้ดูแลให้' },
  { term: 'เบี้ยประกัน', plain: 'เงินที่เราจ่ายเพื่อซื้อความคุ้มครอง' },
];

export const installmentPlans: InstallmentPlan[] = [
  { months: 0, rate: 0, label: 'ชำระเต็มจำนวน' },
  { months: 3, rate: 0, label: 'ผ่อน 0% นาน 3 เดือน (บัตรเครดิต)' },
  { months: 6, rate: 0, label: 'ผ่อน 0% นาน 6 เดือน (บัตรเครดิต)' },
];

// honest trust stats (use only verifiable numbers in production)
export const trustStats = {
  oicLicense: 'ใบอนุญาตนายหน้าประกันวินาศภัย เลขที่ ว00019/2565 (บริษัท ทีเคอาร์โบรกเกอร์เรจ จำกัด)',  // fill with real license
  insurers: insurerPartnerCount,
  customersServed: 12800,
  claimsPaidPct: 98,
};

export const getCoupons = () => coupons;

/** All banners for the admin CMS, in display order (ignores active/date). */
export const getHomeBanners = () =>
  [...homeBanners].sort((a, b) => a.sortOrder - b.sortOrder);

/** Banners to render on the home carousel: active AND today within
 *  [startDate, endDate], ascending by sortOrder. ISO dates compare
 *  lexicographically. Returns [] when nothing is live (home renders nothing). */
export const getActiveHomeBanners = () => {
  const today = new Date().toISOString().slice(0, 10);
  return homeBanners
    .filter((b) => b.active && b.startDate <= today && today <= b.endDate)
    .sort((a, b) => a.sortOrder - b.sortOrder);
};

// PUBLIC NAV visibility (NAV_VISIBILITY) — data-driven on/off (+ optional
// scheduling) for the marketing top-nav, so menu items can be turned off without
// a deploy. Keyed by the nav entry's `key` (see config/nav.ts `publicNav`). Any
// entry NOT listed here defaults to open, so existing items are unchanged. Admin
// edits under /admin/content/navigation persist as localStorage overrides that
// the public Navbar merges on top of these defaults (see lib/nav-visibility.ts).
export const navSettings: NavSetting[] = [
  // top-level items
  { key: 'products',   isOpen: true },
  { key: 'about',      isOpen: true },
  { key: 'help',       isOpen: true },
  { key: 'promotions', isOpen: true },
  { key: 'articles',   isOpen: true },
  { key: 'contact',    isOpen: true },
  // right-side actions (search + login are core, always on — not listed here)
  { key: 'action:renew',    isOpen: true },
  { key: 'action:agent',    isOpen: true },
  { key: 'action:quoteCta', isOpen: true },
  // footer columns (footer links reuse the nav link keys above → shared flag;
  // footer-only links get their own default here)
  { key: 'footerCol:products', isOpen: true },
  { key: 'footerCol:services', isOpen: true },
  { key: 'footerCol:company',  isOpen: true },
  { key: 'customer',     isOpen: true },
  { key: 'wallet',       isOpen: true },
  { key: 'line',         isOpen: true },
  { key: 'applyAgent',   isOpen: true },
  { key: 'agencyCenter', isOpen: true },
];

/** Seed nav-visibility settings, keyed by entry key (admin merges overrides). */
export const getNavSettings = () => navSettings;

export const getReviews = () => reviews;
export const getInsurerPartners = (opts?: { featuredOnly?: boolean }) =>
  opts?.featuredOnly ? insurerPartners.filter((p) => p.featured) : insurerPartners;
export const getGlossary = () => glossary;
export const getInstallmentPlans = () => installmentPlans;

/** THB discount for a coupon code on a given product + subtotal (0 if it doesn't apply). */
export const applyCoupon = (code: string, product: InsuranceType, subtotal: number): number => {
  const c = coupons.find(x => x.active && x.code === code &&
    (x.products.includes('all') || x.products.includes(product)) &&
    (!x.minSpend || subtotal >= x.minSpend));
  if (!c) return 0;
  return c.discountType === 'percent' ? Math.round(subtotal * c.value / 100) : c.value;
};

// ============================ DECISION TOOLS & PAYMENT (Phase 18) ============================
// Generic PLACEHOLDER plan data only — NO real insurer product numbers. Real plan
// data comes from the admin catalog later. The recommender + plan-card grid +
// checkout payment options reuse these across personal lines and worker.
export const planCards: PlanCard[] = [
  // Worker = ONE ทิพย package (no multi-insurer choice; personal lines keep theirs).
  { id: 'plan_w_ess',  product: 'worker', insurer: 'ทิพยประกันภัย',  planName: 'แพ็กเกจแรงงานต่างด้าว (เจ็บป่วย + อุบัติเหตุ)', highlights: ['IPD สูงสุด 150,000 บาท', 'OPD 1,000 บาท/ครั้ง (สูงสุด 15 ครั้ง/ปี)', 'ไม่ต้องสำรองจ่าย รพ.เครือข่าย'], startingPremium: 500, period: 'ต่อคน/ปี', badge: 'แพ็กเกจเดียว', couponCode: 'TKRWORKER300', favoritable: true },
  { id: 'plan_a_c1',   product: 'auto',   insurer: 'วิริยะประกันภัย', planName: 'รถยนต์ชั้น 1', highlights: ['ซ่อมห้าง/ศูนย์', 'คุ้มครองชน-ไฟไหม้-สูญหาย'], startingPremium: 14200, period: 'ต่อปี', badge: 'แนะนำ', favoritable: true },
  { id: 'plan_a_c2p',  product: 'auto',   insurer: 'MSIG',          planName: 'รถยนต์ชั้น 2+', highlights: ['คุ้มครองคู่กรณี + รถหาย/ไฟไหม้', 'เบี้ยคุ้มค่า'], startingPremium: 7900, period: 'ต่อปี', favoritable: true },
];

export const fitQuestions: FitQuestion[] = [
  { id: 'q1', question: 'คุณต้องการคุ้มครองแบบไหน?', options: [
    { label: 'ครอบคลุมสูงสุด', value: 'max', recommends: 'plan_a_c1' },
    { label: 'คุ้มค่า เน้นคู่กรณี', value: 'value', recommends: 'plan_a_c2p' },
  ]},
  // (worker fit question removed — a single ทิพย package leaves nothing to recommend)
];

export const checkoutOptions: CheckoutOption[] = [
  { method: 'full',             label: 'ชำระเต็มจำนวน' },
  { method: 'card_installment', label: 'ผ่อนบัตรเครดิต 0%', detail: 'สูงสุด 10 งวด', maxInstallments: 10 },
  { method: 'qr_promptpay',     label: 'QR PromptPay', detail: 'ผ่าน Mobile Banking ทุกธนาคาร' },
  { method: 'cash_installment', label: 'ผ่อนเงินสด (ไม่ใช้บัตร)', detail: 'งวดแรก ฿1,000 · ต้องมีพาร์ทเนอร์สินเชื่อ', maxInstallments: 10, partnerRequired: true },
];

// instant coverage on first payment — keep as a configurable note (match the
// actual underwriter terms before production; do NOT hardcode in components).
export const instantCoverage = {
  enabled: true,
  note: 'คุ้มครองทันทีเมื่อชำระงวดแรก — สำหรับรถชั้น 1 ระหว่างรอตรวจสภาพ/อนุมัติ จะได้รับความคุ้มครองแบบชั้น 3 ไปก่อน',
};

// optional tax tools (FEATURES.taxTools) — verify caps against the current tax year
export const taxDeductionCaps: TaxDeductionCap[] = [
  { key: 'health',     label: 'ประกันสุขภาพ',                 cap: 25000 },
  { key: 'lifeHealth', label: 'ประกันชีวิต+สุขภาพ (รวม)',     cap: 100000 },
  { key: 'annuity',    label: 'ประกันบำนาญ (15% ของรายได้)', cap: 200000 },
  { key: 'ssf',        label: 'SSF (30% ของรายได้)',         cap: 200000 },
  { key: 'rmf',        label: 'RMF (30% ของรายได้)',         cap: 500000 },
  { key: 'social',     label: 'ประกันสังคม',                 cap: 9000 },
];

export const getPlanCards = (product?: InsuranceType) =>
  product ? planCards.filter(p => p.product === product) : planCards;
export const getFitQuestions = () => fitQuestions;
export const getCheckoutOptions = () => checkoutOptions;
export const getTaxDeductionCaps = () => taxDeductionCaps;

// ============================ CUSTOMER LOYALTY & REWARDS (Phase 20) ============================
// Points/rewards for consumer customers (individual + guest). Ledger is append-
// only with a running balanceAfter; the account balance/lifetime are DERIVED from
// the ledger so they can never drift. `description` is Thai (mock authoring).

// u_indiv ledger — oldest → newest. balanceAfter is the running balance.
export const pointsLedger: PointsEntry[] = [
  { id: 'pt1',  customerId: 'u_indiv', type: 'earn', source: 'purchase',         points: 900,  balanceAfter: 900,  description: 'ได้แต้มจากการซื้อประกันอุบัติเหตุ (PA) ครอบครัว (เบี้ย ฿90,000)', date: '2026-01-01', ref: 'TKR-PA-2026-008700' },
  { id: 'pt2',  customerId: 'u_indiv', type: 'earn', source: 'profile_complete', points: 100,  balanceAfter: 1000, description: 'กรอกข้อมูลโปรไฟล์ครบถ้วน', date: '2026-01-02' },
  { id: 'pt3',  customerId: 'u_indiv', type: 'earn', source: 'social_link',      points: 50,   balanceAfter: 1050, description: 'เชื่อมบัญชี LINE', date: '2026-01-03' },
  { id: 'pt4',  customerId: 'u_indiv', type: 'earn', source: 'no_claim',         points: 300,  balanceAfter: 1350, description: 'ครบปีไม่มีการเคลม', date: '2026-01-15' },
  { id: 'pt5',  customerId: 'u_indiv', type: 'earn', source: 'purchase',         points: 142,  balanceAfter: 1492, description: 'ได้แต้มจากการซื้อประกันรถยนต์ชั้น 1 (เบี้ย ฿14,200)', date: '2026-02-20', ref: 'TKR-A-2026-022104' },
  { id: 'pt6',  customerId: 'u_indiv', type: 'earn', source: 'social_link',      points: 50,   balanceAfter: 1542, description: 'เชื่อมบัญชี Facebook', date: '2026-02-22' },
  { id: 'pt7',  customerId: 'u_indiv', type: 'earn', source: 'referral',         points: 300,  balanceAfter: 1842, description: 'แนะนำเพื่อนสมัครสำเร็จ', date: '2026-03-10', ref: 'REF-7781' },
  { id: 'pt8',  customerId: 'u_indiv', type: 'earn', source: 'renewal',          points: 200,  balanceAfter: 2042, description: 'ต่ออายุกรมธรรม์', date: '2026-03-20' },
  { id: 'pt9',  customerId: 'u_indiv', type: 'earn', source: 'birthday',         points: 100,  balanceAfter: 2142, description: 'โบนัสวันเกิด', date: '2026-04-01' },
  { id: 'pt10', customerId: 'u_indiv', type: 'earn', source: 'purchase',         points: 220,  balanceAfter: 2362, description: 'ได้แต้มจากการซื้อประกันอุบัติเหตุ (PA) (เบี้ย ฿22,000)', date: '2026-04-10', ref: 'TKR-PA-2026-008877' },
  { id: 'pt11', customerId: 'u_indiv', type: 'earn', source: 'purchase',         points: 188,  balanceAfter: 2550, description: 'ได้แต้มจากการซื้อประกันรถยนต์ (เบี้ย ฿18,800)', date: '2026-04-18', ref: 'TKR-A-2026-022590' },
  { id: 'pt12', customerId: 'u_indiv', type: 'earn', source: 'review',           points: 50,   balanceAfter: 2600, description: 'รีวิวหลังใช้บริการ', date: '2026-05-01' },
  { id: 'pt13', customerId: 'u_indiv', type: 'earn', source: 'survey',           points: 30,   balanceAfter: 2630, description: 'ทำแบบสอบถามความพึงพอใจ', date: '2026-05-08' },
  { id: 'pt14', customerId: 'u_indiv', type: 'earn', source: 'mission',          points: 20,   balanceAfter: 2650, description: 'ทำภารกิจประจำเดือนสำเร็จ', date: '2026-05-15' },
  { id: 'pt15', customerId: 'u_indiv', type: 'redeem',                           points: -1200, balanceAfter: 1450, description: 'แลก e-voucher ร้านกาแฟ ฿100', date: '2026-05-20', ref: 'RWD-rw_coffee' },
];

function buildLoyaltyAccount(customerId: string, ledger: PointsEntry[]): LoyaltyAccount {
  const rows = ledger.filter(e => e.customerId === customerId);
  const lifetimePoints = rows.filter(e => e.points > 0).reduce((s, e) => s + e.points, 0);
  const balance = rows.reduce((s, e) => s + e.points, 0);
  return { customerId, balance, lifetimePoints, tier: memberTierOf(lifetimePoints) };
}

export const loyaltyAccounts: LoyaltyAccount[] = [
  buildLoyaltyAccount('u_indiv', pointsLedger),
];

export const rewards: Reward[] = [
  { id: 'rw_coffee',  name: 'rwCoffee',  type: 'voucher',          cost: 1200, value: 100, active: true },
  { id: 'rw_gift',    name: 'rwGift',    type: 'gift',             cost: 1500,             active: true },
  { id: 'rw_endorse', name: 'rwEndorse', type: 'service',          cost: 800,              active: true, minTier: 'silver' },
  { id: 'rw_voucher', name: 'rwVoucher', type: 'voucher',          cost: 2500, value: 250, active: true, minTier: 'gold' },
  { id: 'rw_premium', name: 'rwPremium', type: 'premium_discount', cost: 2000, value: 200, active: true, requiresLegalReview: true },
  { id: 'rw_donate',  name: 'rwDonate',  type: 'donation',         cost: 500,              active: true },
];

export const redemptions: Redemption[] = [
  { id: 'rd1', customerId: 'u_indiv', rewardId: 'rw_coffee', pointsSpent: 1200, code: 'TKR-CAFE-8842', status: 'used', date: '2026-05-20' },
];

export const getLoyalty = (customerId: string) =>
  loyaltyAccounts.find(a => a.customerId === customerId);
export const getPointsLedger = (customerId: string) =>
  pointsLedger.filter(e => e.customerId === customerId);
/** Active rewards; premium-discount entries are hidden unless the feature flag is on. */
export const getRewards = () =>
  rewards.filter(r => r.active && (FEATURES_LOYALTY.pointsToPremiumDiscount || r.type !== 'premium_discount'));
/** Admin view — every reward incl. inactive + legal-gated premium_discount. */
export const getAllRewards = () => rewards;
export const getRedemptions = (customerId?: string) =>
  customerId ? redemptions.filter(r => r.customerId === customerId) : redemptions;
export const getReward = (id: string) => rewards.find(r => r.id === id);
export { redeemGuard } from '@/config/loyalty';

/** Platform-wide loyalty figures for the admin dashboard / liability tracking. */
export function loyaltyStats() {
  const members = loyaltyAccounts.length;
  const liability = loyaltyAccounts.reduce((s, a) => s + a.balance, 0); // outstanding spendable points
  const redeemed = redemptions.reduce((s, r) => s + r.pointsSpent, 0);
  return { members, liability, redeemed, outstanding: liability };
}
