export default function DashboardCards({ data }: { data?: any }) {
  if (!data) return null;
  const overview = data.property_overview || {};
  const rentSummary = data.rent_summary || {};
  return (
    <div className="space-y-8">
      {/* Key Metrics Row */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <PremiumCard 
            title="Monthly Revenue" 
            value={`₹${Number(rentSummary.total_collected || 0).toLocaleString('en-IN')}`} 
            gradient="from-emerald-500 to-teal-400"
          />
          <PremiumCard 
            title="Occupancy %" 
            value={`${overview.occupancy_percentage || 0}%`} 
            gradient="from-blue-500 to-indigo-500"
          />
          <PremiumCard 
            title="Revenue Lost To Vacancy" 
            value={`₹${Number(rentSummary.revenue_lost_to_vacancy || 0).toLocaleString('en-IN')}`} 
            gradient="from-rose-500 to-pink-500"
          />
          <PremiumCard 
            title="Collection Efficiency" 
            value={`${rentSummary.collection_efficiency || 0}%`} 
            gradient="from-amber-500 to-orange-400"
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Property Overview</h2>
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
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Rent Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card title="Total Collected" value={`₹${Number(rentSummary.total_collected || 0).toLocaleString('en-IN')}`} color="text-emerald-600" />
          <Card title="Deposit Collected" value={`₹${Number(rentSummary.total_deposit_collected || 0).toLocaleString('en-IN')}`} color="text-emerald-600" />
          <Card title="Total Due" value={`₹${Number(rentSummary.total_due || 0).toLocaleString('en-IN')}`} color="text-red-600" />
          <Card title="Paid Units" value={rentSummary.paid_units || 0} color="text-emerald-600" />
          <Card title="Unpaid Units" value={rentSummary.unpaid_units || 0} color="text-red-600" />
        </div>
      </div>
    </div>
  );
}

const Card = ({ title, value, color = "text-gray-900 dark:text-white" }: any) => (
  <div className="bg-white dark:bg-[#18181b] p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-center">
    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{title}</p>
    <h3 className={`text-3xl font-bold ${color}`}>{value}</h3>
  </div>
);

const PremiumCard = ({ title, value, gradient }: any) => (
  <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#18181b] p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-between h-32 group">
    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} rounded-full blur-[50px] opacity-20 group-hover:opacity-30 transition-opacity duration-500 -mr-10 -mt-10 pointer-events-none`} />
    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest relative z-10">{title}</p>
    <h3 className="text-3xl font-black text-gray-900 dark:text-white relative z-10 tracking-tight">{value}</h3>
  </div>
);