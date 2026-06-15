import TenantSidebar from '@/src/features/tenant/components/TenantSidebar';
import TenantBottomNav from '@/src/features/tenant/components/TenantBottomNav';

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F7F5] dark:bg-[#0a0a0a] flex">
      <TenantSidebar />
      <main className="flex-1 min-w-0 md:ml-[220px] overflow-y-auto pb-[62px] md:pb-0">
        {children}
      </main>
      <TenantBottomNav />
    </div>
  );
}