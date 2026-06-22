// src/config/portal-nav.ts
// Role-aware sidebar navigation. Labels are i18n keys under the `nav`
// namespace (see messages snippet). Icons are lucide-react names resolved
// by the shared <Icon/> component.
//
// URL scheme: one authenticated area at /app/* (the (app) route group).
// A user has exactly one role, so the Sidebar renders portalNav[role].
// Routes not listed for a role are guarded (403/redirect).

import type { NavSection, Role } from '@/types/portal';

const help: NavSection = {
  key: 'support',
  items: [
    { key: 'help',     href: '/app/help',     icon: 'LifeBuoy' },
    { key: 'settings', href: '/app/settings', icon: 'Settings' },
  ],
};

export const portalNav: Record<Role, NavSection[]> = {
  // ---- Business / Employer (core: foreign-worker insurance) ----
  business: [
    {
      items: [
        { key: 'dashboard', href: '/app/dashboard', icon: 'LayoutDashboard' },
        { key: 'policies',  href: '/app/policies',  icon: 'ShieldCheck' },
        { key: 'workers',   href: '/app/workers',   icon: 'Users' },
        { key: 'buy',       href: '/app/buy',       icon: 'ShoppingCart' },
        { key: 'claims',    href: '/app/claims',    icon: 'ClipboardList' },
      ],
    },
    {
      key: 'manage',
      items: [
        { key: 'billing',   href: '/app/billing',   icon: 'CreditCard' },
        { key: 'documents', href: '/app/documents', icon: 'FolderOpen' },
        { key: 'wallet',    href: '/app/wallet',    icon: 'Wallet' },
      ],
    },
    help,
  ],

  // ---- Individual (personal lines: auto/travel/health/fire) ----
  individual: [
    {
      items: [
        { key: 'dashboard', href: '/app/dashboard', icon: 'LayoutDashboard' },
        { key: 'policies',  href: '/app/policies',  icon: 'ShieldCheck' },
        { key: 'buy',       href: '/app/buy',       icon: 'ShoppingCart' },
        { key: 'claims',    href: '/app/claims',    icon: 'ClipboardList' },
      ],
    },
    {
      key: 'manage',
      items: [
        { key: 'billing',   href: '/app/billing',   icon: 'CreditCard' },
        { key: 'documents', href: '/app/documents', icon: 'FolderOpen' },
      ],
    },
    help,
  ],

  // ---- Agent / Sub-broker ----
  agent: [
    {
      items: [
        { key: 'dashboard',   href: '/app/dashboard',   icon: 'LayoutDashboard' },
        { key: 'clients',     href: '/app/clients',     icon: 'Users' },
        { key: 'quote',       href: '/app/quote',       icon: 'FileText' },
        { key: 'leads',       href: '/app/leads',       icon: 'Target' },
      ],
    },
    {
      key: 'earnings',
      items: [
        { key: 'commissions', href: '/app/commissions', icon: 'Receipt' },
        { key: 'tier',        href: '/app/tier',        icon: 'Award' },
        { key: 'marketing',   href: '/app/marketing',   icon: 'Megaphone' },
      ],
    },
    help,
  ],
};
