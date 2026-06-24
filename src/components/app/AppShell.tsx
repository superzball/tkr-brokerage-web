// src/components/app/AppShell.tsx
// Authenticated layout frame: fixed sidebar on desktop, slide-in Drawer on
// mobile, TopBar + scrollable content. Role drives the sidebar contents.

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Role } from "@/types/portal";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { Drawer } from "./Drawer";

export function AppShell({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const t = useTranslations("app");

  return (
    <div className="min-h-screen lg:flex bg-[#f6f9fe]">
      <Sidebar role={role} className="hidden lg:flex sticky top-0 h-screen" />

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        side="left"
        label={t("menu")}
      >
        <Sidebar
          role={role}
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
