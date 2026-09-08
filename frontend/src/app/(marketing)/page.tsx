import HeroSection from "@/components/marketing/HeroSection";
import ArchitectureWalkthrough from "@/components/marketing/ArchitectureWalkthrough";
import AgentBentoGrid from "@/components/marketing/AgentBentoGrid";
import FoundersRegistry from "@/components/marketing/FoundersRegistry";
import Footer from "@/components/marketing/Footer";
import EarthRotationFallback from "@/components/marketing/EarthRotationFallback";

export default function MarketingPage() {
  return (
    <div className="relative min-h-screen w-full selection:bg-teal-500/30 text-pearl overflow-x-hidden">
      {/* Cinematic Orbital Earth Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        {/* Video Layer */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="/assets/hero-bg.jpg"
        >
          <source src="/assets/earth-orbit-loop.webm" type="video/webm" />
          <source src="/assets/earth-orbit-loop.mp4" type="video/mp4" />
        </video>
        {/* Canvas Fallback: Continuous Earth Rotation */}
        <div className="absolute inset-0">
          <EarthRotationFallback />
        </div>
        {/* Overlay gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 pointer-events-none" />
      </div>

      <main className="relative z-10">
        <HeroSection />
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
