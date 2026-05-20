"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import MetricCard from '../components/rp/MetricCard';
import DashboardCharts from '../components/rp/DashboardCharts';
import { Building2, Home, Briefcase, LayoutGrid, CheckCircle2, XCircle, DollarSign, AlertCircle, BadgeCheck, BadgeX, Bell, Search, TrendingUp, ArrowUpRight, Loader2 } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { buildingsApi } from '../buildings/api/buildingsApi';
import { tenantsApi } from '../tenants/api/tenantsApi';

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

  const fetchData = async () => {
    try {
      const [buildingsRes, tenantsRes] = await Promise.allSettled([
        buildingsApi.getBuildings(),
        tenantsApi.getTenants()
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

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  if (data.loading) {
    return (
      <div className="min-h-screen bg-[#F5F3F0] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 text-[#F26922] animate-spin" />
          <p className="text-[#61605D] font-black uppercase tracking-widest text-xs">Synchronizing Portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3F0] relative overflow-x-hidden">
      
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
            <p className="text-[11px] font-black text-[#61605D]/60 uppercase tracking-[0.25em]">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl px-4 py-2.5 shadow-sm">
              <Search className="w-4 h-4 text-[#61605D]" />
              <input
                type="text"
                placeholder="Search properties, tenants..."
                className="bg-transparent text-sm font-medium text-[#121110] placeholder-[#61605D]/50 outline-none w-52"
              />
            </div>
            
            <button onClick={() => alert("Checking for notifications...")} className="relative p-3 bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-sm hover:bg-white transition-all active:scale-95">
              <Bell className="w-5 h-5 text-[#61605D]" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#F26922] rounded-full" />
            </button>
            <div onClick={() => alert("Admin profile settings")} className="flex items-center space-x-3 bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl px-4 py-2 shadow-sm cursor-pointer hover:bg-white transition-all active:scale-95">
              <div className="w-8 h-8 rounded-xl overflow-hidden bg-[#F26922]/10 border border-[#F26922]/20">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin&backgroundColor=F26922" alt="Admin" className="w-full h-full" />
              </div>
              <div>
                <p className="text-xs font-black text-[#121110] capitalize">{displayName}</p>
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
                <h1 className="text-5xl font-black tracking-tight leading-[1.1] text-[#121110]">
                  {greeting},<br /><span className="capitalize">{displayName.split(' ')[0]}</span>
                </h1>
                <p className="text-[#61605D] font-semibold text-base leading-relaxed">
                  Here's your live portfolio snapshot based on your active registrations.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-5 shadow-sm">
                <div className="grid grid-cols-3 divide-x divide-[#F5F3F0]">
                  {[
                    { label: 'Properties', value: stats.totalBuildings, color: 'text-[#F26922]' },
                    { label: 'Total Units', value: stats.totalUnits, color: 'text-blue-500' },
                    { label: 'Occupancy', value: `${stats.occupancyRate}%`, color: 'text-green-500' },
                  ].map((s, i) => (
                    <div key={i} className={`flex flex-col items-center ${i > 0 ? 'pl-4' : ''} ${i < 2 ? 'pr-4' : ''}`}>
                      <span className={`text-2xl font-black ${s.color}`}>{s.value}</span>
                      <span className="text-[9px] font-black text-[#61605D]/60 uppercase tracking-[0.2em] mt-1">{s.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <div className="grid grid-cols-3 gap-4">
                <MetricCard title="Total Properties" value={stats.totalBuildings.toString()} icon={Building2} color="text-[#F26922]" bgColor="bg-[#F26922]/10" delay={0} />
                <MetricCard title="Residential" value={stats.residential.toString()} icon={Home} color="text-blue-500" bgColor="bg-blue-50" delay={0} />
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
              <h2 className="text-xl font-black text-[#121110] tracking-tight">Financial Overview</h2>
              <button onClick={() => fetchData()} className="flex items-center space-x-1 text-[#F26922] text-sm font-black hover:underline underline-offset-4">
                <span>Refresh Live Data</span>
                <TrendingUp className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  title: 'Rent Collected', 
                  value: `₹${data.tenants.reduce((sum, t) => t.rentStatus === 'Paid' ? sum + (Number(t.rentAmount) || 0) : sum, 0).toLocaleString('en-IN')}`, 
                  subtitle: 'This Month', 
                  icon: DollarSign, 
                  color: 'text-green-600', 
                  bgColor: 'bg-green-50' 
                },
                { 
                  title: 'Total Due', 
                  value: `₹${data.tenants.reduce((sum, t) => sum + (Number(t.dueAmount) || 0), 0).toLocaleString('en-IN')}`, 
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

          <div className="bg-white/40 backdrop-blur-xl rounded-[3rem] p-10 border border-white/60">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-[#121110] tracking-tight">Portfolio Analysis</h2>
                <p className="text-sm font-bold text-[#61605D]/60 uppercase tracking-widest mt-1">Growth & Occupancy Trends</p>
              </div>
              <div className="flex items-center space-x-2 bg-white/60 p-1.5 rounded-2xl border border-white/40 shadow-sm">
                {['Monthly', 'Yearly'].map(t => (
                  <button key={t} className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${t === 'Monthly' ? 'bg-[#F26922] text-white shadow-md shadow-[#F26922]/20' : 'text-[#61605D] hover:text-[#121110]'}`}>
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

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-[#121110] tracking-tight">Active Portfolio Properties</h2>
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
                      <th className="px-6 py-5 text-[10px] font-black text-[#61605D]/60 uppercase tracking-widest">S.No</th>
                      <th className="px-6 py-5 text-[10px] font-black text-[#61605D]/60 uppercase tracking-widest">Property Details</th>
                      <th className="px-6 py-5 text-[10px] font-black text-[#61605D]/60 uppercase tracking-widest">Type</th>
                      <th className="px-6 py-5 text-[10px] font-black text-[#61605D]/60 uppercase tracking-widest">Total Units</th>
                      <th className="px-6 py-5 text-[10px] font-black text-[#61605D]/60 uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5F3F0]">
                    {data.buildings.length > 0 ? (
                      data.buildings.slice(0, 5).map((b, index) => (
                        <tr key={b.id || b.building_id} className="hover:bg-white/60 transition-all group">
                          <td className="px-6 py-6 text-sm font-bold text-[#61605D]">{index + 1}</td>
                          <td className="px-6 py-6">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F26922]/10 to-transparent flex items-center justify-center border border-[#F26922]/10">
                                <Building2 className="w-5 h-5 text-[#F26922]" />
                              </div>
                              <div>
                                <p className="text-sm font-black text-[#121110] group-hover:text-[#F26922] transition-colors">{b.name}</p>
                                <p className="text-[10px] font-bold text-[#61605D]/60 uppercase tracking-wider">{b.area_name || 'Location Pending'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${b.building_type === 'Residential' ? 'bg-blue-50 text-blue-500' : 'bg-purple-50 text-purple-500'}`}>
                              {b.building_type}
                            </span>
                          </td>
                          <td className="px-6 py-6">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-black text-[#121110]">{b.total_units}</span>
                              <span className="text-[10px] font-bold text-[#61605D]/60 uppercase tracking-tight">Units</span>
                            </div>
                          </td>
                          <td className="px-6 py-6 text-right">
                            <Link 
                              href={`/admin/buildings/${b.id || b.building_id}`}
                              className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-[#E2E8F0] rounded-xl text-[11px] font-black uppercase tracking-wider text-[#121110] hover:bg-[#F26922] hover:text-white hover:border-[#F26922] transition-all shadow-sm"
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
  );
}
