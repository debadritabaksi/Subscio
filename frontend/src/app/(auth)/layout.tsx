import Link from "next/link";
import { Activity } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative flex flex-col bg-[#0C1519]">
      <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-15 mix-blend-screen z-0" alt="Networking Tech Background" />
      
      {/* ── Auth Header (Minimal) ────────────────────────────────────── */}
      <header className="p-8 flex justify-center relative z-10">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-red-50 text-red-700 rounded-md flex items-center justify-center">
            <Activity size={18} strokeWidth={2.5} />
          </div>
          <h1 className="text-xl font-bold tracking-tight uppercase leading-none text-white">Subscio</h1>
        </Link>
      </header>

      {/* ── Auth Content ─────────────────────────────────────────────── */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* ── Auth Footer ──────────────────────────────────────────────── */}
      <footer className="p-6 text-center text-xs text-gray-500 relative z-10">
        <p>&copy; {new Date().getFullYear()} Subscio Inc. Secure B2B Platform.</p>
      </footer>
    </div>
  );
}
