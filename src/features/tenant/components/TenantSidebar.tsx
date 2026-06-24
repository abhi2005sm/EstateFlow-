"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, CreditCard, LogOut, Building2, ChevronRight, Wrench, Settings, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { apiRequest } from '../../api/api';
import { ThemeToggle } from '../../../components/ThemeToggle';

export default function TenantSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [securityStaff, setSecurityStaff] = useState<any[]>([]);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch(e) {}

    const fetchTenantProfile = async () => {
      try {
        const profileData = await apiRequest('/users/tenants/me/');
        if (profileData && profileData.name) {
          const updatedUser = {
            ...JSON.parse(localStorage.getItem('user') || '{}'),
            name: profileData.name,
            email: profileData.email || profileData.user?.email
          };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
          window.dispatchEvent(new Event('user-profile-updated'));
        }
      } catch (err) {
        console.error("Failed to fetch tenant profile", err);
      }
      try {
        const staffData = await apiRequest('/users/security/staff/');
        setSecurityStaff(Array.isArray(staffData) ? staffData : (staffData as any).results || []);
      } catch (err) {}
    };
    fetchTenantProfile();
  }, []);

  const navLinks = [
    { name: 'Dashboard', href: '/tenant', icon: Home },
    { name: 'Payments', href: '/tenant/payments', icon: CreditCard },
    { name: 'Requests', href: '/tenant/requests', icon: Wrench },
    { name: 'Visitors', href: '/tenant/visitors', icon: User },
    { name: 'Settings', href: '/tenant/settings', icon: Settings },
  ];

  const displayName = user?.name || "Tenant Account";



  return (
    <aside className="hidden md:flex flex-col fixed inset-y-0 left-0 z-50 w-[220px] bg-white dark:bg-[#09090b] border-r border-zinc-200/80 dark:border-zinc-900/50 transition-colors duration-300">
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-6 shrink-0 border-b border-zinc-100 dark:border-zinc-900/50">
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400 }}
            className="w-8 h-8 bg-gradient-to-tr from-[#F26922] to-[#ff8a50] rounded-xl flex items-center justify-center shadow-md shadow-[#F26922]/20 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <Building2 className="w-4 h-4 text-white" strokeWidth={2.5} />
          </motion.div>
          <div>
            <span className="text-zinc-950 dark:text-white text-sm font-bold tracking-tight">EstateFlow</span>
            <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Tenant Portal</p>
          </div>
        </div>
        <div className="opacity-70 hover:opacity-100 transition-opacity">
          <ThemeToggle />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 px-4 overflow-y-auto">
        <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.15em] px-3 mb-4">Main Menu</p>

        <div className="space-y-1">
          {navLinks.map((link, i) => {
            const isActive = pathname === link.href || (link.href !== '/tenant' && pathname.startsWith(link.href));
            return (
              <Link key={link.name} href={link.href}>
                <motion.div
                  whileTap={{ scale: 0.97 }}
                  className="relative flex items-center space-x-4 px-4 py-3 rounded-xl cursor-pointer group transition-all duration-200"
                >
                  {/* Sliding background pill */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-pill-tenant"
                      className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-500/[0.02] dark:from-orange-500/15 dark:to-orange-500/[0.02] rounded-xl z-0"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}

                  {/* Active left border indicator */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#F26922] rounded-r-full z-10" />
                  )}

                  <div className={`relative z-10 ${isActive ? 'text-orange-600 dark:text-orange-500' : 'text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-zinc-100'} transition-colors duration-200`}>
                    <link.icon className="w-5 h-5 shrink-0" strokeWidth={isActive ? 2.2 : 1.8} />
                  </div>

                  <span className={`relative z-10 font-bold text-sm ${isActive ? 'text-orange-600 dark:text-orange-500' : 'text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-zinc-100'} transition-colors duration-200`}>
                    {link.name}
                  </span>

                  {isActive && (
                    <ChevronRight className="ml-auto w-3 h-3 text-orange-500/60 z-10" />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Tenant profile + logout */}
      <div className="p-4 border-t border-zinc-100 dark:border-zinc-900/50 shrink-0 space-y-3 bg-zinc-50/50 dark:bg-zinc-900/10">
        <div className="flex items-center gap-3 px-2 py-2 border-b border-zinc-100/50 dark:border-zinc-900/30 pb-3">
          {/* Avatar/Icon */}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-500/20 border border-orange-500/20 flex items-center justify-center overflow-hidden shrink-0">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Tenant" alt="User" className="w-full h-full object-cover" />
          </div>
          
          {/* Name & Email Column */}
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate capitalize leading-none">
              {displayName}
            </span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate mt-1">
              {user?.email || "tenant@estatia.com"} 
            </span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            apiRequest('/auth/logout/', { method: 'POST' }).catch(() => {}).finally(() => {
              localStorage.clear();
              router.push('/login');
            });
          }}
          className="flex items-center space-x-3 w-full px-3 py-2.5 text-zinc-500 dark:text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors font-bold text-xs"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Logout</span>
        </motion.button>
      </div>
    </aside>
  );
}