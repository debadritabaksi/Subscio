import { Compass, RadioReceiver, ShieldEllipsis } from "lucide-react";

export default function CapabilitiesTriptych() {
  return (
    <section className="relative w-full overflow-hidden py-20 border-y border-gold/10">
      {/* 1A. Section-Specific Atmospheric Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2000&auto=format&fit=crop" 
          alt="Server Corridor" 
          className="w-full h-full object-cover opacity-45 md:opacity-55 filter blur-[2px] mix-blend-luminosity" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C1519] via-[#0C1519]/50 md:via-[#0C1519]/60 to-[#0C1519]" />
      </div>

      <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-3 gap-8 relative z-10">
        
        <div className="card-interactive-pop bg-[#162127] bg-opacity-40 backdrop-blur-xl -webkit-backdrop-blur-xl border border-[#CA9C68]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_20px_35px_-10px_rgba(0,0,0,0.5)] relative z-20 p-12 space-y-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_35px_-10px_rgba(232,181,70,0.25)] hover:border-[#E8B546] rounded-lg">
          <Compass size={40} className="text-gold" />
          <h3 className="text-[24px] font-semibold text-pearl">Discovery</h3>
          <p className="text-pearl/70 text-[14px] leading-relaxed">
            Mapping the dark web of corporate activity. Identifying key technical shifts before they hit public press releases.
          </p>
        </div>

        <div className="card-interactive-pop bg-[#162127] bg-opacity-40 backdrop-blur-xl -webkit-backdrop-blur-xl border border-[#CA9C68]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_20px_35px_-10px_rgba(0,0,0,0.5)] relative z-20 p-12 space-y-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_35px_-10px_rgba(232,181,70,0.25)] hover:border-[#E8B546] rounded-lg">
          <RadioReceiver size={40} className="text-gold" />
          <h3 className="text-[24px] font-semibold text-pearl">Harvesting</h3>
          <p className="text-pearl/70 text-[14px] leading-relaxed">
            Sub-second ingestion of technical signals from developer ecosystems, job boards, and cloud infrastructure shifts.
          </p>
        </div>

        <div className="card-interactive-pop bg-[#162127] bg-opacity-40 backdrop-blur-xl -webkit-backdrop-blur-xl border border-[#CA9C68]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_20px_35px_-10px_rgba(0,0,0,0.5)] relative z-20 p-12 space-y-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_35px_-10px_rgba(232,181,70,0.25)] hover:border-[#E8B546] rounded-lg">
          <ShieldEllipsis size={40} className="text-gold" />
          <h3 className="text-[24px] font-semibold text-pearl">Outreach Safeguards</h3>
          <p className="text-pearl/70 text-[14px] leading-relaxed">
            Automated compliance filters ensuring all signals meet global SOC2 and GDPR requirements before agent activation.
          </p>
        </div>

      </div>
    </section>
  );
}
