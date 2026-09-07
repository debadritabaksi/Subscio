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
  socials: {
    linkedin: string;
    github: string;
    instagram: string;
  };
}

/**
 * CONFIGURATION:
 * 1. Place photos in `frontend/public/team/`:
 *    - `frontend/public/team/divadrita.jpg`
 *    - `frontend/public/team/devjith.jpg`
 * 2. Update names, roles, and social URLs below.
 */
const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "member-1",
    name: "Debadrita Baksi",
    role: "Lead Full-Stack & AI Systems Architect",
    badge: "Core Architect",
    photoUrl: "/team/divadrita.jpg",
    socials: {
      linkedin: "https://linkedin.com/in/debadrita-baksi",
      github: "https://github.com/debadritabaksi",
      instagram: "https://instagram.com/debadrita",
    },
  },
  {
    id: "member-2",
    name: "Debjeet Mazumder",
    role: "Core Systems & Infrastructure Engineer",
    badge: "Co-Developer",
    photoUrl: "/team/devjith.jpg",
    socials: {
      linkedin: "https://linkedin.com/in/debjeet-mazumder",
      github: "https://github.com/debjeetmazumder",
      instagram: "https://instagram.com/debjeet",
    },
  },
];

export default function FoundersRegistry() {
  return (
    <section className="relative w-full overflow-hidden py-24 bg-[#0C1519]">
      {/* Background Mesh Lighting */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#CA9C68]/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#E8B546]/10 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C1519] via-transparent to-[#0C1519]" />
      </div>

      <div className="relative z-10 px-8 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-[#CA9C68]/20 pb-8 gap-4">
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
              &ldquo;Architected at the intersection of autonomous agents and real-time market intent — engineered to turn chaotic enterprise signals into deterministic revenue pipeline.&rdquo;
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-gray-500 uppercase tracking-widest bg-[#162127]/60 px-3 py-1.5 rounded-full border border-[#CA9C68]/20">
            <RotateCw size={12} className="text-[#CA9C68] animate-spin" style={{ animationDuration: '6s' }} />
            <span>Hover card to reveal portrait</span>
          </div>
        </div>

        {/* Two Flippable Member Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {TEAM_MEMBERS.map((member) => (
            <FlippableMemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FlippableMemberCard({ member }: { member: TeamMember }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group h-[500px] w-full perspective-1000">
      {/* 3D Inner Card Container */}
      <div className="relative w-full h-full rounded-2xl transition-transform duration-700 transform-style-3d group-hover:rotate-y-180 shadow-2xl">

        {/* ── FRONT FACE: Name & Flip Hint Only (No Links) ───────── */}
        <div className="absolute inset-0 w-full h-full rounded-2xl bg-[#162127]/90 backdrop-blur-xl border border-[#CA9C68]/30 p-8 flex flex-col justify-between backface-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_20px_40px_-10px_rgba(0,0,0,0.6)] group-hover:border-[#E8B546]/80 transition-colors">

          {/* Top Row: Badge & Flip Hint */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#E8B546] bg-[#CA9C68]/15 border border-[#CA9C68]/30 px-3 py-1 rounded-full uppercase">
                {member.badge}
              </span>
              <div className="flex items-center gap-1 text-[11px] font-mono text-gray-400 group-hover:text-[#E8B546] transition-colors">
                <RotateCw size={12} />
                <span className="uppercase tracking-wider">Hover to flip</span>
              </div>
            </div>

            {/* Name Only */}
            <h3 className="text-3xl md:text-4xl font-bold text-[#F8FAFC] tracking-tight">
              {member.name}
            </h3>
          </div>

          {/* Bottom Row: Hover Prompt */}
          <div className="pt-6 border-t border-[#CA9C68]/20">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#0C1519]/80 border border-dashed border-[#CA9C68]/30">
              <RotateCw size={16} className="text-[#CA9C68] shrink-0 mt-0.5 animate-spin" style={{ animationDuration: '6s' }} />
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                Hover to reveal who engineered the backend — and everything else behind Subscio.
              </p>
            </div>
          </div>

        </div>

        {/* ── BACK FACE: Portrait Photo, Role & Social Icons ─────── */}
        <div className="absolute inset-0 w-full h-full rounded-2xl bg-[#0C1519] border-2 border-[#E8B546]/80 overflow-hidden rotate-y-180 backface-hidden shadow-[0_20px_45px_-10px_rgba(232,181,70,0.3)] flex flex-col justify-end">

          {/* Photo Render with Graceful Fallback */}
          {!imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={member.photoUrl}
              alt={member.name}
              onError={() => setImgError(true)}
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            /* Fallback when photo file is not yet dropped into public/team */
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#162127] via-[#0C1519] to-[#162127] flex flex-col items-center justify-center p-8 text-center">
              <div className="w-24 h-24 rounded-full border-2 border-[#E8B546]/60 bg-[#CA9C68]/10 flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(232,181,70,0.2)]">
                <User size={40} className="text-[#E8B546]" />
              </div>
              <span className="text-base font-bold text-[#F8FAFC] tracking-tight">{member.name}</span>
              <div className="mt-4 px-3 py-2 rounded-md bg-[#0C1519]/90 border border-dashed border-[#CA9C68]/40 text-[11px] font-mono text-gray-400">
                Place photo at: <span className="text-[#E8B546]">public{member.photoUrl}</span>
              </div>
            </div>
          )}

          {/* Gradient Overlay for Text Legibility */}
          <div className="relative z-10 bg-gradient-to-t from-[#0C1519] via-[#0C1519]/80 to-transparent p-6 pt-20 flex flex-col justify-end">
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#E8B546] uppercase block">
                  {member.badge}
                </span>
                <h4 className="text-2xl font-bold text-[#F8FAFC] tracking-tight">
                  {member.name}
                </h4>
                <p className="text-xs font-mono text-[#CA9C68] mt-1 leading-relaxed">
                  {member.role}
                </p>
              </div>

              {/* Social Icon Links (Symbols Only) */}
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={member.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title="LinkedIn"
                  className="w-8 h-8 rounded-full bg-[#162127]/90 border border-[#CA9C68]/40 flex items-center justify-center text-gray-300 hover:text-[#CA9C68] hover:border-[#CA9C68] hover:scale-110 transition-all"
                >
                  <LinkedInIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href={member.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title="GitHub"
                  className="w-8 h-8 rounded-full bg-[#162127]/90 border border-[#CA9C68]/40 flex items-center justify-center text-gray-300 hover:text-[#CA9C68] hover:border-[#CA9C68] hover:scale-110 transition-all"
                >
                  <GitHubIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href={member.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title="Instagram"
                  className="w-8 h-8 rounded-full bg-[#162127]/90 border border-[#CA9C68]/40 flex items-center justify-center text-gray-300 hover:text-[#CA9C68] hover:border-[#CA9C68] hover:scale-110 transition-all"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}