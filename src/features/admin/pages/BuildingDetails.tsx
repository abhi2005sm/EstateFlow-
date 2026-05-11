"use client";
import { useState, useMemo } from 'react';
import Link from 'next/link';
import BuildingDetailsTable from '../components/BuildingDetailsTable';
import TenantListTable from '../components/TenantListTable';
import { buildingsData } from '../../../mock/buildingsData';
import { tenantsData } from '../../../mock/tenantsData';
import { Plus, X, Mail, Search, Filter, ChevronLeft, Download, MoreVertical, Bell, Settings, ChevronDown, User, MapPin, Share2, MessageSquare, Edit3, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BuildingDetails({ buildingId }: { buildingId: string }) {
  const building = buildingsData.find(b => b.id === buildingId);
  const tenants = tenantsData[buildingId] || [];

  const [activeTab, setActiveTab] = useState('Units');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  
  const filteredTenants = useMemo(() => {
    return tenants.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           t.floorNumber.toString().includes(searchQuery);
      
      const matchesFilter = activeFilter === 'All' || 
                           (activeFilter === 'Occupied' && t.rentStatus === 'Paid') ||
                           (activeFilter === 'Vacant' && t.rentStatus === 'Unpaid');
      
      return matchesSearch && matchesFilter;
    });
  }, [tenants, searchQuery, activeFilter]);

  if (!building) return null;

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
          <button className="relative p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-all">
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
                <h1 className="text-2xl font-bold text-gray-900">Peaceful Retreat Space</h1>
                <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">On rent</span>
              </div>
              <div className="flex items-center text-sm text-gray-400 space-x-4 mb-2">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  1234 Baker Street, San Francisco
                </div>
              </div>
              <p className="text-xs text-gray-400 font-medium">Last Update: 24 May, 2020</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-all">
              <Edit3 className="w-4 h-4" />
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all">
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95">
              <Plus className="w-4 h-4" />
              <span>Add new property</span>
            </button>
          </div>
        </section>

        {/* Tabs Section */}
        <nav className="flex items-center space-x-8 border-b border-gray-100 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {['Overview', 'Units', 'Payment details', 'Weekly reports', 'Tickets', 'Tenant'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-bold transition-all relative ${
                activeTab === tab ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-900"
                />
              )}
            </button>
          ))}
        </nav>

        {/* Units Content Header */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Total 20 Units</h2>
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
                  placeholder="Search ID, location" 
                  className="w-full bg-white border border-gray-100 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/10 outline-none shadow-sm font-medium"
                />
              </div>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-50 transition-all active:scale-95">
              <Plus className="w-4 h-4" />
              <span>Add new unit</span>
            </button>
          </div>
        </div>

        {/* Dynamic Table Content based on Tab */}
        {activeTab === 'Tenant' ? (
          <TenantListTable tenants={filteredTenants} />
        ) : (
          <BuildingDetailsTable tenants={filteredTenants} />
        )}
      </main>
    </div>
  );
}

function CheckCircle(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}

function Users(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
}

function LayoutGrid(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
}