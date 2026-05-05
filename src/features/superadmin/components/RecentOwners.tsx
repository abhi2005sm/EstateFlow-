import { recentOwners } from '../../../mock/ownersData';
import { Building } from 'lucide-react';

export default function RecentOwners() {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Owners</h3>
      <div className="space-y-4">
        {recentOwners.map((owner) => (
          <div key={owner.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                {owner.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-gray-800">{owner.name}</p>
                <p className="text-sm text-gray-500 flex items-center">
                  <Building className="w-3 h-3 mr-1" />
                  {owner.buildings} {owner.buildings === 1 ? 'Building' : 'Buildings'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
