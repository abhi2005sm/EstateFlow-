"use client";
import { useState, useMemo } from 'react';
import Filters from '../components/Filters';
import BuildingsTable from '../components/BuildingsTable';
import { buildingsData } from '../../../mock/buildingsData';
import { Plus, X } from 'lucide-react';

export default function Buildings() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [sortOrder, setSortOrder] = useState('asc');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    totalUnits: '',
    type: 'Residential'
  });

  const filteredData = useMemo(() => {
    let result = [...buildingsData];

    // Search
    if (search) {
      result = result.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));
    }

    // Filter
    if (filterType !== 'All') {
      result = result.filter(b => b.type === filterType);
    }

    // Sort
    result.sort((a, b) => {
      if (sortOrder === 'asc') return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });

    return result;
  }, [search, filterType, sortOrder]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Building "${formData.name}" added successfully!`);
    setIsModalOpen(false);
    setFormData({ name: '', totalUnits: '', type: 'Residential' });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto relative">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Buildings</h1>
          <p className="text-gray-500 mt-2">Manage your residential and commercial properties.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm w-fit"
        >
          <Plus className="w-5 h-5" />
          <span>Add Building</span>
        </button>
      </div>

      <Filters onSearch={setSearch} onFilter={setFilterType} onSort={setSortOrder} />
      <BuildingsTable data={filteredData} />

      {/* Add Building Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Add New Building</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Building Name</label>
                <input 
                  required 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400" 
                  placeholder="e.g. Sunset Apartments" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Total Number of Units</label>
                <input 
                  required 
                  type="number" 
                  min="1"
                  value={formData.totalUnits} 
                  onChange={e => setFormData({...formData, totalUnits: e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400" 
                  placeholder="e.g. 50" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Property Type</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all cursor-pointer"
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                >
                  Add Building
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}