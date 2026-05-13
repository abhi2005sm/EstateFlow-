import { useState, useEffect } from 'react';
import { Mail, MoreHorizontal, Phone, ExternalLink, Edit2, Trash2, Home, Users as UsersIcon, ChevronDown, Edit3, Trash, Search as SearchIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Unit } from '../buildings/api/buildingsApi';

export default function BuildingDetailsTable({ units, onAddTenant }: { units: Unit[], onAddTenant?: (unitId: string) => void }) {
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [collapsedFloors, setCollapsedFloors] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const handleClickOutside = () => {
      if (activeMenuId) setActiveMenuId(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeMenuId]);

  const toggleFloor = (floor: number) => {
    setCollapsedFloors(prev => ({ ...prev, [floor]: !prev[floor] }));
  };

  if (!units || units.length === 0) {
    return (
      <div className="p-20 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 text-gray-300">
          <SearchIcon className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">No units found</h3>
        <p className="text-gray-500 max-w-xs mx-auto text-sm">Try adding units to this building to see them here.</p>
      </div>
    );
  }

  // Group units by floor
  const floors = units.reduce((acc, unit) => {
    const floor = unit.floor_number;
    if (!acc[floor]) {
      acc[floor] = [];
    }
    acc[floor].push(unit);
    return acc;
  }, {} as Record<number, Unit[]>);

  const getStatusStyles = (isOccupied: boolean) => {
    if (isOccupied) {
      return {
        bg: 'bg-[#ECFDF5]',
        text: 'text-[#059669]',
        dot: 'bg-[#10B981]',
        label: 'Occupied'
      };
    }
    return {
      bg: 'bg-[#FFFBEB]',
      text: 'text-[#D97706]',
      dot: 'bg-[#F59E0B]',
      label: 'Vacant'
    };
  };

  const getOrdinal = (n: number) => {
    if (n === 0) return 'Ground';
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return (
    <div className="space-y-4 pb-32">
      {Object.entries(floors).sort(([a], [b]) => Number(a) - Number(b)).map(([floor, floorUnits]) => (
        <div key={floor} className="bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-sm transition-all hover:shadow-md">
          {/* Floor Header */}
          <button 
            onClick={() => toggleFloor(Number(floor))}
            className="w-full px-8 py-5 flex items-center justify-between border-b border-gray-50 bg-[#FCFCFD] hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-4 text-left">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center shadow-inner border border-white">
                <Home className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#111827]">{getOrdinal(Number(floor))} Floor</h3>
                <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mt-0.5">
                  {floorUnits.length} Units · {floorUnits.filter(u => u.is_occupied).length} Occupied
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-lg transition-transform duration-300 ${collapsedFloors[Number(floor)] ? '-rotate-90' : ''}`}>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </button>

          {/* Units Table */}
          <AnimatePresence>
            {!collapsedFloors[Number(floor)] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="overflow-x-visible">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#F5F5F5]">
                        <th className="px-8 py-5 text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">S.NO</th>
                        <th className="px-6 py-5 text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">UNIT NUMBER</th>
                        <th className="px-6 py-5 text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">UNIT TYPE</th>
                        <th className="px-6 py-5 text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">PRICE (RENT)</th>
                        <th className="px-6 py-5 text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider text-center">STATUS</th>
                        <th className="px-6 py-5 text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">OCCUPANCY</th>
                        <th className="px-8 py-5 text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F5F5F5]">
                      {floorUnits.map((unit, index) => {
                        const styles = getStatusStyles(unit.is_occupied);

                        return (
                          <motion.tr
                            key={unit.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="hover:bg-[#FAFAFA] transition-colors group relative"
                          >
                            <td className="px-8 py-6">
                              <span className="text-sm font-medium text-[#6B7280]">{index + 1}</span>
                            </td>
                            <td className="px-6 py-6">
                              <span className="text-sm font-bold text-[#111827]">{unit.unit_number}</span>
                            </td>
                            <td className="px-6 py-6">
                              <span className="text-sm font-medium text-[#4B5563]">{unit.unit_type}</span>
                            </td>
                            <td className="px-6 py-6">
                              <span className="text-sm font-bold text-[#111827]">₹{Number(unit.price).toLocaleString('en-IN')}</span>
                            </td>
                            <td className="px-6 py-6 text-center">
                              <div className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg ${styles.bg} ${styles.text}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
                                <span className="text-[11px] font-bold">{styles.label}</span>
                              </div>
                            </td>
                            <td className="px-6 py-6">
                              <span className="text-sm font-medium text-[#4B5563]">{unit.occupancy_type}</span>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                {unit.is_occupied ? (
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onViewTenant?.(unit.unit_id);
                                    }}
                                    className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"
                                    title="View Tenant"
                                  >
                                    <UsersIcon className="w-4 h-4" />
                                  </button>
                                ) : (
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onAddTenant?.(unit.unit_id || unit.id.toString());
                                    }}
                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                                    title="Add Tenant"
                                  >
                                    <UsersIcon className="w-4 h-4" />
                                  </button>
                                )}
                                <button className="p-2 text-[#9CA3AF] hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-[#9CA3AF] hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}