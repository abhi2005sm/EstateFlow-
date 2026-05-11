import { recentOwners } from '../../../mock/ownersData';
import { Building, ChevronRight } from 'lucide-react';

export default function RecentOwners() {
  return (
    <div className="space-y-4">
      {recentOwners.map((owner) => (
        <div key={owner.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-all border border-transparent hover:border-gray-100 group">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold group-hover:bg-blue-100 transition-colors">
              {owner.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">{owner.name}</p>
              <p className="text-[10px] text-gray-400 font-medium flex items-center">
                <Building className="w-3 h-3 mr-1" />
                {owner.buildings} {owner.buildings === 1 ? 'Building' : 'Buildings'}
              </p>
            </div>
          </div>
          <ChevronRight size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-all" />
        </div>
      ))}
    </div>
  );
}
