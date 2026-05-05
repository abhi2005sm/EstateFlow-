"use client";
import { useState } from 'react';

export default function PaymentsTable({ data }: { data: any[] }) {
  const [payments, setPayments] = useState(data);

  const handlePay = (id: string) => {
    alert('Payment initiated for ID: ' + id);
    setPayments(payments.map(p => p.id === id ? { ...p, status: 'Paid' } : p));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">S.No</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Fee Type</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Amount</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Due Date</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Status</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {payments.map((p) => (
              <tr key={p.id} className={`transition-colors ${p.status === 'Unpaid' ? 'bg-red-50/20 hover:bg-red-50/40' : 'hover:bg-gray-50'}`}>
                <td className="px-6 py-4 font-medium text-gray-500">{p.serialNumber}</td>
                <td className="px-6 py-4 font-bold text-gray-800">{p.feeType}</td>
                <td className="px-6 py-4 font-semibold text-gray-800">$${p.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-gray-500">{p.dueDate}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center w-fit ${p.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${p.status === 'Paid' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {p.status === 'Unpaid' ? (
                    <button 
                      onClick={() => handlePay(p.id)}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                    >
                      Pay Now
                    </button>
                  ) : (
                    <span className="text-gray-400 text-sm font-medium px-2">Completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}