import { adminDashboardData } from '../../../mock/adminDashboardData';

export default function DashboardCards() {
  const { overview, rentSummary } = adminDashboardData;
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Property Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card title="Total Buildings" value={overview.totalBuildings} />
          <Card title="Residential" value={overview.residentialBuildings} />
          <Card title="Commercial" value={overview.commercialBuildings} />
          <Card title="Total Units" value={overview.totalUnits} />
          <Card title="Occupied Units" value={overview.occupiedUnits} color="text-emerald-600" />
          <Card title="Vacant Units" value={overview.vacantUnits} color="text-red-600" />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Rent Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card title="Total Collected" value={`$${rentSummary.totalRentCollected.toLocaleString()}`} color="text-emerald-600" />
          <Card title="Total Due" value={`$${rentSummary.totalRentDue.toLocaleString()}`} color="text-red-600" />
          <Card title="Paid Units" value={rentSummary.paidUnits} color="text-emerald-600" />
          <Card title="Unpaid Units" value={rentSummary.unpaidUnits} color="text-red-600" />
        </div>
      </div>
    </div>
  );
}

const Card = ({ title, value, color = "text-gray-900" }: any) => (
  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{title}</p>
    <h3 className={`text-3xl font-bold ${color}`}>{value}</h3>
  </div>
);