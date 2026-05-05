"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Building, Settings, LogOut } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { name: 'Dashboard', href: '/super-admin/dashboard', icon: LayoutDashboard },
    { name: 'Apartments', href: '/super-admin/apartments', icon: Building },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 shadow-sm z-10">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Estate<span className="text-blue-600">Flow</span> <span className="text-sm font-medium text-gray-400 align-top ml-1">HQ</span></h2>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-6 overflow-y-auto">
        <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Main Menu</p>
        {navLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/super-admin' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 font-semibold' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'
              }`}
            >
              <link.icon className={`w-5 h-5 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 space-y-2">
        <button className="flex items-center space-x-3 px-4 py-3 w-full text-left text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors font-medium">
          <Settings className="w-5 h-5 text-gray-400" />
          <span>Settings</span>
        </button>
        <button 
          onClick={() => {
            // Add any actual logout logic here later (clear tokens, etc.)
            router.push('/login');
          }}
          className="flex items-center space-x-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
