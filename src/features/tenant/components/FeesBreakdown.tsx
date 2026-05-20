import { PaymentRequest } from '../../admin/payments/types';

interface FeesBreakdownProps {
  payments?: PaymentRequest[];
}

export default function FeesBreakdown({ payments = [] }: FeesBreakdownProps) {
  const paidPayments = payments.filter(p => p.status === 'Paid' || p.approval_status === 'Approved');
  const pendingPayments = payments.filter(p => p.approval_status === 'Pending');

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Payment Summary</h3>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-center">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-red-600">{pendingPayments.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex-1">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Current Fees</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
          {payments.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No recent fees found.</p>
          ) : (
            payments.slice(0, 5).map(fee => (
              <div key={fee.payment_id || fee.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-semibold text-gray-800">{fee.fee_type || (fee as any).feeType || 'Rent'}</p>
                  <p className="text-xs text-gray-500 mt-1">Amount: ₹{(Number(fee.amount) || 0).toLocaleString('en-IN')}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${fee.status === 'Paid' || fee.approval_status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {fee.approval_status === 'Approved' || fee.status === 'Paid' ? 'Paid' : fee.approval_status || fee.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}