"use client";

import MetricCard from '../components/rp/MetricCard';
import DashboardCharts from '../components/rp/DashboardCharts';
import { Building2, Home, Briefcase, LayoutGrid, CheckCircle2, XCircle, DollarSign, AlertCircle, BadgeCheck, BadgeX, Bell, Search, TrendingUp, ArrowUpRight } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants: Variants = {
  initial: { y: 20, opacity: 0 },
  animate: { 
    y: 0, 
    opacity: 1, 
    transition: { duration: 0.5, ease: "circOut" } 
  },
};

export default function RealPropertyDashboard() {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="min-h-screen bg-[#F5F3F0] relative overflow-x-hidden">

      {/* ── Hero Image Panel ─────────────────────────────── */}
      <div className="absolute top-0 left-0 h-[700px] w-[56%] overflow-hidden pointer-events-none">
        <img
          src="/hero-bg.jpg"
          alt="Premium Villa"
          className="w-full h-full object-cover object-center"
        />
        {/* Gradients for seamless blending */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent via-[75%] to-[#F5F3F0]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent via-[80%] to-[#F5F3F0]" />
        {/* Top header tint */}
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#F5F3F0]/40 to-transparent" />
      </div>

      <div className="relative z-10">

        {/* ── Top Header Bar ───────────────────────────────── */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between px-10 h-20"
        >
          <div>
            <p className="text-[11px] font-black text-[#61605D]/60 uppercase tracking-[0.25em]">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl px-4 py-2.5 shadow-sm">
              <Search className="w-4 h-4 text-[#61605D]" />
              <input
                type="text"
                placeholder="Search properties, tenants..."
                className="bg-transparent text-sm font-medium text-[#121110] placeholder-[#61605D]/50 outline-none w-52"
              />
            </div>
            {/* Bell */}
            <button className="relative p-3 bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-sm hover:bg-white transition-all">
              <Bell className="w-5 h-5 text-[#61605D]" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#F26922] rounded-full" />
            </button>
            {/* Profile */}
            <div className="flex items-center space-x-3 bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl px-4 py-2 shadow-sm cursor-pointer hover:bg-white transition-all">
              <div className="w-8 h-8 rounded-xl overflow-hidden bg-[#F26922]/10">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" className="w-full h-full" />
              </div>
              <div>
                <p className="text-xs font-black text-[#121110]">Admin Owner</p>

              </div>
            </div>
          </div>
        </motion.header>

        {/* ── Main Content ─────────────────────────────────── */}
        <main className="max-w-[1600px] mx-auto px-10 space-y-10 pb-24">

          {/* ── Hero Section: Image left + Welcome right ───── */}
          <div className="grid grid-cols-12 gap-8 items-start">
            {/* Spacer over building image */}
            <div className="col-span-12 lg:col-span-7 h-[560px]" />

            {/* Welcome + Building Stats */}
            <motion.div
              variants={containerVariants}
              initial="initial"
              animate="animate"
              className="col-span-12 lg:col-span-5 space-y-8 pt-2"
            >
              {/* Greeting */}
              <motion.div variants={itemVariants} className="space-y-3">

                <h1 className="text-5xl font-black tracking-tight leading-[1.1] text-[#121110]">
                  {greeting},<br />Admin 👋
                </h1>
                <p className="text-[#61605D] font-semibold text-base leading-relaxed">
                  Here's your real-time property portfolio snapshot for today.
                </p>
              </motion.div>

              {/* Quick Stats pill */}
              <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-5 shadow-sm">
                <div className="grid grid-cols-3 divide-x divide-[#F5F3F0]">
                  {[
                    { label: 'Buildings', value: '24', color: 'text-[#F26922]' },
                    { label: 'Total Units', value: '600', color: 'text-blue-500' },
                    { label: 'Occupancy', value: '83%', color: 'text-green-500' },
                  ].map((s, i) => (
                    <div key={i} className={`flex flex-col items-center ${i > 0 ? 'pl-4' : ''} ${i < 2 ? 'pr-4' : ''}`}>
                      <span className={`text-2xl font-black ${s.color}`}>{s.value}</span>
                      <span className="text-[9px] font-black text-[#61605D]/60 uppercase tracking-[0.2em] mt-1">{s.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Building Type Cards */}
              <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
                <MetricCard title="Total Buildings" value="24" icon={Building2} color="text-[#F26922]" bgColor="bg-[#F26922]/10" delay={0} />
                <MetricCard title="Residential" value="18" icon={Home} color="text-blue-500" bgColor="bg-blue-50" delay={0} />
                <MetricCard title="Commercial" value="6" icon={Briefcase} color="text-purple-500" bgColor="bg-purple-50" delay={0} />
              </motion.div>

              {/* Unit Status Cards */}
              <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
                <MetricCard title="Total Units" value="600" icon={LayoutGrid} color="text-[#F26922]" bgColor="bg-[#F26922]/10" delay={0} />
                <MetricCard title="Occupied" value="498" icon={CheckCircle2} color="text-green-500" bgColor="bg-green-50" delay={0} />
                <MetricCard title="Vacant" value="102" icon={XCircle} color="text-red-400" bgColor="bg-red-50" delay={0} />
              </motion.div>
            </motion.div>
          </div>

          {/* ── Rent Metrics Row ─────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-[#121110] tracking-tight">Rent Collection Summary</h2>
              <button className="flex items-center space-x-1 text-[#F26922] text-sm font-black hover:underline underline-offset-4">
                <span>View Full Report</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Total Rent Collected', value: '$485,000', subtitle: 'This month', icon: DollarSign, color: 'text-green-600', bgColor: 'bg-green-50' },
                { title: 'Total Due', value: '$52,000', subtitle: 'Outstanding balance', icon: AlertCircle, color: 'text-red-500', bgColor: 'bg-red-50' },
                { title: 'Paid Units', value: '456', subtitle: '76% of total', icon: BadgeCheck, color: 'text-green-600', bgColor: 'bg-green-50' },
                { title: 'Unpaid Units', value: '144', subtitle: '24% of total', icon: BadgeX, color: 'text-red-500', bgColor: 'bg-red-50' },
              ].map((m, i) => (
                <MetricCard key={i} {...m} delay={i * 0.08} />
              ))}
            </div>
          </div>

          {/* ── Charts Row ───────────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-[#121110] tracking-tight">Analytics Overview</h2>
              <span className="text-xs font-bold text-[#61605D]/60 uppercase tracking-widest">Last 6 months</span>
            </div>
            <DashboardCharts delay={0} />
          </div>

        </main>
      </div>
    </div>
  );
}
