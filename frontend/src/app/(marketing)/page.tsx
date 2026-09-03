import NavBar from "@/components/marketing/NavBar";
import HeroSection from "@/components/marketing/HeroSection";
import MetricBanner from "@/components/marketing/MetricBanner";
import ArchitectureWalkthrough from "@/components/marketing/ArchitectureWalkthrough";
import CapabilitiesTriptych from "@/components/marketing/CapabilitiesTriptych";
import AgentBentoGrid from "@/components/marketing/AgentBentoGrid";
import FoundersRegistry from "@/components/marketing/FoundersRegistry";
import CTASection from "@/components/marketing/CTASection";
import Footer from "@/components/marketing/Footer";
import NebulaBackground from "@/components/marketing/NebulaBackground";

export default function MarketingPage() {
  return (
    <>
      <NebulaBackground />
      <NavBar />
      <main className="mt-16 pt-8 pb-0">
        <HeroSection />
        <MetricBanner />
        <ArchitectureWalkthrough />
        <CapabilitiesTriptych />
        <AgentBentoGrid />
        <FoundersRegistry />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
