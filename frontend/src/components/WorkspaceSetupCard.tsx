"use client";

import { useState } from "react";
import { useDashboard } from "./DashboardContext";
import { useGlobal } from "@/app/context/GlobalContext";
import { AlertTriangle, Sparkles, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function WorkspaceSetupCard() {
  const { userProfile } = useDashboard();
  const { setIsConfigured } = useGlobal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyUrl, setCompanyUrl] = useState("");

  const handleSave = async () => {
    if (!companyUrl) return;
    setIsSubmitting(true);
    try {
      // POST /api/v1/context/initialize
      const res = await fetch("http://localhost:8000/api/v1/context/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_url: companyUrl
        })
      });
      if (res.ok) {
        localStorage.setItem("subscio_configured", "true");
        setIsConfigured(true);
      } else {
        alert("Failed to save configuration.");
      }
    } catch (e) {
      alert("Network Error: Could not reach FastAPI backend.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-alabaster p-8 overflow-y-auto">
      
      <div className="max-w-3xl mx-auto w-full">
        {/* Warning Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-8 flex items-start gap-4">
          <AlertTriangle size={20} className="text-amber-600 mt-0.5 shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-amber-800 mb-1">Configuration Required</h3>
            <p className="text-xs text-amber-700 leading-relaxed">
              Workspace settings must be completed before accessing the Pipeline or Compliance Ledger views. Your Signals Engine needs a target profile to begin harvesting data.
            </p>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#162127]/70 border border-[#CA9C68]/20 shadow-sm rounded-md overflow-hidden"
        >
          <div className="p-6 border-b border-[#CA9C68]/20 bg-[#0C1519]/50 flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 text-white rounded-md flex items-center justify-center shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold uppercase tracking-wider text-[#F8FAFC]">Initialize Discovery Engine</h2>
              <p className="text-xs font-medium text-gray-400">Provide your company URL to start the AI discovery engine.</p>
            </div>
          </div>

          <div className="p-6 space-y-8">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F8FAFC] mb-2">
                <Globe size={14} className="text-blue-600" />
                Company URL
              </label>
              <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                Agent 1 will autonomously scrape your company's website to extract your business footprint, determine your ICP, and discover target companies.
              </p>
              <input 
                type="url"
                value={companyUrl}
                onChange={(e) => setCompanyUrl(e.target.value)}
                placeholder="https://yourcompany.com"
                className="w-full px-4 py-3 border border-[#CA9C68]/20 rounded-md text-sm text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium bg-transparent"
              />
            </div>
          </div>

          <div className="p-4 border-t border-[#CA9C68]/20 bg-[#0C1519]/50 flex justify-end">
            <button 
              onClick={handleSave}
              disabled={isSubmitting || !companyUrl}
              className="bg-slate-900 text-white rounded-md px-6 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Initializing Engine..." : "Start Discovery"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
