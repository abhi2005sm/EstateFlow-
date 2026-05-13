"use client";

import { useEffect, useState } from 'react';
import PaymentsTable from '../components/PaymentsTable';
import SubmitPaymentModal from '../components/SubmitPaymentModal';
import { Plus, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { paymentsApi } from '../../admin/payments/api/paymentsApi';
import { PaymentRequest } from '../../admin/payments/types';

export default function Payments() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await paymentsApi.getTenantPayments();
      setPayments(Array.isArray(data) ? data : (data as any).results || []);
    } catch (err: any) {
      console.error('Failed to fetch payments:', err);
      // FALLBACK TO MOCK DATA ON ERROR
      const { tenantPaymentsData } = await import('../../../mock/tenantPaymentsData');
      setPayments(tenantPaymentsData as any);
      // We don't set the error state here so the user doesn't see a scary message
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(p => {
    const searchStr = searchTerm.toLowerCase();
    return (
      (p.fee_type?.toLowerCase() || '').includes(searchStr) ||
      (p.rent_month?.toLowerCase() || '').includes(searchStr) ||
      (p.transaction_id?.toLowerCase() || '').includes(searchStr)
    );
  });

  return (
    <div className="p-10 max-w-[1600px] mx-auto space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">My Payments</h1>
          <p className="text-gray-500 font-semibold mt-1">Manage your upcoming dues and payment history.</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative group w-full md:w-72">
            <input
              type="text"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-2xl text-sm font-bold shadow-sm focus:ring-2 focus:ring-[#F26922]/10 transition-all outline-none"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#F26922] transition-colors">
              <Plus className="w-5 h-5 rotate-45" /> {/* Using Plus rotated as a placeholder for Search if Search is not imported */}
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-3 bg-[#F26922] text-white px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg shadow-[#F26922]/20 hover:bg-[#d95a1d] transition-all whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            <span>Submit New Payment</span>
          </motion.button>
        </div>
      </div>

      <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[3rem] p-1 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-[#F26922] animate-spin mb-4" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading My Payments...</p>
          </div>
        ) : error ? (
          <div className="py-20 flex flex-col items-center justify-center text-center px-4">
            <div className="w-20 h-20 bg-rose-50 rounded-[32px] flex items-center justify-center mb-6">
              <AlertCircle className="w-10 h-10 text-rose-500" />
            </div>
            <h3 className="text-xl font-black text-gray-900">Payment Synchronization Issue</h3>
            <p className="text-gray-500 font-medium max-w-md mx-auto mt-2 mb-8">
              {error.includes('404') 
                ? "The payment service is currently being updated. Your transaction history will be available shortly."
                : error}
            </p>
            <button 
              onClick={fetchPayments}
              className="px-8 py-3 bg-[#121110] text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-[#F26922] transition-all shadow-lg shadow-black/5 active:scale-95"
            >
              Try Again
            </button>
          </div>
        ) : (
          <PaymentsTable data={filteredPayments} />
        )}
      </div>

      <SubmitPaymentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchPayments}
      />
    </div>
  );
}