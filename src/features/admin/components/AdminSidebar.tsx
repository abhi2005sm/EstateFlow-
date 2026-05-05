"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Building2, LogOut } from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Buildings', href: '/admin/buildings', icon: Building2 },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* Sidebar Header */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100 shrink-0">
        <div className="flex items-center space-x-2 text-blue-600">
          <Building2 className="w-6 h-6" />
          <span className="text-xl font-bold">EstateFlow <span className="text-gray-400 font-medium">Owners</span></span>
        </div>
      </div>

      {/* Sidebar Links */}
      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium ${
                isActive
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <link.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-100 shrink-0">
        <button
          onClick={() => router.push('/login')}
          className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
