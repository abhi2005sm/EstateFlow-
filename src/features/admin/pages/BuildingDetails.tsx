"use client";
import { useState } from 'react';
import Link from 'next/link';
import BuildingDetailsTable from '../components/BuildingDetailsTable';
import { buildingsData } from '../../../mock/buildingsData';
import { tenantsData } from '../../../mock/tenantsData';
import { Plus, X } from 'lucide-react';

export default function BuildingDetails({ buildingId }: { buildingId: string }) {
  const building = buildingsData.find(b => b.id === buildingId);
  const tenants = tenantsData[buildingId] || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    floorNumber: '',
    rentAmount: ''
  });

  if (!building) {
    return (
      <div className="p-6 max-w-7xl mx-auto text-center mt-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Building Not Found</h1>
        <Link href="/admin/buildings" className="text-blue-600 hover:underline">← Back to Buildings</Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Tenant "${formData.name}" added successfully!`);
    setIsModalOpen(false);
    setFormData({ name: '', phone: '', floorNumber: '', rentAmount: '' });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto relative">
      <div className="mb-6">
        <Link href="/admin/buildings" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center w-fit mb-4">
          ← Back to Buildings
        </Link>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{building.name}</h1>
            <div className="flex items-center space-x-3 mt-2">
              <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${building.type === 'Residential' ? 'bg-purple-100 text-purple-700' : 'bg-pink-100 text-pink-700'}`}>
                {building.type}
              </span>
              <span className="text-gray-500 text-sm">{building.totalUnits} Total Units</span>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100">
              <p className="text-xs text-emerald-600 font-bold uppercase">Rent Paid</p>
              <p className="text-xl font-bold text-emerald-700">$${building.rentPaid.toLocaleString()}</p>
            </div>
            <div className="bg-red-50 px-4 py-2 rounded-lg border border-red-100">
              <p className="text-xs text-red-600 font-bold uppercase">Rent Due</p>
              <p className="text-xl font-bold text-red-700">$${building.rentDue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8">
        <h2 className="text-xl font-bold text-gray-900">Tenant List</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-colors shadow-sm w-fit"
        >
          <Plus className="w-5 h-5" />
          <span>Add Tenant</span>
        </button>
      </div>
      
      <BuildingDetailsTable tenants={tenants} />

      {/* Add Tenant Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Add New Tenant</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tenant Name</label>
                <input 
                  required 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400" 
                  placeholder="e.g. John Doe" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                <input 
                  required 
                  type="tel" 
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400" 
                  placeholder="e.g. +1 555-0123" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Floor Number</label>
                <input 
                  required 
                  type="number"
                  min="0"
                  value={formData.floorNumber}
                  onChange={e => setFormData({...formData, floorNumber: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
                  placeholder="e.g. 2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Rent Amount ($)</label>
                <input 
                  required 
                  type="number"
                  min="0"
                  value={formData.rentAmount}
                  onChange={e => setFormData({...formData, rentAmount: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
                  placeholder="e.g. 1200"
                />
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
                  Add Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}