"use client";

import { useState, useEffect } from "react";
import { fetchOwnerRequests, updateMaintenanceRequest } from "@/src/features/api/requestsApi";
import { Loader2, Search, Filter, MessageSquare, CheckCircle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [selectedReq, setSelectedReq] = useState<any>(null);
  const [status, setStatus] = useState("");
  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await fetchOwnerRequests();
      setRequests(data);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const openModal = (req: any) => {
    setSelectedReq(req);
    setStatus(req.status);
    setReply(req.owner_reply || "");
  };

  const closeModal = () => {
    setSelectedReq(null);
    setStatus("");
    setReply("");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq) return;
    
    setSubmitting(true);
    try {
      await updateMaintenanceRequest(selectedReq.request_id, status, reply);
      
      closeModal();
      fetchRequests(); // Refresh list
    } catch (err) {
      console.error("Failed to update request", err);
      alert("Failed to update request.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Resolved': return <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-200 flex items-center gap-1 w-max"><CheckCircle className="w-3 h-3"/> Resolved</span>;
      case 'In Progress': return <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 flex items-center gap-1 w-max"><Loader2 className="w-3 h-3 animate-spin"/> In Progress</span>;
      default: return <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold border border-orange-200 flex items-center gap-1 w-max"><Clock className="w-3 h-3"/> Pending</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Maintenance Requests</h1>
          <p className="text-gray-500 mt-1">Manage tenant issues across your buildings.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search issues..." 
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#f26722] focus:ring-1 focus:ring-[#f26722]"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : requests.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-20 text-gray-500">
             <MessageSquare className="w-12 h-12 text-gray-300 mb-4" />
             <p>No maintenance requests found.</p>
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-semibold">Tenant</th>
                  <th className="px-6 py-4 font-semibold">Building & Unit</th>
                  <th className="px-6 py-4 font-semibold">Issue</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.map((req) => (
                  <tr key={req.request_id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{req.tenant_name}</td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 font-medium">{req.building_name}</div>
                      <div className="text-gray-500 text-xs">Unit {req.unit_code}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 font-medium truncate max-w-[200px]">{req.issue_title}</div>
                      <div className="text-gray-500 text-xs truncate max-w-[200px]">{req.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {req.status === 'Resolved' ? (
                        <span className="text-gray-400 font-semibold text-xs px-3 py-1.5 cursor-not-allowed">Resolved</span>
                      ) : (
                        <button 
                          onClick={() => openModal(req)}
                          className="text-[#f26722] font-semibold text-xs hover:bg-[#f26722]/10 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Update
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Action Modal */}
      <AnimatePresence>
        {selectedReq && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-lg text-gray-900">Update Request</h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 font-bold">&times;</button>
              </div>
              
              <div className="p-6">
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-1">{selectedReq.issue_title}</h4>
                  <p className="text-sm text-gray-600">{selectedReq.description}</p>
                </div>

                <form onSubmit={handleUpdate} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select 
                      value={status} 
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f26722] focus:border-[#f26722] outline-none transition-colors"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Reply</label>
                    <textarea 
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Add a message for the tenant..."
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f26722] focus:border-[#f26722] outline-none transition-colors resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button 
                      type="button" 
                      onClick={closeModal}
                      className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2.5 text-sm font-semibold text-white bg-[#f26722] hover:bg-[#d95a1c] rounded-lg flex items-center gap-2 transition-colors disabled:opacity-70"
                    >
                      {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
