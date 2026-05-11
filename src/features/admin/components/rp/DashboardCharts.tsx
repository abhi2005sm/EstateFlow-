"use client";

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const occupancyData = [
  { name: 'Occupied', value: 83, color: '#F26922' },
  { name: 'Vacant', value: 17, color: '#E8E6E0' },
];

const rentData = [
  { name: 'Paid', value: 76, color: '#22C55E' },
  { name: 'Unpaid', value: 24, color: '#EF4444' },
];

const monthlyData = [
  { month: 'Jan', paid: 65000, unpaid: 12000 },
  { month: 'Feb', paid: 72000, unpaid: 9000 },
  { month: 'Mar', paid: 68000, unpaid: 14000 },
  { month: 'Apr', paid: 80000, unpaid: 8000 },
  { month: 'May', paid: 75000, unpaid: 11000 },
  { month: 'Jun', paid: 85000, unpaid: 7000 },
];

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={800}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function DashboardCharts({ delay = 0 }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Occupied vs Vacant */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay }}
        className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/30 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-8"
      >
        <div className="mb-6">
          <h3 className="text-lg font-black text-[#121110] tracking-tight">Occupied vs Vacant</h3>
          <p className="text-xs font-bold text-[#61605D] uppercase tracking-widest mt-1">Unit Occupancy Overview</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="w-1/2 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={occupancyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomLabel}
                  animationDuration={1800}
                >
                  {occupancyData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-1/2 pl-6 space-y-5">
            {occupancyData.map((d, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                    <span className="text-xs font-black text-[#121110] uppercase tracking-wider">{d.name}</span>
                  </div>
                  <span className="text-sm font-black" style={{ color: d.color }}>{d.value}%</span>
                </div>
                <div className="h-2 bg-[#F5F3F1] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${d.value}%` }}
                    transition={{ duration: 1.5, delay: delay + 0.5, ease: "circOut" }}
                    className="h-full rounded-full"
                    style={{ background: d.color }}
                  />
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-[#F5F3F1] space-y-2">
              <div className="flex justify-between">
                <span className="text-xs font-bold text-[#61605D]">Occupied Units</span>
                <span className="text-xs font-black text-[#121110]">498</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs font-bold text-[#61605D]">Vacant Units</span>
                <span className="text-xs font-black text-[#121110]">102</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Paid vs Unpaid Rent */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: delay + 0.15 }}
        className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/30 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-8"
      >
        <div className="mb-6">
          <h3 className="text-lg font-black text-[#121110] tracking-tight">Paid vs Unpaid Rent</h3>
          <p className="text-xs font-bold text-[#61605D] uppercase tracking-widest mt-1">Monthly Collection Breakdown</p>
        </div>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F3F1" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#61605D', fontSize: 11, fontWeight: 700 }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#61605D', fontSize: 10, fontWeight: 700 }} tickFormatter={(v) => `$${v/1000}k`} />
              <Tooltip
                formatter={(v: any, name: any) => [`$${Number(v).toLocaleString()}`, name === 'Paid' || name === 'paid' ? 'Paid' : 'Unpaid']}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', padding: '12px' }}
              />
              <Bar dataKey="paid" fill="#22C55E" radius={[6, 6, 0, 0]} barSize={20} name="Paid" />
              <Bar dataKey="unpaid" fill="#EF4444" radius={[6, 6, 0, 0]} barSize={20} name="Unpaid" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-[10px] font-black text-[#61605D] uppercase tracking-widest">Paid Rent</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-[10px] font-black text-[#61605D] uppercase tracking-widest">Unpaid Rent</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
