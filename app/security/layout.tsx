import SecuritySidebar from '@/src/features/security/components/SecuritySidebar';
import SecurityBottomNav from '@/src/features/security/components/SecurityBottomNav';

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F7F5] dark:bg-[#0a0a0a] flex">
      <SecuritySidebar />
      <main className="flex-1 min-w-0 md:ml-[220px] overflow-y-auto pb-[62px] md:pb-0">
        {children}
      </main>
      <SecurityBottomNav />
    </div>
  );
}
