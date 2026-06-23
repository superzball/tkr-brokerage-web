"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { DataTable, type Column } from "@/components/app/DataTable";
import { FilterBar } from "@/components/app/FilterBar";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Tabs } from "@/components/app/Tabs";
import { Modal } from "@/components/app/Modal";
import { Input, Select, DatePicker } from "@/components/app/form";
import { useToast } from "@/components/app/toast";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { BulkUpload } from "@/components/worker/BulkUpload";
import type { Worker, Nationality } from "@/types/portal";
import { workerTone } from "./status";

type Tab = "roster" | "bulk";
const NATIONALITIES: Nationality[] = ["พม่า", "ลาว", "กัมพูชา"];
const STATUSES: Worker["status"][] = ["covered", "pending", "expired"];

export function WorkersClient({
  workers,
  policies,
}: {
  workers: Worker[];
  policies: { id: string; policyNo: string }[];
}) {
  const t = useTranslations("business");
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("roster");
  const [search, setSearch] = useState("");
  const [nat, setNat] = useState<"all" | Nationality>("all");
  const [status, setStatus] = useState<"all" | Worker["status"]>("all");
  const [editing, setEditing] = useState<Worker | "new" | null>(null);

  const policyNo = useMemo(
    () => Object.fromEntries(policies.map((p) => [p.id, p.policyNo])),
    [policies],
  );

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return workers.filter((w) => {
      if (nat !== "all" && w.nationality !== nat) return false;
      if (status !== "all" && w.status !== status) return false;
      if (!q) return true;
      return (
        w.name.toLowerCase().includes(q) ||
        w.passport.toLowerCase().includes(q)
      );
    });
  }, [workers, search, nat, status]);

  const columns: Column<Worker>[] = [
    {
      key: "name",
      header: t("workers.col.name"),
      sortValue: (w) => w.name,
      render: (w) => <span className="font-600 text-ink-900">{w.name}</span>,
    },
    {
      key: "nationality",
      header: t("workers.col.nationality"),
      sortValue: (w) => w.nationality,
    },
    {
      key: "passport",
      header: t("workers.col.passport"),
      render: (w) => <span className="tabnum">{w.passport}</span>,
    },
    { key: "job", header: t("workers.col.job") },
    {
      key: "policy",
      header: t("workers.col.policy"),
      render: (w) =>
        w.policyId ? policyNo[w.policyId] : (
          <span className="text-ink-400">{t("workers.unassigned")}</span>
        ),
    },
    {
      key: "status",
      header: t("workers.col.status"),
      sortValue: (w) => w.status,
      render: (w) => (
        <StatusBadge tone={workerTone[w.status]}>
          {t(`workerStatus.${w.status}`)}
        </StatusBadge>
      ),
    },
    {
      key: "actions",
      header: t("common.actions"),
      align: "right",
      render: (w) => (
        <button
          type="button"
          onClick={() => setEditing(w)}
          className="btn btn-ghost btn-sm"
        >
          <Icon name="eye" size={16} /> {t("workers.edit")}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <Tabs<Tab>
        tabs={[
          { key: "roster", label: t("workers.tabRoster") },
          { key: "bulk", label: t("workers.tabBulk") },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === "roster" ? (
        <div className="space-y-4">
          <FilterBar
            search={search}
            onSearch={setSearch}
            placeholder={t("workers.searchPlaceholder")}
          >
            <Select
              value={nat}
              onChange={(e) => setNat(e.target.value as typeof nat)}
              className="w-auto"
            >
              <option value="all">{t("workers.filterNat")}</option>
              {NATIONALITIES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </Select>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
              className="w-auto"
            >
              <option value="all">{t("workers.filterStatus")}</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {t(`workerStatus.${s}`)}
                </option>
              ))}
            </Select>
            <Button
              variant="primary"
              size="md"
              onClick={() => setEditing("new")}
            >
              <Icon name="plus" /> {t("workers.add")}
            </Button>
          </FilterBar>

          <DataTable
            columns={columns}
            rows={rows}
            getRowKey={(w) => w.id}
            labels={{
              empty: t("workers.empty"),
              prev: t("common.prev"),
              next: t("common.next"),
              range: (from, to, total) => t("common.range", { from, to, total }),
            }}
          />
        </div>
      ) : (
        <BulkUpload onSwitchSingle={() => setTab("roster")} />
      )}

      <Modal
        open={editing != null}
        onClose={() => setEditing(null)}
        title={editing === "new" ? t("workers.addTitle") : t("workers.editTitle")}
        footer={
          <>
            <Button variant="ghost" size="md" onClick={() => setEditing(null)}>
              {t("common.cancel")}
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                toast(
                  editing === "new" ? t("workers.added") : t("workers.updated"),
                  "success",
                );
                setEditing(null);
              }}
            >
              {t("common.save")}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label={t("workers.form.name")}
            defaultValue={editing && editing !== "new" ? editing.name : ""}
          />
          <Input
            label={t("workers.form.passport")}
            defaultValue={editing && editing !== "new" ? editing.passport : ""}
          />
          <Select
            label={t("workers.form.nationality")}
            defaultValue={
              editing && editing !== "new" ? editing.nationality : "พม่า"
            }
          >
            {NATIONALITIES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </Select>
          <DatePicker
            label={t("workers.form.dob")}
            defaultValue={editing && editing !== "new" ? editing.dob : ""}
          />
          <Input
            label={t("workers.form.job")}
            defaultValue={editing && editing !== "new" ? editing.job : ""}
          />
        </div>
      </Modal>
    </div>
  );
}
