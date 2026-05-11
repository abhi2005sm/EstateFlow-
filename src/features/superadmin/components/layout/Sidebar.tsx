"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  PieChart, 
  ReceiptText, 
  Settings, 
  LogOut,
  ChevronDown,
  Building
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { name: 'Dashboard', href: '/super-admin/dashboard', icon: LayoutDashboard },
    { name: 'Apartments', href: '/super-admin/apartments', icon: Building},
    { name: 'Analytics', href: '/super-admin/analytics', icon: PieChart },

    { name: 'Settings', href: '/super-admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-72 bg-white flex flex-col h-screen sticky top-0 z-50">
      
      {/* ── Logo Section ──────────────────────────────────────── */}
      <div className="p-8 pb-12 flex items-center gap-4">
        <div className="w-14 h-14 bg-[#FF6B2C] rounded-[20px] flex items-center justify-center shadow-lg shadow-[#FF6B2C]/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
          <Building2 className="w-8 h-8 text-white relative z-10" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#121110] leading-none tracking-tight">EstateFlow</h2>
          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.15em] mt-1">SUPER ADMIN PORTAL</p>
        </div>
      </div>

      {/* ── Navigation ────────────────────────────────────────── */}
      <div className="flex-1 px-6 space-y-10 overflow-y-auto custom-scrollbar">
        <div>
          <p className="px-4 text-[10px] font-black text-gray-300 uppercase tracking-[0.25em] mb-6">MAIN MENU</p>
          <nav className="space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/super-admin' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`group relative flex items-center justify-between px-5 py-4 rounded-[22px] transition-all duration-300 ${isActive
                      ? 'bg-[#FF6B2C] text-white shadow-xl shadow-[#FF6B2C]/20'
                      : 'text-[#121110] hover:bg-gray-50'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <link.icon className={`w-6 h-6 transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-[#121110]'}`} />
                    <span className={`text-[15px] font-black ${isActive ? 'text-white' : 'text-[#121110]'}`}>{link.name}</span>
                  </div>
                  {isActive && (
                    <motion.div 
                      layoutId="activeDot"
                      className="w-1.5 h-1.5 bg-white rounded-full mr-1"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ── Bottom Section ────────────────────────────────────── */}
      <div className="p-6 pt-10 border-t border-gray-50 space-y-6">
        {/* User Profile */}
        <div className="flex items-center justify-between px-2 cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF1EB] border-2 border-white shadow-sm overflow-hidden p-1">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=AdminOwner" 
                alt="Admin Owner" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-black text-[#121110]">Super Admin</p>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors" />
        </div>

        {/* Logout */}
        <button
          onClick={() => router.push('/login')}
          className="flex items-center gap-4 px-4 py-3 w-full text-left group"
        >
          <div className="w-12 h-12 rounded-full bg-[#121110] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-black/10 group-hover:bg-red-600 transition-colors">
            N
          </div>
          <span className="text-[15px] font-black text-red-500 group-hover:text-red-600">Logout</span>
        </button>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f1f1f1;
          border-radius: 10px;
        }
      `}</style>
    </aside>
  );
}
