import { tenantDashboardData } from '../../../mock/tenantDashboardData';

export default function DashboardCards() {
  const { overview } = tenantDashboardData;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card title="Total Rent" value={`$${overview.totalRent.toLocaleString()}`} />
      <Card title="Paid Amount" value={`$${overview.paidAmount.toLocaleString()}`} color="text-emerald-600" />
      <Card title="Due Amount" value={`$${overview.dueAmount.toLocaleString()}`} color="text-red-600" />
      <Card title="Next Due Date" value={overview.nextDueDate} color="text-blue-600" />
    </div>
  );
}

const Card = ({ title, value, color = "text-gray-900" }: any) => (
  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{title}</p>
    <h3 className={`text-3xl font-bold ${color}`}>{value}</h3>
  </div>
);