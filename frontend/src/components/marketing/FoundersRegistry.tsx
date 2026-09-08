"use client";

import { useState } from "react";
import { RotateCw, User, Sparkles } from "lucide-react";

/* ── Inline SVG Social Icons for Bulletproof Rendering ─────────── */
function LinkedInIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

function GitHubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

/* ── Team Member Model & Configuration ─────────────────────────── */
interface TeamMember {
  id: string;
  name: string;
  role: string;
  badge: string;
  photoUrl: string;
  description: string;
  socials: {
    linkedin: string;
    github: string;
    instagram: string;
  };
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "member-1",
    name: "Debadrita Baksi",
    role: "Founder, Lead AI/Systems Architect & Full Stack Developer",
    badge: "FOUNDER",
    photoUrl: "/debadrita.jpg",
    description: "Architected the core AI intelligence engine, multi-agent pipeline, and deterministic LLM prompt logic to power real-time signal ingestion. Contributed across the full stack to seamlessly integrate these AI models into a production-ready application.",
    socials: {
      linkedin: "https://linkedin.com/in/debadrita-baksi",
      github: "https://github.com/debadritabaksi",
      instagram: "https://instagram.com/debadrita",
    },
  },
  {
    id: "member-2",
    name: "Debjeet Mazumder",
    role: "Co-Founder & Head of Platform Engineering",
    badge: "CO-FOUNDER",
    photoUrl: "/debjeet.jpg",
    description: "Led the platform's full-stack architecture, focusing on complex client-side state management, API reliability, and database schema integrity. Engineered the secure compliance ledger and real-time dashboard data flow to ensure an enterprise-grade user experience.",
    socials: {
      linkedin: "https://linkedin.com/in/debjeet-mazumder",
      github: "https://github.com/debjeetmazumder",
      instagram: "https://instagram.com/debjeet",
    },
  },
];

