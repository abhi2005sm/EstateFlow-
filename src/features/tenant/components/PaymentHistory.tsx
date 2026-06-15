import { PaymentRequest } from '../../admin/payments/types';

interface PaymentHistoryProps {
  payments?: PaymentRequest[];
}

export default function PaymentHistory({ payments = [] }: PaymentHistoryProps) {
  return (
    <div className="bg-white dark:bg-[#18181b] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Recent Payment History</h3>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-[#27272a] border-b border-gray-100 dark:border-gray-800">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Transaction</th>
              <th className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Tenant & Unit</th>
              <th className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Amount</th>
              <th className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Date</th>
              <th className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {payments.length > 0 ? (
              payments.slice(0, 5).map((p, index) => (
                <tr key={p.payment_id || p.id || index} className="hover:bg-gray-50 dark:bg-[#27272a] transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800 dark:text-white">
                    {p.fee_type || (p as any).feeType || 'Rent'} - {p.rent_month} {p.rent_year}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">
                    {p.tenant_name} | {p.unit_code}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-800 dark:text-white">₹{(Number(p.amount) || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {p.payment_date 
                      ? new Date(p.payment_date).toLocaleDateString() 
                      : p.created_at 
                        ? new Date(p.created_at).toLocaleDateString() 
                        : (p as any).date || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${p.status === 'Paid' || p.approval_status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                      {p.approval_status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 font-medium">
                  No recent payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}