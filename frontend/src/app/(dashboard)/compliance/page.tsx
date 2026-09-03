"use client";

import { useGlobal } from "@/app/context/GlobalContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import WorkspaceSetupCard from "@/components/WorkspaceSetupCard";
import { ShieldCheck } from "lucide-react";

export default function CompliancePage() {
  const { isConfigured } = useGlobal();
  const router = useRouter();

  if (!isConfigured) {
    return <WorkspaceSetupCard />;
  }

  return (
    <div className="flex-1 flex flex-col bg-alabaster p-12 items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-14 h-14 bg-[#162127]/70 border border-[#CA9C68]/20 rounded-md flex items-center justify-center mx-auto mb-6">
          <ShieldCheck size={24} className="text-[#CA9C68]" />
        </div>
        <h3 className="text-lg font-bold uppercase tracking-wider text-[#F8FAFC] mb-3">Compliance Ledger</h3>
        <p className="text-sm text-gray-400 leading-relaxed">No data logs archived for this context yet. Compliance events will appear here as your signal pipeline processes data.</p>
      </div>
    </div>
  );
}
