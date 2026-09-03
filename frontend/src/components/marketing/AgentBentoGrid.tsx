"use client";
import { ActivitySquare, Send } from "lucide-react";
import RollingNumber from "./RollingNumber";

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
        </div>

        <div className="grid grid-cols-12 gap-6">
        
        {/* Agent 1: Context Engine */}
        <div className="card-interactive-pop col-span-12 md:col-span-7 bg-[#162127] bg-opacity-40 backdrop-blur-xl -webkit-backdrop-blur-xl border border-[#CA9C68]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_20px_35px_-10px_rgba(0,0,0,0.5)] relative z-20 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_35px_-10px_rgba(232,181,70,0.25)] hover:border-[#E8B546] p-8 flex flex-col justify-between h-[300px]">
          <div>
            <div className="flex justify-between items-start">
              <h4 className="text-[24px] font-semibold text-pearl">Context Engine</h4>
              <span className="font-mono text-metallic-gold text-xs border border-gold/40 px-2 py-0.5 rounded-sm">AG-01</span>
            </div>
            <p className="text-pearl/70 mt-4 max-w-md text-sm leading-relaxed">
              Analyzes historical corporate data to provide deep context for new incoming signals. Resolves identity and firmographic conflicts instantly.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-obsidian text-metallic-gold text-[10px] font-mono border border-gold/20 uppercase rounded-sm">
              Identity Resolution
            </span>
            <span className="px-2 py-1 bg-obsidian text-metallic-gold text-[10px] font-mono border border-gold/20 uppercase rounded-sm">
              History Log
            </span>
          </div>
        </div>

        {/* Agent 2: Harvester */}
        <div className="card-interactive-pop col-span-12 md:col-span-5 bg-[#162127] bg-opacity-40 backdrop-blur-xl -webkit-backdrop-blur-xl border border-[#CA9C68]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_20px_35px_-10px_rgba(0,0,0,0.5)] relative z-20 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_35px_-10px_rgba(232,181,70,0.25)] hover:border-[#E8B546] p-8 flex flex-col justify-between h-[300px]">
          <div>
            <div className="flex justify-between items-start">
              <h4 className="text-[24px] font-semibold text-pearl">Harvester</h4>
              <span className="font-mono text-metallic-gold text-xs border border-gold/40 px-2 py-0.5 rounded-sm">AG-02</span>
            </div>
            <p className="text-pearl/70 mt-4 text-sm leading-relaxed">
              Scalable ingestion nodes that monitor the open web. Configured for low-latency detection of technology switches.
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

        {/* Agent 3: Analyzer */}
        <div className="card-interactive-pop col-span-12 md:col-span-4 bg-[#162127] bg-opacity-40 backdrop-blur-xl -webkit-backdrop-blur-xl border border-[#CA9C68]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_20px_35px_-10px_rgba(0,0,0,0.5)] relative z-20 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_35px_-10px_rgba(232,181,70,0.25)] hover:border-[#E8B546] p-8 h-[260px]">
          <div className="flex justify-between items-start mb-6">
            <h4 className="text-[24px] font-semibold text-pearl">Analyzer</h4>
            <span className="font-mono text-metallic-gold text-xs border border-gold/40 px-2 py-0.5 rounded-sm">AG-03</span>
          </div>
          <div className="space-y-4 pt-4">
            <div className="h-2 bg-obsidian w-full overflow-hidden rounded-full">
              <div className="h-full bg-gold w-3/4 shadow-[0_0_10px_var(--color-gold)]"></div>
            </div>
            <div className="h-2 bg-obsidian w-full overflow-hidden rounded-full">
              <div className="h-full bg-gold w-1/2 shadow-[0_0_10px_var(--color-gold)]"></div>
            </div>
            <p className="text-xs text-metallic-gold font-mono pt-4 uppercase tracking-tighter animate-pulse">
              Processing vector threads...
            </p>
          </div>
        </div>

        {/* Agent 4: Score Calculator */}
        <div className="card-interactive-pop col-span-12 md:col-span-4 bg-[#162127] bg-opacity-40 backdrop-blur-xl -webkit-backdrop-blur-xl border border-[#CA9C68]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_20px_35px_-10px_rgba(0,0,0,0.5)] relative z-20 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_35px_-10px_rgba(232,181,70,0.25)] hover:border-[#E8B546] p-8 h-[260px] flex flex-col justify-center items-center">
          <span className="text-[72px] font-bold text-metallic-gold drop-shadow-[0_0_15px_rgba(202,156,104,0.5)] leading-none">
            <RollingNumber target={99.2} decimals={1} />
          </span>
          <span className="text-[11px] font-extrabold text-pearl/60 uppercase tracking-widest mt-4">
            Avg. Agent Accuracy
          </span>
        </div>

        {/* Agent 5: Corsair */}
        <div className="card-interactive-pop col-span-12 md:col-span-4 bg-[#162127] bg-opacity-40 backdrop-blur-xl -webkit-backdrop-blur-xl border border-[#CA9C68]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_20px_35px_-10px_rgba(0,0,0,0.5)] relative z-20 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_35px_-10px_rgba(232,181,70,0.25)] hover:border-[#E8B546] p-8 h-[260px] overflow-hidden group">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-[24px] font-semibold text-pearl">Corsair</h4>
              <span className="font-mono text-metallic-gold text-xs border border-gold/40 px-2 py-0.5 rounded-sm">AG-05</span>
            </div>
            <p className="text-xs text-pearl/60 leading-relaxed mt-4">
              Autonomous outreach orchestration across calibrated channels.
            </p>
          </div>
          <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 group-hover:opacity-30 transition-all duration-1000">
            <Send size={160} className="text-gold" />
          </div>
        </div>

        {/* Agent 6: Executive Dashboard */}
        <div className="card-interactive-pop col-span-12 bg-[#162127] bg-opacity-40 backdrop-blur-xl -webkit-backdrop-blur-xl border border-[#CA9C68]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_20px_35px_-10px_rgba(0,0,0,0.5)] relative z-20 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_35px_-10px_rgba(232,181,70,0.25)] hover:border-[#E8B546] p-8 h-[120px] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <ActivitySquare size={36} className="text-gold" />
            <h4 className="text-[24px] font-semibold text-pearl hidden md:block">
              Executive Dashboard Overview
            </h4>
            <h4 className="text-[20px] font-semibold text-pearl md:hidden">
              Executive Overview
            </h4>
          </div>
          <button className="border border-metallic-gold text-metallic-gold px-6 py-3 text-[11px] uppercase tracking-widest hover:bg-gold/10 transition-all font-extrabold rounded-sm">
            Launch Console
          </button>
        </div>

      </div>
      </div>
    </section>
  );
}
