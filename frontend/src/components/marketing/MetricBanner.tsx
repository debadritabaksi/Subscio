import RollingNumber from "./RollingNumber";

export default function MetricBanner() {
  return (
    <section className="border-y border-gold/10 bg-jungle/60 backdrop-blur-sm py-8 mt-12">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="flex flex-col border-l border-gold/20 pl-6">
          <span className="text-pearl/60 text-[11px] font-extrabold uppercase tracking-widest">
            Global Data Logs
          </span>
          <span className="text-[30px] font-bold">
            <RollingNumber target={4.2} decimals={1} className="text-metallic-gold" />
            <span className="text-metallic-gold">M+</span>
          </span>
        </div>
        
        <div className="flex flex-col border-l border-gold/20 pl-6">
          <span className="text-pearl/60 text-[11px] font-extrabold uppercase tracking-widest">
            Ingestion Latency
          </span>
          <span className="text-[30px] font-bold">
            <RollingNumber target={15} className="text-metallic-gold" />
            <span className="text-metallic-gold ml-1">Min</span>
          </span>
        </div>
        
        <div className="flex flex-col border-l border-gold/20 pl-6">
          <span className="text-pearl/60 text-[11px] font-extrabold uppercase tracking-widest">
            Model Precision
          </span>
          <span className="text-[30px] font-bold">
            <RollingNumber target={99.4} decimals={1} className="text-metallic-gold" />
            <span className="text-metallic-gold">%</span>
          </span>
        </div>
        
        <div className="flex flex-col border-l border-gold/20 pl-6">
          <span className="text-pearl/60 text-[11px] font-extrabold uppercase tracking-widest">
            Score Threshold
          </span>
          <span className="text-[30px] font-bold">
            <RollingNumber target={90} className="text-metallic-gold" />
            <span className="text-metallic-gold">+</span>
            <span className="text-xs font-mono text-metallic-gold align-middle ml-2">FIRELOCK</span>
          </span>
        </div>
      </div>
    </section>
  );
}
