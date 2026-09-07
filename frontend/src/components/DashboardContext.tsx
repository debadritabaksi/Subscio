"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

/* ── Types ────────────────────────────────────────────────────── */
export type DashboardTab = "command" | "pipeline" | "ledger" | "intelligence" | "settings";

export interface UserProfile {
  name: string;
  email: string;
  company: string;
}

interface DashboardContextValue {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  userProfile: UserProfile | null;
  isConfigured: boolean;
  setIsConfigured: (val: boolean) => void;
}

/* ── Context ──────────────────────────────────────────────────── */
const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("command");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // We now use GlobalContext for isConfigured, but we'll import it here for the internal guardrail if needed
  // Actually, better to import useGlobal directly here
  
  useEffect(() => {
    // Read profile from localStorage on mount
    try {
      const raw = localStorage.getItem("subscio_profile");
      if (raw) {
        const parsed = JSON.parse(raw);
        setUserProfile(parsed);
      }
    } catch {
      // Malformed JSON — ignore
    }
  }, []);

  return (
    <DashboardContext.Provider value={{ activeTab, setActiveTab, userProfile, isConfigured: false, setIsConfigured: () => {} }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}
