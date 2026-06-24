"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Mail, Lock, LogIn, AlertCircle, ArrowRight, Layout, Globe, Sparkles, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { authApi } from '@/src/features/api/api';

const INSIGHTS = [
  {
    tag: "Market Trend",
    title: "The Rise of Smart Assets",
    content: "Integrated IoT systems are now increasing luxury property valuations by up to 12% globally."
  },
  {
    tag: "Efficiency",
    title: "Predictive Operations",
    content: "Automated maintenance scheduling reduces emergency repair costs by 30% through early detection."
  },
  {
    tag: "Retention",
    title: "Digital Living Experiences",
    content: "Resident satisfaction scores jump by 40% when moving from manual to digital portal workflows."
  },
  {
    tag: "Global Data",
    title: "The $2B Managed Club",
    content: "EstateFlow nodes now orchestrate over $2 billion in prime real estate assets across 4 continents."
  }
];

const MOCK_CREDENTIALS = {
  superadmin: { email: 'superadmin@estateflow.com', password: 'super123' },
  admin: { email: 'johndoe@example.com', password: 'password123' },
  user: { email: 'tenant@example.com', password: 'password123' },
  security: { email: 'security@example.com', password: 'password123' }
};

type RoleType = keyof typeof MOCK_CREDENTIALS;

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<RoleType>('superadmin');
  const [email, setEmail] = useState(MOCK_CREDENTIALS.superadmin.email);
  const [password, setPassword] = useState(MOCK_CREDENTIALS.superadmin.password);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [insightIndex, setInsightIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setInsightIndex(Math.floor(Math.random() * INSIGHTS.length));
  }, []);

  const handleRoleChange = (selectedRole: RoleType) => {
    setRole(selectedRole);
    setEmail(MOCK_CREDENTIALS[selectedRole].email);
    setPassword(MOCK_CREDENTIALS[selectedRole].password);
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      let loginEmail = email;
      if (role === 'security' && !email.includes('@')) {
        loginEmail = `${email}@security.estatia.local`;
      }
      
      const response = await authApi.login({ email: loginEmail, password });
      
      // Store tokens for cross-domain access
      // Store tokens for cross-domain access - checking multiple common keys
      const token = response.access_token || response.access || response.token || response.data?.token || response.accessToken;
      const refreshToken = response.refresh_token || response.refresh || response.data?.refresh;

      if (token) {
        localStorage.setItem('access_token', token);
        console.log('[Login] Token stored successfully');
      }
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }
      
      console.log('[Login] API Response:', response);
      
      // Store user info for UI display
      localStorage.setItem('user', JSON.stringify({
        email: response.email || response.user?.email || email,
        name: response.name || response.first_name || response.user?.name || (role === 'admin' ? 'Admin Owner' : role),
      }));
      
      // Determine role from various possible fields in API response
      let detectedRole = response.role || response.user_type || role;
      if (response.is_superuser) detectedRole = 'superadmin';
      else if (response.is_staff) detectedRole = 'admin';
      
      const userRole = String(detectedRole).toLowerCase(); 

      if (userRole === 'superadmin') {
        router.push('/super-admin');
      } else if (userRole === 'admin' || userRole === 'owner') {
        router.push('/admin'); 
      } else if (userRole === 'security') {
        router.push('/security/dashboard');
      } else {
        router.push('/tenant'); 
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] lg:h-screen w-full relative grid lg:grid-cols-2 selection:bg-white dark:bg-[#121212] selection:text-black font-sans bg-[#050505] overflow-y-auto lg:overflow-hidden">
      {/* Background Image - Full Screen with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop" 
          alt="Luxury Villa Background" 
          fill 
          className="object-cover opacity-60 grayscale-[0.3]"
          priority
        />
        <div className="absolute inset-0 bg-[#050505]/60" />
      </div>

      {/* Background Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-1">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Left Section: Login Form */}
      <div className="relative z-10 flex items-center justify-center p-4 lg:p-8 order-2 lg:order-1 h-full">
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-[420px] bg-[#0D0D0D]/80 backdrop-blur-3xl rounded-[2.5rem] p-6 lg:p-8 border border-white/10 shadow-2xl my-8 lg:my-0"
        >
          <div className="text-left mb-4">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
              <div className="w-6 h-6 rounded-lg bg-white dark:bg-[#121212] flex items-center justify-center text-black group-hover:scale-110 transition-transform">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">EstateFlow</span>
            </Link>
            
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1 leading-tight">
              Experience <br /> EstateFlow.
            </h1>
            <p className="text-gray-400 text-[11px] font-light leading-relaxed max-w-sm">
              Secure access to your dashboard.
            </p>
          </div>

          <div className="flex p-1 bg-white/5 rounded-xl mb-6 border border-white/5">
            {(['superadmin', 'admin', 'user', 'security'] as RoleType[]).map((r) => (
              <button
                key={r}
                onClick={() => handleRoleChange(r)}
                className={`flex-1 py-2 text-[8px] font-bold uppercase tracking-widest rounded-lg transition-all ${
                  role === r 
                    ? 'bg-white dark:bg-[#121212] text-black shadow-lg' 
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                {r === 'user' ? 'Tenant' : r === 'security' ? 'Security' : r.replace('admin', ' Admin')}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 text-red-400 text-[9px] font-bold uppercase tracking-widest"
                >
                  <AlertCircle className="w-3 h-3" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3">
              <div className="group border-b border-white/10 focus-within:border-white transition-colors">
                <label className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-500 group-focus-within:text-white transition-colors block mb-0.5">Email or Username</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent py-1.5 text-white placeholder-white/5 focus:outline-none font-light text-sm"
                  placeholder="email@example.com or username"
                  required
                />
              </div>

              <div className="group border-b border-white/10 focus-within:border-white transition-colors relative">
                <label className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-500 group-focus-within:text-white transition-colors block mb-0.5">Security Key</label>
                <div className="flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent py-1.5 text-white placeholder-white/5 focus:outline-none font-light text-sm"
                    placeholder="••••••••"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <input type="checkbox" id="remember" className="w-3 h-3 rounded border-white/10 bg-white/5 checked:bg-white dark:bg-[#121212] checked:border-white transition-all appearance-none cursor-pointer" />
              <label htmlFor="remember" className="text-[10px] text-gray-500 cursor-pointer hover:text-gray-300 transition-colors leading-snug">
                Secure monitored access session.
              </label>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="submit"
                disabled={isLoading}
                className="group h-12 bg-white dark:bg-[#121212] text-black rounded-full px-8 flex items-center gap-3 hover:bg-gray-200 active:scale-95 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="font-bold text-[10px] uppercase tracking-widest">Login</span>
                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </>
                )}
              </button>
              
              <Link href="/" className="text-[9px] font-bold uppercase tracking-widest text-gray-600 hover:text-white transition-colors">
                Abort
              </Link>
            </div>
          </form>

          <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/5">
             <div className="flex items-center gap-2 grayscale opacity-40">
                <Building2 className="w-3 h-3 text-white" />
                <span className="text-[8px] font-bold tracking-widest uppercase text-white">Secure Node</span>
             </div>
             <p className="text-[8px] font-bold text-gray-700 dark:text-gray-200 uppercase tracking-[0.3em]">v4.0.2</p>
          </div>
        </motion.div>
      </div>

      {/* Right Section: Dynamic Insights */}
      <div className="relative z-10 hidden lg:flex items-center justify-center p-8 lg:p-20 order-1 lg:order-2 h-full">
        <motion.div 
          key={insightIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full max-w-xl"
        >
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-1.5 h-8 bg-white/30 rounded-full" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">
              Insight {insightIndex + 1} // {INSIGHTS[insightIndex].tag}
            </span>
          </motion.div>
          
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-[0.95] tracking-tighter">
            {INSIGHTS[insightIndex].title}
          </h2>
          
          <p className="text-gray-400 text-lg font-light leading-relaxed max-w-lg">
            {INSIGHTS[insightIndex].content}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
