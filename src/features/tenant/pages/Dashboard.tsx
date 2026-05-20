"use client";

import { useEffect, useState } from 'react';
import DashboardCards from '../components/DashboardCards';
import FeesBreakdown from '../components/FeesBreakdown';
import PaymentHistory from '../components/PaymentHistory';
import { paymentsApi } from '../../admin/payments/api/paymentsApi';
import { PaymentRequest } from '../../admin/payments/types';

import { apiRequest } from '../../../features/api/api';

export default function Dashboard() {
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paymentsData, profileData] = await Promise.all([
          paymentsApi.getTenantPayments(),
          apiRequest('/users/tenants/me/').catch(() => null)
        ]);
        setPayments(Array.isArray(paymentsData) ? paymentsData : (paymentsData as any).results || []);
        if (profileData) setProfile(profileData);
      } catch (err: any) {
        console.error('Failed to fetch dashboard data:', err);
        setPayments([]);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tenant Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome! Here is the overview of your rental account.</p>
      </div>
      
      <DashboardCards payments={payments} profile={profile} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <FeesBreakdown payments={payments} />
        </div>
        <div className="lg:col-span-2">
          <PaymentHistory payments={payments} />
        </div>
      </div>
    </div>
  );
}