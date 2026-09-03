"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useGlobal } from "@/app/context/GlobalContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DashboardProvider } from "@/components/DashboardContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { isConfigured } = useGlobal();

  useEffect(() => {
    // Client-side auth check (Phase 1)
    const auth = localStorage.getItem("subscio_auth");
    if (!auth) {
      router.replace("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  useEffect(() => {
    if (isAuthenticated && !isConfigured) {
      if (pathname === "/pipeline" || pathname === "/compliance-ledger") {
        router.replace("/dashboard");
      }
    }
  }, [isAuthenticated, isConfigured, pathname, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0C1519] text-[#F8FAFC] flex items-center justify-center">
        <div className="animate-pulse font-bold uppercase tracking-widest text-[#CA9C68] text-sm">
          Loading Workspace...
        </div>
      </div>
    );
  }

  return (
    <DashboardProvider>
      <div className="flex flex-col min-h-screen bg-[#0C1519] text-[#F8FAFC]">
        <Navbar />
        {/* Changed flex-1 to flex-grow w-full to force footer to the absolute bottom */}
        <main className="flex-grow w-full flex flex-col border-b border-[#CA9C68]/20">
          {children}
        </main>
        <Footer />
      </div>
    </DashboardProvider>
  );
}
