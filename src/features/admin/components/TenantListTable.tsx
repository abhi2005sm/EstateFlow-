import { useState, useEffect } from 'react';
import { Mail, Phone, MoreHorizontal, Eye, Edit3, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TenantListTable({ tenants, onViewTenant, onEditTenant, onDeleteTenant, buildingName }: { tenants: any[], onViewTenant?: (tenantId: number) => void, onEditTenant?: (tenant: any) => void, onDeleteTenant?: (tenantId: number, tenantName: string) => void, buildingName?: string }) {
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
      <div className="p-20 text-center flex flex-col items-center justify-center bg-white dark:bg-[#18181b] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="w-16 h-16 bg-gray-50 dark:bg-[#27272a] rounded-2xl flex items-center justify-center mb-4">
          <Mail className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">No tenants found</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
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
        <div key={floor} className="bg-white dark:bg-[#18181b] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          {/* Floor Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-50 bg-[#F9FAFB]/50">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-100 dark:bg-[#27272a] rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-sm">
                <img 
                  src="https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&q=80&w=100" 
                  alt="Floor" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">{floorNames[parseInt(floor)] || `${floor}th Floor`} {buildingName ? `- ${buildingName}` : ''}</h3>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Tenant Directory · Active</p>
              </div>
            </div>
          </div>

          {/* Table for this Floor */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white dark:bg-[#18181b] border-b border-gray-50">
                  <th className="px-6 py-5 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">S.NO</th>
                  <th className="px-6 py-5 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">TENANT NAME</th>
                  <th className="px-6 py-5 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">UNIT ID</th>
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
                    key={t.tenant_id || t.id}
                    className="hover:bg-gray-50/50 transition-colors duration-200"
                  >
                    <td className="px-6 py-6 text-xs text-gray-400 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{t.name}</span>
                    </td>
                    <td className="px-6 py-6 text-xs">
                      {t.unit_code || t.unit_id || t.unit || t.unit_number ? (
                        <span className="font-medium text-gray-500 dark:text-gray-400">
                          {t.unit_code || t.unit_number || t.unit_id || t.unit}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic font-medium">
                          {t.past_unit_identifier || "Unknown"}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-6 text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {t.phone_number || t.phone || '-'}
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">₹{t.rent_amount?.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold ${
                        t.rent_status === 'Paid' ? 'bg-[#E6FFFA] text-[#047857]' :
                        t.rent_status === 'Partial' ? 'bg-amber-50 text-amber-600' :
                        'bg-[#FFF5F5] text-[#C53030]'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                          t.rent_status === 'Paid' ? 'bg-[#38B2AC]' : 
                          t.rent_status === 'Partial' ? 'bg-amber-500' :
                          'bg-[#F56565]'
                        }`} />
                        {t.rent_status || 'Unpaid'}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`text-sm font-bold ${(t.rent_status === 'Partial' || t.rent_status === 'Unpaid' || Number(t.due_amount) > 0) ? 'text-[#C53030]' : 'text-gray-300'}`}>
                        {(t.rent_status === 'Partial' || t.rent_status === 'Unpaid' || Number(t.due_amount) > 0) ? `₹${Number(t.due_amount || 0).toLocaleString('en-IN')}` : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex items-center justify-end space-x-2 h-9">
                        {activeMenuId === (t.tenant_id || t.id) ? (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center space-x-2"
                          >
                            <a 
                              href={`tel:${t.phone_number || t.phone}`} 
                              className="p-1.5 text-blue-600 dark:text-white border border-blue-100 bg-blue-50/30 rounded-lg transition-all hover:bg-blue-100 active:scale-95" 
                              title="Call Tenant"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                            <a 
                              href={`mailto:${t.email}`} 
                              className="p-1.5 text-blue-600 dark:text-white border border-blue-100 bg-blue-50/30 rounded-lg transition-all hover:bg-blue-100 active:scale-95" 
                              title="Email Tenant"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                            {onViewTenant && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onViewTenant(t.tenant_id || t.id);
                                }}
                                className="p-1.5 text-blue-600 dark:text-white border border-blue-100 bg-blue-50/30 rounded-lg transition-all hover:bg-blue-100 active:scale-95"
                                title="View Profile"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {onEditTenant && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditTenant(t);
                                }}
                                className="p-1.5 text-blue-600 dark:text-white border border-blue-100 bg-blue-50/30 rounded-lg transition-all hover:bg-blue-100 active:scale-95"
                                title="Edit Tenant"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {onDeleteTenant && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteTenant(t.tenant_id || t.id, t.name);
                                }}
                                className="p-1.5 text-red-600 border border-red-100 bg-red-50/30 rounded-lg transition-all hover:bg-red-100 active:scale-95"
                                title="Delete Tenant"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </motion.div>
                        ) : (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(t.tenant_id || t.id);
                            }}
                            className="p-1.5 text-gray-400 hover:text-gray-900 dark:text-white transition-all"
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
