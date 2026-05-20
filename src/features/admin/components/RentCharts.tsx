"use client";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function RentCharts({ data }: { data?: any }) {
  if (!data) return null;
  const overview = data.property_overview || {};
  const rentSummary = data.rent_summary || {};

  const charts = {
    occupancy: [
      { name: 'Occupied', value: overview.occupied_units || 0, fill: '#10b981' },
      { name: 'Vacant', value: overview.vacant_units || 0, fill: '#ef4444' }
    ],
    rentStatus: [
      { name: 'Paid', value: rentSummary.paid_units || 0, fill: '#3b82f6' },
      { name: 'Unpaid/Partial', value: rentSummary.unpaid_units || 0, fill: '#f59e0b' }
    ],
    buildingTypes: [
      { name: 'Residential', value: overview.residential || 0, fill: '#8b5cf6' },
      { name: 'Commercial', value: overview.commercial || 0, fill: '#ec4899' }
    ]
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartCard title="Occupied vs Vacant">
        <PieChart>
          <Pie data={charts.occupancy} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
            {charts.occupancy.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
          <Legend verticalAlign="bottom" />
        </PieChart>
      </ChartCard>
      
      <ChartCard title="Paid vs Unpaid Rent">
        <PieChart>
          <Pie data={charts.rentStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
            {charts.rentStatus.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
          <Legend verticalAlign="bottom" />
        </PieChart>
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
);