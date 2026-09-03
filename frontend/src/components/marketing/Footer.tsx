import Link from "next/link";
import { Hexagon, Disc } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-jungle/95 backdrop-blur-md border-t border-gold/10 pt-24 pb-12 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-24">
          
          {/* Brand Col */}
          <div className="space-y-6">
            <span className="text-[11px] font-extrabold text-metallic-gold uppercase tracking-widest">
              SUBSCIO INTELLIGENCE
            </span>
            <p className="text-pearl/70 text-[14px] leading-relaxed pr-4">
              The world&apos;s first autonomous revenue infrastructure for the enterprise era.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-gold/70 hover:text-metallic-gold transition-colors">
                <Hexagon size={20} />
              </Link>
              <Link href="#" className="text-gold/70 hover:text-metallic-gold transition-colors">
                <Disc size={20} />
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h5 className="text-[11px] font-extrabold uppercase tracking-widest text-metallic-gold mb-8">
              Product
            </h5>
            <ul className="space-y-4 text-[14px] text-pearl/70">
              <li><Link href="#" className="hover:text-metallic-gold transition-colors">Autonomous Ingestion</Link></li>
              <li><Link href="#" className="hover:text-metallic-gold transition-colors">Signal Scoring</Link></li>
              <li><Link href="#" className="hover:text-metallic-gold transition-colors">API Documentation</Link></li>
              <li><Link href="#" className="hover:text-metallic-gold transition-colors">Terminal Console</Link></li>
            </ul>
          </div>

          {/* Compliance Links */}
          <div>
            <h5 className="text-[11px] font-extrabold uppercase tracking-widest text-metallic-gold mb-8">
              Compliance
            </h5>
            <ul className="space-y-4 text-[14px] text-pearl/70">
              <li><Link href="#" className="hover:text-metallic-gold transition-colors">SOC2 Type II Report</Link></li>
              <li><Link href="#" className="hover:text-metallic-gold transition-colors">Privacy Shield</Link></li>
              <li><Link href="#" className="hover:text-metallic-gold transition-colors">GDPR / CCPA</Link></li>
              <li><Link href="#" className="hover:text-metallic-gold transition-colors">Data Processing Addendum</Link></li>
            </ul>
          </div>

          {/* System Logs */}
          <div>
            <h5 className="text-[11px] font-extrabold uppercase tracking-widest text-metallic-gold mb-8">
              System Logs
            </h5>
            <div className="space-y-2 font-mono text-[10px] text-pearl/40">
              <div className="flex justify-between border-b border-gold/10 pb-1">
                <span>INGESTION_V4</span><span className="text-metallic-gold">ONLINE</span>
              </div>
              <div className="flex justify-between border-b border-gold/10 pb-1">
                <span>SEC_NODE_01</span><span className="text-metallic-gold">ONLINE</span>
              </div>
              <div className="flex justify-between border-b border-gold/10 pb-1">
                <span>AGENT_FAB_3</span><span className="text-metallic-gold">ACTIVE</span>
              </div>
              <div className="flex justify-between border-b border-gold/10 pb-1">
                <span>Uptime</span><span className="text-metallic-gold">99.998%</span>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gold/10">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-pearl/60">
            © 2024 SUBSCIO INTELLIGENCE. ALL RIGHTS RESERVED.
          </span>
          <div className="flex gap-8 mt-4 md:mt-0 text-[10px] font-extrabold uppercase tracking-widest text-pearl/60">
            <Link href="#" className="hover:text-metallic-gold transition-colors">Security</Link>
            <Link href="#" className="hover:text-metallic-gold transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-metallic-gold transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
