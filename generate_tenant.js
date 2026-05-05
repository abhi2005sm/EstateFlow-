const fs = require('fs');
const path = require('path');

const files = {
  // MOCK DATA
  'src/mock/tenantDashboardData.ts': `export const tenantDashboardData = {
  overview: {
    totalRent: 1500,
    paidAmount: 1500,
    dueAmount: 0,
    nextDueDate: '2026-06-01'
  },
  feesBreakdown: [
    { id: 'f1', name: 'Maintenance Fees', amount: 100, status: 'Paid' },
    { id: 'f2', name: 'Electricity Fees', amount: 50, status: 'Paid' },
    { id: 'f3', name: 'Water Fees', amount: 30, status: 'Unpaid' }
  ],
  paymentStatus: {
    paidUnits: 2,
    pendingPayments: 1
  },
  paymentHistory: [
    { id: 'h1', serialNumber: 1, feeType: 'Rent', amount: 1500, date: '2026-05-01', status: 'Paid' },
    { id: 'h2', serialNumber: 2, feeType: 'Maintenance', amount: 100, date: '2026-05-01', status: 'Paid' },
    { id: 'h3', serialNumber: 3, feeType: 'Water', amount: 30, date: '2026-05-05', status: 'Pending' }
  ]
};`,

  'src/mock/tenantPaymentsData.ts': `export const tenantPaymentsData = [
  { id: 'p1', serialNumber: 1, feeType: 'Rent (June)', amount: 1500, dueDate: '2026-06-01', status: 'Unpaid' },
  { id: 'p2', serialNumber: 2, feeType: 'Water', amount: 30, dueDate: '2026-05-15', status: 'Unpaid' },
  { id: 'p3', serialNumber: 3, feeType: 'Rent (May)', amount: 1500, dueDate: '2026-05-01', status: 'Paid' },
  { id: 'p4', serialNumber: 4, feeType: 'Maintenance', amount: 100, dueDate: '2026-05-01', status: 'Paid' },
  { id: 'p5', serialNumber: 5, feeType: 'Electricity', amount: 50, dueDate: '2026-05-01', status: 'Paid' },
];`,

  // TYPES
  'src/features/tenant/types.ts': `export interface PaymentRecord {
  id: string;
  serialNumber: number;
  feeType: string;
  amount: number;
  dueDate?: string;
  date?: string;
  status: 'Paid' | 'Unpaid' | 'Pending';
}

export interface FeeBreakdown {
  id: string;
  name: string;
  amount: number;
  status: 'Paid' | 'Unpaid';
}`,

  // COMPONENTS
  'src/features/tenant/components/TenantSidebar.tsx': `"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, CreditCard, LogOut } from 'lucide-react';

export default function TenantSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { name: 'Dashboard', href: '/tenant', icon: Home },
    { name: 'Payments', href: '/tenant/payments', icon: CreditCard },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-100 shrink-0">
        <div className="flex items-center space-x-2 text-blue-600">
          <Home className="w-6 h-6" />
          <span className="text-xl font-bold">Tenant Portal</span>
        </div>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={\`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium \${
                isActive ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }\`}
            >
              <link.icon className={\`w-5 h-5 \${isActive ? 'text-blue-600' : 'text-gray-400'}\`} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

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
}`,

  'src/features/tenant/components/DashboardCards.tsx': `import { tenantDashboardData } from '../../../mock/tenantDashboardData';

export default function DashboardCards() {
  const { overview } = tenantDashboardData;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card title="Total Rent" value={\`$\${overview.totalRent.toLocaleString()}\`} />
      <Card title="Paid Amount" value={\`$\${overview.paidAmount.toLocaleString()}\`} color="text-emerald-600" />
      <Card title="Due Amount" value={\`$\${overview.dueAmount.toLocaleString()}\`} color="text-red-600" />
      <Card title="Next Due Date" value={overview.nextDueDate} color="text-blue-600" />
    </div>
  );
}

const Card = ({ title, value, color = "text-gray-900" }: any) => (
  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{title}</p>
    <h3 className={\`text-3xl font-bold \${color}\`}>{value}</h3>
  </div>
);`,

  'src/features/tenant/components/FeesBreakdown.tsx': `import { tenantDashboardData } from '../../../mock/tenantDashboardData';

export default function FeesBreakdown() {
  const { feesBreakdown, paymentStatus } = tenantDashboardData;
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Payment Summary</h3>
        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-100">
          <div className="text-center">
            <p className="text-sm text-gray-500">Paid Units</p>
            <p className="text-2xl font-bold text-emerald-600">{paymentStatus.paidUnits}</p>
          </div>
          <div className="text-center border-l border-gray-200 pl-4">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-red-600">{paymentStatus.pendingPayments}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex-1">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Current Fees</h3>
        <div className="space-y-3">
          {feesBreakdown.map(fee => (
            <div key={fee.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <p className="font-semibold text-gray-800">{fee.name}</p>
                <p className="text-xs text-gray-500 mt-1">Amount: $\${fee.amount}</p>
              </div>
              <span className={\`px-3 py-1 rounded-full text-xs font-bold \${fee.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}\`}>
                {fee.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`,

  'src/features/tenant/components/PaymentHistory.tsx': `import { tenantDashboardData } from '../../../mock/tenantDashboardData';

export default function PaymentHistory() {
  const { paymentHistory } = tenantDashboardData;
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-800">Recent Payment History</h3>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">S.No</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Fee Type</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Amount</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Date</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paymentHistory.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-500">{p.serialNumber}</td>
                <td className="px-6 py-4 font-bold text-gray-800">{p.feeType}</td>
                <td className="px-6 py-4 font-semibold text-gray-800">$\${p.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-gray-500">{p.date}</td>
                <td className="px-6 py-4">
                  <span className={\`px-2.5 py-1 rounded-md text-xs font-semibold \${p.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}\`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}`,

  'src/features/tenant/components/PaymentsTable.tsx': `"use client";
import { useState } from 'react';

export default function PaymentsTable({ data }: { data: any[] }) {
  const [payments, setPayments] = useState(data);

  const handlePay = (id: string) => {
    alert('Payment initiated for ID: ' + id);
    setPayments(payments.map(p => p.id === id ? { ...p, status: 'Paid' } : p));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">S.No</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Fee Type</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Amount</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Due Date</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Status</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {payments.map((p) => (
              <tr key={p.id} className={\`transition-colors \${p.status === 'Unpaid' ? 'bg-red-50/20 hover:bg-red-50/40' : 'hover:bg-gray-50'}\`}>
                <td className="px-6 py-4 font-medium text-gray-500">{p.serialNumber}</td>
                <td className="px-6 py-4 font-bold text-gray-800">{p.feeType}</td>
                <td className="px-6 py-4 font-semibold text-gray-800">$\${p.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-gray-500">{p.dueDate}</td>
                <td className="px-6 py-4">
                  <span className={\`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center w-fit \${p.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}\`}>
                    <span className={\`w-1.5 h-1.5 rounded-full mr-1.5 \${p.status === 'Paid' ? 'bg-emerald-500' : 'bg-red-500'}\`}></span>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {p.status === 'Unpaid' ? (
                    <button 
                      onClick={() => handlePay(p.id)}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                    >
                      Pay Now
                    </button>
                  ) : (
                    <span className="text-gray-400 text-sm font-medium px-2">Completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}`,

  // PAGES
  'src/features/tenant/pages/Dashboard.tsx': `import DashboardCards from '../components/DashboardCards';
import FeesBreakdown from '../components/FeesBreakdown';
import PaymentHistory from '../components/PaymentHistory';

export default function Dashboard() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tenant Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome! Here is the overview of your rental account.</p>
      </div>
      
      <DashboardCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <FeesBreakdown />
        </div>
        <div className="lg:col-span-2">
          <PaymentHistory />
        </div>
      </div>
    </div>
  );
}`,

  'src/features/tenant/pages/Payments.tsx': `import PaymentsTable from '../components/PaymentsTable';
import { tenantPaymentsData } from '../../../mock/tenantPaymentsData';

export default function Payments() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Payments</h1>
        <p className="text-gray-500 mt-2">Manage your upcoming dues and payment history.</p>
      </div>

      <PaymentsTable data={tenantPaymentsData} />
    </div>
  );
}`,

  // ROUTING
  'app/tenant/layout.tsx': `import TenantSidebar from '@/src/features/tenant/components/TenantSidebar';

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <TenantSidebar />
      <main className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}`,

  'app/tenant/page.tsx': `import Dashboard from '@/src/features/tenant/pages/Dashboard';

export default function TenantPage() {
  return <Dashboard />;
}`,

  'app/tenant/payments/page.tsx': `import Payments from '@/src/features/tenant/pages/Payments';

export default function TenantPaymentsPage() {
  return <Payments />;
}`
};

// Create directories and write files
Object.entries(files).forEach(([filepath, content]) => {
  const fullPath = path.join(__dirname, filepath);
  const dir = path.dirname(fullPath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Created:', filepath);
});
