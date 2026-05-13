"use client";

import React from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  Building2,
  Users,
  History,
  UserCheck,
  Clock,
  Plus,
  Calendar
} from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

// Mock revenue data (Can be made dynamic once revenue API is available)
const revenueData = [
  { day: 'Sat', value: 300 },
  { day: 'Sun', value: 450 },
  { day: 'Mon', value: 300 },
  { day: 'Tue', value: 600 },
  { day: 'Wed', value: 850 },
  { day: 'Thr', value: 500 },
  { day: 'Fri', value: 350 },
];

const containerVariants: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  initial: { y: 20, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  },
};

import { superAdminApi, Owner } from '../api/api';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = React.useState<{
    owners: Owner[];
    summary: any;
    loading: boolean;
  }>({
    owners: [],
    summary: null,
    loading: true
  });

  const fetchData = async () => {
    try {
      const res = await superAdminApi.getOwners();
      setData({
        owners: res.owners || [],
        summary: res.summary,
        loading: false
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const stats = React.useMemo(() => {
    const owners = data.owners;
    const totalBuildings = owners.reduce((acc, o) => acc + (o.total_buildings || 0), 0);
    const activeUsers = owners.filter(o => o.is_active).length;
    const expiredUsers = owners.filter(o => !o.is_active).length;
    
    return {
      totalOwners: data.summary?.total_owners || owners.length,
      totalBuildings,
      activeUsers,
      expiredUsers,
      // Fallback for tenants if not provided by backend directly
      totalTenants: owners.reduce((acc, o) => acc + (o.total_buildings * 6), 0) 
    };
  }, [data]);

  const statusDistribution = React.useMemo(() => [
    { name: 'Active', value: stats.activeUsers, color: '#10B981' },
    { name: 'Inactive', value: stats.expiredUsers, color: '#FF6B6B' },
    { name: 'Total', value: stats.totalOwners, color: '#3B82F6' },
  ], [stats]);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  if (data.loading) {
    return (
      <div className="min-h-screen bg-[#eaedf2] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Synchronizing Super Admin Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eaedf2] font-sans text-[#121110] relative overflow-x-hidden">

      {/* ── Background Hero Image (Merged Look) ────────────────── */}
      <div className="absolute top-[0px] right-[-10%] w-[80%] h-[700px] pointer-events-none z-0">
        <img
          src="/hero_building.png"
          alt="Merged Architecture"
          className="w-full h-full object-contain object-right opacity-95"
          style={{
            maskImage: 'linear-gradient(to left, black 30%, transparent 85%), linear-gradient(to bottom, black 50%, transparent 95%)',
            WebkitMaskImage: 'linear-gradient(to left, black 30%, transparent 85%), linear-gradient(to bottom, black 50%, transparent 95%)'
          }}
        />
      </div>

      {/* ── Top Header ────────────────────────────────────────── */}
      <header className="relative z-50 flex justify-between items-center px-12 h-24 sticky top-0">
        {/* Date Display (Monday, May 11 style) */}
        <div className="flex flex-col">
          <p className="text-[12px] font-black text-gray-400 uppercase tracking-[0.4em]">
            {new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())}
          </p>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search Owners..."
              className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl py-2.5 pl-12 pr-4 w-64 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/10 shadow-sm"
            />
          </div>
          <button onClick={() => fetchData()} className="relative w-10 h-10 bg-white/80 backdrop-blur-md rounded-xl flex items-center justify-center border border-gray-100 shadow-sm transition-all hover:bg-white active:scale-95">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </header>

      {/* ── Main Dashboard Content ─────────────────────────────── */}
      <main className="relative z-10 px-12 py-12 max-w-[1600px] mx-auto space-y-12">

        {/* Row 1: Header + Metrics */}
        <div className="grid grid-cols-12 gap-12 items-start">
          <div className="col-span-12 lg:col-span-6 space-y-12">
            <div>
              <h1 className="text-5xl font-black tracking-tight text-[#121110]">
                {greeting},
              </h1>
              <p className="text-gray-400 text-lg font-bold mt-2">Here's What's Happening Across Your Portfolio.</p>
            </div>

            {/* 2x2 Metrics Grid */}
            <motion.div
              variants={containerVariants}
              initial="initial"
              animate="animate"
              className="grid grid-cols-2 gap-6 max-w-[500px]"
            >
              {[
                { label: 'TOTAL OWNERS', value: stats.totalOwners, icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-50' },
                { label: 'TOTAL BUILDINGS', value: stats.totalBuildings, icon: Building2, color: 'text-blue-600', bgColor: 'bg-blue-50' },
                { label: 'INACTIVE OWNERS', value: stats.expiredUsers, icon: History, color: 'text-red-500', bgColor: 'bg-red-50' },
                { label: 'ACTIVE OWNERS', value: stats.activeUsers, icon: UserCheck, color: 'text-green-500', bgColor: 'bg-green-50' },
              ].map((m, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="bg-white/90 backdrop-blur-xl border border-gray-100 rounded-[32px] p-8 flex flex-col justify-between group hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all duration-300 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className={`w-10 h-10 rounded-xl ${m.bgColor} ${m.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                      <m.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">{m.label}</span>
                  </div>
                  <h3 className="text-4xl font-black tracking-tight">{m.value}</h3>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Row 2: Charts Section */}
        <div className="grid grid-cols-12 gap-8 pt-12">
          {/* User Status Distribution */}
          <div className="col-span-12 lg:col-span-4 bg-white/90 backdrop-blur-xl border border-gray-100 rounded-[40px] p-10 shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <h3 className="font-black text-xl tracking-tight text-[#121110]">User Status Distribution</h3>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">Live Update</span>
            </div>
            <div className="relative h-[250px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={105}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-[18%] left-[28%] w-4 h-4 bg-[#10B981] transform rotate-45 rounded-sm shadow-sm" />
            </div>
            <div className="flex justify-center gap-8 mt-8">
              {statusDistribution.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-[12px] font-bold text-gray-500">{s.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Market Revenue Overview */}
          <div className="col-span-12 lg:col-span-8 bg-white/90 backdrop-blur-xl border border-gray-100 rounded-[40px] p-10 shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <h3 className="font-black text-xl tracking-tight text-[#121110]">Market Revenue Overview</h3>
              <button onClick={() => alert("Time filter selector")} className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-[11px] font-black text-gray-500 hover:bg-white transition-colors">
                Last 7 Days <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={revenueData}>
                  <CartesianGrid vertical={false} stroke="#F1F5F9" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 800 }}
                    dy={12}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 800 }}
                  />
                  <Tooltip content={() => null} />
                  <Bar dataKey="value" fill="#F1F5F9" barSize={10} radius={[5, 5, 0, 0]} opacity={0.3} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3B82F6"
                    strokeWidth={4}
                    dot={false}
                    activeDot={{ r: 6, fill: "#3B82F6", stroke: "#fff", strokeWidth: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Row 3: Bottom Lists */}
        <div className="grid grid-cols-12 gap-8 pb-12">
          {/* Recent Owners */}
          <div className="col-span-12 lg:col-span-6 bg-white border border-gray-100 rounded-[40px] p-10 shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black tracking-tight text-[#121110]">Recent Owners</h3>
              <button onClick={() => alert("Viewing all owners")} className="text-[11px] font-black text-gray-400 uppercase tracking-widest hover:text-[#121110] transition-colors">View All</button>
            </div>
            <div className="space-y-6">
              {data.owners.slice(0, 4).map(owner => (
                <div key={owner.id} className="flex items-center gap-5 p-4 hover:bg-gray-50 rounded-[32px] transition-all group cursor-pointer border border-transparent hover:border-gray-100">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 font-black flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform">
                    {owner.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-base">{owner.name}</h4>
                    <p className="text-xs font-bold text-gray-400 flex items-center gap-2 mt-1">
                      <Building2 className="w-4 h-4 text-blue-500" /> {owner.total_buildings} Properties
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio Insights */}
          <div className="col-span-12 lg:col-span-6 bg-white border border-gray-100 rounded-[40px] p-10 shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black tracking-tight text-[#121110]">Portfolio Insights</h3>
              <button onClick={() => fetchData()} className="w-11 h-11 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors shadow-sm">
                <History className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-6">
              {data.owners.slice(-4).reverse().map(owner => (
                <div key={owner.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-[32px] transition-all group cursor-pointer border border-transparent hover:border-gray-100">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 font-black flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform">
                      {owner.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-black text-base">{owner.name}</h4>
                      <p className="text-xs font-bold text-gray-400 flex items-center gap-2 mt-1">
                        <Building2 className="w-4 h-4 text-blue-500" /> {owner.residential_count} Res | {owner.commercial_count} Com
                      </p>
                    </div>
                  </div>
                  <div className={`px-5 py-3 rounded-2xl text-[12px] font-black border shadow-sm ${owner.is_active ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                    {owner.is_active ? 'Active' : 'Inactive'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
