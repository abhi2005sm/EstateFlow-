"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, Users, Receipt, Wrench, Settings } from 'lucide-react';

const navItems = [
  { name: 'Home',      href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Buildings', href: '/admin/buildings',  icon: Building2 },
  { name: 'Tenants',   href: '/admin/tenants',    icon: Users },
  { name: 'Payments',  href: '/admin/payments',   icon: Receipt },
  { name: 'Requests',  href: '/admin/requests',   icon: Wrench },
  { name: 'Settings',  href: '/admin/settings',   icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0f0f0f] border-t border-white/[0.07]">
      <div className="flex justify-around items-center h-[60px] px-1">
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 h-full gap-1 relative"
            >
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-b-full bg-[#F26922]" />
              )}

              <item.icon
                className={`w-5 h-5 transition-colors duration-150 ${
                  active ? 'text-[#F26922]' : 'text-white/30'
                }`}
                strokeWidth={active ? 2.5 : 1.8}
              />

              <span
                className={`text-[9px] font-semibold leading-none tracking-wide transition-colors duration-150 ${
                  active ? 'text-[#F26922]' : 'text-white/25'
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
