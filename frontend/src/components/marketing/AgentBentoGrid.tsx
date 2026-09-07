"use client";
import { Radar, Target, BrainCircuit, Gauge, Send, BarChart3 } from "lucide-react";
import RollingNumber from "./RollingNumber";

interface AgentCard {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string;
}

/* The six specialized agents of the Subscio engine, from docs/analysis.txt */
const AGENTS: AgentCard[] = [
  {
    id: "discovery",
    name: "Discovery Engine",
    code: "AG-01",
    category: "Ingestion",
    description:
      "Scrapes your website to learn what you sell, maps your ideal customer profile, and generates 5 target accounts with tuned news queries.",
  },
  {
    id: "harvester",
    name: "Harvester",
    code: "AG-02",
    category: "Ingestion",
    description:
      "Monitors the open web in real time for funding rounds, hiring sprees, tenders and tech-stack shifts — deduplicated with SHA-256 hashes.",
  },
  {
    id: "intent",
    name: "Intent Analyzer",
    code: "AG-03",
    category: "Intelligence",
    description:
      "Classifies every raw signal into a buying stage: Targeting, Awareness, Consideration, or Purchase Ready.",
  },
  {
    id: "scoring",
    name: "Score Calculator",
    code: "AG-04",
    category: "Intelligence",
    description:
      "Scores each signal from 1 to 100 based on intent stage, source and recency — and promotes the strong ones straight into leads.",
  },
  {
    id: "corsair",
    name: "Corsair",
    code: "AG-05",
    category: "Outreach",
    description:
      "Drafts a warm, human-sounding outreach pitch for every high-intent lead, framed around their exact trigger event.",
  },
  {
    id: "analytics",
    name: "Analytics Dashboard",
    code: "AG-06",
    category: "Command",
    description:
      "Aggregates the full funnel — signals, scores, pitches — and writes executive summaries on demand for your dashboard.",
  },
];

