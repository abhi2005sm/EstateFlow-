import DashboardCards from '../components/DashboardCards';
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
}