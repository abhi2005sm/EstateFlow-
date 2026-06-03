import AdminSidebar from '@/src/features/admin/components/AdminSidebar';
import BottomNav from '@/src/features/admin/components/BottomNav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F5F3F0] dark:bg-gray-900 flex flex-col md:flex-row">
      {/* Sidebar (Desktop & Mobile Hamburger) */}
      <AdminSidebar />
      
      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto pb-[62px] md:pb-0">
        {children}
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <BottomNav />
    </div>
  );
}