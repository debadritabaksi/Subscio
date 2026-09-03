"use client";

import LiveRadarTicker from "@/components/LiveRadarTicker";
import CommandCanvas from "@/components/CommandCanvas";
import WorkspaceSetupCard from "@/components/WorkspaceSetupCard";
import { useDashboard } from "@/components/DashboardContext";
import { useGlobal } from "@/app/context/GlobalContext";
import { ShieldCheck } from "lucide-react";
import PipelineTable from "@/components/PipelineTable";
import DashboardAnalytics from "@/components/DashboardAnalytics";
import ComplianceLedger from "@/components/ComplianceLedger";

export default function DashboardPage() {
  const { activeTab } = useDashboard();
  const { isConfigured } = useGlobal();

  if (!isConfigured) {
    return <WorkspaceSetupCard />;
  }

  if (activeTab === "pipeline") {
    return <PipelineTable />;
  }

  if (activeTab === "intelligence") {
    return <DashboardAnalytics />;
  }

  if (activeTab === "ledger") {
    return <ComplianceLedger />;
  }

  // Default: Command Center
  return (
    <div className="flex flex-row h-full w-full overflow-hidden">
      <LiveRadarTicker />
      <CommandCanvas />
    </div>
  );
}
