const fs = require('fs');
const path = require('path');

const files = {
  // MOCK DATA
  'src/mock/adminDashboardData.ts': `export const adminDashboardData = {
  overview: {
    totalBuildings: 12,
    residentialBuildings: 8,
    commercialBuildings: 4,
    totalUnits: 150,
    occupiedUnits: 135,
    vacantUnits: 15,
  },
  rentSummary: {
    totalRentCollected: 125000,
    totalRentDue: 15000,
    paidUnits: 120,
    unpaidUnits: 15,
  },
  charts: {
    occupancy: [
      { name: 'Occupied', value: 135, fill: '#10b981' },
      { name: 'Vacant', value: 15, fill: '#ef4444' }
    ],
    rentStatus: [
      { name: 'Paid', value: 120, fill: '#3b82f6' },
      { name: 'Unpaid', value: 15, fill: '#f59e0b' }
    ],
    buildingTypes: [
      { name: 'Residential', value: 8, fill: '#8b5cf6' },
      { name: 'Commercial', value: 4, fill: '#ec4899' }
    ]
  },
  defaulters: [
    { id: '1', name: 'John Smith', phone: '+1 555-0101', buildingName: 'Sunset Apartments', dueAmount: 1200 },
    { id: '2', name: 'Sarah Connor', phone: '+1 555-0102', buildingName: 'Ocean View', dueAmount: 1500 },
    { id: '3', name: 'Michael Bay', phone: '+1 555-0103', buildingName: 'Downtown Lofts', dueAmount: 2100 },
  ]
};`,

  'src/mock/buildingsData.ts': `export const buildingsData = [
  { id: 'b1', serialNumber: 1, name: 'Sunset Apartments', type: 'Residential', totalUnits: 40, rentPaid: 45000, rentDue: 5000 },
  { id: 'b2', serialNumber: 2, name: 'Ocean View', type: 'Residential', totalUnits: 60, rentPaid: 55000, rentDue: 2500 },
  { id: 'b3', serialNumber: 3, name: 'Downtown Plaza', type: 'Commercial', totalUnits: 10, rentPaid: 15000, rentDue: 0 },
  { id: 'b4', serialNumber: 4, name: 'Tech Hub Park', type: 'Commercial', totalUnits: 15, rentPaid: 25000, rentDue: 5000 },
];`,

  'src/mock/tenantsData.ts': `export const tenantsData: Record<string, any[]> = {
  'b1': [
    { id: 't1', serialNumber: 1, name: 'Alice Walker', floorNumber: 1, phone: '+1 555-1001', rentStatus: 'Paid', dueAmount: 0 },
    { id: 't2', serialNumber: 2, name: 'John Smith', floorNumber: 2, phone: '+1 555-0101', rentStatus: 'Unpaid', dueAmount: 1200 },
  ],
  'b2': [
    { id: 't3', serialNumber: 1, name: 'Sarah Connor', floorNumber: 1, phone: '+1 555-0102', rentStatus: 'Unpaid', dueAmount: 1500 },
    { id: 't4', serialNumber: 2, name: 'Bruce Wayne', floorNumber: 5, phone: '+1 555-1002', rentStatus: 'Paid', dueAmount: 0 },
  ],
  'b3': [
    { id: 't5', serialNumber: 1, name: 'Acme Corp', floorNumber: 1, phone: '+1 555-2001', rentStatus: 'Paid', dueAmount: 0 },
  ],
  'b4': [
    { id: 't6', serialNumber: 1, name: 'Global Tech', floorNumber: 2, phone: '+1 555-3001', rentStatus: 'Unpaid', dueAmount: 5000 },
  ]
};`,

  // TYPES
  'src/features/admin/types.ts': `export interface Building {
  id: string;
  serialNumber: number;
  name: string;
  type: string;
  totalUnits: number;
  rentPaid: number;
  rentDue: number;
}

export interface Tenant {
  id: string;
  serialNumber: number;
  name: string;
  floorNumber: number;
  phone: string;
  rentStatus: string;
  dueAmount: number;
}`,

  // COMPONENTS - DASHBOARD
  'src/features/admin/components/DashboardCards.tsx': `import { adminDashboardData } from '../../../mock/adminDashboardData';

export default function DashboardCards() {
  const { overview, rentSummary } = adminDashboardData;
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Property Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card title="Total Buildings" value={overview.totalBuildings} />
          <Card title="Residential" value={overview.residentialBuildings} />
          <Card title="Commercial" value={overview.commercialBuildings} />
          <Card title="Total Units" value={overview.totalUnits} />
          <Card title="Occupied Units" value={overview.occupiedUnits} color="text-emerald-600" />
          <Card title="Vacant Units" value={overview.vacantUnits} color="text-red-600" />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Rent Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card title="Total Collected" value={\`$\${rentSummary.totalRentCollected.toLocaleString()}\`} color="text-emerald-600" />
          <Card title="Total Due" value={\`$\${rentSummary.totalRentDue.toLocaleString()}\`} color="text-red-600" />
          <Card title="Paid Units" value={rentSummary.paidUnits} color="text-emerald-600" />
          <Card title="Unpaid Units" value={rentSummary.unpaidUnits} color="text-red-600" />
        </div>
      </div>
    </div>
  );
}

const Card = ({ title, value, color = "text-gray-900" }: any) => (
  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{title}</p>
    <h3 className={\`text-3xl font-bold \${color}\`}>{value}</h3>
  </div>
);`,

  'src/features/admin/components/RentCharts.tsx': `"use client";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { adminDashboardData } from '../../../mock/adminDashboardData';

export default function RentCharts() {
  const { charts } = adminDashboardData;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <ChartCard title="Occupied vs Vacant">
        <PieChart>
          <Pie data={charts.occupancy} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
            {charts.occupancy.map((entry, index) => <Cell key={\`cell-\${index}\`} fill={entry.fill} />)}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
          <Legend verticalAlign="bottom" />
        </PieChart>
      </ChartCard>
      
      <ChartCard title="Paid vs Unpaid Rent">
        <PieChart>
          <Pie data={charts.rentStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
            {charts.rentStatus.map((entry, index) => <Cell key={\`cell-\${index}\`} fill={entry.fill} />)}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
          <Legend verticalAlign="bottom" />
        </PieChart>
      </ChartCard>

      <ChartCard title="Residential vs Commercial">
        <BarChart data={charts.buildingTypes} margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={50}>
            {charts.buildingTypes.map((entry, index) => <Cell key={\`cell-\${index}\`} fill={entry.fill} />)}
          </Bar>
        </BarChart>
      </ChartCard>
    </div>
  );
}

const ChartCard = ({ title, children }: any) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
    <h3 className="text-lg font-bold text-gray-800 mb-6">{title}</h3>
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  </div>
);`,

  'src/features/admin/components/DefaultersList.tsx': `import { adminDashboardData } from '../../../mock/adminDashboardData';

export default function DefaultersList() {
  const { defaulters } = adminDashboardData;
  return (
    <div className="bg-white rounded-xl border border-red-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-red-100 bg-red-50/50">
        <h3 className="text-lg font-bold text-red-600 flex items-center">
          <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
          Rent Defaulters
        </h3>
        <p className="text-sm text-red-400 mt-1">Tenants with unpaid rent balances</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-white border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Name</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Phone Number</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Building Name</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Due Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {defaulters.map((d) => (
              <tr key={d.id} className="hover:bg-red-50/30 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900">{d.name}</td>
                <td className="px-6 py-4 text-gray-600">{d.phone}</td>
                <td className="px-6 py-4 text-gray-600">{d.buildingName}</td>
                <td className="px-6 py-4 font-bold text-red-600 bg-red-50/30">$\${d.dueAmount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}`,

  // COMPONENTS - BUILDINGS
  'src/features/admin/components/Filters.tsx': `"use client";
export default function Filters({ onSearch, onFilter, onSort }: any) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <input 
          type="text" 
          placeholder="Search building by name..." 
          onChange={(e) => onSearch(e.target.value)}
          className="w-full sm:max-w-md border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
        />
      </div>
      <div className="flex gap-4">
        <select 
          onChange={(e) => onFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-700 cursor-pointer"
        >
          <option value="All">All Types</option>
          <option value="Residential">Residential</option>
          <option value="Commercial">Commercial</option>
        </select>
        
        <select 
          onChange={(e) => onSort(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-700 cursor-pointer"
        >
          <option value="asc">Sort A to Z</option>
          <option value="desc">Sort Z to A</option>
        </select>
      </div>
    </div>
  );
}`,

  'src/features/admin/components/BuildingsTable.tsx': `import Link from 'next/link';

export default function BuildingsTable({ data }: { data: any[] }) {
  if(data.length === 0) return <div className="p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-100">No buildings found.</div>

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">S.No</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Building Name</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Type</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Total Units</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Rent Paid</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Rent Due</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((b) => (
              <tr key={b.id} className="hover:bg-blue-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-500">{b.serialNumber}</td>
                <td className="px-6 py-4 font-bold text-blue-600 hover:text-blue-800">
                  <Link href={\`/admin/buildings/\${b.id}\`}>
                    {b.name}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <span className={\`px-2.5 py-1 rounded-md text-xs font-semibold \${b.type === 'Residential' ? 'bg-purple-100 text-purple-700' : 'bg-pink-100 text-pink-700'}\`}>
                    {b.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-700">{b.totalUnits}</td>
                <td className="px-6 py-4 font-semibold text-emerald-600">$\${b.rentPaid.toLocaleString()}</td>
                <td className="px-6 py-4 font-semibold text-red-600">$\${b.rentDue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}`,

  'src/features/admin/components/BuildingDetailsTable.tsx': `export default function BuildingDetailsTable({ tenants }: { tenants: any[] }) {
  if(!tenants || tenants.length === 0) return <div className="p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-100 mt-6">No tenants found for this building.</div>

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mt-6">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">S.No</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Tenant Name</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Floor Number</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Phone Number</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Rent Status</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Due Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {tenants.map((t) => (
              <tr key={t.id} className={\`hover:bg-gray-50 transition-colors \${t.rentStatus === 'Unpaid' ? 'bg-red-50/10' : ''}\`}>
                <td className="px-6 py-4 font-medium text-gray-500">{t.serialNumber}</td>
                <td className="px-6 py-4 font-bold text-gray-900">{t.name}</td>
                <td className="px-6 py-4 text-gray-600">{t.floorNumber}</td>
                <td className="px-6 py-4 text-gray-600">{t.phone}</td>
                <td className="px-6 py-4">
                  <span className={\`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center w-fit \${t.rentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}\`}>
                    <span className={\`w-1.5 h-1.5 rounded-full mr-1.5 \${t.rentStatus === 'Paid' ? 'bg-emerald-500' : 'bg-red-500'}\`}></span>
                    {t.rentStatus}
                  </span>
                </td>
                <td className={\`px-6 py-4 font-bold \${t.dueAmount > 0 ? 'text-red-600' : 'text-gray-400'}\`}>
                  \${t.dueAmount > 0 ? \`$\${t.dueAmount.toLocaleString()}\` : '-'}
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
  'src/features/admin/pages/Dashboard.tsx': `import DashboardCards from '../components/DashboardCards';
import RentCharts from '../components/RentCharts';
import DefaultersList from '../components/DefaultersList';

export default function Dashboard() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome back. Here is the overview of your properties and rent collections.</p>
      </div>
      
      <DashboardCards />
      <RentCharts />
      <DefaultersList />
    </div>
  );
}`,

  'src/features/admin/pages/Buildings.tsx': `"use client";
