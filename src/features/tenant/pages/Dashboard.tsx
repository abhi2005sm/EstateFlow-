import DashboardCards from '../components/DashboardCards';
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
}