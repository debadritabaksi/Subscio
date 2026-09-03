import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-obsidian/80 backdrop-blur-md border-b border-jungle h-16 flex justify-between items-center px-8 mx-auto left-0 right-0">
      <div className="flex items-center gap-8 max-w-7xl w-full mx-auto justify-between">
        <div className="flex items-center gap-8">
          <span className="text-[24px] font-bold text-metallic-gold tracking-tighter">
            SIGNALS ENGINE
          </span>
          <div className="hidden md:flex gap-6">
            <Link 
              href="#" 
              className="text-[11px] font-extrabold uppercase tracking-widest text-metallic-gold border-b-2 border-gold pb-1"
            >
              Platform Architecture
            </Link>
            <Link 
              href="#" 
              className="text-[11px] font-extrabold uppercase tracking-widest text-pearl/70 hover:text-metallic-gold transition-colors duration-200"
            >
              Autonomous Agents
            </Link>
            <Link 
              href="#" 
              className="text-[11px] font-extrabold uppercase tracking-widest text-pearl/70 hover:text-metallic-gold transition-colors duration-200"
            >
              Security & Compliance
            </Link>
            <Link 
              href="#" 
              className="text-[11px] font-extrabold uppercase tracking-widest text-pearl/70 hover:text-metallic-gold transition-colors duration-200"
            >
              Case Studies
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse shadow-[0_0_8px_var(--color-gold)]"></span>
            <span className="text-[11px] font-extrabold tracking-widest uppercase text-metallic-gold">
              PLATFORM LIVE
            </span>
          </div>
          <button className="btn-metallic-gold px-6 py-2 text-[11px] font-extrabold uppercase tracking-widest transition-all">
            Deploy Harvester →
          </button>
        </div>
      </div>
    </nav>
  );
}
