import DashboardCards from '../components/DashboardCards';
import ExpiringSoonList from '../components/ExpiringSoonList';
import UserStatusChart from '../components/UserStatusChart';
import RecentOwners from '../components/RecentOwners';

export default function Dashboard() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of all properties and revenue.</p>
      </div>
      
      <DashboardCards />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        <UserStatusChart />
        <ExpiringSoonList />
        <RecentOwners />
      </div>
    </div>
  );
}
