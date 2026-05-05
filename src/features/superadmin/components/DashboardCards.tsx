import { Building2, Users, UserCheck, UserX, Clock, Home, DoorOpen, DollarSign, Wrench, Zap, Droplets } from 'lucide-react';
import { dashboardData } from '../../../mock/dashboardData';

export default function DashboardCards() {
  const { buildings, tenants, activeUsers, expiredUsers } = dashboardData;

  const cards = [
    { title: 'Total Buildings', value: buildings, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Total Tenants', value: tenants, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Active Users', value: activeUsers, icon: UserCheck, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Expired Users', value: expiredUsers, icon: UserX, color: 'text-red-600', bg: 'bg-red-100' },
  ];


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
            <div className={`p-3 rounded-full ${card.bg}`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <h3 className="text-2xl font-bold text-gray-800">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
