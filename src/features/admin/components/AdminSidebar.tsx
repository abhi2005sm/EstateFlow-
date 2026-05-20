"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Building2, LogOut, Users, Receipt, Settings, PieChart, ChevronDown, PlusCircle, Wrench } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { apiRequest } from '../../api/api';

const navLinks = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Buildings', href: '/admin/buildings', icon: Building2 },
  { name: 'Tenants', href: '/admin/tenants', icon: Users },
  { name: 'Payments', href: '/admin/payments', icon: Receipt },
  { name: 'Requests', href: '/admin/requests', icon: Wrench },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch(e) {}

    const fetchOwnerProfile = async () => {
      try {
        const profileData = await apiRequest('/users/owners/me/');
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
        console.error("Failed to fetch owner profile", err);
      }
    };
    fetchOwnerProfile();
  }, []);

  const activeIndex = navLinks.findIndex(
    (link) => pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href))
  );

  const displayName = user?.name || "Admin Owner";



  return (
    <div className="w-72 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.03)]">
      {/* Logo */}
      <div className="h-20 flex items-center px-8 shrink-0 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400 }}
            className="w-10 h-10 bg-[#F26922] rounded-2xl flex items-center justify-center shadow-md shadow-[#F26922]/20"
          >
            <Building2 className="w-5 h-5 text-white" strokeWidth={2.5} />
          </motion.div>
          <div>
            <span className="text-[#121110] text-lg font-black tracking-tight">EstateFlow</span>
            <p className="text-[9px] font-bold text-[#61605D]/50 uppercase tracking-[0.2em]">Owner Portal</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-8 px-5 overflow-y-auto">
        <p className="text-[9px] font-black text-[#61605D]/30 uppercase tracking-[0.3em] px-3 mb-4">Main Menu</p>

        <div className="space-y-1">
          {navLinks.map((link, i) => {
            const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
            return (
              <Link key={link.name} href={link.href}>
                <motion.div
                  whileTap={{ scale: 0.97 }}
                  className="relative flex items-center space-x-4 px-4 py-3.5 rounded-2xl cursor-pointer group"
                >
                  {/* Sliding background pill — shared element transition */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-pill"
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
                      layoutId="active-dot"
                      className="relative z-10 ml-auto w-1.5 h-1.5 rounded-full bg-white/80"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Admin profile + logout */}
      <div className="p-5 border-t border-gray-100 shrink-0 space-y-2">
        <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-200 mt-auto">
          {/* Avatar/Icon */}
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="User" className="w-full h-full" />
          </div>
          
          {/* Name & Email Column */}
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold text-gray-900 truncate capitalize">
              {displayName}
            </span>
            {/* ADDED EMAIL HERE */}
            <span className="text-xs text-gray-500 truncate">
              {user?.email || "superadmin@estatia.com"} 
            </span>
          </div>
        </div>

        <motion.button
          whileHover={{ backgroundColor: '#FEF2F2' }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push('/login')}
          className="flex items-center space-x-3 w-full px-4 py-3 text-red-500 rounded-2xl transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span className="font-bold text-sm">Logout</span>
        </motion.button>
      </div>
    </div>
  );
}
