"use client";
import Link from 'next/link';

export default function BuildingsTable({ data }: { data: any[] }) {
  if(data.length === 0) return <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-[#18181b] rounded-xl border border-gray-100 dark:border-gray-800">No properties found.</div>

  return (
    <>
      {/* Desktop Table View (>= 768px) */}
      <div className="hidden md:block bg-white dark:bg-[#18181b] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-[#27272a] border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">S.No</th>
                <th className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Property Name</th>
                <th className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Type</th>
                <th className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Total Units</th>
                <th className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Rent Paid</th>
                <th className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Rent Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((b, index) => (
                <tr key={b.id || b.building_id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">{index + 1}</td>
                  <td className="px-6 py-4 font-bold text-blue-600 dark:text-white hover:text-blue-800">
                    <Link href={`/admin/buildings/${b.id || b.building_id}`}>
                      {b.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${b.building_type === 'Residential' ? 'bg-purple-100 text-purple-700' : 'bg-pink-100 text-pink-700'}`}>
                      {b.building_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-200">{b.total_units}</td>
                  <td className="px-6 py-4 font-semibold text-emerald-600">₹ {(Number(b.rent_paid) || 0).toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 font-semibold text-red-600">₹ {(Number(b.rent_due) || 0).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards View (< 768px) */}
      <div className="md:flex md:hidden flex-col gap-4">
        {data.map((b) => {
          const occupiedUnits = b.units ? b.units.filter((u: any) => u.is_occupied).length : 0;
          const vacantUnits = b.total_units - occupiedUnits;
          const rentPaid = Number(b.rent_paid) || 0;
          const rentDue = Number(b.rent_due) || 0;
          const revenue = rentPaid + rentDue;
          
          return (
            <div key={b.id || b.building_id} className="bg-white dark:bg-[#18181b] rounded-xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm flex flex-col gap-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-[17px] font-black text-gray-900 dark:text-white leading-tight mb-1">{b.name}</h3>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {b.area_name ? `${b.area_name}${b.city ? `, ${b.city}` : ''}` : `${b.total_units} Units`}
                  </p>
                </div>
                <span className={`shrink-0 px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider ${b.building_type === 'Residential' ? 'bg-purple-100 text-purple-700' : 'bg-pink-100 text-pink-700'}`}>
                  {b.building_type}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 dark:bg-[#27272a] p-3 rounded-xl border border-gray-100 dark:border-gray-700/50">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400 mb-1">Total Units</p>
                  <p className="text-base font-black text-gray-900 dark:text-white">{b.total_units}</p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">Revenue</p>
                  <p className="text-base font-black text-emerald-700 dark:text-emerald-400">₹ {revenue.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-900/30">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-blue-600 dark:text-blue-400 mb-1">Occupied</p>
                  <p className="text-base font-black text-blue-700 dark:text-blue-400">{occupiedUnits}</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-xl border border-orange-100 dark:border-orange-900/30">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-orange-600 dark:text-orange-400 mb-1">Vacant</p>
                  <p className="text-base font-black text-orange-700 dark:text-orange-400">{vacantUnits}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Link 
                  href={`/admin/buildings/${b.id || b.building_id}`}
                  className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white py-3 rounded-xl text-sm font-bold text-center transition-colors"
                >
                  View Details
                </Link>
                <Link 
                  href={`/admin/buildings/${b.id || b.building_id}?edit=true`}
                  className="flex-1 bg-[#F26922] hover:bg-[#d95d1d] text-white py-3 rounded-xl text-sm font-bold text-center transition-colors shadow-lg shadow-[#F26922]/20"
                >
                  Edit Property
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}