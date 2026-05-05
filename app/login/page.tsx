"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

const MOCK_CREDENTIALS = {
  superadmin: { email: 'superadmin@example.com', password: 'password123' },
  admin: { email: 'admin@example.com', password: 'password123' },
  user: { email: 'user@example.com', password: 'password123' }
};

type RoleType = keyof typeof MOCK_CREDENTIALS;

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<RoleType>('superadmin');
  const [email, setEmail] = useState(MOCK_CREDENTIALS.superadmin.email);
  const [password, setPassword] = useState(MOCK_CREDENTIALS.superadmin.password);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as RoleType;
    setRole(newRole);
    setEmail(MOCK_CREDENTIALS[newRole].email);
    setPassword(MOCK_CREDENTIALS[newRole].password);
    setError('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (email !== MOCK_CREDENTIALS[role].email || password !== MOCK_CREDENTIALS[role].password) {
      setError('Invalid email or password for selected role.');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      if (role === 'superadmin') {
        router.push('/super-admin');
      } else if (role === 'admin') {
        router.push('/admin'); 
      } else {
        router.push('/tenant'); 
      }
    }, 800);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Background Image & Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-gray-900 to-black opacity-90" />
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[4px]" />
      </div>

      {/* Floating Ambient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-700" />

      {/* Glassmorphism Login Card */}
      <div className="relative z-10 w-full max-w-md px-6 py-12 transition-all duration-500">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/20 text-blue-400 mb-4 border border-blue-500/30 shadow-inner">
              <Building2 className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Super<span className="text-blue-400">Admin</span></h1>
            <p className="text-gray-300 mt-2 text-sm">Property Management Dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 flex items-center gap-3 text-red-200 text-sm animate-pulse">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Role Selection */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-blue-400 transition-colors">
                  <Building2 className="w-5 h-5" />
                </div>
                <select
                  id="role"
                  value={role}
                  onChange={handleRoleChange}
                  className="appearance-none block w-full pl-12 pr-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all [&>option]:text-gray-900 cursor-pointer"
                >
                  <option value="superadmin">Login as: Super Admin</option>
                  <option value="admin">Login as: Admin</option>
                  <option value="user">Login as: User</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-white/40">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>

              {/* Email */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-blue-400 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-blue-400 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-2xl shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform active:scale-95"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-1" />
                  SIGN IN
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-gray-400 text-sm">
              Secure Property Management Access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