export default function FoundersRegistry() {
  const [isLocked, setIsLocked] = useState(false);

  return (
    <section className="relative w-full overflow-hidden py-24 bg-transparent border-b border-white/10">
      <div className="relative z-10 px-8 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-white/10 pb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-[#E8B546]" />
              <span className="text-xs font-mono font-bold tracking-[0.2em] text-[#E8B546] uppercase">
                Engineering & Founding Team
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#F8FAFC] tracking-tight">
              The Minds Behind Subscio.
            </h2>
            <p className="text-gray-400 text-base md:text-lg mt-2 italic max-w-2xl font-sans">
              &ldquo;Architected at the intersection of autonomous agents and real-time market intent engineered to turn chaotic enterprise signals into deterministic revenue pipeline.&rdquo;
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#F5D061]/90 uppercase tracking-widest bg-slate-950/40 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 shadow-sm">
            <RotateCw size={13} className="text-[#E8B546] animate-spin" style={{ animationDuration: "8s" }} />
            <span>Synchronized Dual Dossier</span>
          </div>
        </div>

        {/* Shared Parent Container with group, perspective, Dynamic Proximity Spotlight, and Softly Pulsing Golden Aura */}
        <div 
          className="group relative max-w-4xl mx-auto cursor-pointer select-none"
          style={{ perspective: "1000px" }}
          onClick={() => setIsLocked(prev => !prev)}
          onMouseMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            event.currentTarget.style.setProperty("--mouse-x", `${x}px`);
            event.currentTarget.style.setProperty("--mouse-y", `${y}px`);
          }}
        >
          {/* Dynamic Proximity Golden Spotlight Layer */}
          <div
            className="absolute -inset-24 pointer-events-none transition-opacity duration-700"
            style={{
              background: `radial-gradient(550px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(245,158,11,0.18), transparent 60%)`,
            }}
          />

          {/* Softly pulsing golden aura behind cards */}
          <div className="absolute -inset-12 bg-[#D4AF37]/20 blur-3xl rounded-full pointer-events-none animate-pulse" />

          {/* Dual-Card Grid */}
          <div className="relative z-10 grid md:grid-cols-2 gap-8">
            {TEAM_MEMBERS.map((member) => (
              <FlippableMemberCard 
                key={member.id} 
                member={member} 
                isSynchronizedFlipped={isLocked}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FlippableMemberCard({ 
  member, 
  isSynchronizedFlipped 
}: { 
  member: TeamMember; 
  isSynchronizedFlipped: boolean;
}) {
  return (
    <div className="h-[570px] w-full">
      {/* 3D Inner Card Container */}
      <div
        className="relative w-full h-full rounded-2xl shadow-2xl transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] transform-style-3d"
        style={{
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
          transform: isSynchronizedFlipped ? "rotateY(180deg)" : undefined,
        }}
      >
        {/* ── FRONT FACE: Luxury Playing Card Aesthetic ──────────── */}          <div className="absolute inset-0 w-full h-full rounded-2xl bg-slate-950/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] p-8 flex flex-col justify-between group-hover:border-white/20 transition-colors overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(0deg)",
          }}
        >
          {/* Subscio Signal-Routing Matrix Pattern with opacity-15 */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.15]" aria-hidden="true">
            <defs>
              <pattern id={`matrix-${member.id}`} x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M16 0 L32 16 L16 32 L0 16 Z" fill="none" stroke="#E8B546" strokeWidth="0.75" />
                <circle cx="16" cy="16" r="1.5" fill="#E8B546" />
                <circle cx="0" cy="0" r="1" fill="#CA9C68" />
                <circle cx="32" cy="0" r="1" fill="#CA9C68" />
                <circle cx="0" cy="32" r="1" fill="#CA9C68" />
                <circle cx="32" cy="32" r="1" fill="#CA9C68" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#matrix-${member.id})`} />
          </svg>
          {/* Ornamental Inner Border */}
          <div className="absolute inset-3 rounded-xl border border-white/10 pointer-events-none" />

          {/* Top Row: Standardized Badge (FOUNDER / CO-FOUNDER) */}
          <div className="relative z-10 flex justify-between items-center">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#F5D061]/90 bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-3.5 py-1 rounded-full uppercase shadow-sm">
              {member.badge}
            </span>
            <span className="text-[10px] font-mono text-pearl/60 uppercase tracking-widest flex items-center gap-1.5">
              <RotateCw size={11} className="text-[#E8B546]/80" /> {isSynchronizedFlipped ? 'Click to Unlock' : 'Click to Lock Dossier'}
            </span>
          </div>

          {/* Center Name: Clean & Bold */}
          <div className="relative z-10 text-center my-auto py-6">
            <h3 className="text-3xl md:text-4xl font-bold text-pearl tracking-tight mb-2">
              {member.name}
            </h3>
            <p className="text-xs font-mono text-[#E8B546]/80 uppercase tracking-[0.25em]">
              {member.badge === "FOUNDER" ? "Chief Executive & Architect" : "Head of Platform Engineering"}
            </p>
          </div>

          {/* Bottom Row: Interaction Cue */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-xs font-mono text-[#F5D061]/80 uppercase tracking-widest">
            <RotateCw size={13} className="text-[#E8B546]/80 animate-spin" style={{ animationDuration: "8s" }} />
            <span>Synchronized Dual-Flip Active</span>
          </div>
        </div>

        {/* ── BACK FACE: Revealed Dossier ─────────────────────────── */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl bg-slate-950/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] p-6 flex flex-col justify-between overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Subscio Signal-Routing Matrix Pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.08] pointer-events-none" aria-hidden="true">
            <use href={`#matrix-${member.id}`} />
          </svg>
          {/* Top: Name & Social Icons */}
          <div className="flex justify-between items-center shrink-0 z-10">
            <div>
              <span className="text-[9px] font-mono font-bold tracking-[0.2em] text-[#E8B546] uppercase block">
                {member.badge}
              </span>
              <h4 className="text-xl font-bold text-pearl tracking-tight truncate">
                {member.name}
              </h4>
            </div>

            {/* Social Icon Links */}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={member.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                title="LinkedIn"
                className="w-8 h-8 rounded-full bg-slate-950/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-pearl/70 hover:text-[#F5D061]/90 hover:border-[#D4AF37]/50 hover:scale-110 transition-all cursor-pointer shadow-md"
              >
                <LinkedInIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={member.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                title="GitHub"
                className="w-8 h-8 rounded-full bg-slate-950/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-pearl/70 hover:text-[#F5D061]/90 hover:border-[#D4AF37]/50 hover:scale-110 transition-all cursor-pointer shadow-md"
              >
                <GitHubIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={member.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                title="Instagram"
                className="w-8 h-8 rounded-full bg-slate-950/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-pearl/70 hover:text-[#F5D061]/90 hover:border-[#D4AF37]/50 hover:scale-110 transition-all cursor-pointer shadow-md"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Middle: Portrait Image - Full Frame Uncropped */}
          <div className="relative w-full my-3 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={member.photoUrl}
              alt={member.name}
              loading="eager"
              className="w-full h-56 object-cover object-top rounded-xl border border-[#D8B26E]/30 shadow-lg"
            />
          </div>

          {/* Bottom: Explicit Executive Title & Detailed Contribution */}
          <div className="shrink-0 z-10 space-y-1">
            <p className="text-[12px] font-bold text-[#F5D061]/90 leading-snug">
              {member.role}
            </p>
            <p className="text-[11px] text-pearl/80 leading-relaxed font-sans line-clamp-4">
              {member.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
