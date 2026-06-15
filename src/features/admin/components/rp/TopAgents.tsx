"use client";

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const agents = [
  { name: 'Aurthur Morgan', sold: 90, rented: 60, price: '$2.5M', seed: 'Aurthur' },
  { name: 'Michele Morgan', sold: 90, rented: 60, price: '$2.5M', seed: 'Michele' },
  { name: 'Michael Bennett', sold: 110, rented: 40, price: '$2.3M', seed: 'Michael' },
  { name: 'Daniel Rivera', sold: 85, rented: 35, price: '$2.1M', seed: 'Daniel' },
  { name: 'Daniel Rivera', sold: 85, rented: 35, price: '$2.1M', seed: 'Rivera' },
];

export default function TopAgents({ delay = 0 }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay }}
      className="bg-white/70 dark:bg-[#18181b]/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/20 shadow-rp"
    >
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg font-black tracking-tight">Top Agents</h3>
        <button className="flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-rp-border text-[10px] font-black uppercase tracking-wider text-rp-text-muted hover:bg-rp-border/10 transition-colors">
          <span>This Month</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-6">
        {agents.map((agent, i) => (
          <div key={i} className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-rp-border">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${agent.seed}`} alt={agent.name} />
              </div>
              <div>
                <p className="text-sm font-bold group-hover:text-rp-orange transition-colors">{agent.name}</p>
                <p className="text-[10px] text-rp-text-muted font-bold mt-1 uppercase tracking-tighter">
                  {agent.sold} sold · {agent.rented} rented
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-rp-orange">{agent.price}</p>
              <p className="text-[8px] font-bold text-rp-text-muted uppercase tracking-widest mt-1">annually</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
