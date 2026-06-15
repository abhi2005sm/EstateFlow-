"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle,
  Calendar,
  Download
} from 'lucide-react';
import { PaymentRequest } from '../../admin/payments/types';

interface PaymentsTableProps {
  data: PaymentRequest[];
}

export default function PaymentsTable({ data }: PaymentsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-50">
            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Transaction</th>
            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Tenant & Unit</th>
            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Amount</th>
            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Date</th>
            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Receipt</th>
          </tr>
        </thead>
        <tbody>
          {data.map((payment, index) => (
            <motion.tr
              key={payment.payment_id || payment.id || index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group hover:bg-gray-50/50 transition-colors border-b border-gray-50/50"
            >
              <td className="px-8 py-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-[#27272a] rounded-xl flex items-center justify-center shrink-0">
                    <CreditCard className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {payment.fee_type || (payment as any).feeType} - {payment.rent_month} {payment.rent_year}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                      {payment.transaction_id || `TRX-${payment.payment_id || payment.id || index}`}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-8 py-6">
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{payment.tenant_name}</p>
                  <p className="text-[11px] font-medium text-gray-400">
                    {payment.unit_code}
                  </p>
                </div>
              </td>
              <td className="px-8 py-6">
                <div className="flex flex-col">
                  <p className="text-sm font-black text-gray-900 dark:text-white">₹{(Number(payment.amount) || 0).toLocaleString('en-IN')}</p>
                  {(payment.due_amount || (payment as any).dueAmount) && Number(payment.due_amount || (payment as any).dueAmount) > 0 && (
                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-tighter mt-0.5">
                      Remaining: ₹{(Number(payment.due_amount || (payment as any).dueAmount)).toLocaleString('en-IN')}
                    </p>
                  )}
                </div>
              </td>
              <td className="px-8 py-6">
                <div className="flex items-center text-sm font-bold text-gray-500 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-2 opacity-50" />
                  {payment.payment_date 
                    ? new Date(payment.payment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : payment.created_at 
                      ? new Date(payment.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
                      : 'N/A'}
                </div>
              </td>
              <td className="px-8 py-6">
                <div className="flex flex-col space-y-1">
                  <span className={`w-fit px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    payment.approval_status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                    payment.approval_status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                    'bg-rose-50 text-rose-600'
                  }`}>
                    {payment.approval_status}
                  </span>
                  <span className={`w-fit px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-tighter ${
                    payment.status === 'Paid' ? 'text-emerald-500' : 
                    Number(payment.due_amount || (payment as any).dueAmount) > 0 ? 'text-rose-500' : 'text-gray-400'
                  }`}>
                    {payment.status === 'Paid' ? 'Completed' : 
                     Number(payment.due_amount || (payment as any).dueAmount) > 0 ? 'Partial Payment' : payment.status}
                  </span>
                </div>
              </td>
              <td className="px-8 py-6 text-right">
                <button 
                  disabled={payment.approval_status !== 'Approved'}
                  className="p-2.5 text-gray-400 hover:text-blue-600 dark:text-white hover:bg-blue-50 rounded-xl transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  <Download className="w-5 h-5" />
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && (
        <div className="py-20 text-center">
          <div className="w-20 h-20 bg-gray-50 dark:bg-[#27272a] rounded-[32px] flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-lg font-black text-gray-900 dark:text-white">No payment history</h3>
          <p className="text-gray-400 text-sm font-medium mt-1">Submit a payment to see it here</p>
        </div>
      )}
    </div>
  );
}