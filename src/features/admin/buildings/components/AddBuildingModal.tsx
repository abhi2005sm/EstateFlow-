"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Building2, Layers, DollarSign, CheckCircle2 } from 'lucide-react';
import { buildingsApi, CreateBuildingPayload, FloorData, Unit } from '../api/buildingsApi';

interface AddBuildingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddBuildingModal({ isOpen, onClose, onSuccess }: AddBuildingModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    building_type: 'Residential',
    total_floors: 1,
    price_1rk: 0,
    price_1bhk: 0,
    price_2bhk: 0,
    price_3bhk: 0,
  });

  const [floorsData, setFloorsData] = useState<FloorData[]>([
    { floor_number: 1, units: [{ unit_number: '101', unit_type: '1 RK' }] }
  ]);

  const handleAddFloor = () => {
    const nextFloorNumber = floorsData.length + 1;
    setFloorsData([...floorsData, { floor_number: nextFloorNumber, units: [{ unit_number: `${nextFloorNumber}01`, unit_type: '1 RK' }] }]);
    setFormData({ ...formData, total_floors: nextFloorNumber });
  };

  const handleRemoveFloor = (index: number) => {
    const newFloors = floorsData.filter((_, i) => i !== index).map((f, i) => ({ ...f, floor_number: i + 1 }));
    setFloorsData(newFloors);
    setFormData({ ...formData, total_floors: newFloors.length });
  };

  const handleAddUnit = (floorIndex: number) => {
    const newFloors = [...floorsData];
    const floor = newFloors[floorIndex];
    const nextUnitNumber = floor.units.length + 1;
    floor.units.push({ unit_number: `${floor.floor_number}${nextUnitNumber.toString().padStart(2, '0')}`, unit_type: '1 RK' });
    setFloorsData(newFloors);
  };

  const handleRemoveUnit = (floorIndex: number, unitIndex: number) => {
    const newFloors = [...floorsData];
    newFloors[floorIndex].units = newFloors[floorIndex].units.filter((_, i) => i !== unitIndex);
    setFloorsData(newFloors);
  };

  const handleUnitChange = (floorIndex: number, unitIndex: number, field: keyof Unit, value: string) => {
    const newFloors = [...floorsData];
    newFloors[floorIndex].units[unitIndex] = { ...newFloors[floorIndex].units[unitIndex], [field]: value };
    setFloorsData(newFloors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: CreateBuildingPayload = {
        ...formData,
        floors_data: floorsData,
      };
      await buildingsApi.createBuilding(payload);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to create building:', error);
      alert('Failed to create building. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#121110]/40 backdrop-blur-sm z-[100]"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.5 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-[#F8F9FA] z-[101] shadow-[-20px_0_50px_rgba(0,0,0,0.05)] flex flex-col"
          >
            {/* Header - Fixed */}
            <div className="p-10 pb-6 bg-[#F8F9FA] border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h2 className="text-[32px] font-black text-[#1A1C1E] tracking-tight leading-none">Add Property</h2>
                  <p className="text-[#64748B] font-medium text-sm">Configure your building structure, units, and pricing.</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-12 h-12 flex items-center justify-center bg-white border border-[#E2E8F0] rounded-2xl shadow-sm hover:shadow-md hover:bg-gray-50 transition-all active:scale-95"
                >
                  <X className="w-5 h-5 text-[#64748B]" />
                </button>
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section 1: Basic Information */}
                <div className="bg-white border border-[#E2E8F0] rounded-[24px] overflow-hidden shadow-sm">
                  <div className="px-6 py-4 bg-[#F8F9FA] border-b border-[#E2E8F0] flex items-center space-x-3">
                    <Building2 className="w-4 h-4 text-[#F26922]" />
                    <span className="text-xs font-black text-[#1A1C1E] uppercase tracking-wider">Property Details</span>
                  </div>
                  <div className="p-8 space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-tight ml-1">Building Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Skyline Heights"
                        className="w-full bg-white border border-[#E2E8F0] rounded-xl py-3.5 px-5 text-sm font-semibold text-[#1A1C1E] outline-none focus:border-[#F26922] focus:ring-4 focus:ring-[#F26922]/5 transition-all"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-tight ml-1">Building Category</label>
                        <select
                          className="w-full bg-white border border-[#E2E8F0] rounded-xl py-3.5 px-5 text-sm font-semibold text-[#1A1C1E] outline-none appearance-none transition-all"
                          value={formData.building_type}
                          onChange={(e) => setFormData({ ...formData, building_type: e.target.value })}
                        >
                          <option value="Residential">Residential Property</option>
                          <option value="Commercial">Commercial Space</option>
                          <option value="Mixed-use">Mixed-use Building</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-tight ml-1">Total Floor Count</label>
                        <div className="relative">
                          <Layers className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="number"
                            readOnly
                            className="w-full bg-gray-50 border border-[#E2E8F0] rounded-xl py-3.5 pl-11 pr-5 text-sm font-bold text-[#1A1C1E] outline-none cursor-not-allowed"
                            value={formData.total_floors}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Unit Pricing */}
                <div className="bg-white border border-[#E2E8F0] rounded-[24px] overflow-hidden shadow-sm">
                  <div className="px-6 py-4 bg-[#F8F9FA] border-b border-[#E2E8F0] flex items-center space-x-3">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-black text-[#1A1C1E] uppercase tracking-wider">Base Unit Pricing</span>
                  </div>
                  <div className="p-8 grid grid-cols-2 gap-6">
                    {[
                      { label: '1 RK Price', key: 'price_1rk' },
                      { label: '1 BHK Price', key: 'price_1bhk' },
                      { label: '2 BHK Price', key: 'price_2bhk' },
                      { label: '3 BHK Price', key: 'price_3bhk' },
                    ].map((p) => (
                      <div key={p.key} className="space-y-1.5">
                        <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-tight ml-1">{p.label}</label>
                        <div className="relative group">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#94A3B8]">INR</span>
                          <input
                            type="text"
                            required
                            placeholder="0.00"
                            className="w-full bg-white border border-[#E2E8F0] rounded-xl py-3.5 pl-12 pr-5 text-sm font-bold text-[#1A1C1E] outline-none focus:border-green-500 transition-all"
                            value={formData[p.key as keyof typeof formData] || ''}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^0-9.]/g, '');
                              setFormData({ ...formData, [p.key]: val ? parseFloat(val) : 0 });
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 3: Structural Configuration */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center space-x-3">
                      <Layers className="w-5 h-5 text-blue-500" />
                      <h3 className="font-bold text-lg text-[#1A1C1E]">Structural Mapping</h3>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddFloor}
                      className="flex items-center space-x-2 bg-blue-600 text-white rounded-xl px-4 py-2 text-xs font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-200 active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Floor</span>
                    </button>
                  </div>

                  <div className="space-y-6">
                    {floorsData.map((floor, floorIdx) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={floorIdx}
                        className="bg-white border border-[#E2E8F0] rounded-[24px] overflow-hidden shadow-sm"
                      >
                        <div className="px-6 py-4 bg-gray-50/50 border-b border-[#E2E8F0] flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-xs font-black text-blue-600">
                              {floor.floor_number}
                            </div>
                            <span className="text-sm font-bold text-[#1A1C1E]">Floor Level {floor.floor_number}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFloor(floorIdx)}
                            className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="p-6 space-y-4">
                          {floor.units.map((unit, unitIdx) => (
                            <div key={unitIdx} className="grid grid-cols-12 gap-3 items-center">
                              <div className="col-span-4">
                                <div className="relative group">
                                  <input
                                    type="text"
                                    placeholder="Unit #"
                                    className="w-full bg-[#F8F9FA] border border-[#E2E8F0] rounded-xl py-2.5 px-4 text-xs font-bold text-[#1A1C1E] outline-none focus:bg-white transition-all"
                                    value={unit.unit_number}
                                    onChange={(e) => handleUnitChange(floorIdx, unitIdx, 'unit_number', e.target.value)}
                                  />
                                </div>
                              </div>
                              <div className="col-span-6">
                                <select
                                  className="w-full bg-[#F8F9FA] border border-[#E2E8F0] rounded-xl py-2.5 px-4 text-xs font-bold text-[#1A1C1E] outline-none focus:bg-white transition-all appearance-none"
                                  value={unit.unit_type}
                                  onChange={(e) => handleUnitChange(floorIdx, unitIdx, 'unit_type', e.target.value)}
                                >
                                  <option value="1 RK">Studio / 1 RK</option>
                                  <option value="1 BHK">Premium 1 BHK</option>
                                  <option value="2 BHK">Family 2 BHK</option>
                                  <option value="3 BHK">Executive 3 BHK</option>
                                </select>
                              </div>
                              <div className="col-span-2 flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveUnit(floorIdx, unitIdx)}
                                  className="p-2 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => handleAddUnit(floorIdx)}
                            className="w-full py-3 border-2 border-dashed border-[#E2E8F0] rounded-xl text-[10px] font-black text-[#94A3B8] hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/50 transition-all uppercase tracking-widest"
                          >
                            + Add Unit to Level {floor.floor_number}
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </form>
            </div>

            {/* Footer - Fixed */}
            <div className="p-10 bg-white border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={onClose}
                className="px-8 py-4 rounded-2xl text-sm font-bold text-[#64748B] hover:bg-[#F1F5F9] transition-all active:scale-95"
              >
                Cancel Configuration
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-10 py-4 bg-[#F26922] text-white rounded-2xl text-sm font-bold shadow-xl shadow-[#F26922]/20 hover:bg-[#d95d1d] transition-all disabled:opacity-50 flex items-center space-x-3 active:scale-95"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <CheckCircle2 className="w-5 h-5" />
                )}
                <span>{loading ? 'Finalizing Setup...' : 'Construct Property'}</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
