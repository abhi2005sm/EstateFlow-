export default function DashboardCards({ data }: { data?: any }) {
  if (!data) return null;
  const overview = data.property_overview || {};
  const rentSummary = data.rent_summary || {};
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Property Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card title="Total Properties" value={overview.total_buildings || 0} />
          <Card title="Residential" value={overview.residential || 0} />
          <Card title="Commercial" value={overview.commercial || 0} />
          <Card title="Total Units" value={overview.total_units || 0} />
          <Card title="Occupied Units" value={overview.occupied_units || 0} color="text-emerald-600" />
          <Card title="Vacant Units" value={overview.vacant_units || 0} color="text-red-600" />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Rent Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card title="Total Collected" value={`₹${Number(rentSummary.total_collected || 0).toLocaleString('en-IN')}`} color="text-emerald-600" />
          <Card title="Total Due" value={`₹${Number(rentSummary.total_due || 0).toLocaleString('en-IN')}`} color="text-red-600" />
          <Card title="Paid Units" value={rentSummary.paid_units || 0} color="text-emerald-600" />
          <Card title="Unpaid Units" value={rentSummary.unpaid_units || 0} color="text-red-600" />
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