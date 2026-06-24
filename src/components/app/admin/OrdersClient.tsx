// src/components/app/admin/OrdersClient.tsx
// Platform view of every order: seed back-office orders + agent-originated
// sales (AgentSale) + on-behalf orders created this session (localStorage).
// One orders table feeds both portals — a real backend folds these together.

"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { AgentSale, Order, OrderStatus } from "@/types/portal";
import { AdminTable, type AdminCol, type AdminRow } from "./AdminTable";
import { orderTone } from "./badges";
import { readLocalOrders } from "@/lib/mock/local-admin";

// agent SaleStatus → order status (the reconcile mapping)
const SALE_TO_ORDER: Record<AgentSale["status"], OrderStatus> = {
  issued: "issued",
  pending: "awaiting_payment",
  cancelled: "cancelled",
};

export function OrdersClient({
  orders,
  agentSales,
}: {
  orders: Order[];
  agentSales: AgentSale[];
}) {
  const t = useTranslations("admin.orders");
  const tc = useTranslations("admin.channel");
  const ts = useTranslations("admin.status");
  const ty = useTranslations("business.type");

  // localStorage is client-only — read after mount to avoid hydration mismatch.
  const [local, setLocal] = useState<Order[]>([]);
  useEffect(() => setLocal(readLocalOrders()), []);

  const cols: AdminCol[] = [
    { key: "orderNo", header: t("col.orderNo"), kind: "mono" },
    { key: "customer", header: t("col.customer") },
    { key: "product", header: t("col.product") },
    { key: "premium", header: t("col.premium"), align: "right", kind: "baht" },
    { key: "channel", header: t("col.channel") },
    { key: "source", header: t("col.source") },
    { key: "status", header: t("col.status"), kind: "badge" },
    { key: "date", header: t("col.date") },
  ];

  const orderRow = (o: Order, source: string): AdminRow => ({
    id: o.id,
    orderNo: o.orderNo,
    customer: o.customerName,
    product: ty(o.product),
    premium: o.premium,
    channel: tc(o.channel),
    source,
    status: { label: ts(o.status), tone: orderTone[o.status] },
    date: o.createdDate,
  });

  const rows: AdminRow[] = [
    ...local.map((o) => orderRow(o, t("sourceAdmin"))),
    ...orders.map((o) => orderRow(o, t("sourceAdmin"))),
    ...agentSales.map((s) => {
      const st = SALE_TO_ORDER[s.status];
      return {
        id: s.id,
        orderNo: s.id.toUpperCase(),
        customer: s.clientName,
        product: ty(s.product),
        premium: s.premium,
        channel: "—",
        source: t("sourceAgent"),
        status: { label: ts(st), tone: orderTone[st] },
        date: s.date,
      } satisfies AdminRow;
    }),
  ];

  return <AdminTable columns={cols} rows={rows} empty={t("empty")} pageSize={15} />;
}
