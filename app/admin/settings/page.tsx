"use client";

import { useState, useEffect } from "react";
import { apiRequest } from "@/src/features/api/api";
import { User, Building2, Users, MapPin, Mail, Phone, ShieldCheck, Laptop, Globe, CheckCircle2, XCircle, FileText, ToggleLeft, ToggleRight, Fingerprint, Lock } from "lucide-react";

export default function SettingsPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [profile, setProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiRequest("/users/owners/me/");
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // 1. Frontend Validation: Check if passwords match
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match!" });
      return;
    }

    if (newPassword.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters long." });
      return;
    }

    setLoading(true);

    try {
      // 2. Send request via the proxy / api helper
      const response = await apiRequest("/auth/change-password/", {
        method: "POST",
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      // 3. Handle Success
      setMessage({ type: "success", text: response.message || "Password updated successfully!" });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (error: any) {
      // 4. Handle Error (e.g., Wrong old password)
      setMessage({
        type: "error",
        text: error.message || "Failed to update password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 space-y-10">
      <div className="mb-4">
        <h1 className="text-4xl font-black text-[#121110] dark:text-white tracking-tight">Account Settings</h1>
        <p className="text-sm font-bold text-[#61605D] dark:text-gray-400 uppercase tracking-widest mt-2">Manage your profile & security</p>
      </div>

      {loadingProfile ? (
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-48 bg-gray-200 dark:bg-[#18181b] rounded-3xl"></div>
          </div>
        </div>
      ) : profile && (
        <div className="bg-white/80 dark:bg-[#18181b]/80 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F26922]/10 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="flex flex-col md:flex-row gap-10 items-start relative z-10">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {profile.profile_image_url ? (
                <img src={profile.profile_image_url} alt="Profile" className="w-32 h-32 rounded-3xl object-cover shadow-md border-4 border-white dark:border-[#18181b]" />
              ) : (
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#F26922] to-[#D95A1C] shadow-md border-4 border-white dark:border-[#18181b] flex items-center justify-center">
                  <span className="text-4xl font-black text-white">{profile.name?.charAt(0) || 'O'}</span>
                </div>
              )}
            </div>
            
            {/* Details */}
            <div className="flex-1 space-y-6">
              <div>
                <h2 className="text-3xl font-black text-[#121110] dark:text-white">{profile.name}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <Building2 className="w-4 h-4 text-[#F26922]" />
                  <p className="text-sm font-bold text-[#61605D] dark:text-gray-400">{profile.company_name || 'Independent Owner'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 text-sm font-semibold text-[#121110] dark:text-gray-300">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl"><Phone className="w-4 h-4 text-gray-500" /></div>
                  <span>{profile.phone_number}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm font-semibold text-[#121110] dark:text-gray-300">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl"><Mail className="w-4 h-4 text-gray-500" /></div>
                  <span>{profile.email}</span>
                </div>
                {profile.gst_pan && (
                  <div className="flex items-center space-x-3 text-sm font-semibold text-[#121110] dark:text-gray-300">
                    <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl"><FileText className="w-4 h-4 text-gray-500" /></div>
                    <span>Tax ID: {profile.gst_pan}</span>
                  </div>
                )}
                <div className="flex items-center space-x-3 text-sm font-semibold text-[#121110] dark:text-gray-300">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl"><MapPin className="w-4 h-4 text-gray-500" /></div>
                  <span>{profile.address || 'Address not provided'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-6 relative z-10">
            <div className="bg-[#F5F3F0] dark:bg-white/5 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-[#61605D] dark:text-gray-400 uppercase tracking-widest mb-1">Active Properties</p>
                <p className="text-3xl font-black text-[#121110] dark:text-white">{profile.active_properties || 0}</p>
              </div>
              <div className="w-12 h-12 bg-white dark:bg-[#18181b] rounded-full flex items-center justify-center shadow-sm">
                <Building2 className="w-5 h-5 text-[#F26922]" />
              </div>
            </div>
            <div className="bg-[#F5F3F0] dark:bg-white/5 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-[#61605D] dark:text-gray-400 uppercase tracking-widest mb-1">Active Tenants</p>
                <p className="text-3xl font-black text-[#121110] dark:text-white">{profile.active_tenants || 0}</p>
              </div>
              <div className="w-12 h-12 bg-white dark:bg-[#18181b] rounded-full flex items-center justify-center shadow-sm">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Security Center */}
        {profile?.security && (
          <div className="bg-white dark:bg-[#18181b] rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 p-10 relative overflow-hidden">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl">
                <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-black text-[#121110] dark:text-white tracking-tight">Security Center</h2>
                <p className="text-xs font-bold text-[#61605D] dark:text-gray-400 uppercase tracking-widest mt-1">SaaS Protection</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#27272a]/50 rounded-2xl">
                <div className="flex items-center space-x-4">
                  <Fingerprint className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-black text-[#121110] dark:text-white">Two-Factor Authentication</p>
                    <p className="text-xs font-semibold text-gray-500 mt-0.5">Extra layer of security</p>
                  </div>
                </div>
                {profile.security.two_factor_enabled ? (
                  <ToggleRight className="w-8 h-8 text-emerald-500 cursor-pointer" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-gray-300 dark:text-gray-600 cursor-pointer" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-[#27272a]/50 rounded-2xl">
                  <p className="text-[10px] font-black text-[#61605D] dark:text-gray-400 uppercase tracking-widest mb-2">Last Login</p>
                  <p className="text-sm font-bold text-[#121110] dark:text-white line-clamp-2">{profile.security.last_login || 'Unknown'}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-[#27272a]/50 rounded-2xl">
                  <p className="text-[10px] font-black text-[#61605D] dark:text-gray-400 uppercase tracking-widest mb-2">Active Sessions</p>
                  <p className="text-xl font-black text-[#121110] dark:text-white">{profile.security.active_sessions || 0}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-black text-[#61605D] dark:text-gray-400 uppercase tracking-widest mb-4 mt-8">Recent Login History</h3>
                <div className="space-y-3">
                  {profile.security.login_history?.map((log: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-800 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Laptop className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs font-bold text-[#121110] dark:text-white">{log.device}</p>
                          <p className="text-[10px] font-semibold text-gray-500">{log.location} • {log.date}</p>
                        </div>
                      </div>
                      {log.status === 'Success' ? (
                        <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full">Success</span>
                      ) : (
                        <span className="px-3 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-widest rounded-full">Failed</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Change Password Card */}
      <div className="bg-white dark:bg-[#18181b] rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 p-10 h-fit">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-2 bg-[#F26922]/10 rounded-xl">
            <Lock className="w-6 h-6 text-[#F26922]" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#121110] dark:text-white tracking-tight">Change Password</h2>
            <p className="text-xs font-bold text-[#61605D] dark:text-gray-400 uppercase tracking-widest mt-1">Update your credentials</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-5 max-w-md">
          
          {/* Status Message */}
          {message.text && (
            <div className={`p-4 rounded-lg text-sm ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
              {message.text}
            </div>
          )}

          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-[#363636] rounded-lg focus:ring-2 focus:ring-[#f26722] focus:border-[#f26722] outline-none transition-colors"
              placeholder="Enter current password"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-[#363636] rounded-lg focus:ring-2 focus:ring-[#f26722] focus:border-[#f26722] outline-none transition-colors"
              placeholder="Enter new password"
            />
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-[#363636] rounded-lg focus:ring-2 focus:ring-[#f26722] focus:border-[#f26722] outline-none transition-colors"
              placeholder="Confirm new password"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 bg-[#121110] dark:bg-white hover:bg-[#F26922] dark:hover:bg-[#F26922] text-white dark:text-[#121110] hover:text-white font-black tracking-wide rounded-2xl transition-all flex justify-center items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
}
