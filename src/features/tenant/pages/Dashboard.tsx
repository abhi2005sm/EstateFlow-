"use client";

import { useEffect, useState } from 'react';
import DashboardCards from '../components/DashboardCards';
import FeesBreakdown from '../components/FeesBreakdown';
import PaymentHistory from '../components/PaymentHistory';
import { paymentsApi } from '../../admin/payments/api/paymentsApi';
import { PaymentRequest } from '../../admin/payments/types';

import { apiRequest } from '../../../features/api/api';
import { Shield, Bell, User, UserPlus, CreditCard as CreditCardIcon, MessageSquare, Users, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [profile, setProfile] = useState<any>(null);

  const [visitors, setVisitors] = useState<any[]>([]);
  const [securityStaff, setSecurityStaff] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paymentsData, profileData, visitorsData, staffData] = await Promise.all([
          paymentsApi.getTenantPayments(),
          apiRequest('/users/tenants/me/').catch(() => null),
          apiRequest('/users/security/visitors/').catch(() => []),
          apiRequest('/users/security/staff/').catch(() => [])
        ]);
        setPayments(Array.isArray(paymentsData) ? paymentsData : (paymentsData as any).results || []);
        if (profileData) setProfile(profileData);
        setVisitors(Array.isArray(visitorsData) ? visitorsData : (visitorsData as any).results || []);
        setSecurityStaff(Array.isArray(staffData) ? staffData : (staffData as any).results || []);
      } catch (err: any) {
        console.error('Failed to fetch dashboard data:', err);
        setPayments([]);
      }
    };
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);
  const handleConfirmVacate = async () => {
    if (!profile) return;
    const tenantId = profile.tenant_id || profile.id;
    try {
      await apiRequest(`/users/tenants/${tenantId}/confirm-vacate/`, { method: 'POST' });
      alert("Vacate confirmed successfully. Deposit received.");
      setProfile({ ...profile, vacate_status: 'Vacated' });
    } catch (error) {
      alert("Failed to confirm vacate.");
      console.error(error);
    }
  };

  const handleVisitorAction = async (id: number, action: 'approve' | 'reject') => {
    try {
      await apiRequest(`/users/security/visitors/${id}/action/`, {
        method: 'POST',
        body: JSON.stringify({ action })
      });
      const visitorsData = await apiRequest('/users/security/visitors/').catch(() => []);
      setVisitors(Array.isArray(visitorsData) ? visitorsData : (visitorsData as any).results || []);
    } catch (err) {
      alert("Failed to process visitor action.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Mobile MyGate-Style Dashboard */}
      <div className="md:hidden space-y-6 pb-6">
        {/* Profile Card */}
        <div className="bg-[#1e1e1e] text-white p-6 rounded-b-[32px] shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-400">Welcome</p>
              <h2 className="text-2xl font-black mt-1">{profile?.name || 'Tenant'}</h2>
              <p className="text-sm text-[#F26922] font-bold mt-1 tracking-wider uppercase">Unit {profile?.unit?.unit_number || profile?.unit || 'N/A'}</p>
            </div>
            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center">
              <User className="w-7 h-7" />
            </div>
          </div>
        </div>

        <div className="px-5 space-y-6">
          {/* Quick Actions */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Quick Actions</h3>
              <button className="text-xs font-bold text-blue-600 dark:text-blue-500">Customise</button>
            </div>
            <div className="grid grid-cols-4 gap-y-6 gap-x-2">
              <Link href="/tenant/visitors" className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 bg-white dark:bg-[#27272a] rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-800">
                  <UserPlus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 text-center leading-tight">Visitor<br/>Requests</span>
              </Link>
              <Link href="/tenant/payments" className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 bg-white dark:bg-[#27272a] rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-800">
                  <CreditCardIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 text-center leading-tight">Pay<br/>Rent</span>
              </Link>
              <Link href="/tenant/requests" className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 bg-white dark:bg-[#27272a] rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-800">
                  <MessageSquare className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 text-center leading-tight">Raise<br/>Complaint</span>
              </Link>
              <Link href="/tenant/community" className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 bg-white dark:bg-[#27272a] rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-800">
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 text-center leading-tight">Community</span>
              </Link>
            </div>
          </div>

          {/* Visitor Requests (MyGate Style) */}
          {visitors.some(v => v.status === 'PENDING' || v.status === 'Pending') && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Pending Visitors</h3>
              <div className="space-y-3">
                {visitors.filter(v => v.status === 'PENDING' || v.status === 'Pending').map(visitor => (
                  <div key={visitor.request_id || visitor.id} className="p-4 bg-white dark:bg-[#27272a] rounded-2xl flex flex-col items-center border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                    <div className="flex flex-col items-center space-y-2 mb-4">
                      <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-amber-500" />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-black text-gray-900 dark:text-white">{visitor.visitor_name}</p>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{visitor.purpose}</p>
                        <p className="text-[10px] font-semibold text-gray-400 mt-1">Waiting Approval</p>
                      </div>
                    </div>
                    <div className="flex w-full space-x-3">
                      <button onClick={() => handleVisitorAction(visitor.request_id || visitor.id, 'reject')} className="flex-1 py-3 bg-red-50 text-red-600 hover:bg-red-100 font-black text-sm rounded-xl transition-colors flex items-center justify-center gap-2">
                         <XCircle className="w-4 h-4" /> Reject
                      </button>
                      <button onClick={() => handleVisitorAction(visitor.request_id || visitor.id, 'approve')} className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Required: Vacate Request Initiated */}
          {profile?.vacate_status === 'Pending Confirmation' && (
            <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/50 p-4 rounded-2xl shadow-sm">
              <h3 className="text-amber-800 dark:text-amber-200 font-bold text-sm mb-2">Action Required</h3>
              <p className="text-amber-700 dark:text-amber-300 text-xs mb-3">
                Vacate request initiated. Confirm deposit return of <span className="font-black">₹{Number(profile.deposit_amount || 0).toLocaleString('en-IN')}</span>.
              </p>
              <button 
                onClick={handleConfirmVacate}
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm"
              >
                Confirm Deposit Received
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Dashboard */}
      <div className="hidden md:block space-y-8">
        {profile?.vacate_status === 'Pending Confirmation' && (
          <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/50 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between shadow-sm">
            <div>
              <h3 className="text-amber-800 dark:text-amber-200 font-bold text-lg">Action Required: Vacate Request Initiated</h3>
              <p className="text-amber-700 dark:text-amber-300 mt-1">
                Your landlord has initiated a vacate request. Please confirm you have received your deposit return of <span className="font-black">₹{Number(profile.deposit_amount || 0).toLocaleString('en-IN')}</span>.
              </p>
            </div>
            <button 
              onClick={handleConfirmVacate}
              className="mt-4 md:mt-0 whitespace-nowrap px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95"
            >
              Confirm Deposit Received & Vacate
            </button>
          </div>
        )}

        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tenant Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Welcome! Here is the overview of your rental account.</p>
        </div>
        
        <DashboardCards payments={payments} profile={profile} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <FeesBreakdown payments={payments} />

            {/* Security Information Card */}
            <div className="bg-white dark:bg-[#18181b] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-black text-[#121110] dark:text-white flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-emerald-500" />
                Building Security
              </h3>
              <div className="space-y-3">
                {securityStaff.map(staff => (
                  <div key={staff.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#27272a]/50 rounded-xl">
                    <div>
                      <p className="text-sm font-bold text-[#121110] dark:text-white">{staff.name}</p>
                      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">{staff.shift_start} - {staff.shift_end}</p>
                    </div>
                    <p className="text-xs font-black text-emerald-600">{staff.phone}</p>
                  </div>
                ))}
                {securityStaff.length === 0 && <p className="text-sm text-gray-400">No active guards.</p>}
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            {/* Visitor Requests */}
            {visitors.some(v => v.status === 'PENDING' || v.status === 'Pending') && (
              <div className="bg-white dark:bg-[#18181b] rounded-3xl p-6 shadow-sm border border-amber-200 dark:border-amber-900/30">
                <h3 className="text-lg font-black text-[#121110] dark:text-white mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-500" />
                  Pending Visitor Requests
                </h3>
                <div className="space-y-3">
                  {visitors.filter(v => v.status === 'PENDING' || v.status === 'Pending').map(visitor => (
                    <div key={visitor.request_id || visitor.id} className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl flex flex-col md:flex-row items-center justify-between border border-amber-100 dark:border-amber-900/50">
                      <div className="flex items-center space-x-4 mb-4 md:mb-0">
                        <div className="w-10 h-10 bg-white dark:bg-[#18181b] rounded-xl flex items-center justify-center shadow-sm">
                          <User className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-[#121110] dark:text-white">{visitor.visitor_name}</p>
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{visitor.purpose} • {new Date(visitor.created_at).toLocaleTimeString()}</p>
                          <p className="text-[10px] font-semibold text-gray-400 mt-1">Guard: {visitor.security_staff_name || 'Gate Security'}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => handleVisitorAction(visitor.request_id || visitor.id, 'reject')} className="px-4 py-2 bg-white dark:bg-[#18181b] text-red-500 hover:bg-red-50 font-black text-xs rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">Reject</button>
                        <button onClick={() => handleVisitorAction(visitor.request_id || visitor.id, 'approve')} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-xl shadow-sm transition-colors">Approve Entry</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <PaymentHistory payments={payments} />
          </div>
        </div>
      </div>
    </div>
  );
}