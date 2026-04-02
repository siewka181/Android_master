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
  getFeatureState: (featureId: string) => {
    operationStatus: OperationStatus;
    lastOperationTime: string | null;
  };
  setFeatureOperationStatus: (featureId: string, status: OperationStatus) => void;
  setFeatureLastOperationTime: (featureId: string, time: string) => void;
  resetFeatureState: (featureId: string) => void;
  operationStatus: OperationStatus;
  setOperationStatus: (status: OperationStatus) => void;
  lastOperationTime: string | null;
  setLastOperationTime: (time: string) => void;
}

const FeatureContext = createContext<FeatureContextType | undefined>(undefined);
const GLOBAL_FEATURE_ID = "__global__";
const DEFAULT_STATE = {
  operationStatus: "idle" as OperationStatus,
  lastOperationTime: null as string | null,
};

export function FeatureProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [featureStates, setFeatureStates] = useState<
    Record<string, { operationStatus: OperationStatus; lastOperationTime: string | null }>
  >({
    [GLOBAL_FEATURE_ID]: DEFAULT_STATE,
  });

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

  const getFeatureState = (featureId: string) => featureStates[featureId] ?? DEFAULT_STATE;

  const setFeatureOperationStatus = (featureId: string, status: OperationStatus) => {
    setFeatureStates((prev) => ({
      ...prev,
      [featureId]: {
        ...(prev[featureId] ?? DEFAULT_STATE),
        operationStatus: status,
      },
    }));
  };

  const setFeatureLastOperationTime = (featureId: string, time: string) => {
    setFeatureStates((prev) => ({
      ...prev,
      [featureId]: {
        ...(prev[featureId] ?? DEFAULT_STATE),
        lastOperationTime: time,
      },
    }));
  };

  const resetFeatureState = (featureId: string) => {
    setFeatureStates((prev) => ({
      ...prev,
      [featureId]: DEFAULT_STATE,
    }));
  };

  // Backward-compatible API used by older screens.
  const operationStatus = getFeatureState(GLOBAL_FEATURE_ID).operationStatus;
  const lastOperationTime = getFeatureState(GLOBAL_FEATURE_ID).lastOperationTime;
  const setOperationStatus = (status: OperationStatus) =>
    setFeatureOperationStatus(GLOBAL_FEATURE_ID, status);
  const setLastOperationTime = (time: string) =>
    setFeatureLastOperationTime(GLOBAL_FEATURE_ID, time);

  return (
    <FeatureContext.Provider
      value={{
        logs,
        addLog,
        clearLogs,
        getFeatureState,
        setFeatureOperationStatus,
        setFeatureLastOperationTime,
        resetFeatureState,
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
