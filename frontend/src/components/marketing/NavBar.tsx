"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function NavBar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem("subscio_auth") === "true");
  }, []);

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 rounded-full px-8 py-3 z-50 bg-slate-900/40 backdrop-blur-md border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.6)] flex items-center justify-between gap-6 md:gap-8 max-w-[90vw] md:max-w-fit whitespace-nowrap transition-all duration-300 hover:border-white/20">
      {/* Brand logo & live beacon */}
      <Link href="/" className="flex items-center gap-2 group">
        <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
        <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-pearl group-hover:text-[#F5D061] transition-colors">
          SUBSCIO
        </span>
      </Link>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-6 text-[11px] font-mono uppercase tracking-wider text-pearl/70">
        <a href="#architecture" className="hover:text-[#F5D061] transition-colors">
          Architecture
        </a>
        <a href="#agents" className="hover:text-[#F5D061] transition-colors">
          Agents
        </a>
        <a href="#team" className="hover:text-[#F5D061] transition-colors">
          Team
        </a>
      </div>

      {/* Action CTA */}
      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-gradient-to-br from-[#ECC880] via-[#C99B4A] to-[#9B722B] text-[#050811 font-bold border border-white/30 shadow-[0_0_15px_rgba(201,155,74,0.4)] hover:brightness-110 hover:shadow-[0_0_20px_rgba(201,155,74,0.6)] transition-all"
          >
            <span>Console</span>
            <ArrowRight size={12} className="text-[#050811]" />
          </Link>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-slate-900/70 backdrop-blur-md border border-[#D8B26E]/40 text-[#E8D3A2] hover:bg-slate-800 hover:border-[#D8B26E]/60 hover:text-[#FFF1D0 transition-all"
          >
            <span>Sign In</span>
            <ArrowRight size={12} className="text-[#E8D3A2]" />
          </Link>
        )}
      </div>
    </nav>
  );
}
