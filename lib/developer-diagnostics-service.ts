import Constants from "expo-constants";
import { Platform } from "react-native";

import {
  classifyTermuxError,
  collectRecentNormalizedErrors,
  createOperationContext,
  summarizeOutput,
  type RecentNormalizedError,
} from "@/lib/command-execution-service";
import type { LogEntry } from "@/lib/feature-context";
import { checkPermission, permissionRequirements } from "@/lib/permissions";
import { checkRootAccess } from "@/lib/root-service";
import { checkTermuxConnection } from "@/lib/termux-service";
import { createTRPCClient } from "@/lib/trpc";

export type DiagnosticsCheckStatus = "pass" | "warn" | "fail";

export interface DiagnosticsCheck {
  key: string;
  status: DiagnosticsCheckStatus;
  durationMs: number;
  details: string;
  normalizedErrorCode?: string;
}

export interface DeveloperDiagnosticsReport {
  reportVersion: string;
  appVersion: string;
  buildEnvironment: string;
  timestamp: string;
  sessionId: string;
  device: {
    platform: string;
    platformVersion: string;
    model: string;
    fingerprint?: string;
  };
  environment: {
    appOwnership: string;
    executionEnvironment: string;
  };
  prerequisites: {
    termuxStatus: string;
    rootAvailable: boolean;
    magiskAvailable: boolean;
    permissionSummary: string;
  };
  backendConnectivity: {
    ok: boolean;
    details: string;
  };
  executionLayerChecks: DiagnosticsCheck[];
  featureChecks: DiagnosticsCheck[];
  recentNormalizedErrors: RecentNormalizedError[];
  finalReadinessSummary: {
    status: "ready" | "degraded" | "blocked";
    score: number;
    notes: string[];
  };
  checks: DiagnosticsCheck[];
  failingChecks: string[];
  recommendations: string[];
  debugSummaryForChat: string;
}

async function runCheck(
  key: string,
  fn: () => Promise<Omit<DiagnosticsCheck, "key" | "durationMs">>,
): Promise<DiagnosticsCheck> {
  const start = Date.now();
  try {
    const result = await fn();
    return {
      key,
      durationMs: Date.now() - start,
      ...result,
    };
  } catch (error) {
    return {
      key,
      durationMs: Date.now() - start,
      status: "fail",
      details: String(error),
      normalizedErrorCode: "UNEXPECTED_EXCEPTION",
    };
  }
}

