"use client";
import { useState, useMemo, useEffect } from 'react';
import Filters from '../components/Filters';
import BuildingsTable from '../components/BuildingsTable';
import { Plus, Loader2 } from 'lucide-react';
import AddBuildingModal from '../buildings/components/AddBuildingModal';
import { buildingsApi, Building } from '../buildings/api/buildingsApi';

export default function Buildings() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [sortOrder, setSortOrder] = useState('asc');
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBuildings = async () => {
    setLoading(true);
    try {
      const data = await buildingsApi.getBuildings();
      // Use the buildings array from the response
      setBuildings(data.buildings || []);
    } catch (error) {
      console.error('Failed to fetch buildings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  const filteredData = useMemo(() => {
    let result = [...buildings];

    // Search
    if (search) {
      result = result.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));
    }

    // Filter
    if (filterType !== 'All') {
      result = result.filter(b => b.building_type === filterType);
    }

    // Sort
    result.sort((a, b) => {
      if (sortOrder === 'asc') return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });

    return result;
  }, [buildings, search, filterType, sortOrder]);

  const handleSuccess = () => {
    fetchBuildings();
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-[#F8F9FA]">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-[#1A1C1E] tracking-tight">My Properties</h1>
          <p className="text-[#64748B] font-medium">Detailed overview and management of your building portfolio.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-3 bg-[#F26922] hover:bg-[#d95d1d] text-white px-8 py-4 rounded-[20px] font-bold transition-all shadow-xl shadow-[#F26922]/20 active:scale-95 w-fit"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Property</span>
        </button>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-[32px] p-2 shadow-sm overflow-hidden">
        <div className="p-6">
          <Filters onSearch={setSearch} onFilter={setFilterType} onSort={setSortOrder} />
        </div>
        
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-10 h-10 text-[#F26922] animate-spin" />
            <p className="text-sm font-bold text-[#64748B] animate-pulse">Retrieving your property portfolio...</p>
          </div>
        ) : (
          <BuildingsTable data={filteredData} />
        )}
      </div>

      <AddBuildingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleSuccess}
      />
    </div>
  );
}