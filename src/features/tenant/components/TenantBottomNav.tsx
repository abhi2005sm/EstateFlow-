"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, CreditCard, Users, Wrench, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Home', href: '/tenant', icon: Home },
  { name: 'Payments', href: '/tenant/payments', icon: CreditCard },
  { name: 'Community', href: '/tenant/community', icon: Users },
  { name: 'Requests', href: '/tenant/requests', icon: Wrench },
  { name: 'Profile', href: '/tenant/settings', icon: Settings },
];

export default function TenantBottomNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#18181b] border-t border-gray-100 dark:border-gray-800 pb-safe z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/tenant' && pathname.startsWith(item.href));
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className="flex flex-col items-center justify-center w-full h-full relative group"
            >
              <div className="relative p-1">
                <item.icon 
                  className={`w-6 h-6 transition-colors duration-200 ${isActive ? 'text-[#F26922] dark:text-[#F26922]' : 'text-gray-400 dark:text-gray-500'}`} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {isActive && (
                  <motion.div 
                    layoutId="tenant-bottom-nav-indicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#F26922] rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                )}
              </div>
              <span className={`text-[10px] mt-0.5 font-bold transition-colors duration-200 ${isActive ? 'text-[#F26922] dark:text-[#F26922]' : 'text-gray-500 dark:text-gray-400'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
