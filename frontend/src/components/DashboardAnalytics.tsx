"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Target, Zap, TrendingUp, Users, Loader2 } from "lucide-react";

const API_BASE = "http://localhost:8000";

interface AnalyticsData {
  funnel_distribution: {
    targeting: number;
    awareness: number;
    consideration: number;
    purchase_ready: number;
  };
  total_signals_harvested: number;
}

export default function DashboardAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch(`${API_BASE}/api/v1/analytics/summary`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error("Failed to fetch analytics", e);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 15000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-alabaster">
        <Loader2 className="animate-spin text-slate-400" />
      </div>
    );
  }

  const funnel = data?.funnel_distribution || { targeting: 0, awareness: 0, consideration: 0, purchase_ready: 0 };
  const maxVal = Math.max(...Object.values(funnel), 1); // Avoid division by zero

  return (
    <div className="flex-1 overflow-y-auto bg-[#0C1519]/50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-tight text-[#F8FAFC]">Intelligence Dashboard</h2>
          <p className="text-sm font-medium text-slate-500">Real-time macro analysis of target market movements.</p>
        </div>

        {/* Bento Grid Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#162127]/70 border border-[#CA9C68]/20 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-md flex items-center justify-center">
                <Activity size={20} />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Signals Harvested</h3>
            </div>
            <div className="text-4xl font-black text-[#F8FAFC] tracking-tighter">{data?.total_signals_harvested || 0}</div>
            <div className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-2">
              <TrendingUp size={14} /> +12% this week
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#162127]/70 border border-[#CA9C68]/20 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-50 text-red-600 rounded-md flex items-center justify-center">
                <Target size={20} />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Purchase Ready Leads</h3>
            </div>
            <div className="text-4xl font-black text-[#F8FAFC] tracking-tighter">{funnel.purchase_ready}</div>
            <div className="text-xs font-medium text-slate-500 mt-2">Requires immediate action</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#162127]/70 border border-[#CA9C68]/20 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-md flex items-center justify-center">
                <Users size={20} />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Pipeline</h3>
            </div>
            <div className="text-4xl font-black text-[#F8FAFC] tracking-tighter">
              {funnel.awareness + funnel.consideration + funnel.purchase_ready}
            </div>
            <div className="text-xs font-medium text-slate-500 mt-2">Total engaged targets</div>
          </motion.div>
        </div>

        {/* Funnel Distribution Chart */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#162127]/70 border border-[#CA9C68]/20 rounded-xl p-8 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#F8FAFC] mb-8">Lead Progression Funnel</h3>
          <div className="space-y-6">
            
            <div className="relative">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                <span>Targeting (Cold)</span>
                <span>{funnel.targeting}</span>
              </div>
              <div className="w-full h-3 bg-[#0C1519]/80 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(funnel.targeting / maxVal) * 100}%` }} className="h-full bg-purple-500 rounded-full" />
              </div>
            </div>

            <div className="relative">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                <span>Awareness (Signals Detected)</span>
                <span>{funnel.awareness}</span>
              </div>
              <div className="w-full h-3 bg-[#0C1519]/80 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(funnel.awareness / maxVal) * 100}%` }} className="h-full bg-blue-500 rounded-full" />
              </div>
            </div>

            <div className="relative">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                <span>Consideration (Warm)</span>
                <span>{funnel.consideration}</span>
              </div>
              <div className="w-full h-3 bg-[#0C1519]/80 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(funnel.consideration / maxVal) * 100}%` }} className="h-full bg-amber-500 rounded-full" />
              </div>
            </div>

            <div className="relative">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                <span>Purchase Ready (Hot)</span>
                <span>{funnel.purchase_ready}</span>
              </div>
              <div className="w-full h-3 bg-[#0C1519]/80 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(funnel.purchase_ready / maxVal) * 100}%` }} className="h-full bg-red-500 rounded-full" />
              </div>
            </div>

          </div>
        </motion.div>

        {/* Heatmaps Placeholder */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-slate-900 rounded-xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500 via-slate-900 to-slate-900"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold uppercase tracking-tight mb-2 flex items-center gap-2"><Zap size={18} className="text-yellow-400" /> Sector Heatmaps</h3>
              <p className="text-sm text-slate-400">Activity density across Beauty, Tech, and Wellness sectors.</p>
            </div>
            <button className="px-4 py-2 bg-[#162127]/70/10 hover:bg-[#162127]/70/20 transition-colors rounded-md text-xs font-bold uppercase tracking-wider">
              Expand View
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

