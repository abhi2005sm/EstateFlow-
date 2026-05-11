import { expiringSoonList } from '../../../mock/dashboardData';
import { Clock, Building } from 'lucide-react';

export default function ExpiringSoonList() {
  return (
    <div className="space-y-4">
      {expiringSoonList.map((user) => (
        <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-all border border-gray-50 hover:border-gray-100 group">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 font-bold group-hover:bg-orange-100 transition-colors">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">{user.name}</p>
              <p className="text-[10px] text-gray-400 font-medium flex items-center">
                <Building className="w-3 h-3 mr-1" />
                {user.property}
              </p>
            </div>
          </div>
          <div className="flex items-center text-orange-600 bg-orange-50/50 px-2 py-1 rounded-lg text-[10px] font-bold">
            <Clock className="w-3 h-3 mr-1" />
            {user.daysLeft}d
          </div>
        </div>
      ))}
    </div>
  );
}
