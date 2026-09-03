"use client";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export default function ArchitectureWalkthrough() {
  return (
    <section className="relative w-full overflow-hidden py-24 border-b border-gold/10">
      <div className="relative z-10 px-8 max-w-7xl mx-auto space-y-16">
      {/* Row A */}
      <div className="border border-[#CA9C68]/50 shadow-[0_0_25px_rgba(202,156,104,0.15)] rounded-2xl bg-[#162127]/70 backdrop-blur-xl relative z-20 py-16 px-8 md:px-14 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2000&auto=format&fit=crop" 
            alt="Signal Ingestion Mesh" 
            className="w-full h-full object-cover opacity-45 md:opacity-55 filter blur-[1px] mix-blend-luminosity" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0C1519] via-[#0C1519]/50 md:via-[#0C1519]/60 to-transparent" />
        </div>
        <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
          <div className="text-[11px] font-extrabold text-metallic-gold uppercase tracking-[0.3em]">
            Phase 01 / Harvesting
          </div>
          <h2 className="text-[48px] font-bold text-pearl leading-tight">
            Elastic Signal Ingestion Across the Global Mesh.
          </h2>
          <p className="text-pearl/80 text-[16px] leading-relaxed">
            Our Harvester agents maintain persistence across 500+ unstructured data sources. From GitHub commit patterns to obscure regulatory filings, nothing escapes the engine.
          </p>
          <ul className="space-y-4 font-mono text-sm text-pearl pt-2">
            <li className="flex items-center gap-3">
              <CheckCircle2 size={20} className="text-gold" /> Automated Source Discovery
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 size={20} className="text-gold" /> Real-time Sentiment Analysis
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 size={20} className="text-gold" /> Entity Extraction & Mapping
            </li>
          </ul>
        </div>
        <div className="card-interactive-pop p-2 border border-[#CA9C68]/50 shadow-[0_0_25px_rgba(202,156,104,0.15)] rounded-2xl bg-[#162127] bg-opacity-40 backdrop-blur-xl -webkit-backdrop-blur-xl relative z-20 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            alt="Technical architecture diagram" 
            className="w-full h-auto transition-all duration-700 hover:scale-105 rounded" 
            src="https://lh3.googleusercontent.com/aida/AP1WRLvKnShlCN9Fy_s6azfZfiG3A_H6M6DHBqO8gFo0-SlPmPYmW0hYj5ro85hSlfcxaX7562N0DMhkQCBHnHGDcXN0OD4afK1aF8e-aECxSeQVi5deh8yojJKGzxZUcei-GgGE_hsScinA9-RKCihEKFIqUYfMW1-VhBFyZOaviATd6meZho9Ay8fVqT54g-19cektF4ytM5pJn_x-LOW4jEWUT5ozIkgHUaHMjtzB1h97iJwb8YTy7nHm"
          />
          </div>
        </div>
      </div>

      {/* Row B */}
      <div className="relative overflow-hidden rounded-2xl bg-[#162127] border border-[#CA9C68]/40 p-8 md:p-14 shadow-2xl my-16">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop" 
            alt="Cyber Security Dashboard" 
            className="w-full h-full object-cover opacity-45 md:opacity-55 mix-blend-luminosity" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0C1519] via-[#0C1519]/50 md:via-[#0C1519]/60 to-transparent" />
        </div>

        <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
          <div className="order-1 md:order-1 space-y-6">
            <div className="text-[11px] font-extrabold text-metallic-gold uppercase tracking-[0.3em]">
              Phase 02 / Command
            </div>
            <h2 className="text-[48px] font-bold text-pearl leading-tight">
              Visual Intelligence for High-Velocity Teams.
            </h2>
            <p className="text-pearl/80 text-[16px] leading-relaxed">
              The SUBSCIO Terminal provides a mission-critical view of your revenue landscape. Every lead is categorized by firmographic data and intent signals that are verified.
            </p>
            <button className="btn-metallic-gold px-6 py-3 text-[11px] font-extrabold uppercase tracking-widest transition-all mt-4">
              Access Terminal Proto
            </button>
          </div>
          <div className="card-interactive-pop order-2 md:order-2 p-2 bg-[#162127] bg-opacity-40 backdrop-blur-xl -webkit-backdrop-blur-xl border border-[#CA9C68]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_20px_35px_-10px_rgba(0,0,0,0.5)] relative z-20 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_35px_-10px_rgba(232,181,70,0.25)] hover:border-[#E8B546] overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              alt="Intelligence terminal dashboard" 
              className="w-full h-auto transition-all duration-700 hover:scale-105 rounded" 
              src="https://lh3.googleusercontent.com/aida/AP1WRLt_xUy_2UgMeYy3mQGTdEgeI66dWPhFGm-SvJArpWknXMHP3F_xcTPgk8bIShWQ5t3CBnsh7sTAfQnyMPWDISxPt1r9Zypw8IPmcO3cSKlgG3mthHyEQLfFPXueXgcsFaOMh98bW_leVY5psk0UbP5ut2oXhmpNlp1PYfTVCTF6bFxOPtP1p2WvKXP88DrdxKH-8AHIWa7yVf7gcQGt02UyOTgevkssIm51WZE1mrYj7GKBc1-V0ba0Jw"
            />
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
