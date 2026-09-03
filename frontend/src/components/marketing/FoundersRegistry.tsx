"use client";
import { Link as LinkIcon } from "lucide-react";
import Image from "next/image";

export default function FoundersRegistry() {
  const placeholderUrl = "https://lh3.googleusercontent.com/aida/AP1WRLt_xUy_2UgMeYy3mQGTdEgeI66dWPhFGm-SvJArpWknXMHP3F_xcTPgk8bIShWQ5t3CBnsh7sTAfQnyMPWDISxPt1r9Zypw8IPmcO3cSKlgG3mthHyEQLfFPXueXgcsFaOMh98bW_leVY5psk0UbP5ut2oXhmpNlp1PYfTVCTF6bFxOPtP1p2WvKXP88DrdxKH-8AHIWa7yVf7gcQGt02UyOTgevkssIm51WZE1mrYj7GKBc1-V0ba0Jw";

  return (
    <section className="relative w-full overflow-hidden py-20">
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2000&auto=format&fit=crop" 
          alt="Biometric Security Network" 
          className="w-full h-full object-cover opacity-45 md:opacity-55 filter blur-[2px] mix-blend-luminosity" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C1519] via-[#0C1519]/50 md:via-[#0C1519]/60 to-[#0C1519] backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16 border-b border-gold/20 pb-8">
          <div>
          <h2 className="text-[48px] font-bold text-pearl leading-tight tracking-tight">The Registry.</h2>
          <p className="text-pearl/60 text-lg">The architects of the signal mesh.</p>
        </div>
        <div className="text-right hidden md:block">
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">

          {/* Founder 1 */}
          <div className="card-interactive-pop bg-[#162127] bg-opacity-40 backdrop-blur-xl -webkit-backdrop-blur-xl border border-[#CA9C68]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_20px_35px_-10px_rgba(0,0,0,0.5)] relative z-20 p-4 group transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_35px_-10px_rgba(232,181,70,0.25)] hover:border-[#E8B546]">
            <div className="w-full h-56 bg-[#0C1519]/90 rounded-t-md border-b border-[#CA9C68]/20 flex flex-col items-center justify-center p-4 text-center mb-6">
              <div className="w-12 h-12 rounded-full border border-[#CA9C68]/40 flex items-center justify-center mb-2 bg-[#162127]">
                <span className="text-[#E8B546] text-xs font-mono">ID</span>
              </div>
              <span className="text-[#94A3B8]/40 text-xs tracking-[0.2em] font-mono uppercase">Portrait Pending</span>
            </div>
            <span className="text-[11px] font-extrabold text-metallic-gold uppercase tracking-widest">
              Executive Director
            </span>
            <h4 className="text-[24px] font-semibold text-pearl mt-1">Elena Vane</h4>
            <div className="mt-4 pt-4 border-t border-gold/10 flex justify-between items-center">
              <span className="font-mono text-[10px] text-pearl/60 uppercase">ex-Palantir / Stanford</span>
              <LinkIcon size={14} className="text-gold/60" />
            </div>
          </div>

          {/* Founder 2 */}
          <div className="card-interactive-pop bg-[#162127] bg-opacity-40 backdrop-blur-xl -webkit-backdrop-blur-xl border border-[#CA9C68]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_20px_35px_-10px_rgba(0,0,0,0.5)] relative z-20 p-4 group transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_35px_-10px_rgba(232,181,70,0.25)] hover:border-[#E8B546]">
            <div className="w-full h-56 bg-[#0C1519]/90 rounded-t-md border-b border-[#CA9C68]/20 flex flex-col items-center justify-center p-4 text-center mb-6">
              <div className="w-12 h-12 rounded-full border border-[#CA9C68]/40 flex items-center justify-center mb-2 bg-[#162127]">
                <span className="text-[#E8B546] text-xs font-mono">ID</span>
              </div>
              <span className="text-[#94A3B8]/40 text-xs tracking-[0.2em] font-mono uppercase">Portrait Pending</span>
            </div>
            <span className="text-[11px] font-extrabold text-metallic-gold uppercase tracking-widest">
              Lead Model Architect
            </span>
            <h4 className="text-[24px] font-semibold text-pearl mt-1">Dr. Julian Thorne</h4>
            <div className="mt-4 pt-4 border-t border-gold/10 flex justify-between items-center">
              <span className="font-mono text-[10px] text-pearl/60 uppercase">PhD ML / MIT</span>
              <LinkIcon size={14} className="text-gold/60" />
            </div>
          </div>

          {/* Founder 3 */}
          <div className="card-interactive-pop bg-[#162127] bg-opacity-40 backdrop-blur-xl -webkit-backdrop-blur-xl border border-[#CA9C68]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_20px_35px_-10px_rgba(0,0,0,0.5)] relative z-20 p-4 group transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_35px_-10px_rgba(232,181,70,0.25)] hover:border-[#E8B546]">
            <div className="w-full h-56 bg-[#0C1519]/90 rounded-t-md border-b border-[#CA9C68]/20 flex flex-col items-center justify-center p-4 text-center mb-6">
              <div className="w-12 h-12 rounded-full border border-[#CA9C68]/40 flex items-center justify-center mb-2 bg-[#162127]">
                <span className="text-[#E8B546] text-xs font-mono">ID</span>
              </div>
              <span className="text-[#94A3B8]/40 text-xs tracking-[0.2em] font-mono uppercase">Portrait Pending</span>
            </div>
            <span className="text-[11px] font-extrabold text-metallic-gold uppercase tracking-widest">
              Infrastructure Lead
            </span>
            <h4 className="text-[24px] font-semibold text-pearl mt-1">Marcus Chen</h4>
            <div className="mt-4 pt-4 border-t border-gold/10 flex justify-between items-center">
              <span className="font-mono text-[10px] text-pearl/60 uppercase">Cloud Infrastructure / CERN</span>
              <LinkIcon size={14} className="text-gold/60" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
