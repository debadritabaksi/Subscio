"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Target,
  BarChart3,
  Cpu,
  Filter,
  Download,
  MoreHorizontal,
  ArrowUpRight,
  ShieldAlert,
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  Info,
  AlertTriangle,
  Loader2,
  RefreshCw
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

interface PipelineRow {
  id: string;
  company: string;
  intent: string;
  score: number;
  source: string;
  lastActive: string;
  status: string;
}

/* ── Helpers ──────────────────────────────────────────────────── */
function generateDedupHash(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

function formatTimeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min${mins > 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

// Legacy fallback mapping, just in case
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

function formatIntentStage(stage: string): string {
  const formatted = stage.replace(/_/g, " ").toLowerCase();
  return formatted.replace(/\b\w/g, l => l.toUpperCase());
}

function mapSourceLabel(source: string): string {
  const mapping: Record<string, string> = {
    github_api: "GitHub",
    rss_feed: "RSS Feed",
    webhook_simulate: "Webhook",
    ats_public: "ATS Tracker",
    historical_backfill: "Backfill",
  };
  return mapping[source] || source;
}

function deriveStatus(intentScore: number | null): string {
  if (intentScore === null || intentScore === 0) return "Enriching";
  if (intentScore >= 80) return "Action Required";
  if (intentScore >= 50) return "Monitoring";
  return "Archived";
}

function mapBackendSignal(sig: BackendSignal): PipelineRow {
  let intentDisplay = "Awareness";
  if (sig.intent_stage && sig.intent_stage.trim()) {
    intentDisplay = formatIntentStage(sig.intent_stage);
  } else if (sig.intent_score !== null && sig.intent_score !== undefined && sig.intent_score > 0) {
    if (sig.intent_score >= 85) intentDisplay = "Purchase Ready";
    else if (sig.intent_score >= 70) intentDisplay = "Consideration";
    else if (sig.intent_score >= 40) intentDisplay = "Awareness";
    else intentDisplay = "Targeting";
  } else {
    intentDisplay = mapCategoryToIntent(sig.category);
  }

  return {
    id: sig.id,
    company: sig.company_name || "Unknown Company",
    intent: intentDisplay,
    score: sig.intent_score ?? 0,
    source: mapSourceLabel(sig.source),
    lastActive: formatTimeAgo(sig.created_at),
    status: deriveStatus(sig.intent_score),
  };
}

const intentStyles: Record<string, string> = {
  "Purchase Ready": "bg-red-50 text-red-700 border-red-200",
  "Consideration": "bg-amber-50 text-amber-700 border-amber-200",
  "Awareness": "bg-blue-50 text-blue-700 border-blue-200",
  "Targeting": "bg-purple-50 text-purple-700 border-purple-200",
};

export default function CommandCanvas() {
  const { userProfile, setActiveTab } = useDashboard();
  const [signals, setSignals] = useState<PipelineRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isNewViewOpen, setIsNewViewOpen] = useState(false);

  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  /* ── Fetch signals from backend ────────────────────────────── */
  const fetchSignals = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/webhooks/signals`);
      if (res.ok) {
        const data: BackendSignal[] = await res.json();
        setSignals(data.map(mapBackendSignal));
      }
    } catch {
      // Backend unreachable — leave state as-is
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSignals();
  }, [fetchSignals]);

  /* ── Simulate signal handler ───────────────────────────────── */
  const handleSimulate = async (source: string, category: string, title: string) => {
    setIsSimulating(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/webhooks/simulate-signal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source,
          category,
          title,
          body: `Simulated ${category} signal from dashboard`,
          company_name: userProfile?.company || "Demo Company",
          org_id: "demo-org",
          dedup_hash: generateDedupHash(),
        }),
      });

      if (res.ok) {
        showNotification(`✓ Signal queued — ${category} event dispatched`, "success");
        // Re-fetch signals to update the table
        await fetchSignals();
      } else {
        const errorData = await res.json();
        showNotification(errorData.detail?.message || "Failed to simulate signal.", "error");
      }
    } catch {
      showNotification("Network error. Is the backend running at localhost:8000?", "error");
    } finally {
      setIsSimulating(false);
    }
  };

  /* ── Refresh Feed handler ─────────────────────────────────── */
  const handleRefreshFeed = async () => {
    setIsRefreshing(true);
    showNotification("Pipeline triggered. Fresh accounts and signals are being scraped...", "info");
    try {
      const token = localStorage.getItem("subscio_token");
      const profileStr = localStorage.getItem("subscio_profile");
      let orgId = "default-tenant";
      if (profileStr) {
        try { orgId = JSON.parse(profileStr).org_id || orgId; } catch {}
      }
      
      await fetch(`${API_BASE}/api/v1/context/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
      });
      
      // Poll for new data every 4 seconds for 24 seconds
      let polls = 0;
      const pollInterval = setInterval(async () => {
        polls++;
        await fetchSignals();
        if (polls >= 6) {
          clearInterval(pollInterval);
          setIsRefreshing(false);
          showNotification("Feed refreshed with latest signals.", "success");
        }
      }, 4000);
    } catch {
      showNotification("Failed to trigger pipeline refresh.", "error");
      setIsRefreshing(false);
    }
  };

  const [minScore, setMinScore] = useState(0);

  /* ── Derived data ──────────────────────────────────────────── */
  const filteredData = signals.filter(item =>
    (item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.intent.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (activeFilter === "All" || item.intent === activeFilter) &&
    item.score >= minScore
  );

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const avgScore = signals.length > 0 ? Math.round(signals.reduce((a, b) => a + b.score, 0) / signals.length) : 0;

  /* ── No company profile empty state ────────────────────────── */
  const hasProfile = userProfile && userProfile.company;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#0C1519] relative">

      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className={`absolute top-4 left-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-md shadow-md border text-sm font-medium ${notification.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' :
                notification.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' :
                  'bg-blue-50 text-blue-700 border-blue-200'
              }`}
          >
            {notification.type === 'success' && <CheckCircle2 size={16} />}
            {notification.type === 'error' && <XCircle size={16} />}
            {notification.type === 'info' && <Info size={16} />}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Top Toolbar (Dense) ──────────────────────────────────── */}
      <header className="px-6 py-4 border-b border-[#CA9C68]/20 bg-[#162127]/70 flex flex-wrap items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-50 text-blue-700 flex items-center justify-center rounded-md">
            <Layers size={16} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#F8FAFC] leading-none mb-1">
              Command Canvas
            </h2>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Intelligence Workspace
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Stats Bar / Interactive Filters */}
          <div className="hidden lg:flex items-center gap-4 px-4 py-1.5 border border-[#CA9C68]/20 rounded-md bg-[#0C1519]/50 mr-4">
            <button
              onClick={() => setActiveFilter(activeFilter === "Purchase Ready" ? "All" : "Purchase Ready")}
              className={`flex items-center gap-2 px-2 py-1 rounded-md transition-all ${activeFilter === "Purchase Ready" ? "bg-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]" : "hover:bg-[#CA9C68]/10"}`}
            >
              <Target size={14} className="text-red-500" />
              <span className="text-xs font-bold text-[#F8FAFC]">Purchase Ready</span>
            </button>
            <div className="w-px h-4 bg-[#CA9C68]/30"></div>
            <button
              onClick={() => setActiveFilter(activeFilter === "Consideration" ? "All" : "Consideration")}
              className={`flex items-center gap-2 px-2 py-1 rounded-md transition-all ${activeFilter === "Consideration" ? "bg-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]" : "hover:bg-[#CA9C68]/10"}`}
            >
              <BarChart3 size={14} className="text-amber-500" />
              <span className="text-xs font-bold text-[#F8FAFC]">Consideration</span>
            </button>
            <div className="w-px h-4 bg-[#CA9C68]/30"></div>
            <div className="flex items-center gap-2 px-2 py-1">
              <Cpu size={14} className="text-purple-500" />
              <span className="text-xs font-bold text-[#F8FAFC]">{signals.length} <span className="text-gray-500 font-normal ml-1">Processed</span></span>
            </div>
          </div>

          <button onClick={() => setIsFiltersOpen(true)} className="bg-[#162127]/70 text-[#F8FAFC] border border-[#CA9C68]/20 hover:bg-[#0C1519]/50 rounded-md px-3 py-1.5 flex items-center gap-1 font-medium transition-colors text-xs uppercase tracking-wider">
            <Filter size={14} /> <span className="hidden sm:inline">Filters</span>
          </button>
          <button 
            onClick={handleRefreshFeed}
            disabled={isRefreshing}
            className={`border border-[#CA9C68]/20 rounded-md px-3 py-1.5 flex items-center gap-1.5 font-bold transition-all text-xs uppercase tracking-wider ${isRefreshing ? 'bg-[#CA9C68]/20 text-[#CA9C68] cursor-wait' : 'bg-[#162127]/70 text-[#F8FAFC] hover:bg-[#CA9C68]/10 hover:text-[#CA9C68]'}`}
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">{isRefreshing ? 'Refreshing...' : 'Refresh Feed'}</span>
          </button>
          <button onClick={() => setIsNewViewOpen(true)} className="bg-gradient-to-r from-[#CA9C68] to-[#B88029] text-black hover:brightness-110 rounded-md px-3 py-1.5 flex items-center gap-1 font-bold transition-colors text-xs uppercase tracking-wider">
            <Plus size={14} /> <span className="hidden sm:inline">New View</span>
          </button>
        </div>
      </header>

      {/* ── Main Workspace Area ──────────────────────────────────── */}
      <main className="flex-1 overflow-auto p-6 relative">

        {/* Filters Sidebar */}
        <AnimatePresence>
          {isFiltersOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="absolute top-0 right-0 h-full w-80 bg-[#0C1519]/95 backdrop-blur-xl border-l border-[#CA9C68]/30 z-40 p-6 shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Advanced Filters</h3>
                <button onClick={() => setIsFiltersOpen(false)} className="text-gray-400 hover:text-white">
                  <XCircle size={20} />
                </button>
              </div>
              <div className="flex-1 space-y-6">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Intent Stage</label>
                  <select
                    value={activeFilter}
                    onChange={(e) => setActiveFilter(e.target.value)}
                    className="w-full bg-[#162127]/70 border border-[#CA9C68]/20 text-white text-sm rounded p-2 outline-none focus:border-[#CA9C68]"
                  >
                    <option value="All">All Stages</option>
                    <option value="Purchase Ready">Purchase Ready</option>
                    <option value="Consideration">Consideration</option>
                    <option value="Awareness">Awareness</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Score Range</label>
                  <input type="range" className="w-full accent-[#CA9C68]" min="0" max="100" value={minScore} onChange={(e) => setMinScore(Number(e.target.value))} />
                  <div className="flex justify-between text-xs text-gray-500 mt-1"><span>0</span><span>Min: {minScore}</span><span>100</span></div>
                </div>
              </div>
              <button onClick={() => setIsFiltersOpen(false)} className="w-full bg-gradient-to-r from-[#CA9C68] to-[#B88029] text-black font-bold uppercase py-3 rounded text-sm tracking-wider">
                Apply Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* New View Modal */}
        <AnimatePresence>
          {isNewViewOpen && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsNewViewOpen(false)}></div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-[#162127] border border-[#CA9C68]/30 shadow-2xl rounded-xl p-6 w-full max-w-md"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">Create Custom View</h3>
                  <button onClick={() => setIsNewViewOpen(false)} className="text-gray-400 hover:text-white">
                    <XCircle size={20} />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">View Name</label>
                    <input type="text" placeholder="e.g. Enterprise Target Accounts" className="w-full bg-[#0C1519]/50 border border-[#CA9C68]/20 text-white text-sm rounded p-2 outline-none focus:border-[#CA9C68]" />
                  </div>
                  <button onClick={() => { showNotification("Custom view created successfully.", "success"); setIsNewViewOpen(false); }} className="w-full bg-gradient-to-r from-[#CA9C68] to-[#B88029] text-black font-bold uppercase py-3 rounded text-sm tracking-wider">
                    Save View
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="w-full flex flex-col gap-8 mx-auto px-6 pb-6">

          {/* Onboarding Empty State */}
          {!hasProfile && signals.length === 0 && !isLoading && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-6 flex items-start gap-4">
              <AlertTriangle size={20} className="text-amber-600 mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-amber-800 mb-1">No company context configured yet</h3>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Please complete registration to feed target keywords into your Signals Harvesting Engine. Your pipeline will populate once signals are ingested.
                </p>
              </div>
            </div>
          )}

          {/* Quick Actions / Alerts */}
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-[#162127]/70 border border-[#CA9C68]/20 rounded-md p-4 flex items-start gap-4 shadow-sm">
              <div className="p-2 bg-red-50 rounded-md text-red-600 border border-red-100 mt-0.5">
                <ShieldAlert size={16} />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-1 text-[#F8FAFC]">High Intent Alert</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-3">
                  {signals.length > 0
                    ? `${signals[0].company} signal detected. Score: ${signals[0].score}.`
                    : "No high-intent signals detected yet. Pipeline is monitoring."}
                </p>
                <button onClick={() => {
                  if (signals.length > 0) {
                    showNotification(`Routing to pitch drafts...`, "info");
                    setTimeout(() => setActiveTab("pipeline"), 500);
                  } else {
                    showNotification("No signals to draft outreach for.", "info");
                  }
                }} className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                  Draft Outreach <ArrowUpRight size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* Data Table Container */}
          <div className="bg-[#162127]/70 border border-[#CA9C68]/20 rounded-md overflow-hidden shadow-sm">

            {/* Table Header / Toolbar */}
            <div className="p-3 border-b border-[#CA9C68]/20 bg-[#0C1519]/50 flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">Pipeline View: All Signals</h3>
              <div className="flex gap-2">
                <div className="flex items-center bg-[#162127]/70 border border-[#CA9C68]/20 rounded-md px-2 py-1">
                  <Search size={12} className="text-gray-500 mr-1.5" />
                  <input
                    type="text"
                    placeholder="Filter..."
                    className="bg-transparent text-xs outline-none w-24 text-[#F8FAFC]"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
                <button onClick={() => showNotification("Exporting CSV...", "info")} className="w-7 h-7 flex items-center justify-center border border-[#CA9C68]/20 rounded-md bg-[#162127]/70 hover:bg-[#0C1519]/50 text-gray-400 transition-colors">
                  <Download size={14} />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-[#0C1519]/80 text-gray-400 border-b border-[#CA9C68]/20">
                  <tr>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs">Account</th>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs">Intent Stage</th>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs">Score</th>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs">Primary Source</th>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs">Last Active</th>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs">Status</th>
                    <th className="px-4 py-3 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-gray-500 text-sm">
                        <Loader2 size={20} className="animate-spin inline-block mr-2" />
                        Fetching signals from backend...
                      </td>
                    </tr>
                  ) : paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-gray-500 text-sm">
                        {searchTerm
                          ? "No signals match your search."
                          : "No signals ingested yet. Use the simulate buttons above to send your first signal."}
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((row) => (
                      <tr key={row.id} className="hover:bg-[#0C1519]/70 hover:border-[#CA9C68]/50 border border-transparent transition-colors">
                        <td className="px-4 py-3 font-medium text-[#F8FAFC]">{row.company}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${intentStyles[row.intent] || "bg-[#0C1519]/50 text-gray-300 border-[#CA9C68]/20"}`}>
                            {row.intent}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`font-bold ${row.score >= 80 ? 'text-[#CA9C68] shadow-[0_0_8px_rgba(202,156,104,0.5)]' : row.score >= 70 ? 'text-blue-600' : row.score === 0 ? 'text-gray-500' : 'text-[#F8FAFC]'}`}>
                            {row.score === 0 ? "—" : row.score}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{row.source}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{row.lastActive}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-medium px-2 py-1 bg-[#0C1519]/50 rounded-md border border-[#CA9C68]/20 text-gray-300">
                            {row.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => {
                              showNotification(`Routing to pitch draft for ${row.company}`, "success");
                              setTimeout(() => setActiveTab("pipeline"), 500);
                            }}
                            className="p-1 text-gray-500 hover:text-[#CA9C68] transition-colors"
                          >
                            <MoreHorizontal size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-3 border-t border-[#CA9C68]/20 bg-[#0C1519]/50 flex justify-between items-center text-xs text-gray-500 font-medium">
              <span>
                {filteredData.length > 0
                  ? `Showing ${(currentPage - 1) * rowsPerPage + 1}-${Math.min(currentPage * rowsPerPage, filteredData.length)} of ${filteredData.length} signals`
                  : "No signals to display"}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="px-2 py-1 border border-[#CA9C68]/20 rounded-md bg-[#162127]/70 disabled:opacity-50 hover:bg-[#0C1519]/50 transition-colors"
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="px-2 py-1 border border-[#CA9C68]/20 rounded-md bg-[#162127]/70 disabled:opacity-50 hover:bg-[#0C1519]/50 text-[#F8FAFC] transition-colors"
                  disabled={currentPage >= totalPages}
                >
                  Next
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>

    </div>
  );
}

