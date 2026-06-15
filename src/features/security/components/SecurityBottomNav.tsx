"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shield, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SecurityBottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const isDashboardActive = pathname === '/security/dashboard';

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f0f0f] border-t border-white/[0.07] pb-safe z-50">
      <div className="flex justify-around items-center h-[60px] px-4">
        {/* Dashboard Link */}
        <Link
          href="/security/dashboard"
          className="flex flex-col items-center justify-center flex-1 h-full gap-1 relative"
        >
          {isDashboardActive && (
            <span className="absolute top-0 left-1/2 -translate-y-0 w-6 h-[2px] rounded-b-full bg-[#F26922]" />
          )}
          <Shield
            className={`w-5 h-5 transition-colors duration-150 ${
              isDashboardActive ? 'text-[#F26922]' : 'text-white/30'
            }`}
            strokeWidth={isDashboardActive ? 2.5 : 1.8}
          />
          <span
            className={`text-[9px] font-semibold leading-none tracking-wide transition-colors duration-150 ${
              isDashboardActive ? 'text-[#F26922]' : 'text-white/25'
            }`}
          >
            Dashboard
          </span>
        </Link>

        {/* Sign Out Button */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center flex-1 h-full gap-1 relative cursor-pointer"
        >
          <LogOut
            className="w-5 h-5 text-white/30 hover:text-red-500 transition-colors duration-150"
            strokeWidth={1.8}
          />
          <span className="text-[9px] font-semibold leading-none tracking-wide text-white/25 hover:text-red-500 transition-colors duration-150">
            Sign out
          </span>
        </button>
      </div>
    </div>
  );
}
