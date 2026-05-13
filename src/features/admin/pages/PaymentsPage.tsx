"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, TrendingUp } from 'lucide-react';
import PaymentManagement from '../payments/components/PaymentManagement';

export default function PaymentsPage() {
  return (
    <div className="min-h-screen bg-[#F5F3F0] relative overflow-x-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[40%] h-[400px] bg-gradient-to-bl from-[#F26922]/5 to-transparent rounded-bl-[200px] pointer-events-none" />
      
      <div className="relative z-10">
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between px-10 h-20"
        >
          <div>
            <h1 className="text-xl font-black text-[#121110] tracking-tight">Payment Management</h1>
            <p className="text-[10px] font-black text-[#61605D]/60 uppercase tracking-[0.25em]">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl px-4 py-2.5 shadow-sm">
              <Search className="w-4 h-4 text-[#61605D]" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="bg-transparent text-sm font-medium text-[#121110] placeholder-[#61605D]/50 outline-none w-52"
              />
            </div>
            
            <button className="relative p-3 bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-sm hover:bg-white transition-all active:scale-95">
              <Bell className="w-5 h-5 text-[#61605D]" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#F26922] rounded-full" />
            </button>
            
            <div className="flex items-center space-x-3 bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl px-4 py-2 shadow-sm cursor-pointer hover:bg-white transition-all active:scale-95">
              <div className="w-8 h-8 rounded-xl overflow-hidden bg-[#F26922]/10 border border-[#F26922]/20">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin&backgroundColor=F26922" alt="Admin" className="w-full h-full" />
              </div>
              <div>
                <p className="text-xs font-black text-[#121110]">Admin Owner</p>
              </div>
            </div>
          </div>
        </motion.header>

        <main className="max-w-[1600px] mx-auto px-10 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black text-[#121110] tracking-tight">Payments Overview</h2>
                <p className="text-[#61605D] font-semibold text-sm mt-1">Review, approve, and track all tenant payments.</p>
              </div>
              <button className="flex items-center space-x-2 px-6 py-3 bg-[#121110] text-white rounded-2xl text-sm font-black hover:bg-[#F26922] transition-all shadow-lg shadow-black/5 active:scale-95">
                <TrendingUp className="w-4 h-4" />
                <span>Financial Reports</span>
              </button>
            </div>

            <PaymentManagement />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
