import { ShieldCheck, Lock, Activity, GitBranch, Globe, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#CA9C68]/20 bg-[#0C1519]/50 mt-auto py-12 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Column 1: Branding & Description */}
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-red-50 text-red-700 rounded-md flex items-center justify-center shrink-0">
              <Activity size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight uppercase leading-none text-[#F8FAFC]">Subscio</h2>
              <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Signals Engine</span>
            </div>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed mb-6">
            AI-powered sales intelligence platform. We capture dark funnel signals to help B2B revenue teams close deals faster.
          </p>
          <div className="flex gap-3">
            <a href="#" className="w-8 h-8 rounded-md border border-[#CA9C68]/20 flex items-center justify-center bg-[#162127]/70 hover:bg-[#0C1519]/80 transition-colors text-gray-400">
              <Mail size={14} />
            </a>
            <a href="#" className="w-8 h-8 rounded-md border border-[#CA9C68]/20 flex items-center justify-center bg-[#162127]/70 hover:bg-[#0C1519]/80 transition-colors text-gray-400">
              <Globe size={14} />
            </a>
            <a href="#" className="w-8 h-8 rounded-md border border-[#CA9C68]/20 flex items-center justify-center bg-[#162127]/70 hover:bg-[#0C1519]/80 transition-colors text-gray-400">
              <GitBranch size={14} />
            </a>
          </div>
        </div>

        {/* Column 2: Product */}
        <div>
          <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-[#F8FAFC]">Product</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><a href="#" className="hover:text-accent-blue transition-colors">Signal Harvester</a></li>
            <li><a href="#" className="hover:text-accent-blue transition-colors">Intent Classifier</a></li>
            <li><a href="#" className="hover:text-accent-blue transition-colors">Outreach Engine</a></li>
            <li><a href="#" className="hover:text-accent-blue transition-colors">Integrations</a></li>
            <li><a href="#" className="hover:text-accent-blue transition-colors">Pricing</a></li>
          </ul>
        </div>

        {/* Column 3: Resources */}
        <div>
          <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-[#F8FAFC]">Resources</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><a href="#" className="hover:text-accent-blue transition-colors">Documentation</a></li>
            <li><a href="#" className="hover:text-accent-blue transition-colors">API Reference</a></li>
            <li><a href="#" className="hover:text-accent-blue transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-accent-blue transition-colors">Case Studies</a></li>
            <li><a href="#" className="hover:text-accent-blue transition-colors">Help Center</a></li>
          </ul>
        </div>

        {/* Column 4: Compliance & Legal */}
        <div>
          <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-[#F8FAFC]">Trust & Compliance</h3>
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <ShieldCheck size={16} className="text-green-600" />
              <span>SOC2 Type II Certified</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Lock size={16} className="text-blue-600" />
              <span>GDPR & CCPA Compliant</span>
            </div>
          </div>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><a href="#" className="hover:text-[#F8FAFC] transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-[#F8FAFC] transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-[#CA9C68]/20 text-center text-xs text-gray-500">
        &copy; {currentYear} Subscio Inc. All rights reserved.
      </div>
    </footer>
  );
}

