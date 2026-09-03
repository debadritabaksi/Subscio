"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface GlobalContextType {
  isConfigured: boolean;
  setIsConfigured: (val: boolean) => void;
  orgId: string;
  setOrgId: (val: string) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalProvider({ children }: { children: ReactNode }) {
  // Cold start: defaults to true now, as configuration happens during registration
  const [isConfigured, setIsConfigured] = useState(true);
  const [orgId, setOrgId] = useState("default-tenant");

  return (
    <GlobalContext.Provider
      value={{
        isConfigured,
        setIsConfigured,
        orgId,
        setOrgId,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }
  return context;
}
