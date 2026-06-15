export default function DefaultersList({ data }: { data?: any }) {
  if (!data) return null;
  const defaulters = data.rent_defaulters || [];
  return (
    <div className="bg-white dark:bg-[#18181b] rounded-xl border border-red-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-red-100 bg-red-50/50">
        <h3 className="text-lg font-bold text-red-600 flex items-center">
          <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
          Rent Defaulters
        </h3>
        <p className="text-sm text-red-400 mt-1">Tenants with unpaid rent balances</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-white dark:bg-[#18181b] border-b border-gray-100 dark:border-gray-800">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Name</th>
              <th className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Phone Number</th>
              <th className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Property Name</th>
              <th className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Due Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {defaulters.map((d: any, i: number) => (
              <tr key={d.name + i} className="hover:bg-red-50/30 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{d.name}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{d.phone_number}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{d.building_name}</td>
                <td className="px-6 py-4 font-bold text-red-600 bg-red-50/30">₹{Number(d.due_amount || 0).toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}