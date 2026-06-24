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
} from '@/types/portal';

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
  { id: 'p2', policyNo: 'TKR-W-2026-004955', type: 'worker', status: 'expiring', insurer: 'วิริยะประกันภัย',   holderId: 'u_biz', premium: 36000,  coverage: 500000,  workersCount: 72,  startDate: '2025-07-10', endDate: '2026-07-09' },
  { id: 'p3', policyNo: 'TKR-F-2026-001203', type: 'fire',   status: 'active',   insurer: 'กรุงเทพประกันภัย',  holderId: 'u_biz', premium: 18500,  coverage: 8000000, startDate: '2026-03-01', endDate: '2027-02-28' },
  // individual — personal lines
  { id: 'p4', policyNo: 'TKR-A-2026-022104', type: 'auto',   status: 'active',   insurer: 'วิริยะประกันภัย',   holderId: 'u_indiv', premium: 14200, coverage: 1000000, startDate: '2026-02-20', endDate: '2027-02-19' },
  { id: 'p5', policyNo: 'TKR-H-2026-008877', type: 'health', status: 'active',   insurer: 'เมืองไทยประกันภัย', holderId: 'u_indiv', premium: 22000, coverage: 1500000, startDate: '2026-01-01', endDate: '2026-12-31' },
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
  { id: 'l5', name: 'คุณมณีรัตน์ ทองคำ',         contact: '083-447-2299', interest: 'health', stage: 'won',       value: 24000, createdDate: '2026-05-28' },
  { id: 'l6', name: 'ร้าน สมหวัง การช่าง',       contact: '087-665-1122', interest: 'worker', stage: 'lost',      value: 42000, createdDate: '2026-05-20' },
];

// Deterministic generator (index-based, NO randomness) so the server and client
// bundles build the identical array — avoids hydration mismatch.
const LEAD_NAME_POOL = [
  'บริษัท ไทยรุ่งเรือง', 'หจก. ศรีสมบูรณ์', 'ร้าน ก้าวหน้าพาณิชย์', 'บริษัท สยามอุตสาหกรรม',
  'คุณประเสริฐ ทรัพย์มาก', 'คุณสุภาพร ดีงาม', 'บริษัท เจริญยนต์', 'หจก. มงคลก่อสร้าง',
  'คุณวีระศักดิ์ ใจกล้า', 'ร้าน รวมมิตรวัสดุ', 'บริษัท บางกอกโลจิสติกส์', 'คุณอรทัย พูนสุข',
];
const LEAD_INTERESTS: InsuranceType[] = ['worker', 'auto', 'travel', 'health', 'fire'];
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
  { id: 's5', date: '2026-05-28', clientName: 'คุณพิมพ์ชนก ใจงาม',               product: 'health', premium: 22000,  commission: 2200,  status: 'issued' },
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
  { id: 'a1', title: 'ประกันแรงงานต่างด้าวปี 2569 ต้องรู้อะไรบ้าง', slug: 'foreign-worker-insurance-2026', status: 'published', category: 'ความรู้ประกัน', author: 'ทีม TKR', locales: ['th','en'], publishedAt: '2026-06-01', seo: { metaTitle: 'ประกันแรงงานต่างด้าว 2569 | TKR', metaDescription: 'คู่มือฉบับสมบูรณ์เรื่องประกันแรงงานต่างด้าวสำหรับนายจ้าง' } },
  { id: 'a2', title: '5 ข้อควรรู้ก่อนต่ออายุประกันรถยนต์', slug: 'car-insurance-renewal-tips', status: 'published', category: 'ประกันรถยนต์', author: 'ทีม TKR', locales: ['th'], publishedAt: '2026-05-18', seo: { metaTitle: 'ต่อประกันรถยนต์อย่างไรให้คุ้ม | TKR', metaDescription: 'เคล็ดลับเลือกและต่อประกันรถยนต์' } },
  { id: 'a3', title: 'Worker Wallet คืออะไร ใช้งานอย่างไร', slug: 'what-is-worker-wallet', status: 'scheduled', category: 'ผลิตภัณฑ์', author: 'ทีม TKR', locales: ['th','my','lo'], publishedAt: '2026-07-01', seo: { metaTitle: 'Worker Wallet | TKR', metaDescription: 'กระเป๋าดิจิทัลสำหรับแรงงาน' } },
  { id: 'a4', title: 'ร่างประกาศโปรโมชั่นกลางปี', slug: 'mid-year-promo', status: 'draft', category: 'โปรโมชั่น', author: 'ทีม TKR', locales: ['th'], seo: { metaTitle: '', metaDescription: '' } },
];

