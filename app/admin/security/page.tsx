"use client";

import { useState, useEffect } from 'react';
import { Shield, Plus, Building2, Users, UserPlus, KeyRound, Activity } from 'lucide-react';
import { apiRequest } from '@/src/features/api/api';

export default function SecurityManagement() {
  const [buildings, setBuildings] = useState<any[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  
  const [analytics, setAnalytics] = useState<any>(null);
  const [staffList, setStaffList] = useState<any[]>([]);
  
  // Forms
  const [accountForm, setAccountForm] = useState({ username: '', password: '' });
  const [staffForm, setStaffForm] = useState({ name: '', phone: '', shift_start: '08:00', shift_end: '20:00' });

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const res = await apiRequest('/users/buildings/');
        const bList = Array.isArray(res) ? res : res.buildings || res.results || [];
        setBuildings(bList);
        if (bList.length > 0) setSelectedBuilding(bList[0].building_id.toString());
      } catch (err) {
        console.error("Failed to fetch buildings", err);
      }
    };
    fetchBuildings();
  }, []);

  useEffect(() => {
    if (selectedBuilding) {
      loadSecurityData();
    }
  }, [selectedBuilding]);

  const loadSecurityData = async () => {
    try {
      const staffRes = await apiRequest(`/users/security/staff/?building_id=${selectedBuilding}`);
      setStaffList(Array.isArray(staffRes) ? staffRes : staffRes.results || []);
      
      const analyticsRes = await apiRequest(`/users/security/analytics/?building_id=${selectedBuilding}`);
      setAnalytics(analyticsRes);
    } catch (err) {
      console.error("Failed to load security data", err);
    }
  };

  const createAccount = async (e: any) => {
    e.preventDefault();
    try {
      await apiRequest('/auth/register-security/', {
        method: 'POST',
        body: JSON.stringify({ ...accountForm, building_id: selectedBuilding })
      });
      alert('Security Account created successfully!');
      setAccountForm({ username: '', password: '' });
    } catch (err) {
      alert('Failed to create account.');
    }
  };

  const addStaff = async (e: any) => {
    e.preventDefault();
    try {
      await apiRequest('/users/security/staff/', {
        method: 'POST',
        body: JSON.stringify({ ...staffForm, building: selectedBuilding })
      });
      loadSecurityData();
      setStaffForm({ name: '', phone: '', shift_start: '08:00', shift_end: '20:00' });
    } catch (err) {
      alert('Failed to add staff.');
    }
  };

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-10 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-[#121110] dark:text-white tracking-tight">Security Command Center</h1>
          <p className="text-sm font-bold text-[#61605D] dark:text-gray-400 uppercase tracking-widest mt-2">Manage physical security & visitor logs</p>
        </div>
        <div className="flex items-center space-x-3 bg-white dark:bg-[#18181b] p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <Building2 className="w-5 h-5 text-gray-500 ml-2" />
          <select 
            value={selectedBuilding} 
            onChange={(e) => setSelectedBuilding(e.target.value)}
            className="bg-transparent border-none text-sm font-black outline-none cursor-pointer pr-4"
          >
            {buildings.map(b => <option key={b.building_id} value={b.building_id}>{b.name}</option>)}
          </select>
        </div>
      </div>

      {selectedBuilding ? (
        <>
          {/* Analytics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Visitors', value: analytics?.total_visitors || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Pending Requests', value: analytics?.pending_requests || 0, icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Rejected Entries', value: analytics?.rejected_requests || 0, icon: Shield, color: 'text-red-600', bg: 'bg-red-50' },
              { label: 'Active Guards', value: staffList.length, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white dark:bg-[#18181b] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-[#61605D] dark:text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-3xl font-black text-[#121110] dark:text-white">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-2xl ${stat.bg} dark:bg-white/5`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Create Shared Login */}
            <div className="bg-white dark:bg-[#18181b] rounded-[2.5rem] p-10 shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[80px] opacity-10 pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                    <KeyRound className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h2 className="text-xl font-black text-[#121110] dark:text-white">Gate Login Account</h2>
                </div>
                <form onSubmit={createAccount} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-[#61605D] dark:text-gray-400 uppercase tracking-widest mb-2 block">Username</label>
                    <input required value={accountForm.username} onChange={e => setAccountForm({...accountForm, username: e.target.value})} className="w-full bg-gray-50 dark:bg-[#27272a]/50 border-none rounded-xl px-4 py-3 text-sm font-semibold outline-none" placeholder="e.g. gate_tower_a" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-[#61605D] dark:text-gray-400 uppercase tracking-widest mb-2 block">Password</label>
                    <input required type="password" value={accountForm.password} onChange={e => setAccountForm({...accountForm, password: e.target.value})} className="w-full bg-gray-50 dark:bg-[#27272a]/50 border-none rounded-xl px-4 py-3 text-sm font-semibold outline-none" placeholder="••••••••" />
                  </div>
                  <button type="submit" className="w-full mt-2 bg-[#121110] dark:bg-white text-white dark:text-[#121110] hover:bg-[#F26922] dark:hover:bg-[#F26922] font-black text-sm py-4 rounded-2xl transition-colors">
                    Provision Account
                  </button>
                </form>
              </div>
            </div>

            {/* Add Security Staff */}
            <div className="bg-white dark:bg-[#18181b] rounded-[2.5rem] p-10 shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-[80px] opacity-10 pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                    <UserPlus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-black text-[#121110] dark:text-white">Register Duty Guard</h2>
                </div>
                <form onSubmit={addStaff} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-[#61605D] dark:text-gray-400 uppercase tracking-widest mb-2 block">Full Name</label>
                      <input required value={staffForm.name} onChange={e => setStaffForm({...staffForm, name: e.target.value})} className="w-full bg-gray-50 dark:bg-[#27272a]/50 border-none rounded-xl px-4 py-3 text-sm font-semibold outline-none" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-[#61605D] dark:text-gray-400 uppercase tracking-widest mb-2 block">Phone</label>
                      <input required value={staffForm.phone} onChange={e => setStaffForm({...staffForm, phone: e.target.value})} className="w-full bg-gray-50 dark:bg-[#27272a]/50 border-none rounded-xl px-4 py-3 text-sm font-semibold outline-none" placeholder="+1234567890" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-[#61605D] dark:text-gray-400 uppercase tracking-widest mb-2 block">Shift Start</label>
                      <input required type="time" value={staffForm.shift_start} onChange={e => setStaffForm({...staffForm, shift_start: e.target.value})} className="w-full bg-gray-50 dark:bg-[#27272a]/50 border-none rounded-xl px-4 py-3 text-sm font-semibold outline-none" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-[#61605D] dark:text-gray-400 uppercase tracking-widest mb-2 block">Shift End</label>
                      <input required type="time" value={staffForm.shift_end} onChange={e => setStaffForm({...staffForm, shift_end: e.target.value})} className="w-full bg-gray-50 dark:bg-[#27272a]/50 border-none rounded-xl px-4 py-3 text-sm font-semibold outline-none" />
                    </div>
                  </div>
                  <button type="submit" className="w-full mt-2 bg-[#121110] dark:bg-white text-white dark:text-[#121110] hover:bg-emerald-500 font-black text-sm py-4 rounded-2xl transition-colors">
                    Add Staff Member
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Active Staff Roster */}
          <div className="bg-white dark:bg-[#18181b] rounded-[2.5rem] p-10 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-black text-[#121110] dark:text-white mb-6">Active Security Roster</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <th className="pb-4 text-[10px] font-black text-[#61605D] dark:text-gray-400 uppercase tracking-widest">Name</th>
                    <th className="pb-4 text-[10px] font-black text-[#61605D] dark:text-gray-400 uppercase tracking-widest">Phone</th>
                    <th className="pb-4 text-[10px] font-black text-[#61605D] dark:text-gray-400 uppercase tracking-widest">Shift Timings</th>
                    <th className="pb-4 text-[10px] font-black text-[#61605D] dark:text-gray-400 uppercase tracking-widest text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                  {staffList.map((staff, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-4 font-black text-sm text-[#121110] dark:text-white">{staff.name}</td>
                      <td className="py-4 font-semibold text-sm text-gray-500">{staff.phone}</td>
                      <td className="py-4 font-semibold text-sm text-gray-500">{staff.shift_start} - {staff.shift_end}</td>
                      <td className="py-4 text-right">
                        <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full">Active</span>
                      </td>
                    </tr>
                  ))}
                  {staffList.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-sm font-semibold text-gray-400">No staff registered for this building.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-64 text-sm font-bold text-gray-400">Loading portfolio data...</div>
      )}
    </div>
  );
}
