"use client";

import HeroSection from "@/components/marketing/HeroSection";
import ArchitectureWalkthrough from "@/components/marketing/ArchitectureWalkthrough";
import AgentBentoGrid from "@/components/marketing/AgentBentoGrid";
import FoundersRegistry from "@/components/marketing/FoundersRegistry";
import Footer from "@/components/marketing/Footer";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full selection:bg-teal-500/30 text-pearl overflow-x-hidden">
      {/* ── Global Fixed Video Background ── */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none -z-50">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center"
        >
          <source src="/assets/earth-loop.mp4" type="video/mp4" />
        </video>
        {/* Global subtle dark tint to maintain contrast across all sections */}
        <div className="absolute inset-0 bg-slate-950/40" />
      </div>

      {/* ── Hero Section ── */}
      <div className="relative w-full overflow-hidden">
        <HeroSection />
      </div>

      <main className="relative z-10">
        <div id="architecture">
          <ArchitectureWalkthrough />
        </div>
        <div id="agents">
          <AgentBentoGrid />
        </div>
        <div id="team">
          <FoundersRegistry />
        </div>
      </main>

      <Footer />
    </div>
  );
}
