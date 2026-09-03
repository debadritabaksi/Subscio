"use client";

import { useState } from "react";
import { Activity, Bell, Search, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDashboard, type DashboardTab } from "./DashboardContext";

const tabs: { key: DashboardTab; label: string }[] = [
  { key: "command", label: "Command Center" },
  { key: "pipeline", label: "Pipeline" },
  { key: "ledger", label: "Compliance Ledger" },
];

export default function Navbar() {
  const router = useRouter();
  const { activeTab, setActiveTab, userProfile } = useDashboard();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const displayName = userProfile?.name || "Configure Workspace";
  const displayEmail = userProfile?.email || "No email configured";

  const handleLogout = () => {
    localStorage.removeItem("subscio_auth");
    localStorage.removeItem("subscio_profile");
    localStorage.removeItem("subscio_token");
    router.push("/login");
  };

  return (
    <nav className="border-b border-[#CA9C68]/20 bg-[#162127]/80 backdrop-blur-md flex items-center justify-between px-6 py-3 sticky top-0 z-50">
      
      {/* ── Left: Branding ────────────────────────────────────────────── */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-red-50 text-red-700 rounded-md flex items-center justify-center">
            <Activity size={16} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight uppercase leading-none text-[#F8FAFC]">Subscio</h1>
            <span className="text-[9px] font-bold text-[#CA9C68] tracking-widest uppercase">Signals Engine</span>
          </div>
        </div>

        {/* ── Navigation Tabs (Local State — No Page Reload) ──────────── */}
        <div className="hidden md:flex items-center gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`text-xs font-bold uppercase tracking-wider pb-1 border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "text-[#CA9C68] border-[#CA9C68]"
                  : "text-gray-400 border-transparent hover:text-[#F8FAFC]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Right: Search & Profile ───────────────────────────────────── */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="hidden lg:flex items-center border border-[#CA9C68]/20 rounded-md bg-[#0C1519]/50 px-3 py-1.5 w-64">
          <Search size={14} className="text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search accounts or signals..." 
            className="bg-transparent border-none outline-none text-xs w-full text-[#F8FAFC] placeholder:text-gray-500 font-sans"
          />
        </div>

        {/* System Status (Compact) */}
        <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 rounded-md text-[10px] font-bold uppercase tracking-wider text-green-700">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          System Live
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 border-l border-[#CA9C68]/20 pl-4 ml-2">
          <button className="w-8 h-8 rounded-md border border-[#CA9C68]/20 bg-[#0C1519]/50 flex items-center justify-center hover:bg-[#CA9C68]/10 transition-colors">
            <Bell size={16} className="text-gray-400" />
          </button>
          <button className="w-8 h-8 rounded-md border border-[#CA9C68]/20 bg-[#0C1519]/50 flex items-center justify-center hover:bg-[#CA9C68]/10 transition-colors">
            <Settings size={16} className="text-gray-400" />
          </button>
          
          {/* User Menu / Avatar */}
          <div className="relative z-50">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-8 h-8 rounded-full bg-[#CA9C68]/10 text-[#CA9C68] border border-[#CA9C68]/20 flex items-center justify-center ml-2 relative z-50"
            >
              <User size={16} />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#162127] border border-[#CA9C68]/20 shadow-2xl rounded-md z-[100]">
                <div className="p-3 border-b border-[#CA9C68]/20">
                  <p className="text-sm font-bold text-[#F8FAFC]">{displayName}</p>
                  <p className="text-xs text-gray-400">{displayEmail}</p>
                </div>
                <div className="p-1">
                  <button 
                    onClick={() => { window.open('/settings', '_blank'); setIsMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-gray-300 hover:bg-[#CA9C68]/10 hover:text-[#CA9C68] rounded-md transition-colors"
                  >
                    Edit Profile
                  </button>
                  <button 
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-gray-300 hover:bg-[#CA9C68]/10 hover:text-[#CA9C68] rounded-md transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </nav>
  );
}
