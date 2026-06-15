"use client";

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ChevronDown } from 'lucide-react';

const data = [
  { name: 'House', value: 1514, color: '#F26922', opacity: 1 },
  { name: 'Townhouse', value: 454, color: '#F26922', opacity: 0.6 },
  { name: 'Apartment', value: 757, color: '#F26922', opacity: 0.8 },
  { name: 'Office', value: 303, color: '#F26922', opacity: 0.4 },
];

export default function PropertyTypes({ delay = 0 }) {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className="bg-white/70 dark:bg-[#18181b]/70 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.05)] h-full flex flex-col justify-between"
    >
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-[#121110] dark:text-whitexl font-black tracking-tight text-[#121110] dark:text-white">Properties Types</h3>
        <button className="flex items-center space-x-2 px-4 py-2 rounded-2xl border border-rp-border text-xs font-black uppercase tracking-wider text-rp-text-muted hover:bg-rp-border/10 transition-all">
          <span>All Properties</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center flex-1">
        <div className="w-[55%] h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={70}
                outerRadius={95}
                paddingAngle={8}
                dataKey="value"
                animationDuration={2000}
                animationBegin={delay * 1000}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={entry.opacity} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-4xl font-black text-[#121110] dark:text-white">3,786</span>
            <span className="text-[10px] font-extrabold text-rp-text-muted uppercase tracking-[0.2em] mt-2">Total Property</span>
          </div>
        </div>

        <div className="w-[45%] grid grid-cols-2 gap-y-10 gap-x-6 pl-10">
          {data.map((item, i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-lg shadow-sm" style={{ backgroundColor: item.color, opacity: item.opacity }} />
                <span className="text-[11px] font-black text-rp-text-muted uppercase tracking-widest opacity-80">{item.name}</span>
              </div>
              <p className="text-xl font-black text-[#121110] dark:text-white tracking-tight">{item.value.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
