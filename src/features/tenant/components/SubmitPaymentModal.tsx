"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { paymentsApi } from '../../admin/payments/api/paymentsApi';

import { PaymentRequest } from '../../admin/payments/types';

interface SubmitPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (payment?: PaymentRequest) => void;
}

export default function SubmitPaymentModal({ isOpen, onClose, onSuccess }: SubmitPaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fee_type: 'Rent',
    rent_month: new Date().toLocaleString('default', { month: 'long' }),
    rent_year: new Date().getFullYear(),
    amount: '',
    payment_method: 'Online',
    transaction_id: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await paymentsApi.submitPayment(formData);
      setSuccess(true);
      if (onSuccess) onSuccess(response);
      // Reset form
      setFormData({
        fee_type: 'Rent',
        rent_month: new Date().toLocaleString('default', { month: 'long' }),
        rent_year: new Date().getFullYear(),
        amount: '',
        payment_method: 'Online',
        transaction_id: '',
      });
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (error: any) {
      console.error('Payment submission error:', error);
      setError(error.message || 'Payment submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden"
          >
            {success ? (
              <div className="p-12 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-black text-gray-900">Payment Submitted!</h2>
                <p className="text-gray-500 mt-2">Your payment is now pending approval from the building owner.</p>
              </div>
            ) : (
              <>
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-gray-900">Submit Payment</h2>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Inform owner about your payment</p>
                    </div>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider ml-1">Rent Month</label>
                      <select
                        value={formData.rent_month}
                        onChange={(e) => setFormData({ ...formData, rent_month: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20 transition-all outline-none"
                      >
                        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider ml-1">Rent Year</label>
                      <input
                        type="number"
                        value={formData.rent_year}
                        onChange={(e) => setFormData({ ...formData, rent_year: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider ml-1">Amount (₹)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 12000"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20 transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider ml-1">Payment Method</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Online', 'Cash'].map(m => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setFormData({ ...formData, payment_method: m })}
                          className={`py-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                            formData.payment_method === m 
                              ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-sm' 
                              : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider ml-1">Transaction ID / Reference</label>
                    <input
                      type="text"
                      required={formData.payment_method === 'Online'}
                      placeholder={formData.payment_method === 'Cash' ? "e.g. Received by [Name] (Optional)" : "e.g. UPI-123456789"}
                      value={formData.transaction_id}
                      onChange={(e) => setFormData({ ...formData, transaction_id: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20 transition-all outline-none"
                    />
                  </div>
                  
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center space-x-3"
                    >
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0">
                        <X className="w-4 h-4 text-rose-500" />
                      </div>
                      <p className="text-xs font-bold text-rose-600 leading-tight">{error}</p>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center space-x-3 active:scale-95"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>Submit Payment</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
