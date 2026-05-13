"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, Home, Users, Utensils, PawPrint, FileText, CheckCircle2, ChevronDown } from 'lucide-react';
import { tenantsApi, RegisterTenantPayload } from '../api/tenantsApi';

interface AddTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  buildingId?: string;
  prefilledUnitId?: string;
}

export default function AddTenantModal({ isOpen, onClose, onSuccess, buildingId, prefilledUnitId }: AddTenantModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<RegisterTenantPayload>({
    email: '',
    name: '',
    phone_number: '',
    unit_code: '',
    tenant_type: 'Family',
    male_count: 0,
    female_count: 0,
    adult_count: 1,
    children_count: 0,
    dietary_preference: 'Veg',
    pet_details: 'None',
    occupancy_type: 'Rent',
  });

  React.useEffect(() => {
    if (prefilledUnitId) {
      setFormData(prev => ({ ...prev, unit_code: prefilledUnitId }));
    }
  }, [prefilledUnitId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await tenantsApi.registerTenant(formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to register tenant:', error);
      alert('Failed to register tenant. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#121110]/40 backdrop-blur-sm z-[100]"
          />

          <motion.div
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.5 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-xl bg-[#F8F9FA] z-[101] shadow-[-20px_0_50px_rgba(0,0,0,0.05)] flex flex-col"
          >
            {/* Header - Fixed */}
            <div className="p-10 pb-6 bg-[#F8F9FA] border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h2 className="text-[32px] font-black text-[#1A1C1E] tracking-tight leading-none">Register Tenant</h2>
                  <p className="text-[#64748B] font-medium text-sm">Onboard a new resident with complete profile details.</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-12 h-12 flex items-center justify-center bg-white border border-[#E2E8F0] rounded-2xl shadow-sm hover:shadow-md hover:bg-gray-50 transition-all active:scale-95"
                >
                  <X className="w-5 h-5 text-[#64748B]" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Section 1: Basic Information */}
                <div className="bg-white border border-[#E2E8F0] rounded-[24px] overflow-hidden shadow-sm">
                  <div className="px-6 py-4 bg-[#F8F9FA] border-b border-[#E2E8F0] flex items-center space-x-3">
                    <User className="w-4 h-4 text-[#3B82F6]" />
                    <span className="text-xs font-black text-[#1A1C1E] uppercase tracking-wider">Identity & Contact</span>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-tight ml-1">Full Legal Name</label>
                      <div className="relative group/input">
                        <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within/input:text-[#3B82F6] transition-colors" />
                        <input
                          name="name"
                          required
                          placeholder="e.g. Johnathan Smith"
                          className="w-full bg-white border border-[#E2E8F0] rounded-xl py-3 pl-11 pr-4 text-sm font-semibold text-[#1A1C1E] outline-none focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/5 transition-all"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-tight ml-1">Email Address</label>
                        <div className="relative group/input">
                          <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within/input:text-[#3B82F6] transition-colors" />
                          <input
                            name="email"
                            type="email"
                            required
                            placeholder="john@example.com"
                            className="w-full bg-white border border-[#E2E8F0] rounded-xl py-3 pl-11 pr-4 text-sm font-semibold text-[#1A1C1E] outline-none focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/5 transition-all"
                            value={formData.email}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-tight ml-1">Phone Number</label>
                        <div className="relative group/input">
                          <Phone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within/input:text-[#3B82F6] transition-colors" />
                          <input
                            name="phone_number"
                            required
                            placeholder="+1 (555) 000-0000"
                            className="w-full bg-white border border-[#E2E8F0] rounded-xl py-3 pl-11 pr-4 text-sm font-semibold text-[#1A1C1E] outline-none focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/5 transition-all"
                            value={formData.phone_number}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Occupancy & Unit */}
                <div className="bg-white border border-[#E2E8F0] rounded-[24px] overflow-hidden shadow-sm">
                  <div className="px-6 py-4 bg-[#F8F9FA] border-b border-[#E2E8F0] flex items-center space-x-3">
                    <Home className="w-4 h-4 text-[#F59E0B]" />
                    <span className="text-xs font-black text-[#1A1C1E] uppercase tracking-wider">Unit Allocation</span>
                  </div>
                  <div className="p-6 grid grid-cols-2 gap-x-6 gap-y-4">
                    <div className="space-y-1.5 col-span-2">
                      <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-tight ml-1">Assigned Unit Code</label>
                      <input
                        name="unit_code"
                        required
                        placeholder="e.g. o-5-b-2-201"
                        className="w-full bg-white border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm font-semibold text-[#1A1C1E] outline-none focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/5 transition-all"
                        value={formData.unit_code}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-tight ml-1">Occupancy Type</label>
                      <div className="relative">
                        <select
                          name="occupancy_type"
                          className="w-full bg-white border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm font-semibold text-[#1A1C1E] outline-none appearance-none focus:border-[#F59E0B] transition-all"
                          value={formData.occupancy_type}
                          onChange={handleChange}
                        >
                          <option value="Rent">Rent</option>
                          <option value="Lease">Lease Agreement</option>
                          <option value="Monthly">Monthly License</option>
                          <option value="Short-term">Short-term Stay</option>
                        </select>
                        <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-tight ml-1">Tenant Profile</label>
                      <div className="relative">
                        <select
                          name="tenant_type"
                          className="w-full bg-white border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm font-semibold text-[#1A1C1E] outline-none appearance-none focus:border-[#F59E0B] transition-all"
                          value={formData.tenant_type}
                          onChange={handleChange}
                        >
                          <option value="Family">Family Unit</option>
                          <option value="Bachelor">Bachelor / Individual</option>
                          <option value="Company">Corporate Lease</option>
                        </select>
                        <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Demographic & Preferences */}
                <div className="grid grid-cols-1 gap-6">
                  {/* Household counts */}
                  <div className="bg-white border border-[#E2E8F0] rounded-[24px] overflow-hidden shadow-sm">
                    <div className="px-6 py-4 bg-[#F8F9FA] border-b border-[#E2E8F0] flex items-center space-x-3">
                      <Users className="w-4 h-4 text-[#8B5CF6]" />
                      <span className="text-xs font-black text-[#1A1C1E] uppercase tracking-wider">Household Composition</span>
                    </div>
                    <div className="p-6 grid grid-cols-4 gap-4">
                      {[
                        { label: 'Adults', name: 'adult_count' },
                        { label: 'Children', name: 'children_count' },
                        { label: 'Male', name: 'male_count' },
                        { label: 'Female', name: 'female_count' },
                      ].map((f) => (
                        <div key={f.name} className="space-y-1.5 text-center">
                          <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">{f.label}</label>
                          <input
                            name={f.name}
                            type="text"
                            inputMode="numeric"
                            className="w-full bg-[#F8F9FA] border border-[#E2E8F0] rounded-xl py-2 px-2 text-sm font-bold text-[#1A1C1E] text-center outline-none focus:bg-white focus:border-[#8B5CF6] transition-all"
                            value={formData[f.name as keyof RegisterTenantPayload]}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^0-9]/g, '');
                              setFormData(prev => ({
                                ...prev,
                                [f.name]: val ? parseInt(val) : 0
                              }));
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Other details */}
                  <div className="bg-white border border-[#E2E8F0] rounded-[24px] overflow-hidden shadow-sm">
                    <div className="px-6 py-4 bg-[#F8F9FA] border-b border-[#E2E8F0] flex items-center space-x-3">
                      <Utensils className="w-4 h-4 text-[#10B981]" />
                      <span className="text-xs font-black text-[#1A1C1E] uppercase tracking-wider">Preferences & Pets</span>
                    </div>
                    <div className="p-6 grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-tight ml-1">Dietary</label>
                        <div className="relative">
                          <select
                            name="dietary_preference"
                            className="w-full bg-white border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm font-semibold text-[#1A1C1E] outline-none appearance-none transition-all"
                            value={formData.dietary_preference}
                            onChange={handleChange}
                          >
                            <option value="Veg">Vegetarian</option>
                            <option value="Non-Veg">Non-Vegetarian</option>
                            <option value="Jain">Jain / Restricted</option>
                          </select>
                          <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-tight ml-1">Pet Details</label>
                        <div className="relative group/input">
                          <PawPrint className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within/input:text-[#10B981] transition-colors" />
                          <input
                            name="pet_details"
                            placeholder="e.g. 1 Small Dog"
                            className="w-full bg-white border border-[#E2E8F0] rounded-xl py-3 pl-11 pr-4 text-sm font-semibold text-[#1A1C1E] outline-none focus:border-[#10B981] transition-all"
                            value={formData.pet_details}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer - Fixed at Bottom */}
            <div className="p-10 bg-white border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={onClose}
                className="px-8 py-4 rounded-2xl text-sm font-bold text-[#64748B] hover:bg-[#F1F5F9] transition-all active:scale-95"
              >
                Cancel Process
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-10 py-4 bg-[#1A1C1E] text-white rounded-2xl text-sm font-bold shadow-xl shadow-[#1A1C1E]/20 hover:bg-[#000000] transition-all disabled:opacity-50 flex items-center space-x-3 active:scale-95"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <CheckCircle2 className="w-5 h-5" />
                )}
                <span>{loading ? 'Processing Registration...' : 'Complete Registration'}</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
