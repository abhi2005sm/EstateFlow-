"use client";

import { useState, useEffect } from 'react';
import { Shield, CheckCircle2, XCircle, Clock, ArrowRight, Activity, Search, AlertCircle, BellRing, Sparkles } from 'lucide-react';
import { apiRequest } from '@/src/features/api/api';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function SecurityDashboard() {
  const router = useRouter();
  
  // Auth state
  const [staffList, setStaffList] = useState<any[]>([]);
  const [onDutyGuard, setOnDutyGuard] = useState<any>(null);
  
  // Data state
  const [tenants, setTenants] = useState<any[]>([]);
  const [visitors, setVisitors] = useState<any[]>([]);
  
  // Form state
  const [visitorForm, setVisitorForm] = useState({
    unit: '',
    visitor_name: '',
    visitor_phone: '',
    purpose: '',
    tenant_name: '',
    tenant_id: null as number | null
  });

  useEffect(() => {
    // When security logs in, fetch available staff for their building
    const fetchInitialData = async () => {
      try {
        const staffRes = await apiRequest('/users/security/staff/');
        setStaffList(Array.isArray(staffRes) ? staffRes : staffRes.results || []);
        
        const tenantRes = await apiRequest('/users/security/tenants/');
        setTenants(Array.isArray(tenantRes) ? tenantRes : tenantRes.results || []);
      } catch (err) {
        console.error("Failed to fetch initial security data", err);
      }
    };
    fetchInitialData();
  }, []);

  const loadVisitorRequests = async () => {
    try {
      const res = await apiRequest('/users/security/visitors/');
      setVisitors(Array.isArray(res) ? res : res.results || []);
    } catch (err) {
      console.error("Failed to load visitors", err);
    }
  };

  useEffect(() => {
    if (onDutyGuard) {
      loadVisitorRequests();
      const interval = setInterval(loadVisitorRequests, 5000); // Poll every 5s for snappy updates
      return () => clearInterval(interval);
    }
  }, [onDutyGuard]);

  const handleUnitSelect = (e: any) => {
    const unit = e.target.value;
    const tenant = tenants.find(t => t.unit === unit || t.unit_code === unit || t.unit_number === unit);
    setVisitorForm({
      ...visitorForm,
      unit,
      tenant_name: tenant ? tenant.name : '',
      tenant_id: tenant ? (tenant.tenant_id || tenant.id) : null
    });
  };

  const handleVisitorSubmit = async (e: any) => {
    e.preventDefault();
    if (!onDutyGuard) return alert('Please select your name first.');
    try {
      await apiRequest('/users/security/visitors/', {
        method: 'POST',
        body: JSON.stringify({
          ...visitorForm,
          tenant: visitorForm.tenant_id,
          security_staff: onDutyGuard.staff_id || onDutyGuard.id
        })
      });
      setVisitorForm({ unit: '', visitor_name: '', visitor_phone: '', purpose: '', tenant_name: '', tenant_id: null });
      loadVisitorRequests();
      alert('Visitor request dispatched to tenant successfully!');
    } catch (err) {
      alert('Failed to submit visitor request.');
    }
  };

  if (!onDutyGuard) {
    return (
      <div className="p-6 max-w-7xl mx-auto min-h-[calc(100vh-80px)] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-white dark:bg-[#18181b] border border-gray-100 dark:border-gray-800 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F26922]/10 rounded-full blur-[60px] pointer-events-none" />
          
          <div className="flex items-center space-x-3 mb-8 relative z-10">
            <div className="w-10 h-10 bg-[#F26922]/10 flex items-center justify-center rounded-xl">
              <Shield className="w-5 h-5 text-[#F26922]" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-black text-[#121110] dark:text-white tracking-tight">Duty Roster Login</h1>
          </div>

          <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">Select your name to start gate shift</p>
          
          <div className="space-y-3 mb-2 max-h-[300px] overflow-y-auto pr-1">
            {staffList.map(staff => (
              <button 
                key={staff.staff_id || staff.id} 
                onClick={() => setOnDutyGuard(staff)}
                className="w-full bg-gray-50 dark:bg-white/5 hover:bg-[#F26922]/10 dark:hover:bg-[#F26922]/10 text-gray-700 dark:text-white hover:text-[#F26922] dark:hover:text-[#F26922] text-left px-5 py-4 rounded-2xl text-sm font-black transition-all flex items-center justify-between group border border-transparent hover:border-[#F26922]/20"
              >
                <span>{staff.name}</span>
                <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
            {staffList.length === 0 && (
              <div className="text-center py-8 text-sm font-semibold text-gray-400">
                No active security staff registered.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Security command Node</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Active Shift: <span className="text-[#F26922] font-black">{onDutyGuard.name}</span>
            </p>
          </div>
          
          <div className="flex items-center space-x-2 bg-white dark:bg-[#18181b] p-1.5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm w-fit">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ml-2" />
            <span className="text-[10px] font-black text-[#121110] dark:text-white uppercase tracking-widest px-2">Syncing Live</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-1 bg-white dark:bg-[#18181b] rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800 h-fit relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#F26922]/5 rounded-full blur-[60px] pointer-events-none" />
          <h2 className="text-xl font-black text-[#121110] dark:text-white mb-6 relative z-10">New Visitor Entry</h2>
          
          <form onSubmit={handleVisitorSubmit} className="space-y-5 relative z-10">
            <div>
              <label className="text-[10px] font-black text-[#61605D] dark:text-gray-400 uppercase tracking-widest mb-2 block">Destination Unit</label>
              <select 
                required 
                value={visitorForm.unit} 
                onChange={handleUnitSelect} 
                className="w-full bg-[#F5F3F0] dark:bg-[#27272a]/50 border border-transparent focus:border-[#F26922]/20 rounded-2xl px-4 py-3.5 text-sm font-semibold outline-none text-[#121110] dark:text-white transition-all appearance-none cursor-pointer"
              >
                <option value="">Select Unit...</option>
                {tenants.map((t, index) => (
                  <option key={t.tenant_id || t.id || index} value={t.unit || t.unit_code || t.unit_number}>{t.unit || t.unit_code || t.unit_number}</option>
                ))}
              </select>
              <AnimatePresence>
                {visitorForm.tenant_name && (
                  <motion.p 
                    key="tenant-name-indicator"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs font-bold text-emerald-600 dark:text-emerald-500 mt-2 ml-1"
                  >
                    ✓ Resident: {visitorForm.tenant_name}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            
            <div>
              <label className="text-[10px] font-black text-[#61605D] dark:text-gray-400 uppercase tracking-widest mb-2 block">Visitor Name</label>
              <input 
                required 
                value={visitorForm.visitor_name} 
                onChange={e => setVisitorForm({...visitorForm, visitor_name: e.target.value})} 
                className="w-full bg-[#F5F3F0] dark:bg-[#27272a]/50 border border-transparent focus:border-[#F26922]/20 rounded-2xl px-4 py-3.5 text-sm font-semibold outline-none text-[#121110] dark:text-white transition-all" 
                placeholder="John Doe" 
              />
            </div>
            
            <div>
              <label className="text-[10px] font-black text-[#61605D] dark:text-gray-400 uppercase tracking-widest mb-2 block">Visitor Phone</label>
              <input 
                required 
                value={visitorForm.visitor_phone} 
                onChange={e => setVisitorForm({...visitorForm, visitor_phone: e.target.value})} 
                className="w-full bg-[#F5F3F0] dark:bg-[#27272a]/50 border border-transparent focus:border-[#F26922]/20 rounded-2xl px-4 py-3.5 text-sm font-semibold outline-none text-[#121110] dark:text-white transition-all" 
                placeholder="+91 9876543210" 
              />
            </div>
            
            <div>
              <label className="text-[10px] font-black text-[#61605D] dark:text-gray-400 uppercase tracking-widest mb-2 block">Purpose of Visit</label>
              <input 
                required 
                value={visitorForm.purpose} 
                onChange={e => setVisitorForm({...visitorForm, purpose: e.target.value})} 
                className="w-full bg-[#F5F3F0] dark:bg-[#27272a]/50 border border-transparent focus:border-[#F26922]/20 rounded-2xl px-4 py-3.5 text-sm font-semibold outline-none text-[#121110] dark:text-white transition-all" 
                placeholder="Delivery, Guest, Maintenance..." 
              />
            </div>

            <button 
              type="submit" 
              className="w-full mt-4 bg-[#F26922] hover:bg-[#d95d1d] text-white font-black text-sm py-4 rounded-2xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-[#F26922]/20 active:scale-[0.98]"
            >
              <span>Dispatch Request</span>
              <Activity className="w-4 h-4 animate-pulse" />
            </button>
          </form>
        </div>

        {/* Right Column: Live Feed */}
        <div className="lg:col-span-2 bg-white dark:bg-[#18181b] rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="mb-8">
            <h2 className="text-xl font-black text-[#121110] dark:text-white">Live Operations Feed</h2>
            <p className="text-[10px] font-bold text-[#61605D] dark:text-gray-400 uppercase tracking-widest mt-1">Real-time gate logs & authorization statuses</p>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {visitors.length === 0 ? (
              <div className="text-center py-24 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-4 text-gray-300 dark:text-gray-700">
                  <Shield className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold text-gray-400 dark:text-gray-500">No active visitor logs for today.</p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {visitors.map(visitor => {
                  let statusStyles = {
                    bg: 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30',
                    text: 'text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/20',
                    Icon: Clock
                  };
                  
                  if (visitor.status === 'APPROVED' || visitor.status === 'Approved') {
                    statusStyles = {
                      bg: 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30',
                      text: 'text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/20',
                      Icon: CheckCircle2
                    };
                  } else if (visitor.status === 'REJECTED' || visitor.status === 'Rejected') {
                    statusStyles = {
                      bg: 'bg-rose-50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-900/30',
                      text: 'text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/20',
                      Icon: XCircle
                    };
                  }

                  const tenantObj = tenants.find(t => t.tenant_id === visitor.tenant) || {};
                  const unitDisplay = tenantObj.unit || visitor.unit || 'Unknown';
                  const tenantNameDisplay = tenantObj.name || 'Unknown Tenant';
                  const IconComponent = statusStyles.Icon;

                  return (
                    <motion.div 
                      key={visitor.request_id || visitor.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-5 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between border transition-all ${statusStyles.bg}`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-xl bg-white dark:bg-[#18181b] shadow-sm border ${statusStyles.text}`}>
                          <IconComponent className="w-5 h-5" strokeWidth={2.5} />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm font-black text-[#121110] dark:text-white">{visitor.visitor_name}</h3>
                            <span className="text-gray-300 dark:text-gray-700 text-xs">•</span>
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Unit {unitDisplay}</span>
                          </div>
                          <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 mt-1.5">
                            {visitor.purpose} • {visitor.visitor_phone}
                          </p>
                          <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 mt-0.5">
                            Host: {tenantNameDisplay}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-left md:text-right mt-4 md:mt-0 flex md:flex-col justify-between items-center md:items-end">
                        <span className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-xl border ${statusStyles.text}`}>
                          {visitor.status}
                        </span>
                        <p className="text-[9px] font-bold text-gray-400 mt-2 uppercase">
                          {new Date(visitor.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
