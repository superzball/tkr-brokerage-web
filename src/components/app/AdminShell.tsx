// src/components/app/AdminShell.tsx
// Back-office layout frame (Phase 14). Same chrome as AppShell, but renders an
// RBAC-filtered nav (computed server-side from the staff user) instead of a
// role's full IA. A subtle top accent distinguishes the staff console.

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { NavSection } from "@/types/portal";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { Drawer } from "./Drawer";

export function AdminShell({
  sections,
  children,
}: {
  sections: NavSection[];
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const t = useTranslations("app");

  return (
    // Phase 19: premium visual zone (back-office console).
    <div data-theme="premium" className="min-h-screen lg:flex bg-[#f6f9fe]">
      <Sidebar
        sections={sections}
        className="hidden lg:flex sticky top-0 h-screen"
      />

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        side="left"
        label={t("menu")}
      >
        <Sidebar
          sections={sections}
          className="w-full border-r-0"
          onNavigate={() => setDrawerOpen(false)}
        />
      </Drawer>

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onMenu={() => setDrawerOpen(true)} />
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
