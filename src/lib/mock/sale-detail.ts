// src/lib/mock/sale-detail.ts
// Deterministic per-product detail derived from an AgentSale (mock — a real
// backend would return the actual policy + insured items). Pure functions so
// server and client compute identical results.

import type { AgentSale, Nationality } from "@/types/portal";

const seedOf = (id: string) => [...id].reduce((a, c) => a + c.charCodeAt(0), 0);
const pick = <T,>(arr: T[], n: number): T => arr[((n % arr.length) + arr.length) % arr.length]!;

export function salePolicyNo(sale: AgentSale): string {
  const prefix = { worker: "W", auto: "A", travel: "T", pa: "PA", fire: "F" }[sale.product];
  const year = sale.date.slice(0, 4);
  const n = 100000 + (seedOf(sale.id) * 7919) % 900000;
  return `TKR-${prefix}-${year}-${n}`;
}

export function salePeriod(sale: AgentSale): { start: string; end: string } {
  const d = new Date(sale.date);
  d.setFullYear(d.getFullYear() + 1);
  return { start: sale.date, end: d.toISOString().slice(0, 10) };
}

// ── worker roster ──
const WORKER_NAMES = [
  "Aung Min", "Thuza Win", "Somsak Vilay", "Chan Dara", "Khin Maung", "Bounmy Sysouk",
  "Nyein Aye", "Vannak Sok", "Hla Myo", "Kyaw Soe", "Souk Phan", "Dara Chea",
  "Min Thant", "Zaw Lin", "Noy Keo", "Pich Sok",
];
const NATS: Nationality[] = ["พม่า", "ลาว", "กัมพูชา"];
const PASS_PREFIX: Record<Nationality, string> = { "พม่า": "MB", "ลาว": "LA", "กัมพูชา": "KH" };
const JOBS = ["ก่อสร้าง", "ช่างไม้", "ขนส่ง", "ช่างเชื่อม", "แม่บ้าน", "เกษตร"];

export type SaleWorker = { name: string; nationality: Nationality; passport: string; job: string };

/** Worker count is inferred from premium (~฿500/person/yr), capped for display. */
export function saleWorkerCount(sale: AgentSale): number {
  return Math.max(1, Math.min(320, Math.round(sale.premium / 500)));
}

export function saleWorkers(sale: AgentSale, limit = 50): SaleWorker[] {
  const seed = seedOf(sale.id);
  const count = Math.min(saleWorkerCount(sale), limit);
  return Array.from({ length: count }, (_, i) => {
    const nationality = pick(NATS, seed + i);
    return {
      name: `${pick(WORKER_NAMES, seed + i)}${i > WORKER_NAMES.length ? ` ${Math.floor(i / WORKER_NAMES.length)}` : ""}`,
      nationality,
      passport: `${PASS_PREFIX[nationality]}${1000000 + ((seed + i) * 7919) % 9000000}`,
      job: pick(JOBS, seed + i),
    };
  });
}

// ── auto ──
const CAR_BRANDS = ["Toyota", "Honda", "Mazda", "Isuzu", "Mercedes-Benz"];
const CAR_MODELS = ["Yaris Ativ", "Vios", "Corolla Altis", "Camry", "City"];
const PLATE_TH = ["กก", "ขข", "คค", "งง", "จจ"];

export function saleVehicle(sale: AgentSale) {
  const s = seedOf(sale.id);
  return {
    brand: pick(CAR_BRANDS, s),
    model: pick(CAR_MODELS, s + 1),
    year: 2019 + (s % 6),
    plate: `${1 + (s % 9)}${pick(PLATE_TH, s)}-${1000 + (s * 13) % 9000}`,
    repair: s % 2 === 0 ? "garage" : "dealer",
    sumInsured: pick([500000, 700000, 1000000], s),
    deductible: pick([0, 2000, 5000], s),
  };
}

// ── travel ──
const DESTINATIONS = ["ญี่ปุ่น", "เกาหลีใต้", "สิงคโปร์", "ยุโรป", "ออสเตรเลีย"];
export function saleTravel(sale: AgentSale) {
  const s = seedOf(sale.id);
  return {
    destination: pick(DESTINATIONS, s),
    days: pick([5, 7, 10, 14], s),
    travellers: 1 + (s % 4),
    sumInsured: pick([1000000, 3000000, 5000000], s),
  };
}

// ── pa (personal accident) ──
export function salePA(sale: AgentSale) {
  const s = seedOf(sale.id);
  return {
    insured: sale.clientName,
    age: 25 + (s % 40),
    plan: pick(["basic", "standard", "premium"], s),
    sumInsured: pick([500000, 1500000, 5000000], s),
  };
}

// ── fire ──
export function saleFire(sale: AgentSale) {
  const s = seedOf(sale.id);
  return {
    property: pick(["house", "condo", "commercial"], s),
    sumInsured: pick([1000000, 3000000, 8000000], s),
    address: `${10 + (s % 200)} ถนนสุขุมวิท กรุงเทพฯ`,
  };
}
