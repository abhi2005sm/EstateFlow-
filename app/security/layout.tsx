import SecuritySidebar from '@/src/features/security/components/SecuritySidebar';

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F5F3F0] dark:bg-[#262626] flex">
      <SecuritySidebar />
      <main className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
