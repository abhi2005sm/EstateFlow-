"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shield, LogOut, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ThemeToggle } from '../../../components/ThemeToggle';

export default function SecuritySidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch(e) {}
  }, []);

  const navLinks = [
    { name: 'Dashboard', href: '/security/dashboard', icon: Shield },
  ];

  const displayName = user?.name || "Security Gate";

  return (
    <div className="w-72 bg-white dark:bg-[#121110] border-r border-gray-100 dark:border-white/10 flex flex-col h-screen sticky top-0 overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.03)]">
      {/* Logo */}
      <div className="h-20 flex items-center justify-between px-8 shrink-0 border-b border-gray-100 dark:border-white/10">
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400 }}
            className="w-10 h-10 bg-[#F26922] rounded-2xl flex items-center justify-center shadow-md shadow-[#F26922]/20"
          >
            <Building2 className="w-5 h-5 text-white" strokeWidth={2.5} />
          </motion.div>
          <div>
            <span className="text-[#121110] dark:text-white text-lg font-black tracking-tight">EstateFlow</span>
            <p className="text-[9px] font-bold text-[#61605D] dark:text-gray-400/50 dark:text-gray-400 uppercase tracking-[0.2em]">Security Portal</p>
          </div>
        </div>
        <ThemeToggle />
      </div>

      {/* Nav */}
      <nav className="flex-1 py-8 px-5 overflow-y-auto">
        <p className="text-[9px] font-black text-[#61605D] dark:text-gray-400/30 uppercase tracking-[0.3em] px-3 mb-4">Main Menu</p>

        <div className="space-y-1">
          {navLinks.map((link, i) => {
            const isActive = pathname === link.href || (link.href !== '/security' && pathname.startsWith(link.href));
            return (
              <Link key={link.name} href={link.href}>
                <motion.div
                  whileTap={{ scale: 0.97 }}
                  className="relative flex items-center space-x-4 px-4 py-3.5 rounded-2xl cursor-pointer group"
                >
                  {/* Sliding background pill */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-pill-security"
                      className="absolute inset-0 bg-[#F26922] rounded-2xl shadow-lg shadow-[#F26922]/20 z-0"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}

                  <motion.div
                    animate={{ color: isActive ? '#ffffff' : '#61605D' }}
                    className="relative z-10"
                  >
                    <link.icon className="w-5 h-5 shrink-0" strokeWidth={2} />
                  </motion.div>

                  <motion.span
                    animate={{ color: isActive ? '#ffffff' : '#61605D' }}
                    className="relative z-10 font-bold text-sm"
                  >
                    {link.name}
                  </motion.span>

                  {isActive && (
                    <motion.div
                      layoutId="active-dot-security"
                      className="relative z-10 ml-auto w-1.5 h-1.5 rounded-full bg-white/80 dark:bg-[#18181b]/80"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Security profile + logout */}
      <div className="p-5 border-t border-gray-100 dark:border-white/10 shrink-0 space-y-2">
        <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-200 dark:border-white/5 mt-auto">
          {/* Avatar/Icon */}
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Security" alt="User" className="w-full h-full" />
          </div>
          
          {/* Name & Email Column */}
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold text-gray-900 dark:text-white truncate capitalize">
              {displayName}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email || "gate@estatia.com"} 
            </span>
          </div>
        </div>

        <motion.button
          whileHover={{ backgroundColor: '#FEF2F2' }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            localStorage.clear();
            router.push('/login');
          }}
          className="flex items-center space-x-3 w-full px-4 py-3 text-red-500 rounded-2xl transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span className="font-bold text-sm">Logout</span>
        </motion.button>
      </div>
    </div>
  );
}
