import { Mail } from 'lucide-react';

export default function BuildingDetailsTable({ tenants }: { tenants: any[] }) {
  if(!tenants || tenants.length === 0) return <div className="p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-100 mt-6">No tenants found for this building.</div>

  const handleSendReminder = (t: any) => {
    const subject = encodeURIComponent(`Rent Payment Reminder - Floor ${t.floorNumber}`);
    const body = encodeURIComponent(`Hi ${t.name},\n\nThis is a friendly reminder to pay your rent for Floor ${t.floorNumber}.\n\nDetails:\n- Rent Amount: $${t.rentAmount.toLocaleString()}\n- Due Amount: $${t.dueAmount.toLocaleString()}\n\nPlease make the payment at your earliest convenience.\n\nThank you!`);
    window.location.href = `mailto:${t.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mt-6">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">S.No</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Tenant Name</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Floor Number</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Phone Number</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Rent Amount</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Rent Status</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Due Amount</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {tenants.map((t) => (
              <tr key={t.id} className={`hover:bg-gray-50 transition-colors ${t.rentStatus === 'Unpaid' ? 'bg-red-50/10' : ''}`}>
                <td className="px-6 py-4 font-medium text-gray-500">{t.serialNumber}</td>
                <td className="px-6 py-4 font-bold text-gray-900">{t.name}</td>
                <td className="px-6 py-4 text-gray-600">{t.floorNumber}</td>
                <td className="px-6 py-4 text-gray-600">{t.phone}</td>
                <td className="px-6 py-4 text-gray-900 font-semibold">
                  ${t.rentAmount?.toLocaleString() || '-'}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center w-fit ${t.rentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${t.rentStatus === 'Paid' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                    {t.rentStatus}
                  </span>
                </td>
                <td className={`px-6 py-4 font-bold ${t.dueAmount > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                  {t.dueAmount > 0 ? `$${t.dueAmount.toLocaleString()}` : '-'}
                </td>
                <td className="px-6 py-4 text-center">
                  {t.rentStatus === 'Unpaid' && (
                    <button 
                      onClick={() => handleSendReminder(t)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors title='Send Reminder'"
                    >
                      <Mail className="w-5 h-5" />
                    </button>
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