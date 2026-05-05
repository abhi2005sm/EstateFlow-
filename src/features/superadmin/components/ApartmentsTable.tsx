"use client";
import { useState } from 'react';
import { apartmentsData } from '../../../mock/apartmentsData';
import { X, MapPin } from 'lucide-react';

export default function ApartmentsTable() {
  const [selectedOwner, setSelectedOwner] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden text-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600">S.No</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Owner Name</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Buildings</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Property Type</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {apartmentsData.map((apt) => (
                <tr 
                  key={apt.id} 
                  onClick={() => setSelectedOwner(apt)}
                  className="hover:bg-blue-50/50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">{apt.serialNumber}</td>
                  <td className="px-6 py-4 text-gray-600">{apt.ownerName}</td>
                  <td className="px-6 py-4 text-gray-600">{apt.buildings}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      apt.propertyType === 'Residential' ? 'bg-indigo-100 text-indigo-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {apt.propertyType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex w-fit items-center ${
                      apt.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        apt.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'
                      }`}></span>
                      {apt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Owner Detail Slide-over Panel */}
      {selectedOwner && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" 
            onClick={() => setSelectedOwner(null)}
          />
          
          {/* Slide-over Content */}
          <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
            <div className="p-8 overflow-y-auto h-full">
              {/* Close Button */}
              <div className="flex justify-end mb-4">
                <button 
                  onClick={() => setSelectedOwner(null)}
                  className="text-gray-400 hover:text-gray-600 p-1.5 rounded-md transition-colors hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Header Info */}
              <div className="mb-8">
                <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold tracking-wider rounded uppercase mb-4">
                  OWN-{selectedOwner.id.toString().padStart(3, '0')}
                </span>
                <h2 className="text-2xl font-bold text-gray-900">{selectedOwner.ownerName}</h2>
                <p className="text-gray-500 text-sm mt-1">Los Angeles, California</p>
              </div>

              {/* Tabs */}
              <div className="flex space-x-8 border-b border-gray-200 mb-8">
                {['Overview', 'Contact', 'Settings'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content: Overview */}
              {activeTab === 'Overview' && (
                <div className="space-y-8">
                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-5">
                      <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-2">Total Buildings</p>
                      <p className="text-3xl font-bold text-gray-900">{selectedOwner.buildings}</p>
                    </div>
                    
                    <div className="bg-emerald-50/30 border border-emerald-50 rounded-2xl p-5">
                      <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Status</p>
                      <div className="flex items-center mt-2">
                        <span className={`w-2 h-2 rounded-full mr-2 ${selectedOwner.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                        <p className="text-lg font-bold text-gray-900">{selectedOwner.status}</p>
                      </div>
                    </div>
                  </div>

                  {/* Location Details Block */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Location Details</h3>
                    <div className="border border-gray-100 rounded-2xl p-5 flex items-start space-x-4 bg-white shadow-sm">
                      <div className="bg-gray-50 p-2.5 rounded-xl text-gray-400 shrink-0 mt-0.5">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div className="text-sm text-gray-600 leading-relaxed">
                        <p>123 Property Management Blvd,</p>
                        <p>Los Angeles, California - 90001</p>
                        <p className="text-gray-400 mt-1">United States</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Content: Contact */}
              {activeTab === 'Contact' && (
                <div className="space-y-4 text-sm text-gray-600">
                  <div className="border border-gray-100 rounded-xl p-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</p>
                    <p className="font-medium text-gray-900">{selectedOwner.ownerName.toLowerCase().replace(' ', '.')}@example.com</p>
                  </div>
                  <div className="border border-gray-100 rounded-xl p-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone Number</p>
                    <p className="font-medium text-gray-900">+1 (555) 123-4567</p>
                  </div>
                </div>
              )}

              {/* Tab Content: Settings */}
              {activeTab === 'Settings' && (
                <div className="space-y-6">
                  <div className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 mb-1">Owner Account Status</h3>
                      <p className="text-xs text-gray-500">Toggle to activate or deactivate this owner's account.</p>
                    </div>
                    <button 
                      onClick={() => {
                        const newStatus = selectedOwner.status === 'Active' ? 'Inactive' : 'Active';
                        // Update local state for immediate feedback
                        setSelectedOwner({ ...selectedOwner, status: newStatus });
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        selectedOwner.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        selectedOwner.status === 'Active' ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
