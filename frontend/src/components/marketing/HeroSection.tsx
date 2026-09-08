"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function HeroSection() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem("subscio_auth") === "true");
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative w-full overflow-hidden min-h-[85vh] border-b border-white/10 flex items-center bg-transparent">

      <div className="relative z-10 flex flex-col md:flex-row items-center px-8 py-16 md:py-20 max-w-7xl mx-auto gap-12 w-full">
        {/* Hero Left Content */}
        <div className="flex-1 space-y-6 relative">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-[#D8B26E]/30 bg-[#D8B26E]/10 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(216,178,110,0.25)]">
            <span className="w-2 h-2 rounded-full bg-[#D8B26E] animate-pulse shadow-[0_0_8px_rgba(216,178,110,0.8)]" />
            <span className="text-[11px] font-mono font-extrabold text-[#D8B26E] uppercase tracking-[0.22em]">
              Autonomous Signal Intelligence
            </span>
          </div>

          {/* Brand Text — Champagne-Gold Metallic Gradient */}
          <div className="space-y-1 pt-1">
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight uppercase leading-none drop-shadow-[0_4px_28px_rgba(216,178,110,0.25)] text-metallic-champagne">
              SUBSCIO
            </h1>
            <p className="text-xs font-mono text-[#D8B26E]/80 tracking-[0.3em] uppercase pt-2">
              Enterprise Revenue Infrastructure
            </p>
          </div>

          {/* Headline — Champagne-Gold Accent */}
          <h2 className="text-3xl md:text-5xl font-bold text-pearl leading-snug tracking-tight pt-2">
            Turn Global{" "}
            <span className="text-metallic-champagne">
              Internet Noise
            </span>{" "}
            Into High-Intent B2B Revenue.
          </h2>

          <p className="text-[15px] md:text-[16px] text-pearl/80 max-w-xl leading-relaxed font-sans">
            Deploy autonomous AI agents that intercept, synthesize, and score
            raw market signals across GitHub, live RSS feeds, and the open web —
            delivering verified intent and warm executive pitches directly to
            your pipeline.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="btn-metallic-champagne px-8 py-4 text-[11px] uppercase tracking-widest text-center"
              >
                RETURN TO DASHBOARD
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="btn-metallic-champagne px-8 py-4 text-[11px] uppercase tracking-widest text-center"
                >
                  REGISTER WORKSPACE
                </Link>
                <Link
                  href="/login"
                  className="btn-signin-glass px-8 py-4 text-[11px] font-semibold uppercase tracking-widest text-center"
                >
                  SIGN IN
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Hero Right — Expansive Multi-Card Intercept Scatter */}
        <div className="flex-1 w-full flex items-center justify-center">
          <div className="relative w-full h-[480px] lg:h-[540px] flex items-center justify-center pointer-events-auto">
            <div 
              className={`group relative w-[340px] sm:w-[380px] h-[220px] cursor-pointer transition-all duration-700 ${
                isScrolled ? "pointer-events-none" : ""
              }`}
            >
              {/* Floating Satellite Status Badge */}
              <div className="absolute -top-6 right-2 z-30 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/15 text-[10px] font-mono text-slate-300 tracking-wider shadow-lg transition-all duration-700 group-hover:-translate-y-12 group-hover:translate-x-8">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D8B26E] animate-pulse" />
                GITHUB SIGNAL VERIFIED
              </div>

              {/* CARD 3: Top-Right Scatter Node (Nexus AI Systems) */}
              <div className={`absolute inset-0 rounded-2xl bg-slate-950/45 backdrop-blur-xl border border-white/15 p-5 shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
                !isScrolled 
                  ? "group-hover:translate-x-28 group-hover:-translate-y-32 group-hover:rotate-[5deg] group-hover:scale-100" 
                  : ""
              } translate-x-3 translate-y-3 rotate-[3deg] opacity-75 group-hover:opacity-100 z-10`}>
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D8B26E]" />
                    <span className="text-[10px] font-mono tracking-widest text-[#D8B26E] uppercase">INGESTION CACHE</span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 uppercase">RESOLVED</span>
                </div>
                <div className="space-y-0.5 mb-2.5">
                  <h4 className="text-sm font-semibold text-white">Nexus AI Systems</h4>
                  <p className="text-[11px] font-mono text-cyan-400">RFP: GPU CLUSTER INFRASTRUCTURE</p>
                </div>
                <div className="space-y-1 mb-2.5">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-slate-400 uppercase">Readiness</span>
                    <span className="text-[#D8B26E] font-bold">92/100</span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-[#D8B26E] w-[92%]" />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-1 text-[9px] font-mono text-slate-400">
                  <span>NODE_BETA_03</span>
                  <span className="text-emerald-400">BUDGET LOCKED ($1.2M)</span>
                </div>
              </div>

              {/* CARD 2: Bottom-Left Scatter Node (Vanguard Fintech) */}
              <div className={`absolute inset-0 rounded-2xl bg-slate-950/50 backdrop-blur-xl border border-white/15 p-5 shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
                !isScrolled 
                  ? "group-hover:-translate-x-36 group-hover:translate-y-24 group-hover:rotate-[-7deg] group-hover:scale-100" 
                  : ""
              } translate-x-1.5 translate-y-1.5 rotate-[1.5deg] opacity-85 group-hover:opacity-100 z-15`}>
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">HIGH INTENT SIGNAL</span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 uppercase">EXPANDING</span>
                </div>
                <div className="space-y-0.5 mb-2.5">
                  <h4 className="text-sm font-semibold text-white">Vanguard Fintech Corp</h4>
                  <p className="text-[11px] font-mono text-amber-300">TRIGGER: SOC2 COMPLIANCE OVERHAUL</p>
                </div>
                <div className="space-y-1 mb-2.5">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-slate-400 uppercase">Match Score</span>
                    <span className="text-emerald-400 font-bold">96/100</span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-400 w-[96%]" />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-1 text-[9px] font-mono text-slate-400">
                  <span>NODE_GAMMA_11</span>
                  <span className="text-[#D8B26E]">INTENT CONFIRMED</span>
                </div>
              </div>

              {/* CARD 1: Anchor Core Node (Global Cloud Inc) */}
              <div className={`relative z-20 w-full h-full rounded-2xl bg-slate-950/60 backdrop-blur-xl border border-white/20 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.7)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
                !isScrolled 
                  ? "group-hover:-translate-y-4 group-hover:scale-105" 
                  : ""
              }`}>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#D8B26E] shadow-[0_0_8px_#D8B26E]" />
                    <span className="text-[11px] font-mono font-bold tracking-widest text-[#D8B26E] uppercase">ACTIVE INTERCEPT</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">LIVE</span>
                </div>

                {/* Lead Details */}
                <div className="space-y-0.5 mb-3">
                  <h4 className="text-base font-semibold text-white tracking-tight">Global Cloud Inc</h4>
                  <p className="text-xs font-mono text-emerald-400">INTENT: PURCHASE READY</p>
                </div>

                {/* Confidence Bar */}
                <div className="space-y-1 mb-3">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-slate-400 uppercase tracking-wider">Confidence Score</span>
                    <span className="text-[#D8B26E] font-bold">98/100</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#D8B26E] to-[#FFF1D0] w-[98%]" />
                  </div>
                </div>

                {/* Badges */}
                <div className="flex items-center justify-between pt-1">
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400">
                    NODE_ALPHA_09
                  </span>
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#D8B26E]/10 border border-[#D8B26E]/30 text-[10px] font-mono text-[#D8B26E]">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2L2 22l10-4 10 4L12 2z" />
                    </svg>
                    CORSAIR ACTIVE
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
