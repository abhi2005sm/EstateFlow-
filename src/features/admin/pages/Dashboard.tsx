"use client";

import { useState, useEffect } from 'react';
import DashboardCards from '../components/DashboardCards';
import RentCharts from '../components/RentCharts';
import DefaultersList from '../components/DefaultersList';
import { dashboardApi } from '../dashboard/api/dashboardApi';
import { Loader2, Bell, ShieldCheck } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const result = await dashboardApi.getOwnerDashboard();
        setData(result);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 dark:text-white animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load dashboard data.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Owner Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Welcome back. Here is the overview of your properties and rent collections.</p>
      </div>

      {data.lease_alerts && data.lease_alerts.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-[24px] p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <Bell className="w-5 h-5 text-amber-600 dark:text-amber-500 animate-pulse" />
            <h2 className="text-xl font-bold text-amber-900 dark:text-amber-100 tracking-tight">Operational Alerts</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.lease_alerts.map((alert: any, idx: number) => (
              <div key={idx} className="bg-white dark:bg-[#18181b] border border-amber-100 dark:border-amber-900/50 rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{alert.tenant_name}</p>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">Unit {alert.unit}</p>
                  </div>
                  <span className="px-3 py-1.5 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-md">
                    {alert.days_left} Days Left
                  </span>
                </div>
                <div className="mt-5 flex items-center space-x-2 bg-gray-50 dark:bg-[#09090b] px-3 py-2 rounded-lg border border-gray-100 dark:border-gray-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                    Renewal Likelihood: <span className="font-bold text-gray-900 dark:text-white">{alert.renewal_likelihood}</span>
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
}