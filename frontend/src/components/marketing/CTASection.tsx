import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-24 px-8 max-w-7xl mx-auto">
      <div className="relative overflow-hidden border-metallic-gold bg-jungle/90 backdrop-blur-md p-16 md:p-24 text-center rounded-lg shadow-[0_0_60px_rgba(202,156,104,0.15)]">
        
        {/* Background Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{
            backgroundImage: "linear-gradient(var(--color-gold) 1px, transparent 1px), linear-gradient(90deg, var(--color-gold) 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }}
        />

        <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
          <h2 className="text-[48px] md:text-[60px] text-pearl tracking-tight uppercase font-bold leading-none">
            Ready to Automate Your Revenue Infrastructure?
          </h2>
          <p className="text-pearl/80 text-[20px]">
            The next signal is being generated now. Be there to harvest it.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 pt-8">
            <Link href="/register" className="btn-metallic-gold px-12 py-5 text-[11px] font-extrabold uppercase tracking-[0.2em] transition-colors rounded-sm inline-flex justify-center items-center">
              REGISTER WORKSPACE
            </Link>
            <Link href="/login" className="border border-metallic-gold text-pearl px-12 py-5 text-[11px] font-extrabold uppercase tracking-[0.2em] hover:bg-gold/10 transition-all rounded-sm inline-flex justify-center items-center">
              SIGN IN
            </Link>
          </div>
          
          <div className="pt-12 flex justify-center gap-8 md:gap-12 items-center opacity-60 flex-wrap">
            <span className="font-mono text-[10px] uppercase text-metallic-gold tracking-widest">
              SOC2 Type II
            </span>
            <span className="font-mono text-[10px] uppercase text-metallic-gold tracking-widest">
              GDPR COMPLIANT
            </span>
            <span className="font-mono text-[10px] uppercase text-metallic-gold tracking-widest">
              ISO 27001
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
