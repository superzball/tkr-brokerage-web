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
      key: 'team',
      items: [
        { key: 'myTeam',      href: '/app/team',             icon: 'Network' },
        { key: 'recruit',     href: '/app/team/recruit',     icon: 'UserPlus' },
        { key: 'teamSales',   href: '/app/team/sales',       icon: 'TrendingUp' },
        { key: 'teamIncome',  href: '/app/team/income',      icon: 'HandCoins' },
        { key: 'leaderboard', href: '/app/team/leaderboard', icon: 'Trophy' },
      ],
    },
    {
      key: 'earnings',
      items: [
        { key: 'sales',       href: '/app/sales',       icon: 'ShoppingCart' },
        { key: 'commissions', href: '/app/commissions', icon: 'Receipt' },
        { key: 'tier',        href: '/app/tier',        icon: 'Award' },
        { key: 'marketing',   href: '/app/marketing',   icon: 'Megaphone' },
      ],
    },
    help,
  ],

  // ---- Admin / Staff back-office (Phase 14) ----
  // URL scheme: /admin/* (its own (admin) route group).
  // `perm` gates by staffRole; superadmin sees all.
  admin: [
    {
      items: [
        { key: 'overview', href: '/admin', icon: 'LayoutDashboard' },
      ],
    },
    {
      key: 'content',
      items: [
        { key: 'articles', href: '/admin/content/articles', icon: 'Newspaper', perm: 'content' },
        { key: 'pages',    href: '/admin/content/pages',    icon: 'FileText',  perm: 'content' },
        { key: 'seo',      href: '/admin/content/seo',      icon: 'Search',    perm: 'content' },
        { key: 'media',    href: '/admin/content/media',    icon: 'Image',     perm: 'content' },
        { key: 'coupons',  href: '/admin/content/coupons',  icon: 'TicketPercent', perm: 'content' },
        { key: 'reviews',  href: '/admin/content/reviews',  icon: 'Star',          perm: 'content' },
        { key: 'partners', href: '/admin/content/partners', icon: 'Handshake',     perm: 'content' },
      ],
    },
    {
      key: 'sales',
      items: [
        { key: 'newOrder', href: '/admin/sales/new',    icon: 'ShoppingCart', perm: 'sales' },
        { key: 'orders',   href: '/admin/sales/orders', icon: 'ClipboardList', perm: 'sales' },
      ],
    },
    {
      key: 'operations',
      items: [
        { key: 'adminPolicies', href: '/admin/policies',  icon: 'ShieldCheck', perm: 'ops' },
        { key: 'claimsQueue',   href: '/admin/claims',    icon: 'BadgeCheck',  perm: 'ops' },
        { key: 'approvals',     href: '/admin/approvals', icon: 'FileCheck2',  perm: 'ops' },
        { key: 'policyTickets', href: '/admin/ops/tickets',     icon: 'Ticket',       perm: 'ops' },
        { key: 'amendments',    href: '/admin/ops/amendments',  icon: 'FilePenLine',  perm: 'ops' },
        { key: 'issued',        href: '/admin/ops/issued',      icon: 'FileBadge',    perm: 'ops' },
      ],
    },
    {
      key: 'accounts',
      items: [
        { key: 'customers', href: '/admin/customers', icon: 'Building2', perm: 'ops' },
        { key: 'agents',    href: '/admin/agents',    icon: 'Users',     perm: 'ops' },
      ],
    },
    {
      key: 'finance',
      items: [
        { key: 'adminInvoices', href: '/admin/finance/invoices', icon: 'Receipt',   perm: 'ops' },
        { key: 'payouts',       href: '/admin/finance/payouts',  icon: 'Banknote',  perm: 'ops' },
        { key: 'reports',       href: '/admin/finance/reports',  icon: 'BarChart3', perm: 'ops' },
        { key: 'payments',     href: '/admin/finance/payments', icon: 'Wallet',       perm: 'ops' },
        { key: 'creditWallet', href: '/admin/finance/credit',   icon: 'WalletCards',  perm: 'ops' },
        { key: 'debtors',      href: '/admin/finance/debtors',  icon: 'AlertCircle',  perm: 'ops' },
      ],
    },
    {
      key: 'config',
      items: [
        { key: 'catalog',     href: '/admin/catalog/products',    icon: 'Package',  perm: 'superadmin' },
        { key: 'commRules',   href: '/admin/catalog/commissions', icon: 'Percent',  perm: 'superadmin' },
        { key: 'staff',       href: '/admin/staff',               icon: 'UserCog',  perm: 'superadmin' },
        { key: 'sysSettings', href: '/admin/settings',            icon: 'Settings', perm: 'superadmin' },
        { key: 'audit',       href: '/admin/audit',               icon: 'ScrollText', perm: 'superadmin' },
      ],
    },
    {
      key: 'support',
      items: [
        { key: 'tickets', href: '/admin/support', icon: 'LifeBuoy', perm: 'ops' },
      ],
    },
  ],
};
