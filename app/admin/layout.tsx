import AdminSidebar from '@/src/features/admin/components/AdminSidebar';
import BottomNav    from '@/src/features/admin/components/BottomNav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F7F5] dark:bg-[#0a0a0a] flex">
      <AdminSidebar />

      {/* Main — offset by sidebar width on desktop */}
      <main className="flex-1 min-w-0 md:ml-[220px] overflow-y-auto pb-[62px] md:pb-0">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}