import { Mail, MoreHorizontal, Phone, ExternalLink, Edit2, Trash2, Home, Users as UsersIcon, ChevronDown, Edit3, Trash } from 'lucide-react';
import { motion } from 'framer-motion';

interface Tenant {
  id: string;
  name: string;
  floorNumber: number;
  houseNumber?: string;
  phone: string;
  email: string;
  rentAmount: number;
  rentStatus: string;
  dueAmount: number;
  moveInDate: string;
  members: number;
  complainRate: number;
}

export default function BuildingDetailsTable({ tenants }: { tenants: Tenant[] }) {
  if (!tenants || tenants.length === 0) {
    return (
      <div className="p-20 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 text-gray-300">
          <SearchIcon className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">No units found</h3>
        <p className="text-gray-500 max-w-xs mx-auto text-sm">Try adjusting your filters or search terms to find what you're looking for.</p>
      </div>
    );
  }

  // Group tenants by floor
  const floors = tenants.reduce((acc, tenant) => {
    const floor = tenant.floorNumber;
    if (!acc[floor]) {
      acc[floor] = [];
    }
    acc[floor].push(tenant);
    return acc;
  }, {} as Record<number, Tenant[]>);

  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return {
          bg: 'bg-[#ECFDF5]',
          text: 'text-[#059669]',
          dot: 'bg-[#10B981]'
        };
      case 'unpaid':
        return {
          bg: 'bg-[#FEF2F2]',
          text: 'text-[#DC2626]',
          dot: 'bg-[#EF4444]'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-600',
          dot: 'bg-gray-400'
        };
    }
  };

  const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return (
    <div className="space-y-10">
      {Object.entries(floors).sort(([a], [b]) => Number(a) - Number(b)).map(([floor, floorTenants]) => (
        <div key={floor} className="bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-sm">
          {/* Floor Header */}
          <div className="px-8 py-5 flex items-center justify-between border-b border-gray-50 bg-[#FCFCFD]">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden shadow-inner border border-white">
                <img 
                  src={`https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=200`} 
                  alt="Floor" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#111827]">{getOrdinal(Number(floor))} Floor</h3>
                <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mt-0.5">
                  {Number(floor) + 1} Bed • {Number(floor)} Bath • {1500 + (Number(floor) * 200)} Sqft
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all border border-transparent hover:border-gray-100">
                <Edit3 className="w-4 h-4" />
              </button>
              <button className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all border border-transparent hover:border-rose-100/50">
                <Trash className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Units Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#F5F5F5]">
                  <th className="px-8 py-5 text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">S.NO</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">TENANT NAME</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider text-center">HOUSE NUMBER</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">PHONE NUMBER</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">RENT AMOUNT</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider text-center">RENT STATUS</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">DUE AMOUNT</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F5F5]">
                {floorTenants.map((t, index) => {
                  const styles = getStatusStyles(t.rentStatus);
                  const isUnpaid = t.rentStatus.toLowerCase() === 'unpaid';
                  const houseNum = (t.floorNumber * 100) + (index + 1);

                  return (
                    <motion.tr
                      key={t.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-[#FAFAFA] transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <span className="text-sm font-medium text-[#6B7280]">{index + 1}</span>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-sm font-bold text-[#111827]">{t.name}</span>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span className="text-sm font-medium text-[#4B5563]">{houseNum}</span>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-sm font-medium text-[#4B5563]">{t.phone || '+1 555-0102'}</span>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-sm font-bold text-[#111827]">${t.rentAmount?.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <div className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg ${styles.bg} ${styles.text}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
                          <span className="text-[11px] font-bold">{t.rentStatus}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`text-sm font-bold ${isUnpaid ? 'text-[#DC2626]' : 'text-[#6B7280]'}`}>
                          {isUnpaid ? `$${t.rentAmount?.toLocaleString()}` : '—'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button 
                            className="p-2 text-[#4F46E5] hover:bg-[#EEF2FF] rounded-lg transition-all" 
                            title="Message Tenant"
                          >
                            <Mail className="w-4 h-4 stroke-[2]" />
                          </button>
                          <button className="p-2 text-[#9CA3AF] hover:text-[#111827] transition-all opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}