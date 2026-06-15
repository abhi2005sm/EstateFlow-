"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Building2, LogOut, Users, Receipt,
  Settings, Wrench, Shield, ChevronRight, Bell
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiRequest } from '../../api/api';
import { ThemeToggle } from '../../../components/ThemeToggle';

const navSections = [
  {
    label: 'Overview',
    links: [
      { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    ]
  },
  {
    
    label: 'Manage',
    links: [
      
      { name: 'Buildings', href: '/admin/buildings', icon: Building2 },
      { name: 'Tenants',   href: '/admin/tenants',   icon: Users },
      { name: 'Payments',  href: '/admin/payments',  icon: Receipt },
      { name: 'Requests',  href: '/admin/requests',  icon: Wrench },
    ]
  },
  {
    label: 'System',
    links: [
      { name: 'Security',  href: '/admin/security',  icon: Shield },
      { name: 'Settings',  href: '/admin/settings',  icon: Settings },
    ]
  },
];

function NavItem({ link, isActive, onClick }: { link: any; isActive: boolean; onClick?: () => void }) {
  return (
    <Link href={link.href} onClick={onClick}>
      <div
        className={`
          group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
          transition-all duration-200 cursor-pointer select-none
          ${isActive
            ? 'bg-gradient-to-r from-orange-500/10 to-orange-500/[0.02] dark:from-orange-500/15 dark:to-orange-500/[0.02] text-orange-600 dark:text-orange-500 font-semibold'
            : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/40'
          }
        `}
      >
        {/* Active accent bar */}
        {isActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#F26922] rounded-r-full" />
        )}

        <link.icon
          className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-orange-600 dark:text-orange-500' : 'text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300'}`}
          strokeWidth={isActive ? 2.2 : 1.8}
        />

        <span className="tracking-[-0.01em]">
          {link.name}
        </span>

        {isActive && (
          <ChevronRight className="ml-auto w-3 h-3 text-orange-500/60 shrink-0" />
        )}
      </div>
    </Link>
  );
}

export default function AdminSidebar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) setUser(JSON.parse(stored));
    } catch {}

    apiRequest('/users/owners/me/').then((profile: any) => {
      if (profile?.name) {
        const updated = {
          ...JSON.parse(localStorage.getItem('user') || '{}'),
          name:  profile.name,
          email: profile.email || profile.user?.email,
        };
        setUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
      }
    }).catch(() => {});
  }, []);

  const displayName  = user?.name  || 'Admin Owner';
  const displayEmail = user?.email || 'admin@estateflow.com';
  const initials     = displayName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);

  const isActive = (href: string) =>
    pathname === href || (href !== '/admin' && pathname.startsWith(href));

  return (
    <>
      {/* ── Desktop Sidebar ────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col fixed inset-y-0 left-0 z-50 w-[220px] bg-white dark:bg-[#09090b] border-r border-zinc-200/80 dark:border-zinc-900/50 transition-colors duration-300">

        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-zinc-100 dark:border-zinc-900/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-[#F26922] to-[#ff8a50] rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-[#F26922]/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <Building2 className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-zinc-950 dark:text-white text-sm font-bold tracking-tight leading-none" style={{ fontFamily: 'var(--font-jakarta)' }}>
                EstateFlow
              </p>
              <p className="text-zinc-400 dark:text-zinc-500 text-[10px] font-semibold leading-none mt-1 tracking-wider uppercase">
                Owner Portal
              </p>
            </div>
          </div>

          {/* Theme toggle — small */}
          <div className="opacity-70 hover:opacity-100 transition-opacity">
            <ThemeToggle />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <div className="space-y-0.5">
            {navSections.map((section, idx) => (
              <div key={section.label}>
                {idx > 0 && (
                  <div className="my-3 h-px bg-zinc-100 dark:bg-zinc-900/60 mx-3" />
                )}
                <div className="space-y-0.5">
                  {section.links.map((link) => (
                    <NavItem key={link.name} link={link} isActive={isActive(link.href)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* User profile */}
        <div className="shrink-0 border-t border-zinc-100 dark:border-zinc-900/50 p-4 space-y-3 bg-zinc-50/50 dark:bg-zinc-900/10">
          {/* Avatar row */}
          <div className="flex items-center gap-3 px-1 py-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-500/20 border border-orange-500/20 flex items-center justify-center shrink-0 animate-pulse">
              <span className="text-xs font-bold text-[#F26922]">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-zinc-800 dark:text-zinc-200 text-xs font-bold truncate capitalize leading-none">
                {displayName}
              </p>
              <p className="text-zinc-400 dark:text-zinc-500 text-[10px] truncate mt-1">
                {displayEmail}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={() => {
              localStorage.clear();
              router.push('/login');
            }}
            className="
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold
              text-zinc-500 dark:text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10
              transition-all duration-200 group
            "
          >
            <LogOut className="w-3.5 h-3.5 shrink-0 text-zinc-400 group-hover:text-red-500 transition-colors" strokeWidth={1.8} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
