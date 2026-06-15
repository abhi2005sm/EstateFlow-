import Sidebar from '@/src/features/superadmin/components/layout/Sidebar';

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-[#F7F7F5] dark:bg-[#0a0a0a]">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden md:ml-[220px]">
        {children}
      </main>
    </div>
  );
}
