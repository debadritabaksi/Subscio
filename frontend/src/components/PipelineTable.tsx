"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, MoreHorizontal, Mail, ShieldAlert, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import PitchApprovalModal from "./PitchApprovalModal";

const API_BASE = "http://localhost:8000";

interface Lead {
  id: string;
  company_name: string;
  title: string;
  intent_stage: string;
  quality_score: number;
  pitch_draft: string | null;
  corsair_status: string;
  created_at: string;
}

const stageColors: Record<string, string> = {
  "purchase_ready": "bg-red-100 text-red-800 border-red-200",
  "consideration": "bg-amber-100 text-amber-800 border-amber-200",
  "awareness": "bg-blue-100 text-blue-800 border-blue-200",
  "targeting": "bg-purple-100 text-purple-800 border-purple-200",
};

const stageLabels: Record<string, string> = {
  "purchase_ready": "Purchase Ready",
  "consideration": "Consideration",
  "awareness": "Awareness",
  "targeting": "Targeting",
};

export default function PipelineTable() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    async function fetchLeads() {
      try {
        const res = await fetch(`${API_BASE}/api/v1/analytics/summary`);
        if (res.ok) {
          const data = await res.json();
          setLeads(data.pipeline);
        }
      } catch (e) {
        console.error("Failed to fetch leads", e);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLeads();
    const interval = setInterval(fetchLeads, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  // SAFTEY NET: Ensure leads is always treated as an array to prevent .filter() crashes
  const safeLeads = Array.isArray(leads) ? leads : [];

  const filteredLeads = safeLeads.filter(l => {
    // Also protect against undefined company_name or title from the database
    const company = l.company_name || "";
    const title = l.title || "";
    return company.toLowerCase().includes(search.toLowerCase()) ||
      title.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#162127]/70">
      {/* Toolbar */}
      <div className="p-4 border-b border-[#CA9C68]/20 flex items-center justify-between bg-[#0C1519]/50">
        <div className="relative w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search accounts or signals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#162127]/70 border border-[#CA9C68]/20 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 bg-[#162127]/70 border border-[#CA9C68]/20 rounded-md text-sm font-medium text-gray-300 hover:bg-[#0C1519]/50 transition-colors">
          <Filter size={16} /> Filter
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-slate-400">
            <Loader2 className="animate-spin" />
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center">
            <ShieldAlert size={32} className="mb-4 text-slate-300" />
            <p className="text-sm">No leads in your pipeline yet.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[#162127]/70 shadow-sm z-10">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-[#CA9C68]/20">Company</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-[#CA9C68]/20">Intent Stage</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-[#CA9C68]/20">Quality Score</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-[#CA9C68]/20">Recent Signal</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-[#CA9C68]/20">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#CA9C68]/10">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-[#0C1519]/70 hover:border-[#CA9C68]/50 border border-transparent transition-colors group cursor-pointer" onClick={() => lead.corsair_status === 'pending_approval' && setSelectedLead(lead)}>
                  <td className="px-6 py-4">
                    <span className="font-bold text-[#F8FAFC]">{lead.company_name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${stageColors[lead.intent_stage.toLowerCase()] || "bg-[#0C1519]/80 text-[#F8FAFC]"}`}>
                      {stageLabels[lead.intent_stage.toLowerCase()] || lead.intent_stage}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-[#162127] border border-[#CA9C68]/20 rounded-full h-1.5 max-w-[60px]">
                        <div className={`h-1.5 rounded-full ${lead.quality_score >= 80 ? 'bg-[#CA9C68] shadow-[0_0_8px_rgba(202,156,104,0.5)]' : lead.quality_score >= 50 ? 'bg-amber-500' : 'bg-blue-500'}`} style={{ width: `${lead.quality_score}%` }}></div>
                      </div>
                      <span className={`text-sm font-bold ${lead.quality_score >= 80 ? 'text-[#CA9C68]' : 'text-gray-300'}`}>{lead.quality_score}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-gray-400 truncate max-w-[250px]" title={lead.title}>{lead.title}</p>
                  </td>
                  <td className="px-6 py-4">
                    {lead.corsair_status === "pending_approval" ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedLead(lead); }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-md hover:bg-slate-800 transition-colors"
                      >
                        <Mail size={14} /> Review Pitch
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                        <CheckCircle2 size={14} /> Sent
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Phase 5: Pitch Approval Drawer */}
      <AnimatePresence>
        {selectedLead && (
          <PitchApprovalModal
            lead={selectedLead}
            onClose={() => setSelectedLead(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

