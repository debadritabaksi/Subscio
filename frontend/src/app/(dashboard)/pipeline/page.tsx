"use client";

import { useGlobal } from "@/app/context/GlobalContext";
import { useRouter } from "next/navigation";
import WorkspaceSetupCard from "@/components/WorkspaceSetupCard";
import PipelineTable from "@/components/PipelineTable";

export default function PipelinePage() {
  const { isConfigured } = useGlobal();

  if (!isConfigured) {
    return <WorkspaceSetupCard />;
  }

  return (
    <div className="flex-1 flex flex-col bg-alabaster">
      <PipelineTable />
    </div>
  );
}
