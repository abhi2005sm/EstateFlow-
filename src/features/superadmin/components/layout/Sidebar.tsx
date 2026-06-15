"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  PieChart,
  Settings,
  LogOut,
  ChevronRight,
  Building
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeToggle } from '../../../../components/ThemeToggle';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { name: 'Dashboard',   href: '/super-admin/dashboard',  icon: LayoutDashboard },
    { name: 'Properties',  href: '/super-admin/apartments', icon: Building },
    { name: 'Analytics',   href: '/super-admin/analytics',  icon: PieChart },
    { name: 'Settings',    href: '/super-admin/settings',   icon: Settings },
  ];

  return (
    <aside className="w-[220px] bg-white dark:bg-[#09090b] border-r border-zinc-200/80 dark:border-zinc-900/50 flex flex-col h-screen fixed inset-y-0 left-0 z-50 transition-colors duration-300">

      {/* ── Logo Section ─────────────────────────────── */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-zinc-100 dark:border-zinc-900/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-[#F26922] to-[#ff8a50] rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-[#F26922]/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <Building2 className="w-4 h-4 text-white relative z-10" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-zinc-950 dark:text-white text-sm font-bold tracking-tight leading-none">
              EstateFlow
            </p>
            <p className="text-zinc-400 dark:text-zinc-500 text-[10px] font-semibold leading-none mt-1 tracking-wider uppercase">
              Super Admin
            </p>
          </div>
        </div>

        <div className="opacity-70 hover:opacity-100 transition-opacity">
          <ThemeToggle />
        </div>
      </div>

      {/* ── Navigation ───────────────────────────────── */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="space-y-0.5">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== '/super-admin' && pathname.startsWith(link.href));

            return (
              <Link key={link.name} href={link.href}>
                <motion.div
                  whileTap={{ scale: 0.97 }}
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
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive
                        ? 'text-orange-600 dark:text-orange-500'
                        : 'text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300'
                    }`}
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />

                  <span className="tracking-[-0.01em]">{link.name}</span>

                  {isActive && (
                    <ChevronRight className="ml-auto w-3 h-3 text-orange-500/60 shrink-0" />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── Bottom Section ────────────────────────────── */}
      <div className="shrink-0 border-t border-zinc-100 dark:border-zinc-900/50 p-4 space-y-3 bg-zinc-50/50 dark:bg-zinc-900/10">
        {/* User profile */}
        <div className="flex items-center gap-3 px-1 py-1">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-500/20 border border-orange-500/20 flex items-center justify-center overflow-hidden shrink-0">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=SuperAdmin"
              alt="Super Admin"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-zinc-800 dark:text-zinc-200 text-xs font-bold truncate leading-none">
              Super Admin
            </p>
            <p className="text-zinc-400 dark:text-zinc-500 text-[10px] truncate mt-1">
              superadmin@estateflow.com
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
  );
}
