import { tenantDashboardData } from '../../../mock/tenantDashboardData';

export default function PaymentHistory() {
  const { paymentHistory } = tenantDashboardData;
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-800">Recent Payment History</h3>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">S.No</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Fee Type</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Amount</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Date</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paymentHistory.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-500">{p.serialNumber}</td>
                <td className="px-6 py-4 font-bold text-gray-800">{p.feeType}</td>
                <td className="px-6 py-4 font-semibold text-gray-800">$${p.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-gray-500">{p.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${p.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}