import { useState, useMemo } from 'react';
import Filters from '../components/Filters';
import BuildingsTable from '../components/BuildingsTable';
import { buildingsData } from '../../../mock/buildingsData';

export default function Buildings() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [sortOrder, setSortOrder] = useState('asc');

  const filteredData = useMemo(() => {
    let result = [...buildingsData];

    // Search
    if (search) {
      result = result.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));
    }

    // Filter
    if (filterType !== 'All') {
      result = result.filter(b => b.type === filterType);
    }

    // Sort
    result.sort((a, b) => {
      if (sortOrder === 'asc') return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });

    return result;
  }, [search, filterType, sortOrder]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Buildings</h1>
        <p className="text-gray-500 mt-2">Manage your residential and commercial properties.</p>
      </div>

      <Filters onSearch={setSearch} onFilter={setFilterType} onSort={setSortOrder} />
      <BuildingsTable data={filteredData} />
    </div>
  );
}`,

  'src/features/admin/pages/BuildingDetails.tsx': `import Link from 'next/link';
import BuildingDetailsTable from '../components/BuildingDetailsTable';
import { buildingsData } from '../../../mock/buildingsData';
import { tenantsData } from '../../../mock/tenantsData';

export default function BuildingDetails({ buildingId }: { buildingId: string }) {
  const building = buildingsData.find(b => b.id === buildingId);
  const tenants = tenantsData[buildingId] || [];

  if (!building) {
    return (
      <div className="p-6 max-w-7xl mx-auto text-center mt-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Building Not Found</h1>
        <Link href="/admin/buildings" className="text-blue-600 hover:underline">← Back to Buildings</Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/buildings" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center w-fit mb-4">
          ← Back to Buildings
        </Link>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{building.name}</h1>
            <div className="flex items-center space-x-3 mt-2">
              <span className={\`px-2.5 py-1 rounded-md text-xs font-semibold \${building.type === 'Residential' ? 'bg-purple-100 text-purple-700' : 'bg-pink-100 text-pink-700'}\`}>
                {building.type}
              </span>
              <span className="text-gray-500 text-sm">{building.totalUnits} Total Units</span>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100">
              <p className="text-xs text-emerald-600 font-bold uppercase">Rent Paid</p>
              <p className="text-xl font-bold text-emerald-700">$\${building.rentPaid.toLocaleString()}</p>
            </div>
            <div className="bg-red-50 px-4 py-2 rounded-lg border border-red-100">
              <p className="text-xs text-red-600 font-bold uppercase">Rent Due</p>
              <p className="text-xl font-bold text-red-700">$\${building.rentDue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8">Tenant List</h2>
      <BuildingDetailsTable tenants={tenants} />
    </div>
  );
}`,

  // ROUTING
  'app/admin/layout.tsx': `import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center text-xl font-bold text-blue-600">
                Owner Portal
              </div>
              <div className="ml-8 flex space-x-8">
                <Link href="/admin" className="text-gray-600 hover:text-blue-600 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-600 text-sm font-medium transition-colors">
                  Dashboard
                </Link>
                <Link href="/admin/buildings" className="text-gray-600 hover:text-blue-600 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-600 text-sm font-medium transition-colors">
                  Buildings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}`,

  'app/admin/page.tsx': `import Dashboard from '@/src/features/admin/pages/Dashboard';

export default function AdminPage() {
  return <Dashboard />;
}`,

  'app/admin/buildings/page.tsx': `import Buildings from '@/src/features/admin/pages/Buildings';

export default function BuildingsPage() {
  return <Buildings />;
}`,

  'app/admin/buildings/[id]/page.tsx': `import BuildingDetails from '@/src/features/admin/pages/BuildingDetails';

export default function BuildingDetailsPage({ params }: { params: { id: string } }) {
  return <BuildingDetails buildingId={params.id} />;
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