export async function runDeveloperDiagnostics(logs: LogEntry[] = []): Promise<DeveloperDiagnosticsReport> {
  const context = createOperationContext("developer-diagnostics");

  const checks: DiagnosticsCheck[] = [];

  checks.push(
    await runCheck("runtime", async () => ({
      status: "pass",
      details: `Platform=${Platform.OS} ${String(Platform.Version)}, appOwnership=${Constants.appOwnership ?? "unknown"}`,
    })),
  );

  const permissionsCheck = await runCheck("permissions", async () => {
    const statuses = await Promise.all(
      permissionRequirements.map(async (requirement) => ({
        id: requirement.id,
        status: await checkPermission(requirement),
      })),
    );

    const blocked = statuses.filter((item) => item.status === "blocked" || item.status === "denied");
    return {
      status: blocked.length > 0 ? "warn" : "pass",
      details: statuses.map((s) => `${s.id}:${s.status}`).join(", "),
    };
  });
  checks.push(permissionsCheck);

  const rootTermuxCheck = await runCheck("root-termux", async () => {
    const root = await checkRootAccess();
    const termux = await checkTermuxConnection();
    return {
      status: termux === "connected" ? "pass" : "warn",
      details: `termux=${termux}; root=${root.hasRoot}; magisk=${root.hasMagisk}`,
    };
  });
  checks.push(rootTermuxCheck);

  const backendConnectivityCheck = await runCheck("backend-connectivity", async () => {
    const client = createTRPCClient();
    const health = await client.system.health.query({ timestamp: Date.now() });
    return {
      status: health.ok ? "pass" : "fail",
      details: `system.health.ok=${String(health.ok)}`,
    };
  });
  checks.push(backendConnectivityCheck);

  const executionLayerCheck = await runCheck("execution-layer", async () => {
    const timeoutCode = classifyTermuxError({ success: false, output: "", error: "timed out" });
    const sampleSummary = summarizeOutput("line1\nline2");
    return {
      status: timeoutCode === "TIMEOUT" ? "pass" : "fail",
      details: `errorCodeSample=${timeoutCode}; summary=${sampleSummary}`,
    };
  });
  checks.push(executionLayerCheck);

  const featureChecks: DiagnosticsCheck[] = [];

  featureChecks.push(
    await runCheck("feature-permissions", async () => {
      const blocked = permissionsCheck.details.includes(":blocked") || permissionsCheck.details.includes(":denied");
      return {
        status: blocked ? "warn" : "pass",
        details: blocked
          ? "Brak wszystkich wymaganych uprawnień dla feature modyfikujących."
          : "Uprawnienia wystarczające dla feature read-only i większości modyfikujących.",
      };
    }),
  );

  featureChecks.push(
    await runCheck("high-risk-features", async () => {
      const root = await checkRootAccess();
      const termux = await checkTermuxConnection();
      return {
        status: root.hasRoot && termux === "connected" ? "pass" : "warn",
        details:
          root.hasRoot && termux === "connected"
            ? "Game Boost / Advanced Tools mogą wykonywać realne komendy."
            : "Brak root lub Termux ograniczy działania high-risk do fallbacków/read-only.",
      };
    }),
  );

  featureChecks.push(
    await runCheck("backend-logs-flow", async () => {
      const status = backendConnectivityCheck.status;
      return {
        status: status === "pass" ? "pass" : "warn",
        details:
          status === "pass"
            ? "Backend dostępny: feature.logs.add/list powinny działać."
            : "Backend niedostępny: logi przejdą tylko lokalnie (device context).",
      };
    }),
  );

  checks.push(...featureChecks);

  const failingChecks = checks
    .filter((check) => check.status !== "pass")
    .map((check) => `${check.key}:${check.status}`);

  const recommendations: string[] = [];
  if (checks.find((check) => check.key === "root-termux")?.status !== "pass") {
    recommendations.push("Skonfiguruj Termux + Termux:API i potwierdź dostęp do localhost:8080.");
  }
  if (checks.find((check) => check.key === "permissions")?.status !== "pass") {
    recommendations.push("Nadaj brakujące uprawnienia w Permissions Onboarding.");
  }
  if (checks.find((check) => check.key === "backend-connectivity")?.status !== "pass") {
    recommendations.push("Uruchom backend (`pnpm dev:server`) i sprawdź konfigurację API base URL.");
  }

  const recentNormalizedErrors = collectRecentNormalizedErrors(logs, 8);
  if (recentNormalizedErrors.length > 0) {
    recommendations.push("Przeanalizuj recentNormalizedErrors i usuń powtarzalne błędy z tej samej klasy.");
  }

  const failingCount = failingChecks.length;
  const readinessStatus: "ready" | "degraded" | "blocked" =
    failingCount === 0 ? "ready" : checks.some((item) => item.status === "fail") ? "blocked" : "degraded";
  const readinessScore = Math.max(0, Math.round(((checks.length - failingCount) / checks.length) * 100));
  const readinessNotes = [
    readinessStatus === "ready"
      ? "Środowisko gotowe do szerokiego testu na urządzeniu."
      : "Przed pełnym testem runtime popraw failing checks.",
    `Pass ratio: ${checks.length - failingCount}/${checks.length}`,
  ];

  const report: DeveloperDiagnosticsReport = {
    reportVersion: "2.0",
    appVersion: Constants.expoConfig?.version ?? "unknown",
    buildEnvironment: Constants.executionEnvironment,
    timestamp: new Date().toISOString(),
    sessionId: context.sessionId,
    device: {
      platform: Platform.OS,
      platformVersion: String(Platform.Version),
      model: Constants.deviceName ?? "unknown",
      fingerprint: Constants.expoConfig?.android?.package,
    },
    environment: {
      appOwnership: Constants.appOwnership ?? "unknown",
      executionEnvironment: Constants.executionEnvironment,
    },
    prerequisites: {
      termuxStatus: rootTermuxCheck.details.includes("termux=connected") ? "connected" : "disconnected",
      rootAvailable: rootTermuxCheck.details.includes("root=true"),
      magiskAvailable: rootTermuxCheck.details.includes("magisk=true"),
      permissionSummary: permissionsCheck.details,
    },
    backendConnectivity: {
      ok: backendConnectivityCheck.status === "pass",
      details: backendConnectivityCheck.details,
    },
    executionLayerChecks: [executionLayerCheck],
    featureChecks,
    recentNormalizedErrors,
    finalReadinessSummary: {
      status: readinessStatus,
      score: readinessScore,
      notes: readinessNotes,
    },
    checks,
    failingChecks,
    recommendations,
    debugSummaryForChat: [
      `reportVersion=2.0`,
      `appVersion=${Constants.expoConfig?.version ?? "unknown"}`,
      `sessionId=${context.sessionId}`,
      `platform=${Platform.OS} ${String(Platform.Version)}`,
      `failingChecks=${failingChecks.join("|") || "none"}`,
      `recentErrors=${recentNormalizedErrors.map((item) => item.code).join("|") || "none"}`,
      `readiness=${readinessStatus}(${readinessScore}%)`,
      `recommendations=${recommendations.join(" | ") || "none"}`,
    ].join("\n"),
  };

  return report;
}