export default function AgentBentoGrid() {
  return (
    <section className="relative w-full overflow-hidden py-20 border-b border-gold/10">
      {/* 1A. Section-Specific Atmospheric Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2000&auto=format&fit=crop" 
          alt="AI Neural Processing" 
          className="w-full h-full object-cover opacity-45 md:opacity-55 filter blur-[2px] mix-blend-luminosity" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C1519] via-[#0C1519]/50 md:via-[#0C1519]/60 to-[#0C1519] backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 px-8 max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-[48px] font-bold text-pearl mb-2 uppercase tracking-tight">
            The Autonomous Staff
          </h2>
          <div className="h-1 w-24 bg-gold"></div>
          <p className="text-pearl/60 text-sm mt-4 max-w-xl leading-relaxed">
            Six specialized agents working as one revenue assembly line — from target discovery to the final pitch.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6">
        
        {/* Agent 1: Discovery Engine */}
        <div className="card-interactive-pop col-span-12 md:col-span-7 bg-[#162127] bg-opacity-40 backdrop-blur-xl -webkit-backdrop-blur-xl border border-[#CA9C68]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_20px_35px_-10px_rgba(0,0,0,0.5)] relative z-20 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_35px_-10px_rgba(232,181,70,0.25)] hover:border-[#E8B546] p-8 flex flex-col justify-between h-[300px]">
          <div>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Target size={20} className="text-gold" />
                <h4 className="text-[24px] font-semibold text-pearl">Discovery Engine</h4>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="font-mono text-metallic-gold text-xs border border-gold/40 px-2 py-0.5 rounded-sm">{AGENTS[0].code}</span>
                <span className="font-mono text-[9px] text-gold/80 border border-gold/20 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">{AGENTS[0].category}</span>
              </div>
            </div>
            <p className="text-pearl/70 mt-4 max-w-md text-sm leading-relaxed">
              {AGENTS[0].description}
            </p>
          </div>
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-obsidian text-metallic-gold text-[10px] font-mono border border-gold/20 uppercase rounded-sm">
              ICP Mapping
            </span>
            <span className="px-2 py-1 bg-obsidian text-metallic-gold text-[10px] font-mono border border-gold/20 uppercase rounded-sm">
              5 Targets / Run
            </span>
          </div>
        </div>

        {/* Agent 2: Harvester */}
        <div className="card-interactive-pop col-span-12 md:col-span-5 bg-[#162127] bg-opacity-40 backdrop-blur-xl -webkit-backdrop-blur-xl border border-[#CA9C68]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_20px_35px_-10px_rgba(0,0,0,0.5)] relative z-20 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_35px_-10px_rgba(232,181,70,0.25)] hover:border-[#E8B546] p-8 flex flex-col justify-between h-[300px]">
          <div>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Radar size={20} className="text-gold" />
                <h4 className="text-[24px] font-semibold text-pearl">Harvester</h4>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="font-mono text-metallic-gold text-xs border border-gold/40 px-2 py-0.5 rounded-sm">{AGENTS[1].code}</span>
                <span className="font-mono text-[9px] text-gold/80 border border-gold/20 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">{AGENTS[1].category}</span>
              </div>
            </div>
            <p className="text-pearl/70 mt-4 text-sm leading-relaxed">
              {AGENTS[1].description}
            </p>
          </div>
          
          <div className="h-16 w-full bg-obsidian/50 flex items-end gap-1 px-2 pb-2 relative overflow-hidden border border-gold/10 rounded-sm">
            {/* Animated Bars mock */}
            {[4, 8, 6, 10, 5, 9, 3, 7, 4, 8, 6, 10].map((h, i) => (
              <div 
                key={i} 
                className={`w-full bg-gold/${(i % 3 + 2) * 20}`} 
                style={{ height: `${h * 10}%`, opacity: 0.8 }} 
              />
            ))}
          </div>
        </div>

        {/* Agent 3: Intent Analyzer */}
        <div className="card-interactive-pop col-span-12 md:col-span-4 bg-[#162127] bg-opacity-40 backdrop-blur-xl -webkit-backdrop-blur-xl border border-[#CA9C68]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_20px_35px_-10px_rgba(0,0,0,0.5)] relative z-20 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_35px_-10px_rgba(232,181,70,0.25)] hover:border-[#E8B546] p-8 flex flex-col justify-between h-[260px]">
          <div>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <BrainCircuit size={20} className="text-gold" />
                <h4 className="text-[20px] font-semibold text-pearl">Intent Analyzer</h4>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="font-mono text-metallic-gold text-xs border border-gold/40 px-2 py-0.5 rounded-sm">{AGENTS[2].code}</span>
                <span className="font-mono text-[9px] text-gold/80 border border-gold/20 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">{AGENTS[2].category}</span>
              </div>
            </div>
            <p className="text-pearl/70 mt-4 text-sm leading-relaxed">
              {AGENTS[2].description}
            </p>
          </div>
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-obsidian text-metallic-gold text-[10px] font-mono border border-gold/20 uppercase rounded-sm">Awareness</span>
            <span className="px-2 py-1 bg-obsidian text-metallic-gold text-[10px] font-mono border border-gold/20 uppercase rounded-sm">Purchase Ready</span>
          </div>
        </div>

        {/* Agent 4: Score Calculator */}
        <div className="card-interactive-pop col-span-12 md:col-span-4 bg-[#162127] bg-opacity-40 backdrop-blur-xl -webkit-backdrop-blur-xl border border-[#CA9C68]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_20px_35px_-10px_rgba(0,0,0,0.5)] relative z-20 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_35px_-10px_rgba(232,181,70,0.25)] hover:border-[#E8B546] p-8 flex flex-col justify-between h-[260px]">
          <div>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Gauge size={20} className="text-gold" />
                <h4 className="text-[20px] font-semibold text-pearl">Score Calculator</h4>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="font-mono text-metallic-gold text-xs border border-gold/40 px-2 py-0.5 rounded-sm">{AGENTS[3].code}</span>
                <span className="font-mono text-[9px] text-gold/80 border border-gold/20 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">{AGENTS[3].category}</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-[52px] font-bold text-metallic-gold drop-shadow-[0_0_15px_rgba(202,156,104,0.5)] leading-none">
                <RollingNumber target={99.2} decimals={1} />
              </span>
              <span className="text-[10px] font-extrabold text-pearl/60 uppercase tracking-widest">
                Avg. Agent Accuracy
              </span>
            </div>
            <p className="text-pearl/70 mt-3 text-sm leading-relaxed">
              {AGENTS[3].description}
            </p>
          </div>
        </div>

        {/* Agent 5: Corsair */}
        <div className="card-interactive-pop col-span-12 md:col-span-4 bg-[#162127] bg-opacity-40 backdrop-blur-xl -webkit-backdrop-blur-xl border border-[#CA9C68]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_20px_35px_-10px_rgba(0,0,0,0.5)] relative z-20 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_35px_-10px_rgba(232,181,70,0.25)] hover:border-[#E8B546] p-8 h-[260px] overflow-hidden group">
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Send size={20} className="text-gold" />
                  <h4 className="text-[20px] font-semibold text-pearl">Corsair</h4>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-mono text-metallic-gold text-xs border border-gold/40 px-2 py-0.5 rounded-sm">{AGENTS[4].code}</span>
                  <span className="font-mono text-[9px] text-gold/80 border border-gold/20 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">{AGENTS[4].category}</span>
                </div>
              </div>
              <p className="text-xs text-pearl/60 leading-relaxed mt-4">
                {AGENTS[4].description}
              </p>
            </div>
            <span className="px-2 py-1 bg-obsidian text-metallic-gold text-[10px] font-mono border border-gold/20 uppercase rounded-sm self-start">
              Warm Outreach Drafts
            </span>
          </div>
          <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 group-hover:opacity-30 transition-all duration-1000">
            <Send size={160} className="text-gold" />
          </div>
        </div>

        {/* Agent 6: Analytics Dashboard */}
        <div className="card-interactive-pop col-span-12 bg-[#162127] bg-opacity-40 backdrop-blur-xl -webkit-backdrop-blur-xl border border-[#CA9C68]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_20px_35px_-10px_rgba(0,0,0,0.5)] relative z-20 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_35px_-10px_rgba(232,181,70,0.25)] hover:border-[#E8B546] p-8 h-[140px] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <BarChart3 size={36} className="text-gold shrink-0" />
            <div>
              <div className="flex items-center gap-3">
                <h4 className="text-[24px] font-semibold text-pearl hidden md:block">
                  Analytics Dashboard
                </h4>
                <h4 className="text-[20px] font-semibold text-pearl md:hidden">
                  Analytics Dashboard
                </h4>
                <span className="font-mono text-metallic-gold text-xs border border-gold/40 px-2 py-0.5 rounded-sm">{AGENTS[5].code}</span>
                <span className="font-mono text-[9px] text-gold/80 border border-gold/20 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">{AGENTS[5].category}</span>
              </div>
              <p className="text-pearl/60 text-xs leading-relaxed mt-1 hidden md:block max-w-2xl">
                {AGENTS[5].description}
              </p>
            </div>
          </div>
          <button className="border border-metallic-gold text-metallic-gold px-6 py-3 text-[11px] uppercase tracking-widest hover:bg-gold/10 transition-all font-extrabold rounded-sm shrink-0">
            Launch Console
          </button>
        </div>

      </div>
      </div>
    </section>
  );
}