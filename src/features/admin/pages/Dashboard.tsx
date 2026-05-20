"use client";

import { useState, useEffect } from 'react';
import DashboardCards from '../components/DashboardCards';
import RentCharts from '../components/RentCharts';
import DefaultersList from '../components/DefaultersList';
import { dashboardApi } from '../dashboard/api/dashboardApi';
import { Loader2 } from 'lucide-react';

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
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
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
        <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome back. Here is the overview of your properties and rent collections.</p>
      </div>
      
      <DashboardCards data={data} />
      <RentCharts data={data} />
      <DefaultersList data={data} />
    </div>
  );
}