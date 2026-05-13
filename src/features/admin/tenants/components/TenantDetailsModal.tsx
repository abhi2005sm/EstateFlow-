"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, Home, Users, Utensils, PawPrint, Calendar, DollarSign, ShieldCheck, BadgeCheck } from 'lucide-react';
import { tenantsApi } from '../api/tenantsApi';

interface TenantDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  unitCode: string;
}

export default function TenantDetailsModal({ isOpen, onClose, unitCode }: TenantDetailsModalProps) {
  const [tenant, setTenant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && unitCode) {
      setLoading(true);
      tenantsApi.getTenantByUnitCode(unitCode)
        .then(data => {
          setTenant(data);
        })
        .catch(err => {
          console.error('Failed to fetch tenant details:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, unitCode]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#121110]/40 backdrop-blur-md"
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-[32px] overflow-hidden shadow-2xl"
        >
          {loading ? (
            <div className="h-[500px] flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-gray-500 font-bold text-sm tracking-widest uppercase">Fetching Resident Profile...</p>
            </div>
          ) : tenant ? (
            <>
              {/* Header Banner */}
              <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-700 p-8">
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all active:scale-95"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute -bottom-12 left-8 p-1 bg-white rounded-[24px] shadow-lg">
                  <div className="w-24 h-24 bg-blue-50 rounded-[20px] flex items-center justify-center">
                    <User className="w-10 h-10 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="pt-16 pb-10 px-8">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-black text-[#1A1C1E]">{tenant.name}</h2>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider rounded-md">
                        {tenant.tenant_type}
                      </span>
                      <span className="text-[#64748B] text-sm font-medium">Resident of Unit {unitCode}</span>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-2xl flex items-center space-x-2 ${tenant.rent_status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {tenant.rent_status === 'Paid' ? <BadgeCheck className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                    <span className="text-xs font-black uppercase tracking-widest">{tenant.rent_status}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  {/* Left Column: Contact & Occupancy */}
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-[11px] font-black text-[#64748B] uppercase tracking-[0.2em]">Contact Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 text-[#1A1C1E]">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-semibold">{tenant.email}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-[#1A1C1E]">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-semibold">{tenant.phone_number}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-[11px] font-black text-[#64748B] uppercase tracking-[0.2em]">Occupancy Details</h3>
                      <div className="bg-gray-50 rounded-2xl p-4 grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Type</p>
                          <p className="text-sm font-black text-[#1A1C1E]">{tenant.occupancy_type}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Rent</p>
                          <p className="text-sm font-black text-[#1A1C1E]">₹{Number(tenant.rent_amount).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Household & Preferences */}
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-[11px] font-black text-[#64748B] uppercase tracking-[0.2em]">Household Composition</h3>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { label: 'Adult', val: tenant.adult_count, icon: User },
                          { label: 'Child', val: tenant.children_count, icon: Users },
                          { label: 'Male', val: tenant.male_count, icon: User },
                          { label: 'Female', val: tenant.female_count, icon: User },
                        ].map((item, i) => (
                          <div key={i} className="bg-white border border-gray-100 rounded-xl p-2 text-center">
                            <p className="text-[14px] font-black text-[#1A1C1E]">{item.val}</p>
                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-[11px] font-black text-[#64748B] uppercase tracking-[0.2em]">Preferences & Pets</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 text-[#1A1C1E]">
                          <Utensils className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm font-semibold">{tenant.dietary_preference} Diet</span>
                        </div>
                        <div className="flex items-center space-x-3 text-[#1A1C1E]">
                          <PawPrint className="w-4 h-4 text-amber-500" />
                          <span className="text-sm font-semibold">{tenant.pet_details || 'No Pets'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lease Timeline */}
                <div className="mt-10 p-6 bg-blue-50/50 rounded-[24px] border border-blue-100/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-black text-[#1A1C1E] uppercase tracking-widest">Lease Agreement</span>
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 bg-white px-3 py-1 rounded-full shadow-sm">
                      Next Due: June 1st
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Start Date</p>
                      <p className="text-sm font-bold text-[#1A1C1E]">{tenant.lease_start_date || 'Not set'}</p>
                    </div>
                    <div className="flex-1 border-t border-dashed border-blue-200 mx-6 mt-4" />
                    <div className="space-y-1 text-right">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">End Date</p>
                      <p className="text-sm font-bold text-[#1A1C1E]">{tenant.lease_end_date || 'Renewable'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-20 text-center space-y-4">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <p className="text-gray-500 font-bold">Resident details could not be loaded.</p>
              <button onClick={onClose} className="px-6 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold">Close Window</button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
