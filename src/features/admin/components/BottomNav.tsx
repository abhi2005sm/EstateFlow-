"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Building2, Users, ReceiptText, Wrench, User } from 'lucide-react';

const navItems = [
  { name: 'Home',      href: '/admin/dashboard', icon: Home },
  { name: 'Buildings', href: '/admin/buildings',  icon: Building2 },
  { name: 'Tenants',   href: '/admin/tenants',    icon: Users },
  { name: 'Payments',  href: '/admin/payments',   icon: ReceiptText },
  { name: 'Requests',  href: '/admin/requests',   icon: Wrench },
  { name: 'Profile',   href: '/admin/settings',   icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    /* MyGate-style: plain flat white bar anchored to bottom */
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#18181b] border-t border-gray-100 dark:border-gray-800 safe-area-bottom">
      <div className="flex justify-around items-center h-[62px] px-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 h-full gap-[3px] relative"
            >
              {/* Active indicator dot at the very top — MyGate style */}
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-b-full bg-[#F26922]" />
              )}

              <item.icon
                className={`w-[22px] h-[22px] transition-colors duration-200 ${
                  isActive
                    ? 'text-[#F26922]'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
                strokeWidth={isActive ? 2.5 : 1.8}
                fill={isActive ? 'rgba(242,105,34,0.12)' : 'none'}
              />
              <span
                className={`text-[10px] font-semibold leading-none transition-colors duration-200 ${
                  isActive
                    ? 'text-[#F26922]'
                    : 'text-gray-400 dark:text-gray-500'
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
