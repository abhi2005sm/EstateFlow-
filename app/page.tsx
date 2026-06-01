'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronRight, Home, Search, MapPin, Star, ArrowUpRight, Menu, LogIn } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white font-sans selection:bg-white dark:bg-[#121212] selection:text-black overflow-x-hidden">
      {/* Background Orbs & Grid */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0D0D0D]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white dark:bg-[#121212] rounded-lg flex items-center justify-center">
              <Home className="text-black w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">EstateFlow</span>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="px-6 py-2.5 rounded-full bg-white dark:bg-[#121212] text-black text-sm font-semibold hover:bg-gray-200 transition-all flex items-center gap-2 group"
            >
              Sign In
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <button className="md:hidden p-2 text-gray-400">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-start pt-40 pb-20">
          <div className="absolute inset-0 z-0">
            <Image 
              src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop" 
              alt="Luxury Villa" 
              fill 
              className="object-cover opacity-60 grayscale-[0.2]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/40 to-transparent" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold tracking-[0.2em] uppercase mb-8 backdrop-blur-sm"
              >
                Next-Gen Property Management
              </motion.span>
              <h1 className="text-6xl md:text-9xl font-bold leading-[0.9] mb-10 tracking-[-0.04em]">
                Manage your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/20">Assets Smarter.</span>
              </h1>
              <p className="text-lg md:text-[#121110] dark:text-whitexl text-gray-400 mb-4 max-w-2xl leading-relaxed font-light">
                A unified command center for Super Admins, Property Managers, and Tenants. Streamline your real estate operations with industrial precision.
              </p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mt-16 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 flex flex-col md:flex-row gap-4 items-center shadow-2xl"
              >
                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-4 md:border-r border-white/10 px-4">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">System Role</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm font-medium">Super Admin</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Active Modules</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">12 Integrated Modules</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Platform Status</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">99.9% Operational</span>
                    </div>
                  </div>
                </div>
                <Link href="/login" className="w-full md:w-auto bg-white dark:bg-[#121212] text-black px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                  <LogIn className="w-5 h-5" />
                  Access Dashboard
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 bg-[#0D0D0D]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
              {[
                { label: 'Units Managed', value: '15,000+' },
                { label: 'Uptime SLA', value: '99.9%' },
                { label: 'Tenant Retention', value: '92%' },
                { label: 'Years of Trust', value: '10+' },
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <h3 className="text-4xl md:text-5xl font-bold tracking-tight">{stat.value}</h3>
                  <p className="text-sm text-gray-500 uppercase font-bold tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Listings */}
        <section className="py-24 bg-[#111111] rounded-[3rem] mx-4 my-8">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6"
            >
              <div className="max-w-xl">
                <h2 className="text-4xl md:text-7xl font-bold tracking-tighter mb-8">Built for <br />every Role.</h2>
                <p className="text-xl text-gray-400 leading-relaxed font-light">
                  Tailored experiences designed for administrators, portfolio owners, and residents alike.
                </p>
              </div>
              <button className="px-10 py-5 rounded-full border border-white/10 hover:bg-white dark:bg-[#121212] hover:text-black transition-all flex items-center gap-2 group font-bold">
                Explore Modules
                <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
              </button>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Super Admin Section */}
              <motion.div 
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <div className="relative h-[450px] rounded-[2.5rem] overflow-hidden mb-6">
                  <Image src="/images/hero-bg.png" alt="Global Operations" fill className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent" />
                  <div className="absolute top-6 right-6">
                    <span className="px-4 py-2 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-500/30 text-[10px] font-bold uppercase tracking-wider text-blue-400">
                      Super Admin
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-[#121110] dark:text-whitexl font-bold tracking-tight">Global Governance</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Full-scale ecosystem management for multi-property portfolios. Oversee administrator permissions, cross-building analytics, and system-wide configurations.
                  </p>
                  <ul className="flex flex-wrap gap-2 pt-2">
                    {['Portfolio Analytics', 'Role Management', 'Audit Logs'].map(tag => (
                      <li key={tag} className="text-[10px] px-2 py-1 rounded bg-white/5 border border-white/5 text-gray-500 font-bold uppercase">{tag}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* Admin Portal Section */}
              <motion.div 
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <div className="relative h-[450px] rounded-[2.5rem] overflow-hidden mb-6">
                  <Image src="/images/admin-mockup.png" alt="Executive Command" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent" />
                  <div className="absolute top-6 right-6">
                    <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-wider">
                      Property Manager
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-[#121110] dark:text-whitexl font-bold tracking-tight">Executive Command</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    A dedicated command center for day-to-day operations. Track unit occupancy, automate maintenance workflows, and generate comprehensive financial reports.
                  </p>
                  <ul className="flex flex-wrap gap-2 pt-2">
                    {['Occupancy Tracking', 'Maintenance CRM', 'Rent Collection'].map(tag => (
                      <li key={tag} className="text-[10px] px-2 py-1 rounded bg-white/5 border border-white/5 text-gray-500 font-bold uppercase">{tag}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* Tenant Portal Section */}
              <motion.div 
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <div className="relative h-[450px] rounded-[2.5rem] overflow-hidden mb-6">
                  <Image src="/images/interior.png" alt="Tenant Experience" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent" />
                  <div className="absolute top-6 right-6">
                    <span className="px-4 py-2 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      Resident Portal
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-[#121110] dark:text-whitexl font-bold tracking-tight">Seamless Living</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    A modern mobile-first hub for tenants. Process rent payments instantly, sign digital lease agreements, and request concierge services with one click.
                  </p>
                  <ul className="flex flex-wrap gap-2 pt-2">
                    {['Digital Payments', 'Mobile Access', 'Direct Support'].map(tag => (
                      <li key={tag} className="text-[10px] px-2 py-1 rounded bg-white/5 border border-white/5 text-gray-500 font-bold uppercase">{tag}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-24 pb-12 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
              <div className="col-span-2">
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-8 h-8 bg-white dark:bg-[#121212] rounded-lg flex items-center justify-center">
                    <Home className="text-black w-5 h-5" />
                  </div>
                  <span className="text-xl font-bold tracking-tight">EstateFlow</span>
                </div>
                <h3 className="text-3xl md:text-5xl font-bold tracking-tighter mb-8 max-w-sm">
                  Ready to optimize <br /> your operations?
                </h3>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white dark:bg-[#121212] hover:text-black cursor-pointer transition-all">
                    <Search className="w-4 h-4" />
                  </div>
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white dark:bg-[#121212] hover:text-black cursor-pointer transition-all">
                    <Menu className="w-4 h-4" />
                  </div>
                </div>
              </div>
              
          

              <div className="col-span-2">
                <h5 className="font-bold mb-6 text-sm uppercase tracking-widest text-gray-500">Platform Insights</h5>
                <p className="text-gray-400 text-sm mb-6 max-w-sm">Stay updated with the latest in property technology and platform updates.</p>
                <div className="relative max-w-md">
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-sm focus:outline-none focus:border-white transition-all focus:ring-4 focus:ring-white/5"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white dark:bg-[#121212] rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs text-gray-500 font-medium">© 2026 EstateFlow Real Estate. All rights reserved.</p>
              <div className="flex gap-8 text-xs text-gray-500 font-medium">
                <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
