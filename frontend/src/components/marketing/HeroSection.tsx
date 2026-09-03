import { ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden min-h-[85vh] border-b border-gold/10 flex items-center">
      {/* 1A. Section-Specific Atmospheric Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop" 
          alt="Global Signal Mesh" 
          className="w-full h-full object-cover opacity-45 md:opacity-55 filter blur-[1px] mix-blend-luminosity" 
        />
        {/* Top & Bottom Smooth Obsidian Fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C1519] via-[#0C1519]/50 md:via-[#0C1519]/60 to-[#0C1519]" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center px-8 py-12 max-w-7xl mx-auto gap-12 w-full">
        <div className="flex-1 space-y-8">
        <div className="inline-flex items-center px-3 py-1 border border-gold/30 bg-gold/5 rounded-full">
          <span className="text-[11px] font-extrabold text-metallic-gold uppercase tracking-[0.2em]">
            Universal Revenue Infrastructure
          </span>
        </div>
        
        <h1 className="text-[48px] font-bold text-pearl leading-tight tracking-tight">
          Turn Global <span className="text-metallic-gold">Internet Noise</span> Into High-Intent B2B Revenue.
        </h1>
        
        <p className="text-[16px] text-pearl/80 max-w-xl">
          Deploy autonomous agents that ingest millions of unstructured signals across GitHub, RSS, and the open web to identify and target your next high-contract enterprise lead.
        </p>
        
        <div className="flex flex-wrap gap-4 pt-4">
          <Link href="/register" className="btn-metallic-gold px-8 py-4 text-[11px] font-extrabold uppercase tracking-widest transition-all">
            REGISTER WORKSPACE
          </Link>
          <Link href="/login" className="border border-metallic-gold text-pearl px-8 py-4 text-[11px] font-extrabold uppercase tracking-widest hover:bg-gold/10 transition-all">
            SIGN IN
          </Link>
        </div>
      </div>

      {/* HERO RIGHT - Isometric Cards */}
      <div className="flex-1 relative w-full h-[520px] flex items-center justify-center">
        <div className="relative [transform:perspective(1000px)_rotateX(50deg)_rotateZ(-30deg)] flex flex-col items-center">
          {/* Card Layers */}
          <div className="w-80 h-48 bg-jungle/60 backdrop-blur-sm border border-gold/20 rounded-lg absolute translate-y-16 translate-x-4 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]"></div>
          <div className="w-80 h-48 bg-jungle/80 backdrop-blur-md border border-gold/20 rounded-lg absolute translate-y-8 translate-x-2 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]"></div>
          
          {/* Top Card */}
          <div className="w-80 h-48 bg-jungle backdrop-blur-xl border border-gold rounded-lg relative z-10 shadow-[0_35px_70px_-15px_rgba(0,0,0,0.9)] animate-smooth-bounce p-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
              <span className="text-metallic-gold text-[10px] font-extrabold uppercase tracking-widest">
                Active Intercept
              </span>
            </div>
            <p className="text-sm text-pearl font-medium leading-snug">
              🚨 Global Cloud Inc — Intent: Purchase Ready — Score: 98/100
            </p>
            <div className="mt-4 pt-4 border-t border-gold/20 flex justify-between items-center">
              <span className="text-[10px] font-mono text-pearl/60">NODE_ALPHA_09</span>
              <span className="text-[10px] font-mono text-metallic-gold">SECURE</span>
            </div>
          </div>
        </div>

        {/* Floating Badges */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-10 bg-jungle/40 backdrop-blur-md border border-gold/40 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(202,156,104,0.2)]">
            <ShieldCheck size={14} className="text-gold" />
            <span className="text-[9px] font-extrabold text-metallic-gold uppercase tracking-widest">
              GitHub Signal Verified
            </span>
          </div>
          <div className="absolute bottom-1/4 left-10 bg-jungle/40 backdrop-blur-md border border-gold/40 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(202,156,104,0.2)]">
            <Zap size={14} className="text-gold" />
            <span className="text-[9px] font-extrabold text-metallic-gold uppercase tracking-widest">
              Corsair Active
            </span>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
