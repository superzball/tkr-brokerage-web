// src/lib/mock/seed.ts
// Realistic seed data so every portal screen renders populated and clickable.
// Thai names, real-looking policy numbers, THB amounts. No backend.
// Access data only through the helpers at the bottom so a real API can replace
// them later without touching screens.

import type {
  User, Policy, Worker, Claim, Invoice, DocItem,
  Client, Commission, Lead, AgentTierInfo, Notification, Role,
} from '@/types/portal';

// ============================ USERS (demo accounts) ============================
export const users: User[] = [
  { id: 'u_biz',   role: 'business',   name: 'คุณสมชาย เจริญทรัพย์', company: 'บริษัท ไทยเจริญ ก่อสร้าง จำกัด', email: 'business@tkr.demo', phone: '081-000-0001', avatarColor: '#1f66ee' },
  { id: 'u_indiv', role: 'individual', name: 'คุณนภัสสร วงศ์ดี',       email: 'me@tkr.demo',       phone: '081-000-0002', avatarColor: '#0f52c7' },
  { id: 'u_agent', role: 'agent',      name: 'คุณธนกร พาณิชย์',         email: 'agent@tkr.demo',    phone: '081-000-0003', avatarColor: '#e89c12' },
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
export const leads: Lead[] = [
  { id: 'l1', name: 'บริษัท บูรพา ขนส่ง จำกัด',  contact: '086-221-3344', interest: 'worker', stage: 'new',       value: 88000, createdDate: '2026-06-18' },
  { id: 'l2', name: 'หจก. รุ่งโรจน์ ก่อสร้าง',   contact: '089-552-1100', interest: 'worker', stage: 'contacted', value: 145000, createdDate: '2026-06-14' },
  { id: 'l3', name: 'คุณอาทิตย์ แสงทอง',         contact: '081-334-7788', interest: 'auto',   stage: 'quoted',    value: 16500, createdDate: '2026-06-10' },
  { id: 'l4', name: 'บริษัท นครชัย พลาสติก',     contact: '092-110-9988', interest: 'fire',   stage: 'quoted',    value: 31000, createdDate: '2026-06-05' },
  { id: 'l5', name: 'คุณมณีรัตน์ ทองคำ',         contact: '083-447-2299', interest: 'health', stage: 'won',       value: 24000, createdDate: '2026-05-28' },
  { id: 'l6', name: 'ร้าน สมหวัง การช่าง',       contact: '087-665-1122', interest: 'worker', stage: 'lost',      value: 42000, createdDate: '2026-05-20' },
];

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
