"use client";

import { useState, useEffect } from "react";
import { apiRequest } from "@/src/features/api/api";
import { Loader2, Users, Clock, CheckCircle, XCircle } from "lucide-react";

export default function TenantVisitorsPage() {
  const [visitors, setVisitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVisitors = async () => {
    setLoading(true);
    try {
      const data = await apiRequest("/users/security/visitors/");
      setVisitors(data.results || data || []);
    } catch (err) {
      console.error("Failed to fetch visitors", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const handleVisitorAction = async (id: number, action: 'approve' | 'reject') => {
    try {
      await apiRequest(`/users/security/visitors/${id}/action/`, {
        method: 'POST',
        body: JSON.stringify({ action })
      });
      fetchVisitors(); // Refresh list
    } catch (err) {
      alert("Failed to process visitor action.");
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status?.toUpperCase()) {
      case 'APPROVED': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'REJECTED': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-amber-500" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch(status?.toUpperCase()) {
      case 'APPROVED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'REJECTED': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Visitor Requests</h1>
        <p className="text-gray-500 mt-1">Manage and respond to visitors arriving at the gate.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-[#f26722] mb-4" />
          <p>Loading your visitors...</p>
        </div>
      ) : visitors.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#121212] rounded-xl border border-gray-100 dark:border-[#363636] shadow-sm">
          <div className="w-16 h-16 bg-gray-50 dark:bg-[#262626] rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No visitors found</h3>
          <p className="text-gray-500 mb-6">You have no visitor requests at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {visitors.map((visitor) => (
            <div key={visitor.request_id || visitor.id} className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-gray-100 dark:border-[#363636] p-6 overflow-hidden relative">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{visitor.visitor_name}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Requested on {new Date(visitor.created_at).toLocaleString()}
                  </p>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider ${getStatusClass(visitor.status)}`}>
                  {getStatusIcon(visitor.status)}
                  {visitor.status}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-[#262626] rounded-lg p-4 mb-4 text-sm text-gray-700 dark:text-gray-200">
                <p><strong>Phone:</strong> {visitor.visitor_phone}</p>
                <p className="mt-1"><strong>Purpose:</strong> {visitor.purpose}</p>
              </div>

              {(visitor.status?.toUpperCase() === 'PENDING' || visitor.status === 'Pending') && (
                <div className="flex space-x-3 mt-4">
                  <button 
                    onClick={() => handleVisitorAction(visitor.request_id || visitor.id, 'approve')} 
                    className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-sm transition-colors"
                  >
                    Approve Entry
                  </button>
                  <button 
                    onClick={() => handleVisitorAction(visitor.request_id || visitor.id, 'reject')} 
                    className="px-6 py-2 bg-white text-red-500 font-bold rounded-xl shadow-sm border border-red-200 hover:bg-red-50 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
