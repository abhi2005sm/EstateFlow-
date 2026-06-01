"use client";

import { motion } from 'framer-motion';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, Cell } from 'recharts';
import { ArrowUpRight } from 'lucide-react';

const data = [
  { name: 'Mon', v: 400 }, { name: 'Tue', v: 300 }, { name: 'Wed', v: 600 },
  { name: 'Thu', v: 450 }, { name: 'Fri', v: 700 }, { name: 'Sat', v: 550 },
  { name: 'Sun', v: 800 },
];

export default function RevenueOverview({ delay = 0 }) {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className="bg-white/70 dark:bg-[#18181b]/70 backdrop-blur-3xl rounded-[3rem] border border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-10 relative overflow-hidden h-full flex flex-col justify-between"
    >
      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <h3 className="text-[#121110] dark:text-whitexl font-black tracking-tight text-[#121110] dark:text-white">Market Revenue Overview</h3>
            <div className="p-2 bg-rp-orange/5 rounded-full">
               <ArrowUpRight className="w-4 h-4 text-rp-orange rotate-45" />
            </div>
          </div>
          <p className="text-rp-text-muted text-sm font-bold opacity-80">Available rental income this month</p>
          <div className="flex items-center space-x-4 mt-8">
            <span className="text-5xl font-black tracking-tighter text-[#121110] dark:text-white">$5,120.00</span>
            <span className="bg-[#E6FFFA] text-[#047857] px-3 py-1.5 rounded-xl text-xs font-black">+20</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center text-rp-success font-black text-[#121110] dark:text-whitexl tracking-tighter">
            <ArrowUpRight className="w-7 h-7 mr-0.5" />
            <span>2.03%</span>
          </div>
        </div>
      </div>

      <div className="h-60 w-full mt-12">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <Bar dataKey="v" radius={[10, 10, 0, 0]} barSize={32}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#F26922" fillOpacity={index === data.length - 1 ? 1 : 0.85} />
              ))}
            </Bar>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#61605D', fontSize: 12, fontWeight: 800 }}
              dy={20}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(242, 105, 34, 0.05)' }}
              contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 60px rgba(0,0,0,0.1)', padding: '16px' }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-14 space-y-6">
        <div className="h-3 w-full bg-rp-orange/10 rounded-full overflow-hidden flex">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '83%' }}
            transition={{ duration: 1.8, ease: "circOut", delay: 1.2 }}
            className="h-full bg-rp-orange rounded-full" 
          />
        </div>
        <div className="flex items-center space-x-10">
          <div className="flex items-center space-x-3">
            <div className="w-3.5 h-3.5 rounded-md bg-rp-orange" />
            <span className="text-xs font-black text-[#121110] dark:text-white uppercase tracking-widest opacity-80">Occupied Units - 83%</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3.5 h-3.5 rounded-md bg-rp-orange/20" />
            <span className="text-xs font-black text-rp-text-muted uppercase tracking-widest opacity-60">Vacant Units - 17%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
