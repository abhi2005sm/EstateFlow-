import Link from 'next/link';

export default function BuildingsTable({ data }: { data: any[] }) {
  if(data.length === 0) return <div className="p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-100">No buildings found.</div>

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">S.No</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Building Name</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Type</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Total Units</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Rent Paid</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Rent Due</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((b) => (
              <tr key={b.id} className="hover:bg-blue-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-500">{b.serialNumber}</td>
                <td className="px-6 py-4 font-bold text-blue-600 hover:text-blue-800">
                  <Link href={`/admin/buildings/${b.id}`}>
                    {b.name}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${b.type === 'Residential' ? 'bg-purple-100 text-purple-700' : 'bg-pink-100 text-pink-700'}`}>
                    {b.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-700">{b.totalUnits}</td>
                <td className="px-6 py-4 font-semibold text-emerald-600">$${b.rentPaid.toLocaleString()}</td>
                <td className="px-6 py-4 font-semibold text-red-600">$${b.rentDue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}