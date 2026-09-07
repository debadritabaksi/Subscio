"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radio,
  GitBranch,
  Rss,
  Webhook,
  Clock,
  Briefcase,
  DollarSign,
  Code,
  Building2,
  ExternalLink,
  MoreVertical,
  Activity,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { useDashboard } from "./DashboardContext";

const API_BASE = "http://localhost:8000";

/* ── Types ────────────────────────────────────────────────────── */
interface BackendSignal {
  id: string;
  org_id: string;
  source: string;
  category: string;
  title: string;
  body: string;
  company_name: string;
  dedup_hash: string;
  intent_score: number | null;
  intent_stage: string;
  created_at: string;
}

type SignalCategory = "funding" | "hiring" | "tech_stack" | "expansion" | "partnership" | "creator";

interface DisplaySignal {
  id: string;
  timestamp: string;
  company: string;
  title: string;
  intent: string;
  category: SignalCategory;
  source: string;
  score: number;
}

/* ── UI Helpers ───────────────────────────────────────────────── */
function formatTime(isoString: string): string {
  try {
    return new Date(isoString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "—";
  }
}

function formatIntentStage(stage: string): string {
  const formatted = stage.replace(/_/g, " ").toLowerCase();
  return formatted.replace(/\b\w/g, l => l.toUpperCase());
}

function mapCategoryToIntent(category: string): string {
  const mapping: Record<string, string> = {
    funding: "Purchase Ready",
    hiring: "Consideration",
    tech_stack: "Awareness",
    expansion: "Targeting",
    partnership: "Consideration",
    creator: "Awareness",
  };
  return mapping[category] || "Awareness";
}

const categoryDisplayLabels: Record<string, string> = {
  funding: "Funding",
  hiring: "Hiring",
  tech_stack: "Dev Activity",
  expansion: "Expansion",
  partnership: "Partnership",
  creator: "Creator",
};

const intentDots: Record<string, string> = {
  "Purchase Ready": "bg-red-500",
  "Consideration": "bg-amber-500",
  "Awareness": "bg-blue-500",
  "Targeting": "bg-purple-500",
};

const categoryIcons: Record<string, React.ReactNode> = {
  funding: <DollarSign size={12} strokeWidth={2.5} />,
  hiring: <Briefcase size={12} strokeWidth={2.5} />,
  tech_stack: <Code size={12} strokeWidth={2.5} />,
  expansion: <Building2 size={12} strokeWidth={2.5} />,
  partnership: <Activity size={12} strokeWidth={2.5} />,
  creator: <Rss size={12} strokeWidth={2.5} />,
};

const sourceIcons: Record<string, React.ReactNode> = {
  github_api: <GitBranch size={12} strokeWidth={2.5} />,
  rss_feed: <Rss size={12} strokeWidth={2.5} />,
  webhook_simulate: <Webhook size={12} strokeWidth={2.5} />,
  ats_public: <Briefcase size={12} strokeWidth={2.5} />,
  historical_backfill: <Activity size={12} strokeWidth={2.5} />,
};

function mapBackendSignal(sig: BackendSignal): DisplaySignal {
  let intentStr = "Awareness";
  if (sig.intent_stage && sig.intent_stage.trim()) {
    intentStr = formatIntentStage(sig.intent_stage);
  } else if (sig.intent_score !== null && sig.intent_score !== undefined && sig.intent_score > 0) {
    if (sig.intent_score >= 85) intentStr = "Purchase Ready";
    else if (sig.intent_score >= 70) intentStr = "Consideration";
    else if (sig.intent_score >= 40) intentStr = "Awareness";
    else intentStr = "Targeting";
  } else {
    intentStr = mapCategoryToIntent(sig.category);
  }

  return {
    id: sig.id,
    timestamp: formatTime(sig.created_at),
    company: sig.company_name || "Unknown",
    title: sig.title,
    intent: intentStr,
    category: sig.category as SignalCategory,
    source: sig.source,
    score: sig.intent_score ?? 0,
  };
}

/* ── Component ────────────────────────────────────────────────── */
export default function LiveRadarTicker() {
  const { userProfile } = useDashboard();
  const [signals, setSignals] = useState<DisplaySignal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLog, setShowLog] = useState(false);

  const hasProfile = userProfile && userProfile.company;

  const fetchSignals = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/webhooks/signals`);
      if (res.ok) {
        const data: BackendSignal[] = await res.json();
        setSignals(data.map(mapBackendSignal));
      }
    } catch {
      // Backend unreachable
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSignals();
    // Poll every 5 seconds for new signals
    const interval = setInterval(fetchSignals, 5000);
    return () => clearInterval(interval);
  }, [fetchSignals]);

  return (
    <aside className="w-80 flex-shrink-0 bg-alabaster border-r border-[#CA9C68]/20 flex flex-col h-[calc(100vh-56px-200px)] md:h-auto overflow-hidden">

      {/* Header */}
      <div className="p-4 border-b border-[#CA9C68]/20 bg-[#162127]/70 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="relative flex h-3 w-3 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
          </div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#F8FAFC]">Live Signals</h2>
        </div>
        <div className="text-[10px] font-bold text-gray-500 bg-[#0C1519]/50 border border-[#CA9C68]/20 px-2 py-0.5 rounded-md">
          Today: <span className="text-blue-600">{signals.length}</span>
        </div>
      </div>

      {/* Ticker Feed */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 relative">
        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-gray-500">
            <Loader2 size={18} className="animate-spin mr-2" />
            <span className="text-xs font-medium">Connecting to backend...</span>
          </div>
        ) : signals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <AlertTriangle size={24} className="text-amber-400 mb-3" />
            <p className="text-xs text-gray-500 leading-relaxed">
              {hasProfile
                ? "No signals ingested yet. Simulate a signal from the Command Canvas."
                : "⚠️ No company context configured yet. Please complete registration to feed target keywords into your Signals Harvesting Engine."}
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {signals.map((signal) => (
              <motion.div
                key={signal.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="mb-3"
              >
                <div className="bg-[#162127]/70 border border-[#CA9C68]/20 rounded-md p-3 hover:bg-[#0C1519]/50 transition-colors relative group cursor-pointer shadow-sm">

                  {/* Top Row: Time & Source */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 tracking-wider uppercase">
                      <Clock size={10} />
                      {signal.timestamp}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-gray-500" title={signal.source}>
                        {sourceIcons[signal.source] || <Radio size={12} />}
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-[#F8FAFC]">
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Company & Title */}
                  <div className="mb-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${intentDots[signal.intent] || "bg-slate-400"}`} title={`Intent: ${signal.intent}`}></div>
                      <h3 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wide">{signal.company}</h3>
                    </div>
                    <p className="text-xs text-gray-400 font-medium leading-snug line-clamp-2">
                      {signal.title}
                    </p>
                  </div>

                  {/* Bottom Row: Category & Score */}
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#CA9C68]/20">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-[#0C1519]/50 border border-[#CA9C68]/20 px-1.5 py-0.5 rounded-md">
                      {categoryIcons[signal.category] || <Radio size={12} />}
                      <span className="uppercase">{categoryDisplayLabels[signal.category] || signal.category}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Score</span>
                      <span className={`text-[11px] font-black ${
                        signal.score > 80 ? "text-red-600" :
                        signal.score > 60 ? "text-blue-600" :
                        signal.score === 0 ? "text-gray-500" : "text-gray-400"
                      }`}>
                        {signal.score === 0 ? "—" : signal.score}
                      </span>
                    </div>
                  </div>

                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer / Action */}
      <div className="p-3 border-t border-[#CA9C68]/20 bg-[#162127]/70 z-10">
        <button
          onClick={() => setShowLog(!showLog)}
          className="w-full border border-[#CA9C68]/20 bg-[#162127]/70 hover:bg-[#0C1519]/50 rounded-md text-[#F8FAFC] flex items-center justify-center gap-2 text-xs py-2 font-medium transition-colors"
        >
          <ExternalLink size={12} /> {showLog ? "Close Signal Log" : "Open Signal Log"}
        </button>
        {showLog && (
          <div className="mt-2 p-3 bg-[#0C1519]/50 border border-[#CA9C68]/20 rounded-md max-h-40 overflow-auto">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Raw Signal IDs</p>
            {signals.length === 0 ? (
              <p className="text-xs text-gray-500">No signals to display.</p>
            ) : (
              <ul className="space-y-1">
                {signals.map((s) => (
                  <li key={s.id} className="text-[10px] font-mono text-gray-400 truncate">{s.id} — {s.company}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

    </aside>
  );
}

