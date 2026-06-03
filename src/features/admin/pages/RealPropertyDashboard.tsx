"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import MetricCard from '../components/rp/MetricCard';
import DashboardCharts from '../components/rp/DashboardCharts';
import { Building2, Home, Briefcase, LayoutGrid, CheckCircle2, XCircle, IndianRupee, AlertCircle, BadgeCheck, BadgeX, Bell, Search, TrendingUp, ArrowUpRight, Loader2, Activity, Wrench, Clock, Plus, ShieldCheck, ChevronRight, Receipt } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { buildingsApi } from '../buildings/api/buildingsApi';
import { tenantsApi } from '../tenants/api/tenantsApi';
import { dashboardApi } from '../dashboard/api/dashboardApi';

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

interface DashboardState {
  buildings: any[];
  tenants: any[];
  loading: boolean;
}

export default function RealPropertyDashboard() {
  const [data, setData] = useState<DashboardState>({
    buildings: [],
    tenants: [],
    loading: true
  });
  const [summary, setSummary] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);

  const fetchData = async () => {
    try {
      const [buildingsRes, tenantsRes, dashboardRes] = await Promise.allSettled([
        buildingsApi.getBuildings(),
        tenantsApi.getTenants(),
        dashboardApi.getOwnerDashboard().catch(() => null)
      ]);

      const buildingsResData = buildingsRes.status === 'fulfilled' ? buildingsRes.value : { buildings: [], summary: null };
      const buildingsList = Array.isArray(buildingsResData.buildings) ? buildingsResData.buildings : [];
      
      // Fetch full details for each building to get the units array
      // This is necessary because the list API might not include full unit details
      const fullBuildings = await Promise.all(
        buildingsList.map(async (b: any) => {
          try {
            const idToUse = b.id || b.building_id;
            if (!idToUse) return b;
            return await buildingsApi.getBuildingById(idToUse.toString());
          } catch {
            return b;
          }
        })
      );

      const tenantsRaw = tenantsRes.status === 'fulfilled' ? tenantsRes.value : [];
      const tenantsArray = Array.isArray(tenantsRaw) ? tenantsRaw : (tenantsRaw?.tenants || []);
      
      // Create a map for unit lookup by ID
      const unitMap: Record<number, { unit_number: string, floor_number: number }> = {};
      fullBuildings.forEach((b: any) => {
        if (Array.isArray(b.units)) {
          b.units.forEach((u: any) => {
            unitMap[u.id] = { unit_number: u.unit_number, floor_number: u.floor_number };
          });
        }
      });

      // Enrich tenants with unit_number and floor_number
      const enrichedTenants = tenantsArray.map((t: any) => {
        const unitInfo = unitMap[t.unit];
        
        // Robust fallback for unit number: 
        // 1. Try mapping from buildings list
        // 2. Try parsing from unit_id string (e.g. o-2-b-1-101 -> 101)
        // 3. Fallback to existing unit_number or unit field
        let resolvedUnitNumber = unitInfo?.unit_number;
        if (!resolvedUnitNumber && t.unit_id) {
          const parts = String(t.unit_id).split('-');
          if (parts.length > 1) resolvedUnitNumber = parts[parts.length - 1];
        }

        return {
          ...t,
          unit_number: resolvedUnitNumber || t.unit_number || t.unit_id || t.unit,
          floor_number: unitInfo?.floor_number ?? t.floor_number ?? 0
        };
      });

      setData({
        buildings: fullBuildings,
        tenants: enrichedTenants,
        loading: false
      });
      setSummary(buildingsResData.summary);
      if (dashboardRes.status === 'fulfilled' && dashboardRes.value) {
        setDashboardData(dashboardRes.value);
      }
    } catch (error) {
      console.error('Dashboard data fetch failed:', error);
      setData((prev: DashboardState) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
      } catch(e) {}
    };

    loadUser();
    window.addEventListener('user-profile-updated', loadUser);

    fetchData();

    return () => window.removeEventListener('user-profile-updated', loadUser);
  }, []);

  const displayName = user?.name || "Admin Owner";



  const stats = useMemo(() => {
    const totalBuildings = summary?.total_buildings || data.buildings.length;
    
    // Total Units: Sum of total_units from all buildings
    const totalUnits = data.buildings.reduce((acc: number, b: any) => acc + (b.total_units || 0), 0);
    
    // Occupied Units: Try to count from units array first, then fallback to tenants length
    const occupiedFromUnits = data.buildings.reduce((acc: number, b: any) => {
      const unitsOccupied = Array.isArray(b.units) 
        ? b.units.filter((u: any) => u.is_occupied).length 
        : 0;
      return acc + unitsOccupied;
    }, 0);

    // If we found occupied units via building.units, use that. 
    // Otherwise use tenants count. This is better than the 70% fallback.
    const occupiedUnits = occupiedFromUnits > 0 ? occupiedFromUnits : data.tenants.length;
    
    const vacantUnits = Math.max(0, totalUnits - occupiedUnits);
    const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
    
    const residential = summary?.residential_count !== undefined 
      ? summary.residential_count 
      : data.buildings.filter((b: any) => b.building_type === 'Residential').length;
      
    const commercial = summary?.commercial_count !== undefined 
      ? summary.commercial_count 
      : data.buildings.filter((b: any) => b.building_type === 'Commercial').length;

    return {
      totalBuildings,
      totalUnits,
      occupiedUnits,
      vacantUnits,
      occupancyRate, // Removed || 75 fallback
      residential,
      commercial
    };
  }, [data, summary]);

  const feedEvents = useMemo(() => {
    const events = [];
    if (dashboardData?.lease_alerts) {
      dashboardData.lease_alerts.forEach((alert: any) => {
        events.push({
          type: 'ALERT',
          title: 'Lease expiring soon',
          description: `Unit ${alert.unit} lease ends in ${alert.days_left} days.`,
          time: 'Just now'
        });
      });
    }
    const recentlyPaid = data.tenants.filter(t => t.rent_status === 'Paid').slice(0, 2);
    recentlyPaid.forEach(t => {
      events.push({
        type: 'PAYMENT',
        title: `Rent received from Unit ${t.unit_number}`,
        description: `₹${Number(t.rent_amount).toLocaleString('en-IN')} collected from ${t.name}.`,
        time: 'Today'
      });
    });
    events.push({
      type: 'MAINTENANCE',
      title: 'Tenant request resolved',
      description: 'Plumbing issue was marked as resolved.',
      time: 'Yesterday'
    });
    return events;
  }, [dashboardData, data.tenants]);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  if (data.loading) {
    return (
      <div className="min-h-screen bg-[#F5F3F0] dark:bg-[#09090b] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 text-[#F26922] animate-spin" />
          <p className="text-[#61605D] dark:text-gray-400 font-black uppercase tracking-widest text-xs">Synchronizing Portfolio...</p>
        </div>
      </div>
    );
  }

  const fmt = (n: number) => '₹' + Number(n).toLocaleString('en-IN');
  
  // Real Occupancy Data by Property instead of dummy monthly data
  const mobileOccupancyBars = data.buildings.slice(0, 6).map((b: any) => {
    const units = b.total_units || 1;
    const occupied = Array.isArray(b.units) 
      ? b.units.filter((u:any) => u.is_occupied).length 
      : (stats.occupiedUnits > 0 ? Math.floor(stats.occupiedUnits / data.buildings.length) : 0);
    return {
      label: (b.name || 'Prop').substring(0, 3).toUpperCase(),
      pct: Math.min(100, Math.round((occupied / units) * 100))
    };
  });
  while (mobileOccupancyBars.length < 6) {
    mobileOccupancyBars.push({ label: '-', pct: 0 });
  }

  const mobile = (
    <div className="md:hidden bg-[#F5F4F2] dark:bg-[#111315] min-h-screen pb-24">
      <div className="flex items-center justify-between px-5 pt-7 pb-5">
        <div className="flex items-center gap-3">
          <img src={`https://ui-avatars.com/api/?name=${displayName}&background=F26922&color=fff&bold=true&size=80`} alt="Avatar" className="w-11 h-11 rounded-full" />
          <div>
            <p className="text-[16px] font-extrabold text-gray-900 dark:text-white leading-tight">{displayName.split(' ')[0]}</p>
            <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium">Property manager</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/buildings" className="w-9 h-9 rounded-full bg-white dark:bg-[#1e1e1e] shadow-sm flex items-center justify-center">
            <Plus className="w-4 h-4 text-gray-700 dark:text-gray-200" />
          </Link>
          <button className="w-9 h-9 rounded-full bg-white dark:bg-[#1e1e1e] shadow-sm flex items-center justify-center">
            <Bell className="w-4 h-4 text-gray-700 dark:text-gray-200" />
          </button>
        </div>
      </div>
      <div className="px-5 space-y-5">
        <div>
          <h2 className="text-[17px] font-extrabold text-gray-900 dark:text-white mb-3">Property Summary</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-[#1e1e1e] rounded-[20px] p-4 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Properties</p>
                <div className="w-7 h-7 bg-[#F26922]/10 rounded-xl flex items-center justify-center"><Building2 className="w-4 h-4 text-[#F26922]" strokeWidth={2} /></div>
              </div>
              <p className="text-[28px] font-black text-gray-900 dark:text-white leading-none">{String(stats.totalBuildings).padStart(2, '0')}</p>
            </div>
            <div className="bg-white dark:bg-[#1e1e1e] rounded-[20px] p-4 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Occupied</p>
                <div className="w-7 h-7 bg-[#F26922]/10 rounded-xl flex items-center justify-center"><ShieldCheck className="w-4 h-4 text-[#F26922]" strokeWidth={2} /></div>
              </div>
              <p className="text-[28px] font-black text-gray-900 dark:text-white leading-none">{stats.occupiedUnits}<span className="text-[15px] font-bold text-gray-400">/{stats.totalUnits}</span></p>
            </div>
            <div className="bg-white dark:bg-[#1e1e1e] rounded-[20px] p-4 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Rent Collected</p>
                <div className="w-7 h-7 bg-[#F26922]/10 rounded-xl flex items-center justify-center"><Receipt className="w-4 h-4 text-[#F26922]" strokeWidth={2} /></div>
              </div>
              <p className="text-[20px] font-black text-gray-900 dark:text-white leading-none">{fmt(dashboardData?.rent_summary?.total_collected || 0)}<span className="text-[12px] font-bold text-gray-400">/{fmt(dashboardData?.rent_summary?.total_due || 0)}</span></p>
            </div>
            <div className="bg-white dark:bg-[#1e1e1e] rounded-[20px] p-4 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Maint. Request</p>
                <div className="w-7 h-7 bg-[#F26922]/10 rounded-xl flex items-center justify-center"><Wrench className="w-4 h-4 text-[#F26922]" strokeWidth={2} /></div>
              </div>
              <p className="text-[28px] font-black text-gray-900 dark:text-white leading-none">{String(dashboardData?.lease_alerts?.length || 0).padStart(2, '0')}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#1e1e1e] rounded-[24px] p-5 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-[16px] font-extrabold text-gray-900 dark:text-white">Occupancy Rates</h2>
            <button className="flex items-center gap-0.5 text-[12px] font-semibold text-gray-500">By Property</button>
          </div>
          <div className="flex gap-3">
            <div className="flex flex-col justify-between text-[9px] font-semibold text-gray-400 pb-5 shrink-0 select-none">
              <span>100%</span><span>70%</span><span>50%</span><span>10%</span>
            </div>
            <div className="flex-1 flex items-end gap-[7px] h-28">
              {mobileOccupancyBars.map(({ label, pct }, i) => (
                <div key={i} className="flex flex-col items-center flex-1 gap-1 h-full justify-end">
                  <div className="w-full flex items-end" style={{ height: '100%' }}>
                    <div className="w-full rounded-t-lg overflow-hidden" style={{ height: `${pct}%` }}>
                      <div className="w-full h-full bg-[#F26922]/15 relative">
                        <div className="absolute bottom-0 left-0 right-0 bg-[#F26922] rounded-t-lg" style={{ height: '60%' }} />
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] font-semibold text-gray-500">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-[16px] font-extrabold text-gray-900 dark:text-white">Recent Activity</h2>
            <button className="text-[12px] font-semibold text-gray-500 flex items-center gap-0.5">View all <ChevronRight className="w-3 h-3" /></button>
          </div>
          <div className="space-y-3">
            {feedEvents.slice(0, 3).map((event: any, idx: number) => {
              let Icon = CheckCircle2;
              let iconColor = 'text-emerald-500 bg-emerald-50';
              if (event.type === 'PAYMENT') { Icon = Receipt; iconColor = 'text-[#F26922] bg-[#F26922]/10'; }
              if (event.type === 'MAINTENANCE') { Icon = Wrench; iconColor = 'text-amber-500 bg-amber-50'; }
              if (event.type === 'ALERT') { Icon = Bell; iconColor = 'text-purple-500 bg-purple-50'; }

              return (
                <div key={idx} className="bg-white dark:bg-[#1e1e1e] rounded-[20px] p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${iconColor} flex items-center justify-center shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-gray-900 dark:text-white truncate">{event.title}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{event.description} · {event.time}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                  </div>
                </div>
              );
            })}
            {feedEvents.length === 0 && (
              <div className="text-center p-4 text-gray-500 text-sm">No recent activity</div>
            )}
          </div>
        </div>

        {/* ── Missing Financial Overview ── */}
        <div>
          <h2 className="text-[16px] font-extrabold text-gray-900 dark:text-white mb-3">Financial Overview</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-[#1e1e1e] rounded-[20px] p-4 shadow-sm">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Due</p>
              <p className="text-[18px] font-black text-red-500">₹{data.tenants.reduce((sum: number, t: any) => sum + (Number(t.due_amount) || 0), 0).toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-white dark:bg-[#1e1e1e] rounded-[20px] p-4 shadow-sm">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Coll. Effic.</p>
              <p className="text-[18px] font-black text-amber-500">{dashboardData?.rent_summary?.collection_efficiency || 0}%</p>
            </div>
          </div>
        </div>

        {/* ── Active Properties Cards ── */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-[16px] font-extrabold text-gray-900 dark:text-white">Your Properties</h2>
            <Link href="/admin/buildings" className="text-[12px] font-semibold text-gray-500 flex items-center gap-0.5">View all <ChevronRight className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-4">
            {data.buildings.slice(0, 5).map((b: any) => {
              const bTenants = data.tenants.filter((t: any) => t.property === b.id || t.building_id === b.id || t.property === b.name);
              const bRevenue = bTenants.reduce((sum: number, t: any) => {
                if (t.rent_status === 'Paid') return sum + (Number(t.rent_amount) || 0);
                if (t.rent_status === 'Partial') return sum + ((Number(t.rent_amount) || 0) - (Number(t.due_amount) || 0));
                return sum;
              }, 0);
              const bUnits = b.total_units || 0;
              const bOccupied = Array.isArray(b.units) ? b.units.filter((u:any) => u.is_occupied).length : 0;

              return (
                <div key={b.id || b.building_id} className="bg-white dark:bg-[#1e1e1e] rounded-[24px] p-5 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-[14px] bg-[#F26922]/10 flex items-center justify-center shrink-0">
                        <Building2 className="w-6 h-6 text-[#F26922]" />
                      </div>
                      <div>
                        <h3 className="text-[15px] font-black text-gray-900 dark:text-white">{b.name}</h3>
                        <p className="text-[10px] font-bold text-gray-400 mt-0.5 uppercase tracking-wider">{b.area_name || 'Location Pending'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-[#F5F4F2] dark:bg-[#111315] rounded-xl p-3 text-center">
                      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Units</p>
                      <p className="text-[14px] font-black text-gray-900 dark:text-white">{bUnits}</p>
                    </div>
                    <div className="bg-[#F5F4F2] dark:bg-[#111315] rounded-xl p-3 text-center">
                      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Occupied</p>
                      <p className="text-[14px] font-black text-[#F26922]">{bOccupied}</p>
                    </div>
                    <div className="bg-[#F5F4F2] dark:bg-[#111315] rounded-xl p-3 text-center">
                      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Revenue</p>
                      <p className="text-[14px] font-black text-emerald-600">{bRevenue >= 1000 ? `₹${(bRevenue/1000).toFixed(1)}k` : `₹${bRevenue}`}</p>
                    </div>
                  </div>

                  <Link href={`/admin/buildings/${b.id || b.building_id}`} className="w-full bg-[#111315] dark:bg-white text-white dark:text-[#111315] text-[11px] font-black uppercase tracking-widest py-3 rounded-xl flex items-center justify-center">
                    View Stats
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {mobile}
      <div className="hidden md:block min-h-screen bg-[#F5F3F0] dark:bg-[#09090b] relative overflow-x-hidden">
      
      <div className="absolute top-0 left-0 h-[700px] w-[56%] overflow-hidden pointer-events-none">
        <img
          src="/hero-bg.jpg"
          alt="Premium Villa"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent via-[75%] to-[#F5F3F0]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent via-[80%] to-[#F5F3F0]" />
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#F5F3F0]/40 to-transparent" />
      </div>

      <div className="relative z-10">

        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between px-10 h-20"
        >
          <div>
            <p className="text-[11px] font-black text-[#61605D] dark:text-gray-400/60 uppercase tracking-[0.25em]">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-white/70 dark:bg-[#18181b]/70 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl px-4 py-2.5 shadow-sm">
              <Search className="w-4 h-4 text-[#61605D] dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search properties, tenants..."
                className="bg-transparent text-sm font-medium text-[#121110] dark:text-white placeholder-[#61605D]/50 outline-none w-52"
              />
            </div>
            
            <button onClick={() => alert("Checking for notifications...")} className="relative p-3 bg-white/70 dark:bg-[#18181b]/70 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl shadow-sm hover:bg-white dark:bg-[#18181b] transition-all active:scale-95">
              <Bell className="w-5 h-5 text-[#61605D] dark:text-gray-400" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#F26922] rounded-full" />
            </button>
            <div onClick={() => alert("Admin profile settings")} className="flex items-center space-x-3 bg-white/70 dark:bg-[#18181b]/70 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl px-4 py-2 shadow-sm cursor-pointer hover:bg-white dark:bg-[#18181b] transition-all active:scale-95">
              <div className="w-8 h-8 rounded-xl overflow-hidden bg-[#F26922]/10 border border-[#F26922]/20">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin&backgroundColor=F26922" alt="Admin" className="w-full h-full" />
              </div>
              <div>
                <p className="text-xs font-black text-[#121110] dark:text-white capitalize">{displayName}</p>
              </div>
            </div>
          </div>
        </motion.header>

        <main className="max-w-[1600px] mx-auto px-10 space-y-10 pb-24">

          <div className="grid grid-cols-12 gap-8 items-start">
            <div className="col-span-12 lg:col-span-7 h-[500px]" />

            <motion.div
              variants={containerVariants}
              initial="initial"
              animate="animate"
              className="col-span-12 lg:col-span-5 space-y-8 pt-2"
            >
              <motion.div variants={itemVariants} className="space-y-3">
                <h1 className="text-5xl font-black tracking-tight leading-[1.1] text-[#121110] dark:text-white">
                  {greeting},<br /><span className="capitalize">{displayName.split(' ')[0]}</span>
                </h1>
                <p className="text-[#61605D] dark:text-gray-400 font-semibold text-base leading-relaxed">
                  Here's your live portfolio snapshot based on your active registrations.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-white/80 dark:bg-[#18181b]/80 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl p-5 shadow-sm">
                <div className="grid grid-cols-3 divide-x divide-[#F5F3F0]">
                  {[
                    { label: 'Properties', value: stats.totalBuildings, color: 'text-[#F26922]' },
                    { label: 'Total Units', value: stats.totalUnits, color: 'text-blue-500 dark:text-white' },
                    { label: 'Occupancy', value: `${stats.occupancyRate}%`, color: 'text-green-500' },
                  ].map((s, i) => (
                    <div key={i} className={`flex flex-col items-center ${i > 0 ? 'pl-4' : ''} ${i < 2 ? 'pr-4' : ''}`}>
                      <span className={`text-[#121110] dark:text-whitexl font-black ${s.color}`}>{s.value}</span>
                      <span className="text-[9px] font-black text-[#61605D] dark:text-gray-400/60 uppercase tracking-[0.2em] mt-1">{s.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <div className="grid grid-cols-3 gap-4">
                <MetricCard title="Total Properties" value={stats.totalBuildings.toString()} icon={Building2} color="text-[#F26922]" bgColor="bg-[#F26922]/10" delay={0} />
                <MetricCard title="Residential" value={stats.residential.toString()} icon={Home} color="text-blue-500 dark:text-white" bgColor="bg-blue-50" delay={0} />
                <MetricCard title="Commercial" value={stats.commercial.toString()} icon={Briefcase} color="text-purple-500" bgColor="bg-purple-50" delay={0} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <MetricCard title="Total Units" value={stats.totalUnits.toString()} icon={LayoutGrid} color="text-[#F26922]" bgColor="bg-[#F26922]/10" delay={0} />
                <MetricCard title="Occupied" value={stats.occupiedUnits.toString()} icon={CheckCircle2} color="text-green-500" bgColor="bg-green-50" delay={0} />
                <MetricCard title="Vacant" value={stats.vacantUnits.toString()} icon={XCircle} color="text-red-400" bgColor="bg-red-50" delay={0} />
              </div>
            </motion.div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-[#121110] dark:text-white tracking-tight">Key Metrics</h2>
              <button onClick={() => fetchData()} className="flex items-center space-x-1 text-[#F26922] text-sm font-black hover:underline underline-offset-4">
                <span>Refresh Live Data</span>
                <TrendingUp className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  title: 'Monthly Revenue', 
                  value: `₹${Number(dashboardData?.rent_summary?.total_collected || 0).toLocaleString('en-IN')}`, 
                  subtitle: 'This Month', 
                  icon: IndianRupee, 
                  color: 'text-emerald-600', 
                  bgColor: 'bg-emerald-50' 
                },
                { 
                  title: 'Occupancy %', 
                  value: `${dashboardData?.property_overview?.occupancy_percentage || 0}%`, 
                  subtitle: 'Active Tenants', 
                  icon: BadgeCheck, 
                  color: 'text-blue-600', 
                  bgColor: 'bg-blue-50' 
                },
                { 
                  title: 'Revenue Lost', 
                  value: `₹${Number(dashboardData?.rent_summary?.revenue_lost_to_vacancy || 0).toLocaleString('en-IN')}`, 
                  subtitle: 'Due to Vacancy', 
                  icon: AlertCircle, 
                  color: 'text-rose-500', 
                  bgColor: 'bg-rose-50' 
                },
                { 
                  title: 'Collection Efficiency', 
                  value: `${dashboardData?.rent_summary?.collection_efficiency || 0}%`, 
                  subtitle: 'Of Total Due', 
                  icon: BadgeCheck, 
                  color: 'text-amber-500', 
                  bgColor: 'bg-amber-50' 
                },
              ].map((m, i) => (
                <MetricCard key={i} {...m} delay={i * 0.08} />
              ))}
            </div>
          </div>

          {dashboardData?.lease_alerts && dashboardData.lease_alerts.length > 0 && (
            <div className="bg-amber-50 dark:bg-[#18181b] border border-amber-200 dark:border-amber-900/30 rounded-[3rem] p-10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400 rounded-full blur-[80px] opacity-10 pointer-events-none" />
              <div className="flex items-center space-x-3 mb-8 relative z-10">
                <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-2xl">
                  <Bell className="w-6 h-6 text-amber-600 dark:text-amber-500 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-amber-900 dark:text-amber-100 tracking-tight">Operational Alerts</h2>
                  <p className="text-sm font-semibold text-amber-700/70 dark:text-amber-500/70">Lease expiries in the next 30 days</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                {dashboardData.lease_alerts.map((alert: any, idx: number) => (
                  <div key={idx} className="bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl border border-amber-100 dark:border-amber-900/50 rounded-[24px] p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-lg font-black text-[#121110] dark:text-white tracking-tight">{alert.tenant_name}</p>
                        <p className="text-sm font-bold text-[#61605D] dark:text-gray-400 mt-1">Unit {alert.unit}</p>
                      </div>
                      <span className="px-4 py-2 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 text-[11px] font-black uppercase tracking-widest rounded-xl">
                        {alert.days_left} Days
                      </span>
                    </div>
                    <div className="mt-6 flex items-center justify-between bg-[#F5F3F0]/50 dark:bg-white/5 px-4 py-3 rounded-xl">
                      <span className="text-[11px] font-bold text-[#61605D] dark:text-gray-400 uppercase tracking-widest">
                        Likelihood
                      </span>
                      <span className="text-sm font-black text-[#121110] dark:text-white">
                        {alert.renewal_likelihood}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-[#121110] dark:text-white tracking-tight">Financial Overview</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { 
                  title: 'Rent Collected', 
                  value: `₹${data.tenants.reduce((sum, t) => {
                    if (t.rent_status === 'Paid') return sum + (Number(t.rent_amount) || 0);
                    if (t.rent_status === 'Partial') return sum + ((Number(t.rent_amount) || 0) - (Number(t.due_amount) || 0));
                    return sum;
                  }, 0).toLocaleString('en-IN')}`, 
                  subtitle: 'This Month', 
                  icon: IndianRupee, 
                  color: 'text-green-600', 
                  bgColor: 'bg-green-50' 
                },
                { 
                  title: 'Deposit Collected', 
                  value: `₹${Number(summary?.total_deposit_collected || 0).toLocaleString('en-IN')}`, 
                  subtitle: 'Active Tenants', 
                  icon: IndianRupee, 
                  color: 'text-[#F26922]', 
                  bgColor: 'bg-[#F26922]/10' 
                },
                { 
                  title: 'Total Due', 
                  value: `₹${data.tenants.reduce((sum, t) => sum + (Number(t.due_amount) || 0), 0).toLocaleString('en-IN')}`, 
                  subtitle: 'Awaiting', 
                  icon: AlertCircle, 
                  color: 'text-red-500', 
                  bgColor: 'bg-red-50' 
                },
                { title: 'Verified Units', value: stats.occupiedUnits.toString(), subtitle: 'With Tenants', icon: BadgeCheck, color: 'text-green-600', bgColor: 'bg-green-50' },
                { title: 'Available Units', value: stats.vacantUnits.toString(), subtitle: 'Ready to lease', icon: BadgeX, color: 'text-red-500', bgColor: 'bg-red-50' },
              ].map((m, i) => (
                <MetricCard key={i} {...m} delay={i * 0.08} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 bg-white/40 dark:bg-[#18181b]/40 backdrop-blur-xl rounded-[3rem] p-10 border border-white/60 dark:border-white/10 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-[#121110] dark:text-white text-xl font-black tracking-tight">Portfolio Analysis</h2>
                  <p className="text-sm font-bold text-[#61605D] dark:text-gray-400/60 uppercase tracking-widest mt-1">Growth & Occupancy Trends</p>
                </div>
                <div className="flex items-center space-x-2 bg-white/60 dark:bg-[#27272a]/60 p-1.5 rounded-2xl border border-white/40 dark:border-white/10 shadow-sm">
                  {['Monthly', 'Yearly'].map(t => (
                    <button key={t} className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${t === 'Monthly' ? 'bg-[#F26922] text-white shadow-md shadow-[#F26922]/20' : 'text-[#61605D] dark:text-gray-400 hover:text-[#121110] dark:text-white'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <DashboardCharts 
                buildings={data.buildings} 
                tenants={data.tenants} 
                delay={0} 
              />
            </div>

            <div className="xl:col-span-1 bg-white dark:bg-[#18181b] rounded-[3rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-[60px] opacity-10 pointer-events-none" />
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                  <h2 className="text-xl font-black text-[#121110] dark:text-white tracking-tight">Activity Feed</h2>
                  <p className="text-xs font-bold text-[#61605D] dark:text-gray-400/60 uppercase tracking-widest mt-1">Real-time Operations</p>
                </div>
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                  <Activity className="w-4 h-4 text-blue-500" />
                </div>
              </div>
              <div className="relative pl-4 border-l border-gray-100 dark:border-gray-800 space-y-6">
                {feedEvents.map((event, idx) => {
                  let Icon = CheckCircle2;
                  let iconColor = 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400';
                  if (event.type === 'PAYMENT') { Icon = IndianRupee; iconColor = 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'; }
                  if (event.type === 'MAINTENANCE') { Icon = Wrench; iconColor = 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400'; }
                  if (event.type === 'ALERT') { Icon = Clock; iconColor = 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400'; }
                  
                  return (
                    <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="relative">
                      <div className={`absolute -left-[23px] top-0.5 p-1 rounded-full bg-white dark:bg-[#18181b]`}>
                        <div className={`p-1 rounded-full ${iconColor}`}>
                          <Icon className="w-3 h-3" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-black text-[#1A1C1E] dark:text-white leading-tight">{event.title}</p>
                        <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 mt-1">{event.description}</p>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-2">{event.time}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-[#121110] dark:text-white tracking-tight">Active Portfolio Properties</h2>
              <Link href="/admin/buildings" className="text-sm font-black text-[#F26922] hover:underline underline-offset-4 flex items-center">
                <span>Manage All Properties</span>
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2.5rem] overflow-hidden shadow-sm p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#F5F3F0]">
                      <th className="px-6 py-5 text-[10px] font-black text-[#61605D] dark:text-gray-400/60 uppercase tracking-widest">S.No</th>
                      <th className="px-6 py-5 text-[10px] font-black text-[#61605D] dark:text-gray-400/60 uppercase tracking-widest">Property Details</th>
                      <th className="px-6 py-5 text-[10px] font-black text-[#61605D] dark:text-gray-400/60 uppercase tracking-widest">Type</th>
                      <th className="px-6 py-5 text-[10px] font-black text-[#61605D] dark:text-gray-400/60 uppercase tracking-widest">Total Units</th>
                      <th className="px-6 py-5 text-[10px] font-black text-[#61605D] dark:text-gray-400/60 uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5F3F0]">
                    {data.buildings.length > 0 ? (
                      data.buildings.slice(0, 5).map((b, index) => (
                        <tr key={b.id || b.building_id} className="hover:bg-white/60 transition-all group">
                          <td className="px-6 py-6 text-sm font-bold text-[#61605D] dark:text-gray-400">{index + 1}</td>
                          <td className="px-6 py-6">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F26922]/10 to-transparent flex items-center justify-center border border-[#F26922]/10">
                                <Building2 className="w-5 h-5 text-[#F26922]" />
                              </div>
                              <div>
                                <p className="text-sm font-black text-[#121110] dark:text-white group-hover:text-[#F26922] transition-colors">{b.name}</p>
                                <p className="text-[10px] font-bold text-[#61605D] dark:text-gray-400/60 uppercase tracking-wider">{b.area_name || 'Location Pending'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${b.building_type === 'Residential' ? 'bg-blue-50 text-blue-500 dark:text-white' : 'bg-purple-50 text-purple-500'}`}>
                              {b.building_type}
                            </span>
                          </td>
                          <td className="px-6 py-6">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-black text-[#121110] dark:text-white">{b.total_units}</span>
                              <span className="text-[10px] font-bold text-[#61605D] dark:text-gray-400/60 uppercase tracking-tight">Units</span>
                            </div>
                          </td>
                          <td className="px-6 py-6 text-right">
                            <Link 
                              href={`/admin/buildings/${b.id || b.building_id}`}
                              className="inline-flex items-center space-x-2 px-4 py-2 bg-white dark:bg-[#18181b] border border-[#E2E8F0] dark:border-gray-800 rounded-xl text-[11px] font-black uppercase tracking-wider text-[#121110] dark:text-white hover:bg-[#F26922] hover:text-white hover:border-[#F26922] transition-all shadow-sm"
                            >
                              <span>View Stats</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center space-y-3 opacity-30">
                            <Building2 className="w-10 h-10" />
                            <p className="text-sm font-black uppercase tracking-widest">No Active Properties Found</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
    </>
  );
}
