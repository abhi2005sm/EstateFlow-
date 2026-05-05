import { tenantDashboardData } from '../../../mock/tenantDashboardData';

export default function FeesBreakdown() {
  const { feesBreakdown, paymentStatus } = tenantDashboardData;
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Payment Summary</h3>
        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-100">
          <div className="text-center">
            <p className="text-sm text-gray-500">Paid Units</p>
            <p className="text-2xl font-bold text-emerald-600">{paymentStatus.paidUnits}</p>
          </div>
          <div className="text-center border-l border-gray-200 pl-4">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-red-600">{paymentStatus.pendingPayments}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex-1">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Current Fees</h3>
        <div className="space-y-3">
          {feesBreakdown.map(fee => (
            <div key={fee.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <p className="font-semibold text-gray-800">{fee.name}</p>
                <p className="text-xs text-gray-500 mt-1">Amount: $${fee.amount}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${fee.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                {fee.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}