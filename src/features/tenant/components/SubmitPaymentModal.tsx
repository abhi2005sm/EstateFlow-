"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Send, Loader2, CheckCircle2, IndianRupee } from 'lucide-react';
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
    transaction_id: '',
    note_50: 0,
    note_100: 0,
    note_200: 0,
    note_500: 0,
    note_2000: 0
  });
  
  const [isSplit, setIsSplit] = useState(false);
  const [splitAmount, setSplitAmount] = useState('');
  const [splitTransactionId, setSplitTransactionId] = useState('');

  useEffect(() => {
    if (formData.payment_method === 'Cash' || isSplit) {
      const calculatedSum = 
        (formData.note_50 * 50) +
        (formData.note_100 * 100) +
        (formData.note_200 * 200) +
        (formData.note_500 * 500) +
        (formData.note_2000 * 2000);
      setFormData(prev => ({ ...prev, amount: calculatedSum.toString() }));
    }
  }, [formData.payment_method, isSplit, formData.note_50, formData.note_100, formData.note_200, formData.note_500, formData.note_2000]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload: any = { ...formData };
      if (payload.payment_method !== 'Cash' && !isSplit) {
        delete payload.note_50;
        delete payload.note_100;
        delete payload.note_200;
        delete payload.note_500;
        delete payload.note_2000;
      }

      if (isSplit) {
        payload.payment_method = 'Cash'; // The primary payload is Cash
      }
      
      let response;
      if (isSplit) {
        const splitPayload = {
          fee_type: formData.fee_type,
          rent_month: formData.rent_month,
          rent_year: formData.rent_year,
          amount: splitAmount,
          payment_method: 'Online',
          transaction_id: splitTransactionId
        };
        // Submit both concurrently
        const [cashRes] = await Promise.all([
          paymentsApi.submitPayment(payload),
          paymentsApi.submitPayment(splitPayload as any)
        ]);
        response = cashRes; // Pass back one of them for the table to refresh
      } else {
        response = await paymentsApi.submitPayment(payload);
      }

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
        note_50: 0,
        note_100: 0,
        note_200: 0,
        note_500: 0,
        note_2000: 0
      });
      setIsSplit(false);
      setSplitAmount('');
      setSplitTransactionId('');
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

  const handleNoteChange = (noteKey: string, value: string) => {
    const num = parseInt(value);
    setFormData(prev => ({
      ...prev,
      [noteKey]: isNaN(num) ? 0 : num
    }));
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
            className="relative w-full max-w-lg bg-white dark:bg-[#18181b] rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {success ? (
              <div className="p-12 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-[#121110] dark:text-whitexl font-black text-gray-900 dark:text-white">Payment Submitted!</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Your payment is now pending approval from the building owner.</p>
              </div>
            ) : (
              <>
                <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 shrink-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-blue-600 dark:text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-gray-900 dark:text-white">Submit Payment</h2>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Inform owner about your payment</p>
                    </div>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:bg-[#27272a] rounded-full transition-colors">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="overflow-y-auto custom-scrollbar p-8">
                  <form id="submit-payment-form" onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider ml-1">Rent Month</label>
                      <select
                        value={formData.rent_month}
                        onChange={(e) => setFormData({ ...formData, rent_month: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-[#27272a] border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20 transition-all outline-none"
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
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-[#27272a] border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Payment Method</label>
                      <label className="flex items-center space-x-2 cursor-pointer group">
                        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider group-hover:text-blue-600 dark:text-white transition-colors">Split Payment</span>
                        <div className={`w-8 h-4 rounded-full transition-colors relative ${isSplit ? 'bg-blue-600' : 'bg-gray-200'}`}>
                          <input type="checkbox" className="sr-only" checked={isSplit} onChange={(e) => {
                            setIsSplit(e.target.checked);
                            if (e.target.checked) setFormData({ ...formData, payment_method: 'Cash' });
                          }} />
                          <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white dark:bg-[#18181b] transition-transform ${isSplit ? 'translate-x-4' : ''}`} />
                        </div>
                      </label>
                    </div>
                    {!isSplit && (
                      <div className="grid grid-cols-2 gap-3">
                        {['Online', 'Cash'].map(m => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setFormData({ ...formData, payment_method: m, amount: m === 'Cash' ? '0' : formData.amount })}
                            className={`py-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                              formData.payment_method === m 
                                ? 'border-blue-500 bg-blue-50 text-blue-600 dark:text-white shadow-sm' 
                                : 'border-gray-200 dark:border-white/10 bg-white dark:bg-[#18181b] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:bg-[#27272a]'
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <AnimatePresence mode="popLayout">
                    {(formData.payment_method === 'Cash' || isSplit) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-[#F8F9FA] dark:bg-[#09090b] border border-[#E2E8F0] dark:border-gray-800 rounded-2xl p-5 space-y-4">
                          <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-3 mb-4">
                            <div className="flex items-center space-x-2">
                              <IndianRupee className="w-4 h-4 text-emerald-600" />
                              <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Cash Deposit Challan {isSplit && '(Part 1)'}</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { val: 2000, key: 'note_2000', label: '₹2000 Notes' },
                              { val: 500, key: 'note_500', label: '₹500 Notes' },
                              { val: 200, key: 'note_200', label: '₹200 Notes' },
                              { val: 100, key: 'note_100', label: '₹100 Notes' },
                              { val: 50, key: 'note_50', label: '₹50 Notes' }
                            ].map(note => (
                              <div key={note.key} className="flex items-center bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/10 rounded-lg overflow-hidden focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                                <div className="px-3 py-2 bg-gray-50 dark:bg-[#27272a] border-r border-gray-200 dark:border-white/10 text-xs font-bold text-gray-600 dark:text-gray-300 shrink-0 w-16">
                                  ₹{note.val}
                                </div>
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  placeholder="0"
                                  value={(formData as any)[note.key] || ''}
                                  onChange={(e) => handleNoteChange(note.key, e.target.value)}
                                  className="w-full px-3 py-2 text-sm font-semibold outline-none"
                                />
                              </div>
                            ))}
                          </div>
                          
                          <div className="pt-3 border-t border-gray-200 dark:border-white/10 flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Calculated Total</span>
                            <span className="text-lg font-black text-emerald-600">₹{formData.amount || '0'}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider ml-1">Amount (₹)</label>
                    <input
                      type="text"
                      required
                      readOnly={formData.payment_method === 'Cash' || isSplit}
                      placeholder="e.g. 12000"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className={`w-full px-4 py-3 border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20 transition-all outline-none ${
                        (formData.payment_method === 'Cash' || isSplit) 
                          ? 'bg-gray-100 dark:bg-[#27272a] text-gray-500 dark:text-gray-400 cursor-not-allowed' 
                          : 'bg-gray-50 dark:bg-[#27272a] text-gray-900 dark:text-white'
                      }`}
                    />
                    {(formData.payment_method === 'Cash' || isSplit) && (
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 ml-1 font-medium italic">Amount is auto-calculated from the challan above.</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider ml-1">Cash Transaction Note / Reference (Optional)</label>
                    <input
                      type="text"
                      required={formData.payment_method === 'Online' && !isSplit}
                      placeholder="e.g. Received by [Name]"
                      value={formData.transaction_id}
                      onChange={(e) => setFormData({ ...formData, transaction_id: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-[#27272a] border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20 transition-all outline-none"
                    />
                  </div>

                  <AnimatePresence mode="popLayout">
                    {isSplit && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-[#F8F9FA] dark:bg-[#09090b] border border-[#E2E8F0] dark:border-gray-800 rounded-2xl p-5 space-y-4 mt-2">
                          <div className="flex items-center space-x-2 border-b border-gray-200 dark:border-white/10 pb-3 mb-4">
                            <CreditCard className="w-4 h-4 text-blue-600 dark:text-white" />
                            <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Online Payment (Part 2)</span>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider ml-1">Split Amount (₹)</label>
                            <input
                              type="number"
                              required={isSplit}
                              placeholder="e.g. 5000"
                              value={splitAmount}
                              onChange={(e) => setSplitAmount(e.target.value)}
                              className="w-full px-4 py-3 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all outline-none"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider ml-1">Online Transaction ID</label>
                            <input
                              type="text"
                              required={isSplit}
                              placeholder="e.g. UPI-123456789"
                              value={splitTransactionId}
                              onChange={(e) => setSplitTransactionId(e.target.value)}
                              className="w-full px-4 py-3 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all outline-none"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center space-x-3"
                    >
                      <div className="w-8 h-8 bg-white dark:bg-[#18181b] rounded-lg flex items-center justify-center shrink-0">
                        <X className="w-4 h-4 text-rose-500" />
                      </div>
                      <p className="text-xs font-bold text-rose-600 leading-tight">{error}</p>
                    </motion.div>
                  )}
                  </form>
                </div>

                <div className="p-8 border-t border-gray-100 dark:border-gray-800 shrink-0">
                  <button
                    type="submit"
                    form="submit-payment-form"
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
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
