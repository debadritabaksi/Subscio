"use client";

import { motion } from "framer-motion";
import { X, Send, ShieldAlert } from "lucide-react";

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

export default function PitchApprovalModal({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  
  const handleApprove = () => {
    // Basic extract from title since no explicit email field, default to founders@company
    const companyClean = lead.company_name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const email = `founders@${companyClean}.com`;
    const subject = `Partnership Opportunity`;
    const body = lead.pitch_draft || "";
    
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // In a real app we would hit backend to update corsair_status to "authorized"
    onClose();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex justify-end"
    >
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200"
      >
        <div className="p-6 border-b border-[#CA9C68]/20 flex items-center justify-between bg-[#0C1519]/50">
          <div>
            <h3 className="text-lg font-bold text-[#F8FAFC] uppercase tracking-tight">Corsair Security Gateway</h3>
            <p className="text-xs font-medium text-gray-400 flex items-center gap-1 mt-1">
              <ShieldAlert size={12} className="text-[#CA9C68]" /> Pending Human Approval
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#CA9C68]/10 rounded-md transition-colors text-gray-400">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto bg-[#162127]/80 backdrop-blur-xl">
          <div className="mb-6">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#CA9C68] mb-1 block">Target Account</label>
            <div className="text-sm font-semibold text-[#F8FAFC]">{lead.company_name}</div>
          </div>
          
          <div className="mb-6">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#CA9C68] mb-1 block">Context Signal</label>
            <div className="text-sm text-gray-300 bg-[#0C1519]/50 p-3 rounded-md border border-[#CA9C68]/20">
              {lead.title}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#CA9C68] mb-2 block">AI Drafted Pitch</label>
            <textarea 
              readOnly
              className="w-full h-64 p-4 text-sm text-[#F8FAFC] bg-[#0C1519]/50 border border-[#CA9C68]/20 rounded-md focus:outline-none focus:ring-1 focus:ring-[#CA9C68] resize-none font-medium leading-relaxed shadow-inner"
              value={lead.pitch_draft || "No draft available."}
            />
          </div>
        </div>

        <div className="p-6 border-t border-[#CA9C68]/20 bg-[#0C1519]/50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-white transition-colors">
            Cancel
          </button>
          <button onClick={handleApprove} className="px-6 py-2 bg-gradient-to-r from-[#CA9C68] to-[#B88029] text-black text-sm font-bold rounded-md hover:brightness-110 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(202,156,104,0.3)]">
            <Send size={16} /> Approve & Send
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
