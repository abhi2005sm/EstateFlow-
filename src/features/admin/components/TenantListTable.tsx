import { useState, useEffect } from 'react';
import { Mail, Phone, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TenantListTable({ tenants }: { tenants: any[] }) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = () => {
      if (activeMenuId) setActiveMenuId(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeMenuId]);

  if (!tenants || tenants.length === 0) {
    return (
      <div className="p-20 text-center flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
          <Mail className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">No tenants found</h3>
        <p className="text-gray-500 max-w-xs mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
      </div>
    );
  }

  // Group tenants by floor - fallback to 0 if missing
  const groupedByFloor = tenants.reduce((acc: any, t) => {
    const floor = t.floor_number || 0;
    if (!acc[floor]) acc[floor] = [];
    acc[floor].push(t);
    return acc;
  }, {});

  const floorNames = ['Ground Floor', 'First Floor', '2nd Floor', 'Third Floor', 'Fourth Floor', 'Fifth Floor'];

  return (
    <div className="space-y-10">
      {Object.entries(groupedByFloor).map(([floor, floorTenants]: [string, any]) => (
        <div key={floor} className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          {/* Floor Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-50 bg-[#F9FAFB]/50">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                <img 
                  src="https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&q=80&w=100" 
                  alt="Floor" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">{floorNames[parseInt(floor)] || `${floor}th Floor`}</h3>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Tenant Directory · Active</p>
              </div>
            </div>
          </div>

          {/* Table for this Floor */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-50">
                  <th className="px-6 py-5 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">S.NO</th>
                  <th className="px-6 py-5 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">TENANT NAME</th>
                  <th className="px-6 py-5 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">UNIT NUMBER</th>
                  <th className="px-6 py-5 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">PHONE NUMBER</th>
                  <th className="px-6 py-5 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">RENT AMOUNT</th>
                  <th className="px-6 py-5 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">RENT STATUS</th>
                  <th className="px-6 py-5 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">DUE AMOUNT</th>
                  <th className="px-6 py-5 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {floorTenants.map((t: any, index: number) => (
                  <tr 
                    key={t.id}
                    className="hover:bg-gray-50/50 transition-colors duration-200"
                  >
                    <td className="px-6 py-6 text-xs text-gray-400 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-sm font-bold text-gray-900">{t.name}</span>
                    </td>
                    <td className="px-6 py-6 text-xs text-gray-500 font-medium">
                      {t.unit_number || t.unit_id || t.unit || '-'}
                    </td>
                    <td className="px-6 py-6 text-xs text-gray-500 font-medium">
                      {t.phone_number || t.phone || '-'}
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-sm font-bold text-gray-900">₹{t.rent_amount?.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold ${
                        t.rent_status === 'Paid' 
                          ? 'bg-[#E6FFFA] text-[#047857]' 
                          : 'bg-[#FFF5F5] text-[#C53030]'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                          t.rent_status === 'Paid' ? 'bg-[#38B2AC]' : 'bg-[#F56565]'
                        }`} />
                        {t.rent_status || 'Unpaid'}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`text-sm font-bold ${Number(t.due_amount) > 0 ? 'text-[#C53030]' : 'text-gray-300'}`}>
                        {Number(t.due_amount) > 0 ? `₹${Number(t.due_amount).toLocaleString('en-IN')}` : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex items-center justify-end space-x-2 h-9">
                        {activeMenuId === t.id ? (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center space-x-2"
                          >
                            <a 
                              href={`tel:${t.phone_number || t.phone}`} 
                              className="p-1.5 text-blue-600 border border-blue-100 bg-blue-50/30 rounded-lg transition-all hover:bg-blue-100 active:scale-95" 
                              title="Call Tenant"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                            <a 
                              href={`mailto:${t.email}`} 
                              className="p-1.5 text-blue-600 border border-blue-100 bg-blue-50/30 rounded-lg transition-all hover:bg-blue-100 active:scale-95" 
                              title="Email Tenant"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                          </motion.div>
                        ) : (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(t.id);
                            }}
                            className="p-1.5 text-gray-400 hover:text-gray-900 transition-all"
                          >
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
