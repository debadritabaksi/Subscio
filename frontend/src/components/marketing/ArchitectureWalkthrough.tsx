"use client";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export default function ArchitectureWalkthrough() {
  return (
    <section className="relative w-full overflow-hidden py-24 border-b border-white/10 bg-transparent">
      <div className="relative z-20 px-8 max-w-7xl mx-auto space-y-16">
      {/* Row A - Phase 01 / Harvesting */}
      <div className="border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-2xl bg-slate-950/40 backdrop-blur-xl relative z-20 py-12 md:py-16 px-6 md:px-12 overflow-hidden">
        <div className="relative z-10 grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="text-[11px] font-extrabold text-[#F5D061]/90 uppercase tracking-[0.3em]">
              Phase 01 / Harvesting
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-pearl leading-tight tracking-tight">
              Elastic Signal Ingestion Across the Global Mesh.
            </h2>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-sans">
              Our Harvester agents maintain persistence across 500+ unstructured data sources. From GitHub commit patterns to obscure regulatory filings, nothing escapes the engine.
            </p>
            <ul className="space-y-3 font-mono text-sm text-pearl pt-2">
              <li className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-gold shrink-0" /> Automated Source Discovery
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-gold shrink-0" /> Real-time Sentiment Analysis
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-gold shrink-0" /> Entity Extraction & Mapping
              </li>
            </ul>
          </div>
          
          <div className="lg:col-span-7">
            <div className="p-2 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-2xl bg-slate-950/40 backdrop-blur-xl relative z-20 transition-all duration-500 hover:border-[#D4AF37]/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                alt="Technical architecture diagram" 
                className="w-full h-auto object-contain rounded-xl shadow-2xl transition-transform duration-700 hover:scale-[1.02]" 
                src="/architecture_diagram.jpg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Row B - Phase 02 / Command: Visual Intelligence */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-950/40 backdrop-blur-xl border border-white/10 p-6 md:p-12 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] my-12">
        <div className="relative z-10 grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="text-[11px] font-extrabold text-[#F5D061]/90 uppercase tracking-[0.3em]">
              Phase 02 / Command
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-pearl leading-tight">
              Visual Intelligence for High-Velocity Teams.
            </h2>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-sans">
              The SUBSCIO Terminal provides a mission-critical view of your revenue landscape. Every lead is categorized by firmographic data and intent signals that are verified.
            </p>
            <div className="pt-2">
              <a 
                href="/dashboard" 
                className="btn-metallic-gold px-8 py-3.5 text-xs font-extrabold uppercase tracking-widest transition-all inline-block shadow-[0_0_20px_rgba(232,181,70,0.3)] hover:brightness-110"
              >
                Access Terminal Proto
              </a>
            </div>
          </div>
          
          <div className="lg:col-span-7">
            <div className="p-2 bg-slate-950/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] relative z-20 transition-all duration-500 hover:border-[#D4AF37]/40 rounded-2xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                alt="Intelligence terminal dashboard" 
                className="w-full h-auto object-contain rounded-xl shadow-2xl transition-transform duration-700 hover:scale-[1.02]" 
                src="/terminal_dashboard.jpg"
              />
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
