"use client";

import { useEffect, useState } from 'react';
import PaymentsTable from '../components/PaymentsTable';
import SubmitPaymentModal from '../components/SubmitPaymentModal';
import { motion, AnimatePresence } from 'framer-motion';
import { paymentsApi } from '../../admin/payments/api/paymentsApi';
import { PaymentRequest } from '../../admin/payments/types';
import { CheckCircle2, Clock, Filter, XCircle, Building2, Calendar, History, Search, CreditCard, Download, Plus, Loader2, AlertCircle } from 'lucide-react';

export default function Payments() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPayments = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const data = await paymentsApi.getTenantPayments();
      setPayments(Array.isArray(data) ? data : (data as any).results || []);
    } catch (err: any) {
      console.error('Failed to fetch payments:', err);
      if (err.message && err.message.includes('404')) {
        // Backend GET might not be implemented yet. Let it be empty.
        setPayments([]);
      } else {
        setError(err.message || 'Failed to load payments.');
      }
      // We don't set the error state here so the user doesn't see a scary message
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(true);
    const intervalId = setInterval(() => {
      fetchPayments(false);
    }, 3000);
    
    return () => clearInterval(intervalId);
  }, []);

  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('history');

  const filteredPayments = payments.filter(p => {
    const searchStr = searchTerm.toLowerCase();
    const matchesSearch = (p.fee_type?.toLowerCase() || '').includes(searchStr) ||
                          (p.rent_month?.toLowerCase() || '').includes(searchStr) ||
                          (p.transaction_id?.toLowerCase() || '').includes(searchStr);
    
    const isPending = p.approval_status === 'Pending';
    const matchesTab = activeTab === 'pending' ? isPending : true; // History shows all for tenant

    return matchesSearch && matchesTab;
  });

  const stats = {
    pending: payments.filter(p => p.approval_status === 'Pending').length,
    totalPaid: payments.filter(p => p.approval_status === 'Approved' || p.status === 'Paid').reduce((acc, p) => acc + (Number(p.amount) || 0), 0),
    totalDue: payments.reduce((acc, p) => acc + (Number(p.due_amount) || 0), 0)
  };

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto min-h-screen bg-[#F8F9FA] dark:bg-[#09090b]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#1A1C1E] tracking-tight">Payments Overview</h1>
          <p className="text-[#64748B] font-medium mt-1">Review, submit, and track all your rent payments.</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-[#1A1C1E] text-white px-6 py-3 rounded-xl text-sm font-bold shadow-sm hover:bg-black transition-all whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          <span>Submit Payment</span>
        </motion.button>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center space-x-3 text-rose-600"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-bold">{error}</p>
          <button onClick={() => fetchPayments(true)} className="ml-auto text-xs underline font-black uppercase tracking-widest">Retry</button>
        </motion.div>
      )}

      {/* Header section with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Pending Approvals', value: stats.pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Total Paid', value: `₹${stats.totalPaid.toLocaleString('en-IN')}`, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Total Due', value: `₹${stats.totalDue.toLocaleString('en-IN')}`, icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-[#18181b] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center space-x-4"
          >
            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-[#121110] dark:text-whitexl font-black text-gray-900 dark:text-white">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white dark:bg-[#18181b] border border-[#E2E8F0] dark:border-gray-800 rounded-[32px] p-2 shadow-sm overflow-hidden mb-8">
        {/* Table Controls */}
        <div className="p-8 border-b border-gray-50 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex bg-gray-50/50 p-1.5 rounded-2xl w-fit">
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeTab === 'pending' 
                    ? 'bg-white dark:bg-[#18181b] text-[#F26922] shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-200'
                }`}
              >
                Pending Requests
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeTab === 'history' 
                    ? 'bg-white dark:bg-[#18181b] text-[#F26922] shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-200'
                }`}
              >
                Payment History
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#F26922] transition-colors" />
                <input
                  type="text"
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 pr-4 py-3 bg-gray-50/50 border-none rounded-2xl text-sm font-medium w-full md:w-72 focus:ring-2 focus:ring-[#F26922]/10 transition-all outline-none"
                />
              </div>
              <button onClick={() => fetchPayments(true)} className="p-3 bg-gray-50/50 rounded-2xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:bg-[#27272a] transition-all">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-[#F26922] animate-spin mb-4" />
            <p className="text-sm font-bold text-[#64748B] animate-pulse">Loading My Payments...</p>
          </div>
        ) : payments.length === 0 && !loading ? (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-gray-50 dark:bg-[#27272a] rounded-[32px] flex items-center justify-center mx-auto mb-6">
              <History className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white">No payments found</h3>
            <p className="text-gray-400 text-sm font-medium mt-1">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <PaymentsTable data={filteredPayments} />
        )}
      </div>

      <SubmitPaymentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={(newPayment?: PaymentRequest) => {
          if (newPayment) {
            setPayments(prev => [newPayment, ...prev]);
          } else {
            fetchPayments(true);
          }
        }}
      />
    </div>
  );
}