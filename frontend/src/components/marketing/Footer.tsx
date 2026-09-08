"use client";

import Link from "next/link";
import { Hexagon, Disc, ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";

export default function Footer() {
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const interval = setInterval(() => setSecondsElapsed(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatSession = (totalSeconds: number) => {
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSeconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <footer className="relative bg-slate-950/50 backdrop-blur-xl py-16 px-8 overflow-hidden">
      {/* ── Golden Border Line Right Where Footer Starts ─────────── */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E8B546] to-transparent shadow-[0_0_12px_rgba(232,181,70,0.5)]" />
      {/* ── Ledger Vault Radial Gradient & Glass Overlay ─────────── */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-800/40 via-slate-900/50 to-transparent">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Top bar with brand & back to top */}
        <div className="flex justify-between items-center pb-5 mb-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37]/80 animate-pulse shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
            <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-[#F5D061]/90">
              Subscio Autonomous Core
            </span>
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs font-mono font-bold text-[#F5D061]/90 hover:text-white transition-all uppercase tracking-widest border border-white/10 hover:border-[#D4AF37]/50 px-4 py-2 rounded-full bg-slate-950/40 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] hover:-translate-y-0.5 group cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp size={14} className="text-[#E8B546] group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <span className="text-[11px] font-extrabold text-[#F5D061]/90 uppercase tracking-widest">
              SUBSCIO INTELLIGENCE
            </span>
            <p className="text-pearl/70 text-[14px] leading-relaxed pr-4">
              The world&apos;s first autonomous revenue infrastructure for the enterprise era.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-8 h-8 rounded-md border border-white/10 bg-slate-900/30 backdrop-blur-md flex items-center justify-center text-[#E8B546]/70 hover:text-[#F5D061]/90 transition-colors">
                <Hexagon size={14} />
              </Link>
              <Link href="#" className="w-8 h-8 rounded-md border border-white/10 bg-slate-900/30 backdrop-blur-md flex items-center justify-center text-[#E8B546]/70 hover:text-[#F5D061]/90 transition-colors">
                <Disc size={14} />
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h5 className="text-[11px] font-extrabold uppercase tracking-widest text-[#F5D061]/90">
              Product
            </h5>
            <ul className="space-y-3 text-[14px] text-pearl/70">
              {["Autonomous Ingestion", "Signal Scoring", "API Documentation", "Terminal Console"].map((item) => (
                <li key={item}>
                  <Link href="#" className="inline-block border border-transparent hover:border-[#D4AF37]/40 px-2 py-1 rounded transition-colors">
                    <span className="hover:text-[#F5D061]/90 transition-colors">{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Compliance Links */}
          <div className="space-y-4">
            <h5 className="text-[11px] font-extrabold uppercase tracking-widest text-[#F5D061]/90">
              Compliance
            </h5>
            <ul className="space-y-3 text-[14px] text-pearl/70">
              {["SOC2 Type II Report", "Privacy Shield", "GDPR / CCPA", "Data Processing Addendum"].map((item) => (
                <li key={item}>
                  <Link href="#" className="inline-block border border-transparent hover:border-[#D4AF37]/40 px-2 py-1 rounded transition-colors">
                    <span className="hover:text-[#F5D061]/90 transition-colors">{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* System Logs */}
          <div className="space-y-4">
            <h5 className="text-[11px] font-extrabold uppercase tracking-widest text-[#F5D061]/90">
              System Logs
            </h5>
            <div className="space-y-2 text-[10px] text-pearl/40">
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span>INGESTION_V4</span>
                <span className="text-[#E8B546] bg-slate-900/30 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded">ONLINE</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span>SEC_NODE_01</span>
                <span className="text-[#E8B546] bg-slate-900/30 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded">ONLINE</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1">
                <span>AGENT_FAB_3</span>
                <span className="text-[#E8B546] bg-slate-900/30 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded">ACTIVE</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1 items-center">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Session Active
                </span>
                <span className="text-emerald-400 font-mono bg-slate-950/40 backdrop-blur-xl border border-emerald-500/20 px-2 py-0.5 rounded">
                  {formatSession(secondsElapsed)}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-white/10">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-pearl/60">
            © 2024 SUBSCIO INTELLIGENCE. ALL RIGHTS RESERVED.
          </span>
          <div className="flex gap-6 mt-4 md:mt-0 text-[10px] font-extrabold uppercase tracking-widest text-pearl/60">
            {["Security", "Privacy", "Terms"].map((item) => (
              <Link key={item} href="#" className="hover:text-[#F5D061]/90 transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
