"use client";

import { useState, useEffect } from 'react';
import { dashboardApi } from '../dashboard/api/dashboardApi';
import {
  Loader2, Bell, Plus, Building2, ShieldCheck, Receipt,
  Wrench, ChevronRight, Users, TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

// ─── Desktop-only imports ────────────────────────────────────────────────────
import DashboardCards from '../components/DashboardCards';
import RentCharts from '../components/RentCharts';
import DefaultersList from '../components/DefaultersList';

const BARS = [
  { label: 'Feb', pct: 72 },
  { label: 'Mar', pct: 55 },
  { label: 'Apr', pct: 48 },
  { label: 'May', pct: 88 },
  { label: 'Jun', pct: 65 },
  { label: 'Jul', pct: 78 },
];

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi
      .getOwnerDashboard()
      .then(setData)
      .catch((e) => console.error('Dashboard fetch failed', e))
      .finally(() => setLoading(false));
  }, []);

  /* ─── Loading ─────────────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F5F4F2] dark:bg-[#111315]">
        <Loader2 className="w-10 h-10 text-[#F26922] animate-spin" />
      </div>
    );
  }

  /* ─── Error ───────────────────────────────────────────────────────────── */
  if (!data) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load dashboard data.
      </div>
    );
  }

  /* ─── Derived values ──────────────────────────────────────────────────── */
  const buildings   = data.property_overview?.total_buildings ?? 0;
  const occupied    = data.property_overview?.occupied_units  ?? 0;
  const total       = data.property_overview?.total_units     ?? 0;
  const collected   = data.rent_summary?.total_collected      ?? 0;
  const due         = data.rent_summary?.total_due            ?? 0;
  const maintCount  = data.lease_alerts?.length               ?? 0;

  const fmt = (n: number) =>
    '₹' + Number(n).toLocaleString('en-IN');

  /* ─── Mobile layout ───────────────────────────────────────────────────── */
  const mobile = (
    <div className="md:hidden bg-[#F5F4F2] dark:bg-[#111315] min-h-screen pb-24">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 pt-7 pb-5">
        <div className="flex items-center gap-3">
          <img
            src="https://ui-avatars.com/api/?name=Rahul&background=F26922&color=fff&bold=true&size=80"
            alt="Avatar"
            className="w-11 h-11 rounded-full"
          />
          <div>
            <p className="text-[16px] font-extrabold text-gray-900 dark:text-white leading-tight">
              Rahul
            </p>
            <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium">
              Property manager
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/buildings"
            className="w-9 h-9 rounded-full bg-white dark:bg-[#1e1e1e] shadow-sm flex items-center justify-center"
          >
            <Plus className="w-4 h-4 text-gray-700 dark:text-gray-200" />
          </Link>
          <button className="w-9 h-9 rounded-full bg-white dark:bg-[#1e1e1e] shadow-sm flex items-center justify-center">
            <Bell className="w-4 h-4 text-gray-700 dark:text-gray-200" />
          </button>
        </div>
      </div>

      <div className="px-5 space-y-5">

        {/* ── Property Summary ── */}
        <div>
          <h2 className="text-[17px] font-extrabold text-gray-900 dark:text-white mb-3">
            Property Summary
          </h2>

          {/* 2 × 2 grid — icon top-right, label top-left, big number bottom-left */}
          <div className="grid grid-cols-2 gap-3">

            {/* Properties */}
            <div className="bg-white dark:bg-[#1e1e1e] rounded-[20px] p-4 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Properties
                </p>
                <div className="w-7 h-7 bg-[#F26922]/10 rounded-xl flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-[#F26922]" strokeWidth={2} />
                </div>
              </div>
              <p className="text-[28px] font-black text-gray-900 dark:text-white leading-none">
                {String(buildings).padStart(2, '0')}
              </p>
            </div>

            {/* Occupied */}
            <div className="bg-white dark:bg-[#1e1e1e] rounded-[20px] p-4 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Occupied
                </p>
                <div className="w-7 h-7 bg-[#F26922]/10 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-[#F26922]" strokeWidth={2} />
                </div>
              </div>
              <p className="text-[28px] font-black text-gray-900 dark:text-white leading-none">
                {occupied}
                <span className="text-[15px] font-bold text-gray-400">
                  /{total}
                </span>
              </p>
            </div>

            {/* Rent Collected */}
            <div className="bg-white dark:bg-[#1e1e1e] rounded-[20px] p-4 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Rent Collected
                </p>
                <div className="w-7 h-7 bg-[#F26922]/10 rounded-xl flex items-center justify-center">
                  <Receipt className="w-4 h-4 text-[#F26922]" strokeWidth={2} />
                </div>
              </div>
              <p className="text-[20px] font-black text-gray-900 dark:text-white leading-none">
                {fmt(collected)}
                <span className="text-[12px] font-bold text-gray-400">
                  /{fmt(due)}
                </span>
              </p>
            </div>

            {/* Maint. Request */}
            <div className="bg-white dark:bg-[#1e1e1e] rounded-[20px] p-4 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Maint. Request
                </p>
                <div className="w-7 h-7 bg-[#F26922]/10 rounded-xl flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-[#F26922]" strokeWidth={2} />
                </div>
              </div>
              <p className="text-[28px] font-black text-gray-900 dark:text-white leading-none">
                {String(maintCount).padStart(2, '0')}
              </p>
            </div>

          </div>
        </div>

        {/* ── Occupancy Rates ── */}
        <div className="bg-white dark:bg-[#1e1e1e] rounded-[24px] p-5 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-[16px] font-extrabold text-gray-900 dark:text-white">
              Occupancy Rates
            </h2>
            <button className="flex items-center gap-0.5 text-[12px] font-semibold text-gray-500">
              Monthly <ChevronRight className="w-3 h-3 rotate-90" />
            </button>
          </div>

          <div className="flex gap-3">
            {/* Y-axis labels */}
            <div className="flex flex-col justify-between text-[9px] font-semibold text-gray-400 pb-5 shrink-0 select-none">
              <span>100%</span>
              <span>70%</span>
              <span>50%</span>
              <span>10%</span>
            </div>

            {/* Bars */}
            <div className="flex-1 flex items-end gap-[7px] h-28">
              {BARS.map(({ label, pct }) => (
                <div key={label} className="flex flex-col items-center flex-1 gap-1 h-full justify-end">
                  {/* container at full col height, bar grows from bottom */}
                  <div className="w-full flex items-end" style={{ height: '100%' }}>
                    <div
                      className="w-full rounded-t-lg overflow-hidden"
                      style={{ height: `${pct}%` }}
                    >
                      {/* light track */}
                      <div className="w-full h-full bg-[#F26922]/15 relative">
                        {/* solid fill at 60% of track */}
                        <div
                          className="absolute bottom-0 left-0 right-0 bg-[#F26922] rounded-t-lg"
                          style={{ height: '60%' }}
                        />
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] font-semibold text-gray-500">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Recent Activity ── */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-[16px] font-extrabold text-gray-900 dark:text-white">
              Recent Activity
            </h2>
            <button className="text-[12px] font-semibold text-gray-500 flex items-center gap-0.5">
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="bg-white dark:bg-[#1e1e1e] rounded-[20px] p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F26922]/10 flex items-center justify-center shrink-0">
                <Receipt className="w-5 h-5 text-[#F26922]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-gray-900 dark:text-white truncate">
                  Rent paid by Jane Doe for Unit 101
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  2nd Mar 2025 · 10:00 AM
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );

  /* ─── Desktop layout ──────────────────────────────────────────────────── */
  const desktop = (
    <div className="hidden md:block p-6 space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Owner Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Welcome back. Here is the overview of your properties and rent
          collections.
        </p>
      </div>

      {data.lease_alerts && data.lease_alerts.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-[24px] p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <Bell className="w-5 h-5 text-amber-600 dark:text-amber-500 animate-pulse" />
            <h2 className="text-xl font-bold text-amber-900 dark:text-amber-100 tracking-tight">
              Operational Alerts
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.lease_alerts.map((alert: any, idx: number) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#18181b] border border-amber-100 dark:border-amber-900/50 rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {alert.tenant_name}
                    </p>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">
                      Unit {alert.unit}
                    </p>
                  </div>
                  <span className="px-3 py-1.5 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-md">
                    {alert.days_left} Days Left
                  </span>
                </div>
                <div className="mt-5 flex items-center space-x-2 bg-gray-50 dark:bg-[#09090b] px-3 py-2 rounded-lg border border-gray-100 dark:border-gray-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                    Renewal Likelihood:{' '}
                    <span className="font-bold text-gray-900 dark:text-white">
                      {alert.renewal_likelihood}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <DashboardCards data={data} />
      <RentCharts data={data} />
      <DefaultersList data={data} />
    </div>
  );

  return (
    <>
      {mobile}
      {desktop}
    </>
  );
}