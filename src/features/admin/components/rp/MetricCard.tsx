"use client";

import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  delay?: number;
}

export default function MetricCard({ title, value, subtitle, icon: Icon, color, bgColor, delay = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white/30 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col justify-between"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] font-extrabold text-[#61605D] uppercase tracking-widest mb-3">{title}</p>
          <h3 className="text-3xl font-black text-[#121110] tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs font-bold text-[#61605D] mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-2xl ${bgColor}`}>
          <Icon className={`w-5 h-5 ${color}`} strokeWidth={2.5} />
        </div>
      </div>
    </motion.div>
  );
}
