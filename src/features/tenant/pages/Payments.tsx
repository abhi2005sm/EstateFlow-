import PaymentsTable from '../components/PaymentsTable';
import { tenantPaymentsData } from '../../../mock/tenantPaymentsData';

export default function Payments() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Payments</h1>
        <p className="text-gray-500 mt-2">Manage your upcoming dues and payment history.</p>
      </div>

      <PaymentsTable data={tenantPaymentsData} />
    </div>
  );
}