"use client";

import { useState, useEffect } from "react";
import { apiRequest } from "@/src/features/api/api";
import { PlusCircle, Loader2, MessageSquare, Clock, CheckCircle } from "lucide-react";

export default function TenantRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [profile, setProfile] = useState<any>(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const [data, profileData] = await Promise.all([
        apiRequest("/users/tenants/maintenance/"),
        apiRequest('/users/tenants/me/').catch(() => null)
      ]);
      setRequests(data.results || data);
      if (profileData) setProfile(profileData);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleConfirmVacate = async () => {
    if (!profile) return;
    const tenantId = profile.tenant_id || profile.id;
    try {
      await apiRequest(`/users/tenants/${tenantId}/confirm-vacate/`, { method: 'POST' });
      alert("Vacate confirmed successfully. Deposit received.");
      setProfile({ ...profile, vacate_status: 'Vacated' });
    } catch (error) {
      alert("Failed to confirm vacate.");
      console.error(error);
    }
  };

  const handleRejectVacate = async () => {
    if (!profile) return;
    const tenantId = profile.tenant_id || profile.id;
    try {
      await apiRequest(`/users/tenants/${tenantId}/reject-vacate/`, { method: 'POST' });
      alert("You have rejected the vacate request. The owner will be notified.");
      // Assuming rejection sets status back to 'Active' or similar in backend
      setProfile({ ...profile, vacate_status: 'Active' });
    } catch (error) {
      alert("Failed to reject vacate request.");
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setSubmitting(true);
    setError("");

    try {
      await apiRequest("/users/tenants/maintenance/", {
        method: "POST",
        body: JSON.stringify({
          issue_title: title,
          description: description
        }),
      });
      
      setTitle("");
      setDescription("");
      setShowForm(false);
      fetchRequests(); // Refresh list
    } catch (err: any) {
      setError(err.message || "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Resolved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'In Progress': return <Loader2 className="w-4 h-4 text-blue-500 dark:text-white animate-spin" />;
      default: return <Clock className="w-4 h-4 text-orange-500" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'Resolved': return 'bg-green-50 text-green-700 border-green-200';
      case 'In Progress': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-orange-50 text-orange-700 border-orange-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {profile?.vacate_status === 'Pending Confirmation' && (
        <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/50 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between shadow-sm mb-8">
          <div>
            <h3 className="text-amber-800 dark:text-amber-200 font-bold text-lg">Action Required: Vacate Request Initiated</h3>
            <p className="text-amber-700 dark:text-amber-300 mt-1">
              Your landlord has initiated a vacate request. Please confirm you have received your deposit return of <span className="font-black">₹{Number(profile.deposit_amount || 0).toLocaleString('en-IN')}</span>.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
            <button 
              onClick={handleRejectVacate}
              className="whitespace-nowrap px-6 py-3 bg-white text-amber-700 font-bold rounded-xl shadow-sm border border-amber-200 hover:bg-amber-50 transition-all active:scale-95"
            >
              Reject (Deposit Not Received)
            </button>
            <button 
              onClick={handleConfirmVacate}
              className="whitespace-nowrap px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95"
            >
              Confirm Deposit Received & Vacate
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Maintenance Requests</h1>
          <p className="text-gray-500 mt-1">Report and track issues in your unit.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-[#f26722] hover:bg-[#d95a1c] text-white rounded-lg font-medium transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          {showForm ? "Cancel Request" : "New Request"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-gray-100 dark:border-[#363636] p-6 mb-8 animate-in slide-in-from-top-4 fade-in duration-300">
          <h2 className="text-xl font-semibold mb-4">Raise an Issue</h2>
          {error && (
            <div className="p-3 mb-4 text-sm bg-red-50 text-red-600 border border-red-100 rounded-lg">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Issue Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Broken AC in Bedroom"
                className="w-full px-4 py-2 border border-gray-300 dark:border-[#363636] rounded-lg focus:ring-2 focus:ring-[#f26722] focus:border-[#f26722] outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Description</label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe the issue in detail..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-[#363636] rounded-lg focus:ring-2 focus:ring-[#f26722] focus:border-[#f26722] outline-none transition-colors resize-none"
              />
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-[#f26722] text-white rounded-lg font-medium hover:bg-[#d95a1c] transition-colors disabled:opacity-70 flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-[#f26722] mb-4" />
          <p>Loading your requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#121212] rounded-xl border border-gray-100 dark:border-[#363636] shadow-sm">
          <div className="w-16 h-16 bg-gray-50 dark:bg-[#262626] rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No requests found</h3>
          <p className="text-gray-500 mb-6">You haven't submitted any maintenance requests yet.</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-[#f26722] font-medium hover:underline"
          >
            Create your first request
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.request_id} className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-gray-100 dark:border-[#363636] p-6 overflow-hidden relative">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{req.issue_title}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Submitted on {new Date(req.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${getStatusClass(req.status)}`}>
                  {getStatusIcon(req.status)}
                  {req.status}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-[#262626] rounded-lg p-4 mb-4 text-sm text-gray-700 dark:text-gray-200">
                {req.description}
              </div>

              {req.owner_reply && (
                <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold">O</div>
                    <span className="text-sm font-semibold text-blue-900">Owner's Reply</span>
                  </div>
                  <p className="text-sm text-blue-800 ml-8">{req.owner_reply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
