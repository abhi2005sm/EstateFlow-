import TenantSidebar from '@/src/features/tenant/components/TenantSidebar';
import TenantBottomNav from '@/src/features/tenant/components/TenantBottomNav';

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#262626] flex flex-col md:flex-row">
      <div className="hidden md:block">
        <TenantSidebar />
      </div>
      <main className="flex-1 min-w-0 overflow-y-auto pb-20 md:pb-0">
        {children}
      </main>
      <TenantBottomNav />
    </div>
  );
}