"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  History, 
  Clock, 
  Download,
  CreditCard,
  Building2,
  Calendar,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { PaymentRequest, ApprovalStatus } from '../types';
import { paymentsApi } from '../api/paymentsApi';

export default function PaymentManagement() {
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await paymentsApi.getPaymentRequests();
      // Ensure data is an array
      setPayments(Array.isArray(data) ? data : (data as any).results || []);
    } catch (error: any) {
      console.error('Failed to fetch payments:', error);
      
      if (error.message && error.message.includes('404')) {
        // Fallback for when the backend doesn't have the GET endpoint implemented yet
        setPayments([
          {
            "payment_id": 1,
            "tenant_name": "Peter Parker",
            "unit_code": "o-2-b-1-101",
            "fee_type": "Rent",
            "rent_month": "May",
            "rent_year": 2026,
            "amount": "12000.00",
            "payment_method": "Online",
            "transaction_id": "UPI-123456789",
            "approval_status": "Pending",
            "status": "Unpaid",
            "due_date": null,
            "payment_date": null,
            "created_at": "2026-05-13T16:49:52.750466Z",
            "tenant": 4
          } as any
        ]);
      } else {
        setError(error.message || 'Failed to load payments. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleStatusChange = async (id: number, newStatus: 'Approved' | 'Declined' | 'Rejected') => {
    setProcessingId(id);
    try {
      const updatedPayment = await paymentsApi.updatePaymentStatus(id, newStatus);
      if (updatedPayment) {
        const updatedId = updatedPayment.payment_id || updatedPayment.id || id;
        setPayments(prev => prev.map(p => 
          (p.payment_id === updatedId || p.id === updatedId) ? { ...p, ...updatedPayment, approval_status: newStatus } : p
        ));
      }
    } catch (error: any) {
      console.error('Failed to update status:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredPayments = payments.filter(p => {
    const searchStr = searchTerm.toLowerCase();
    const matchesSearch = (p.tenant_name?.toLowerCase() || '').includes(searchStr) || 
                         (String(p.payment_id || p.id).toLowerCase()).includes(searchStr) ||
                         (p.unit_code?.toLowerCase() || p.unit_id?.toLowerCase() || '').includes(searchStr);
    
    const isPending = p.approval_status === 'Pending';
    const matchesTab = activeTab === 'pending' ? isPending : !isPending;
    
    return matchesSearch && matchesTab;
  });

  const stats = {
    pending: payments.filter(p => p.approval_status === 'Pending').length,
    totalCollected: payments.filter(p => p.approval_status === 'Approved').reduce((acc, p) => acc + (Number(p.amount) || 0), 0),
    totalDeclined: payments.filter(p => p.approval_status === 'Rejected' || p.approval_status === 'Declined').length
  };

  if (loading && payments.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#F26922] animate-spin mb-4" />
        <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-xs">Synchronizing Payments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Error State */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center space-x-3 text-rose-600"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-bold">{error}</p>
          <button onClick={fetchPayments} className="ml-auto text-xs underline font-black uppercase tracking-widest">Retry</button>
        </motion.div>
      )}

      {/* Header section with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Pending Requests', value: stats.pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Total Collected', value: `₹${stats.totalCollected.toLocaleString('en-IN')}`, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Declined Payments', value: stats.totalDeclined, icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
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

      <div className="bg-white dark:bg-[#18181b] rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
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
                  placeholder="Search by tenant, unit or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 pr-4 py-3 bg-gray-50/50 border-none rounded-2xl text-sm font-medium w-full md:w-72 focus:ring-2 focus:ring-[#F26922]/10 transition-all outline-none"
                />
              </div>
              <button onClick={fetchPayments} className="p-3 bg-gray-50/50 rounded-2xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:bg-[#27272a] transition-all">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Transaction</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Tenant & Unit</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Amount</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Date</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode='wait'>
                {filteredPayments.map((payment, index) => (
                  <motion.tr
                    key={payment.payment_id || payment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="group hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-[#27272a] rounded-xl flex items-center justify-center shrink-0">
                          <CreditCard className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{payment.fee_type} - {payment.rent_month} {payment.rent_year}</p>
                          <p className="text-[11px] font-medium text-gray-400">{payment.transaction_id || `ID: ${payment.payment_id || payment.id}`}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{payment.tenant_name}</p>
                          <span className="text-[10px] font-black bg-gray-100 dark:bg-[#27272a] text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded">ID: {payment.tenant}</span>
                        </div>
                        <div className="flex items-center text-[11px] font-medium text-gray-400 mt-0.5">
                          <Building2 className="w-3 h-3 mr-1" />
                          {payment.unit_code || payment.unit_id}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <p className="text-sm font-black text-gray-900 dark:text-white">₹{(Number(payment.amount) || 0).toLocaleString('en-IN')}</p>
                        {payment.due_amount && Number(payment.due_amount) > 0 && (
                          <p className="text-[10px] font-black text-rose-500 uppercase tracking-tighter mt-0.5">
                            Due: ₹{(Number(payment.due_amount)).toLocaleString('en-IN')}
                          </p>
                        )}
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">{payment.payment_method}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center text-sm font-bold text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-2 opacity-50" />
                        {new Date(payment.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col space-y-1">
                        <span className={`w-fit px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          payment.approval_status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                          payment.approval_status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                          'bg-rose-50 text-rose-600'
                        }`}>
                          {payment.approval_status === 'Approved' ? 'Rent Paid' : payment.approval_status}
                        </span>
                        <span className={`w-fit px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-tighter ${
                          payment.status === 'Paid' ? 'text-emerald-500' : 
                          Number(payment.due_amount) > 0 ? 'text-rose-500' : 'text-gray-400'
                        }`}>
                          {payment.status === 'Paid' ? 'Completed' : 
                           Number(payment.due_amount) > 0 ? 'Partial Payment' : payment.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      {payment.approval_status === 'Pending' ? (
                        <div className="flex items-center justify-end space-x-2">
                          {processingId === (payment.payment_id || payment.id) ? (
                            <div className="p-2.5">
                              <Loader2 className="w-5 h-5 text-[#F26922] animate-spin" />
                            </div>
                          ) : (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleStatusChange(payment.payment_id || payment.id, 'Approved')}
                                className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors"
                                title="Approve Payment"
                              >
                                <CheckCircle2 className="w-5 h-5" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleStatusChange(payment.payment_id || payment.id, 'Rejected')}
                                className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors"
                                title="Decline Payment"
                              >
                                <XCircle className="w-5 h-5" />
                              </motion.button>
                            </>
                          )}
                        </div>
                      ) : (
                        <button className="p-2.5 text-gray-400 hover:text-[#F26922] hover:bg-[#F26922]/5 rounded-xl transition-all">
                          <Download className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {filteredPayments.length === 0 && !loading && (
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-gray-50 dark:bg-[#27272a] rounded-[32px] flex items-center justify-center mx-auto mb-6">
                <History className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white">No payments found</h3>
              <p className="text-gray-400 text-sm font-medium mt-1">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
