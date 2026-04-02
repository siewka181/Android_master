import React, { createContext, useContext, useState } from "react";

export type OperationStatus = "idle" | "running" | "success" | "error";

export interface LogEntry {
  id: string;
  timestamp: string;
  level: "SUCCESS" | "WARN" | "ERROR" | "INFO" | "XDR";
  message: string;
}

interface FeatureContextType {
  logs: LogEntry[];
  addLog: (level: LogEntry["level"], message: string) => void;
  clearLogs: () => void;
  operationStatus: OperationStatus;
  setOperationStatus: (status: OperationStatus) => void;
  lastOperationTime: string | null;
  setLastOperationTime: (time: string) => void;
}

const FeatureContext = createContext<FeatureContextType | undefined>(undefined);

export function FeatureProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [operationStatus, setOperationStatus] = useState<OperationStatus>("idle");
  const [lastOperationTime, setLastOperationTime] = useState<string | null>(null);

  const addLog = (level: LogEntry["level"], message: string) => {
    const now = new Date();
    const timestamp = now.toLocaleTimeString();
    const newLog: LogEntry = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp,
      level,
      message,
    };
    setLogs((prev) => [...prev, newLog]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <FeatureContext.Provider
      value={{
        logs,
        addLog,
        clearLogs,
        operationStatus,
        setOperationStatus,
        lastOperationTime,
        setLastOperationTime,
      }}
    >
      {children}
    </FeatureContext.Provider>
  );
}

export function useFeature() {
  const context = useContext(FeatureContext);
  if (!context) {
    throw new Error("useFeature must be used within FeatureProvider");
  }
  return context;
}
