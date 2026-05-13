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

export default function BuildingDetails({ buildingId }: { buildingId: string }) {
  const [building, setBuilding] = useState<Building | null>(null);
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Units');
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);
  const [isViewTenantModalOpen, setIsViewTenantModalOpen] = useState(false);
  const [selectedUnitCode, setSelectedUnitCode] = useState<string>('');
  const [prefilledUnitId, setPrefilledUnitId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

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
        const tenantsData = await tenantsApi.getTenantsByBuildingId(buildingId);
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
      console.error('Failed to fetch building details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [buildingId]);

  const handleAction = (action: string) => {
    if (building) {
      alert(`${action} action triggered for ${building.name}`);
    }
  };

  const handleAddUnit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("New unit added successfully!");
    setIsUnitModalOpen(false);
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
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-gray-500 font-medium">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!building) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
      <div className="text-center space-y-4">
        <p className="text-xl font-bold text-gray-900">Building not found</p>
        <Link href="/admin/buildings" className="text-blue-600 hover:underline">Return to properties</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#1F2937] font-sans pb-20">
      {/* Top Navigation */}
      <header className="bg-white px-8 py-4 flex items-center justify-between border-b border-gray-100">
        <Link href="/admin/buildings" className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to properties
        </Link>
        <div className="flex items-center space-x-5">
          <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-all">
            <MessageSquare className="w-5 h-5" />
          </button>
          <button onClick={() => alert("No new notifications")} className="relative p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-all">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
            <img src="https://ui-avatars.com/api/?name=Admin&background=random" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-8 mt-6">
        {/* Property Banner Section */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex items-start justify-between">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden shadow-inner">
               <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=200" alt="Property" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{building.name}</h1>
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
            <button onClick={() => handleAction('Edit')} className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-all">
              <Edit3 className="w-4 h-4" />
            </button>
            <button onClick={() => handleAction('Download')} className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all">
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <button onClick={() => handleAction('Share')} className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </section>

        {/* Units Content Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Management Overview</h2>
            <div className="flex bg-gray-100 p-1 rounded-xl">
              {['Units', 'Tenant'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 bg-white border border-gray-100 px-4 py-2 rounded-lg text-sm font-bold text-gray-600 shadow-sm">
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
                  className="w-full bg-white border border-gray-100 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/10 outline-none shadow-sm font-medium"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={() => setIsTenantModalOpen(true)} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-md shadow-blue-500/10">
                <Plus className="w-4 h-4" />
                <span>Add Tenant</span>
              </button>
              <button onClick={() => setIsUnitModalOpen(true)} className="flex items-center space-x-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-50 transition-all active:scale-95">
                <Plus className="w-4 h-4" />
                <span>Add new unit</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Table Content based on Tab */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          {activeTab === 'Tenant' ? (
            <TenantListTable tenants={filteredTenants} />
          ) : (
            <BuildingDetailsTable 
              units={building.units || []} 
              onAddTenant={(unitId) => {
                setPrefilledUnitId(unitId);
                setIsTenantModalOpen(true);
              }}
              onViewTenant={(unitCode) => {
                setSelectedUnitCode(unitCode);
                setIsViewTenantModalOpen(true);
              }}
            />
          )}
        </div>

        {/* Add Tenant Modal */}
        <AddTenantModal 
          isOpen={isTenantModalOpen} 
          onClose={() => {
            setIsTenantModalOpen(false);
            setPrefilledUnitId('');
          }} 
          onSuccess={() => {
            fetchData();
            alert("Tenant registered successfully!");
          }}
          buildingId={buildingId}
          prefilledUnitId={prefilledUnitId}
        />

        {/* View Tenant Details Modal */}
        <TenantDetailsModal 
          isOpen={isViewTenantModalOpen}
          onClose={() => {
            setIsViewTenantModalOpen(false);
            setSelectedUnitCode('');
          }}
          unitCode={selectedUnitCode}
        />

        {/* Add Unit Modal */}
        {isUnitModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Add New Unit</h2>
                <button onClick={() => setIsUnitModalOpen(false)} className="text-gray-400 hover:bg-gray-100 p-1.5 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddUnit} className="p-6 space-y-4">
                <div className="space-y-4">
                  <input required type="text" placeholder="Unit Number (e.g. 101)" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                  <input required type="text" placeholder="Floor" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder="Beds" className="border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="number" placeholder="Baths" className="border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button type="button" onClick={() => setIsUnitModalOpen(false)} className="px-4 py-2 text-gray-600 font-bold text-sm">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm shadow-md">Add Unit</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}