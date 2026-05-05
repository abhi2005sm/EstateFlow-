import { expiringSoonList } from '../../../mock/dashboardData';
import { Clock, Building } from 'lucide-react';

export default function ExpiringSoonList() {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Expiring Soon</h3>
      <div className="space-y-4">
        {expiringSoonList.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-500 flex items-center">
                  <Building className="w-3 h-3 mr-1" />
                  {user.property}
                </p>
              </div>
            </div>
            <div className="flex items-center text-orange-600 bg-orange-50 px-3 py-1 rounded-full text-sm font-medium">
              <Clock className="w-4 h-4 mr-1.5" />
              {user.daysLeft} days
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
