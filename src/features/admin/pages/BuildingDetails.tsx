"use client";
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import BuildingDetailsTable from '../components/BuildingDetailsTable';
import TenantListTable from '../components/TenantListTable';
import { Plus, X, Mail, Search, Filter, ChevronLeft, Download, MoreVertical, Bell, Settings, ChevronDown, User, MapPin, Share2, MessageSquare, Edit3, Trash2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AddTenantModal from '../tenants/components/AddTenantModal';
import TenantDetailsModal from '../tenants/components/TenantDetailsModal';
import { buildingsApi, Building, Unit } from '../buildings/api/buildingsApi';
import { tenantsApi } from '../tenants/api/tenantsApi';
import { getUnitsByBuilding, createUnit, updateUnit, deleteUnit } from '@/src/features/api/unitsApi';

export default function BuildingDetails({ buildingId }: { buildingId: string }) {
  const [building, setBuilding] = useState<Building | null>(null);
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Units');
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);
  const [isViewTenantModalOpen, setIsViewTenantModalOpen] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState<number | null>(null);
  const [prefilledUnitId, setPrefilledUnitId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [viewingPast, setViewingPast] = useState(false);
  const [editingTenant, setEditingTenant] = useState<any>(null);

  const [viewingPastUnits, setViewingPastUnits] = useState(false);
  const [units, setUnits] = useState<Unit[]>([]);
  const [editingUnit, setEditingUnit] = useState<any>(null);
  const [unitFormData, setUnitFormData] = useState({
    unit_number: '',
    floor_number: '',
    unit_type: '1 BHK',
    price: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // First try to get the specific building
      let buildingData: Building | null = null;
      try {
        buildingData = await buildingsApi.getBuildingById(buildingId);
      } catch (e) {
        console.warn('Direct building fetch failed, falling back to list:', e);
        // Fallback: fetch all buildings and filter
        const listData = await buildingsApi.getBuildings();
        buildingData = listData.buildings.find(b => b.id.toString() === buildingId || b.building_id === buildingId) || null;
      }
      
      setBuilding(buildingData);
      
      if (buildingData) {
        const tenantsData = await tenantsApi.getTenantsByBuildingId(buildingId, viewingPast ? 'past' : 'active');
        const rawTenants = Array.isArray(tenantsData?.tenants) ? tenantsData.tenants : [];
        
        // Map unit IDs to numbers/floors from the building object
        const unitMap: Record<number, { unit_number: string, floor_number: number }> = {};
        if (Array.isArray(buildingData.units)) {
          buildingData.units.forEach(u => {
            unitMap[u.id] = { unit_number: u.unit_number, floor_number: u.floor_number };
          });
        }

        const enrichedTenants = rawTenants.map((t: any) => {
          const unitInfo = unitMap[t.unit];

          // Robust fallback for unit number: 
          // 1. Try mapping from buildings list
          // 2. Try parsing from unit_id string (e.g. o-2-b-1-101 -> 101)
          // 3. Fallback to existing unit_number or unit field
          let resolvedUnitNumber = unitInfo?.unit_number;
          if (!resolvedUnitNumber && t.unit_id) {
            const parts = String(t.unit_id).split('-');
            if (parts.length > 1) resolvedUnitNumber = parts[parts.length - 1];
          }

          return {
            ...t,
            unit_number: resolvedUnitNumber || t.unit_number || t.unit_id || t.unit,
            floor_number: unitInfo?.floor_number ?? t.floor_number ?? 0
          };
        });

        setTenants(enrichedTenants);
      }
    } catch (error) {
      console.warn('Failed to fetch building details:', error);
    } finally {
      setLoading(false);
    }
  };

  const [hasFetchedUnits, setHasFetchedUnits] = useState(false);

  const fetchUnits = async () => {
    try {
      const status = viewingPastUnits ? 'past' : 'active';
      const data = await getUnitsByBuilding(buildingId, status);
      setUnits(Array.isArray(data) ? data : (data.results || data.units || []));
      setHasFetchedUnits(true);
    } catch (error) {
      console.warn('Failed to fetch units:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [buildingId, viewingPast]);

  useEffect(() => {
    fetchUnits();
  }, [buildingId, viewingPastUnits]);

  const handleAction = (action: string) => {
    if (building) {
      alert(`${action} action triggered for ${building.name}`);
    }
  };

  const handleDeleteTenant = async (tenantId: number, tenantName: string) => {
    const confirmDelete = window.confirm(`This will send a vacate request to the tenant (${tenantName}). They must confirm they have received their deposit return before the unit is marked as vacant.`);
    
    if (confirmDelete) {
      try {
        await tenantsApi.deleteTenant(tenantId);
        alert(`Vacate request sent to ${tenantName}. Waiting for tenant confirmation.`);
        fetchData();
      } catch (error) {
        alert("Failed to initiate vacate request.");
        console.warn(error);
      }
    }
  };

  const handleEditTenant = (tenant: any) => {
    setEditingTenant(tenant);
    setIsTenantModalOpen(true);
  };

  const handleAddUnitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUnit) {
        await updateUnit(editingUnit.unit_code || editingUnit.unit_id || editingUnit.id.toString(), unitFormData);
        alert("Unit updated successfully!");
      } else {
        await createUnit(buildingId, {
          ...unitFormData,
          floor_number: Number(unitFormData.floor_number),
          price: Number(unitFormData.price)
        });
        alert("New unit added successfully!");
      }
      setIsUnitModalOpen(false);
      setEditingUnit(null);
      setUnitFormData({ unit_number: '', floor_number: '', unit_type: '1 BHK', price: '' });
      fetchUnits();
    } catch (error) {
      alert("Failed to save unit.");
      console.warn(error);
    }
  };

  const handleDeleteUnit = async (unit: any) => {
    if (unit.is_occupied) {
      alert("Cannot delete this unit. Please remove the tenant first!");
      return;
    }
    
    const confirm = window.confirm(`Are you sure you want to soft delete Unit ${unit.unit_number}?`);
    if (confirm) {
      try {
        await deleteUnit(unit.unit_code || unit.unit_id || unit.id.toString());
        alert("Unit moved to history successfully!");
        fetchUnits();
      } catch (error) {
        alert("Failed to delete unit.");
        console.warn(error);
      }
    }
  };

  const handleEditUnit = (unit: any) => {
    setEditingUnit(unit);
    setUnitFormData({
      unit_number: unit.unit_number || '',
      floor_number: unit.floor_number?.toString() || '',
      unit_type: unit.unit_type || '1 BHK',
      price: unit.price?.toString() || ''
    });
    setIsUnitModalOpen(true);
  };
  
  const filteredTenants = useMemo(() => {
    return tenants.filter(t => {
      const name = t.name || '';
      const email = t.email || '';
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = activeFilter === 'All' || 
                           (activeFilter === 'Occupied' && t.status === 'Active') ||
                           (activeFilter === 'Vacant' && t.status === 'Inactive');
      
      return matchesSearch && matchesFilter;
    });
  }, [tenants, searchQuery, activeFilter]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 text-blue-600 dark:text-white animate-spin" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!building) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
      <div className="text-center space-y-4">
        <p className="text-xl font-bold text-gray-900 dark:text-white">Building not found</p>
        <Link href="/admin/buildings" className="text-blue-600 dark:text-white hover:underline">Return to properties</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#1F2937] font-sans pb-20">
      {/* Top Navigation */}
      <header className="bg-white dark:bg-[#18181b] px-8 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <Link href="/admin/buildings" className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to properties
        </Link>
        <div className="flex items-center space-x-5">
          <button className="p-2 text-gray-400 hover:bg-gray-50 dark:bg-[#27272a] rounded-full transition-all">
            <MessageSquare className="w-5 h-5" />
          </button>
          <button onClick={() => alert("No new notifications")} className="relative p-2 text-gray-400 hover:bg-gray-50 dark:bg-[#27272a] rounded-full transition-all">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-100 dark:border-gray-800">
            <img src="https://ui-avatars.com/api/?name=Admin&background=random" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-8 mt-6">
        {/* Property Banner Section */}
        <section className="bg-white dark:bg-[#18181b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-8 flex items-start justify-between">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-gray-100 dark:bg-[#27272a] rounded-xl overflow-hidden shadow-inner">
               <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=200" alt="Property" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-[#121110] dark:text-whitexl font-bold text-gray-900 dark:text-white">{building.name}</h1>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${(building.rentDue ?? 0) === 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                   Active Property
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-400 space-x-4 mb-2">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {building.area_name || 'Location details pending'}
                </div>
              </div>
              <p className="text-xs text-gray-400 font-medium">Managed Property Portfolio</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button onClick={() => handleAction('Edit')} className="p-2 border border-gray-200 dark:border-white/10 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:bg-[#27272a] transition-all">
              <Edit3 className="w-4 h-4" />
            </button>
            <button onClick={() => handleAction('Download')} className="flex items-center space-x-2 px-4 py-2 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:bg-[#27272a] transition-all">
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <button onClick={() => handleAction('Share')} className="flex items-center space-x-2 px-4 py-2 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:bg-[#27272a] transition-all">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </section>

        {/* Units Content Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {activeTab === 'Tenant' 
                  ? (viewingPast ? "Past Tenants (Historical)" : "Management Overview") 
                  : (viewingPastUnits ? "Past Units (Historical)" : "Management Overview")}
              </h2>
              {activeTab === 'Tenant' && (
                <button 
                  onClick={() => setViewingPast(!viewingPast)}
                  className="px-3 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-[#27272a] rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {viewingPast ? "View Active Tenants" : "View Past Tenants"}
                </button>
              )}
              {activeTab === 'Units' && (
                <button 
                  onClick={() => setViewingPastUnits(!viewingPastUnits)}
                  className="px-3 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-[#27272a] rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {viewingPastUnits ? "View Active Units" : "View Past Units"}
                </button>
              )}
            </div>
            <div className="flex bg-gray-100 dark:bg-[#27272a] p-1 rounded-xl">
              {['Units', 'Tenant'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab ? 'bg-white dark:bg-[#18181b] text-blue-600 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-white'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 bg-white dark:bg-[#18181b] border border-gray-100 dark:border-gray-800 px-4 py-2 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 shadow-sm">
                <span>All type</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              <div className="relative group w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tenants or units" 
                  className="w-full bg-white dark:bg-[#18181b] border border-gray-100 dark:border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/10 outline-none shadow-sm font-medium"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={() => setIsTenantModalOpen(true)} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-md shadow-blue-500/10">
                <Plus className="w-4 h-4" />
                <span>Add Tenant</span>
              </button>
              <button onClick={() => {
                setEditingUnit(null);
                setUnitFormData({ unit_number: '', floor_number: '', unit_type: '1 BHK', price: '' });
                setIsUnitModalOpen(true);
              }} className="flex items-center space-x-2 px-4 py-2 border border-blue-600 text-blue-600 dark:text-white rounded-lg text-sm font-bold hover:bg-blue-50 transition-all active:scale-95">
                <Plus className="w-4 h-4" />
                <span>Add new unit</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Table Content based on Tab */}
        <div className="bg-white dark:bg-[#18181b] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
          {activeTab === 'Tenant' ? (
            <TenantListTable 
              tenants={filteredTenants} 
              buildingName={building.name} 
              onViewTenant={(id) => {
                setSelectedTenantId(id);
                setIsViewTenantModalOpen(true);
              }}
              onEditTenant={handleEditTenant}
              onDeleteTenant={handleDeleteTenant}
            />
          ) : (
            <BuildingDetailsTable 
              units={hasFetchedUnits ? units : (building.units || [])} 
              onAddTenant={(unitId) => {
                setPrefilledUnitId(unitId);
                setIsTenantModalOpen(true);
              }}
              onViewTenant={(unitCode) => {
                const tenant = tenants.find(t => t.unit_code === unitCode || t.unit_id === unitCode || String(t.unit) === unitCode || t.unit_number === unitCode);
                if (tenant) {
                  setSelectedTenantId(tenant.tenant_id || tenant.id);
                  setIsViewTenantModalOpen(true);
                } else {
                  alert("Could not find tenant ID for this unit.");
                }
              }}
              onEditUnit={handleEditUnit}
              onDeleteUnit={handleDeleteUnit}
            />
          )}
        </div>

        {/* Add/Edit Tenant Modal */}
        <AddTenantModal 
          isOpen={isTenantModalOpen} 
          onClose={() => {
            setIsTenantModalOpen(false);
            setPrefilledUnitId('');
            setEditingTenant(null);
          }} 
          onSuccess={() => {
            fetchData();
            alert(`Tenant ${editingTenant ? 'updated' : 'registered'} successfully!`);
            setEditingTenant(null);
          }}
          buildings={building ? [building] : []}
          defaultBuildingId={buildingId}
          prefilledUnitId={prefilledUnitId}
          editData={editingTenant}
        />

        {/* View Tenant Details Modal */}
        <TenantDetailsModal 
          isOpen={isViewTenantModalOpen}
          onClose={() => {
            setIsViewTenantModalOpen(false);
            setSelectedTenantId(null);
          }}
          tenantId={selectedTenantId}
        />

        {/* Add/Edit Unit Modal */}
        {isUnitModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#18181b] rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editingUnit ? 'Edit Unit' : 'Add New Unit'}</h2>
                <button onClick={() => setIsUnitModalOpen(false)} className="text-gray-400 hover:bg-gray-100 dark:bg-[#27272a] p-1.5 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddUnitSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Unit Number</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 101"
                      value={unitFormData.unit_number}
                      onChange={(e) => setUnitFormData({...unitFormData, unit_number: e.target.value})}
                      className="w-full border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={!!editingUnit} // Prevent changing unit number after creation
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Floor Number</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 1"
                      value={unitFormData.floor_number}
                      onChange={(e) => setUnitFormData({...unitFormData, floor_number: e.target.value})}
                      className="w-full border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Unit Type</label>
                    <select 
                      value={unitFormData.unit_type}
                      onChange={(e) => setUnitFormData({...unitFormData, unit_type: e.target.value})}
                      className="w-full border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#18181b]"
                    >
                      <option value="1 RK">1 RK</option>
                      <option value="1 BHK">1 BHK</option>
                      <option value="2 BHK">2 BHK</option>
                      <option value="3 BHK">3 BHK</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Rent (₹)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 15000"
                      value={unitFormData.price}
                      onChange={(e) => setUnitFormData({...unitFormData, price: e.target.value})}
                      className="w-full border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button type="button" onClick={() => setIsUnitModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 font-bold text-sm">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm shadow-md">
                    {editingUnit ? 'Save Changes' : 'Add Unit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}