export const orders: Order[] = [
  { id: 'o1', orderNo: 'ORD-2026-1188', customerName: 'บริษัท บูรพา ขนส่ง จำกัด', customerType: 'business', product: 'worker', premium: 88000, status: 'awaiting_payment', channel: 'phone', createdBy: 'u_admin', createdDate: '2026-06-20' },
  { id: 'o2', orderNo: 'ORD-2026-1175', customerName: 'คุณอาทิตย์ แสงทอง', customerType: 'individual', product: 'auto', premium: 16500, status: 'issued', channel: 'line', createdBy: 'u_admin', createdDate: '2026-06-15' },
  { id: 'o3', orderNo: 'ORD-2026-1162', customerName: 'ร้าน ก.รุ่งเรืองวัสดุ', customerType: 'business', product: 'fire', premium: 24000, status: 'issued', channel: 'walk_in', createdBy: 'u_admin', createdDate: '2026-06-09' },
  { id: 'o4', orderNo: 'ORD-2026-1150', customerName: 'คุณมณีรัตน์ ทองคำ', customerType: 'individual', product: 'health', premium: 24000, status: 'draft', channel: 'phone', createdBy: 'u_admin', createdDate: '2026-06-05' },
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
  { id: 'pp1', product: 'worker', planName: 'แรงงาน Essential', insurer: 'ทิพยประกันภัย',   coverage: 500000,  basePremium: 500,  active: true },
  { id: 'pp2', product: 'worker', planName: 'แรงงาน Plus',      insurer: 'วิริยะประกันภัย',  coverage: 1000000, basePremium: 850,  active: true },
  { id: 'pp3', product: 'auto',   planName: 'รถยนต์ชั้น 1',      insurer: 'วิริยะประกันภัย',  coverage: 1000000, basePremium: 14200, active: true },
  { id: 'pp4', product: 'health', planName: 'สุขภาพเหมาจ่าย',    insurer: 'เมืองไทยประกันภัย', coverage: 1500000, basePremium: 22000, active: true },
  { id: 'pp5', product: 'fire',   planName: 'อัคคีภัยธุรกิจ',    insurer: 'กรุงเทพประกันภัย',  coverage: 8000000, basePremium: 18500, active: false },
];

export const auditLog: AuditEntry[] = [
  { id: 'au1', actor: 'คุณกานต์ ผู้ดูแลระบบ', action: 'สร้างออเดอร์แทนลูกค้า', target: 'ORD-2026-1188', time: '2026-06-20T14:22:00+07:00' },
  { id: 'au2', actor: 'คุณปาริชาต ฝ่ายปฏิบัติการ', action: 'อนุมัติเคลม', target: 'CLM-2026-09887', time: '2026-06-21T10:05:00+07:00' },
  { id: 'au3', actor: 'คุณธีรเดช คอนเทนต์', action: 'เผยแพร่บทความ', target: 'foreign-worker-insurance-2026', time: '2026-06-01T09:00:00+07:00' },
];

// helpers
export const getArticles = () => articles;
export const getOrders = () => orders;
export const getStaff = () => staffUsers;
export const getTickets = () => tickets;
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
  { id: 'cr6', product: 'health', tier: 'Gold',     rate: 15, active: true },
  { id: 'cr7', product: 'fire',   tier: 'Diamond',  rate: 16, active: false },
];

export const getCmsPages = () => cmsPages;
export const getFaqs = (pageId?: string) =>
  pageId ? faqs.filter(f => f.pageId === pageId) : faqs;
export const getMedia = () => mediaAssets;
export const getRedirects = () => redirects;
export const getCommissionRules = () => commissionRules;
