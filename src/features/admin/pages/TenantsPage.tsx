"use client";

import { useState, useEffect } from 'react';
import { Loader2, Building2, Search } from 'lucide-react';
import TenantListTable from '../components/TenantListTable';
import TenantDetailsModal from '../tenants/components/TenantDetailsModal';
import AddTenantModal from '../tenants/components/AddTenantModal';
import { buildingsApi, Building } from '../buildings/api/buildingsApi';
import { tenantsApi } from '../tenants/api/tenantsApi';

export default function TenantsPage() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>('');
  const [tenants, setTenants] = useState<any[]>([]);
  
  const [loadingBuildings, setLoadingBuildings] = useState(true);
  const [loadingTenants, setLoadingTenants] = useState(false);
  
  const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);
  const [isViewTenantModalOpen, setIsViewTenantModalOpen] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState('');

  // Fetch buildings on mount
  useEffect(() => {
    const fetchBuildings = async () => {
      setLoadingBuildings(true);
      try {
        const data = await buildingsApi.getBuildings();
        setBuildings(data.buildings || []);
        if (data.buildings && data.buildings.length > 0) {
          const firstBuilding = data.buildings[0];
          const firstId = firstBuilding.id || firstBuilding.building_id;
          if (firstId) {
             setSelectedBuildingId(firstId.toString());
          }
        }
      } catch (error) {
        console.error('Failed to fetch buildings:', error);
      } finally {
        setLoadingBuildings(false);
      }
    };
    fetchBuildings();
  }, []);

  // Fetch tenants when selected building changes
  useEffect(() => {
    if (!selectedBuildingId) {
      setTenants([]);
      return;
    }
    
    const fetchTenants = async () => {
      setLoadingTenants(true);
      try {
        const tenantsData = await tenantsApi.getTenantsByBuildingId(selectedBuildingId);
        
        // Use raw tenants or empty array
        const rawTenants = Array.isArray(tenantsData?.tenants) ? tenantsData.tenants : [];
        
        // Attempt to find building for unit map
        const building = buildings.find(b => b.id?.toString() === selectedBuildingId || b.building_id?.toString() === selectedBuildingId);
        const unitMap: Record<number, { unit_number: string, floor_number: number }> = {};
        
        if (building && Array.isArray(building.units)) {
          building.units.forEach(u => {
            unitMap[u.id] = { unit_number: u.unit_number, floor_number: u.floor_number };
          });
        }
        
        const enrichedTenants = rawTenants.map((t: any) => {
          const unitInfo = unitMap[t.unit];
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
      } catch (error) {
        console.error('Failed to fetch tenants:', error);
        setTenants([]);
      } finally {
        setLoadingTenants(false);
      }
    };
    fetchTenants();
  }, [selectedBuildingId, buildings]);

  const filteredTenants = tenants.filter(t => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    const name = t.name?.toLowerCase() || '';
    const email = t.email?.toLowerCase() || '';
    const unit = String(t.unit_number || t.unit_id || '').toLowerCase();
    
    return name.includes(searchLower) || email.includes(searchLower) || unit.includes(searchLower);
  });

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-[#F8F9FA]">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-[#1A1C1E] tracking-tight">Tenants Directory</h1>
          <p className="text-[#64748B] font-medium">Manage and view all tenants across your properties.</p>
        </div>
        <div className="flex items-center space-x-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
           <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-xl text-blue-600">
             <Building2 className="w-5 h-5" />
           </div>
           <div className="pr-2">
             <select 
               value={selectedBuildingId}
               onChange={(e) => setSelectedBuildingId(e.target.value)}
               disabled={loadingBuildings}
               className="bg-transparent border-none outline-none text-sm font-bold text-gray-900 cursor-pointer disabled:opacity-50"
             >
               <option value="" disabled>Select Property</option>
               {buildings.map((b, i) => {
                 const bid = b.id || b.building_id || `b-${i}`;
                 return <option key={bid} value={bid}>{b.name}</option>
               })}
             </select>
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider ml-1 -mt-1">Building Filter</p>
           </div>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-[32px] p-2 shadow-sm overflow-hidden mb-8">
         <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
           <div className="relative group w-full sm:w-72">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
             <input 
               type="text" 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder="Search by name, email or unit..." 
               className="w-full bg-[#F8F9FA] border border-transparent rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20 focus:bg-white outline-none transition-all font-medium"
             />
           </div>
           <button
             onClick={() => setIsAddTenantModalOpen(true)}
             className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-blue-700 transition-all flex items-center justify-center whitespace-nowrap"
           >
             + Add Tenant
           </button>
         </div>
        
        {loadingBuildings || loadingTenants ? (
          <div className="h-64 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-sm font-bold text-[#64748B] animate-pulse">
              {loadingBuildings ? 'Loading properties...' : 'Retrieving tenant records...'}
            </p>
          </div>
        ) : (
          <div className="bg-gray-50/30 p-4">
             <TenantListTable 
               tenants={filteredTenants} 
               buildingName={buildings.find(b => b.id?.toString() === selectedBuildingId || b.building_id?.toString() === selectedBuildingId)?.name}
               onViewTenant={(tenantId) => {
                 setSelectedTenantId(tenantId);
                 setIsViewTenantModalOpen(true);
               }} 
             />
          </div>
        )}
      </div>

      <TenantDetailsModal 
        isOpen={isViewTenantModalOpen}
        onClose={() => {
          setIsViewTenantModalOpen(false);
          setSelectedTenantId(null);
        }}
        tenantId={selectedTenantId}
      />

      <AddTenantModal
        isOpen={isAddTenantModalOpen}
        onClose={() => setIsAddTenantModalOpen(false)}
        onSuccess={() => {
          // Re-fetch tenants
          if (selectedBuildingId) {
             const reloadTenants = async () => {
               setLoadingTenants(true);
               try {
                 const tenantsData = await tenantsApi.getTenantsByBuildingId(selectedBuildingId);
                 const rawTenants = Array.isArray(tenantsData?.tenants) ? tenantsData.tenants : [];
                 const building = buildings.find(b => b.id?.toString() === selectedBuildingId || b.building_id?.toString() === selectedBuildingId);
                 const unitMap: Record<number, { unit_number: string, floor_number: number }> = {};
                 if (building && Array.isArray(building.units)) {
                   building.units.forEach(u => {
                     unitMap[u.id] = { unit_number: u.unit_number, floor_number: u.floor_number };
                   });
                 }
                 const enrichedTenants = rawTenants.map((t: any) => {
                   const unitInfo = unitMap[t.unit];
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
               } catch (error) {
                 console.error(error);
               } finally {
                 setLoadingTenants(false);
               }
             };
             reloadTenants();
          }
        }}
        buildings={buildings}
        defaultBuildingId={selectedBuildingId}
      />
    </div>
  );
}
