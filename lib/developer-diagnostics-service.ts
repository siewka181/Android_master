import Constants from "expo-constants";
import { Platform } from "react-native";

import { createOperationContext, classifyTermuxError, summarizeOutput } from "@/lib/command-execution-service";
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

export async function runDeveloperDiagnostics(): Promise<DeveloperDiagnosticsReport> {
  const context = createOperationContext("developer-diagnostics");

  const checks: DiagnosticsCheck[] = [];

  checks.push(
    await runCheck("runtime", async () => ({
      status: "pass",
      details: `Platform=${Platform.OS} ${String(Platform.Version)}, appOwnership=${Constants.appOwnership ?? "unknown"}`,
    })),
  );

  checks.push(
    await runCheck("permissions", async () => {
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
    }),
  );

  checks.push(
    await runCheck("root-termux", async () => {
      const root = await checkRootAccess();
      const termux = await checkTermuxConnection();
      return {
        status: termux === "connected" ? "pass" : "warn",
        details: `termux=${termux}; root=${root.hasRoot}; magisk=${root.hasMagisk}`,
      };
    }),
  );

  checks.push(
    await runCheck("backend-connectivity", async () => {
      const client = createTRPCClient();
      const health = await client.system.health.query({ timestamp: Date.now() });
      return {
        status: health.ok ? "pass" : "fail",
        details: `system.health.ok=${String(health.ok)}`,
      };
    }),
  );

  checks.push(
    await runCheck("execution-layer", async () => {
      const timeoutCode = classifyTermuxError({ success: false, output: "", error: "timed out" });
      const sampleSummary = summarizeOutput("line1\nline2");
      return {
        status: timeoutCode === "TIMEOUT" ? "pass" : "fail",
        details: `errorCodeSample=${timeoutCode}; summary=${sampleSummary}`,
      };
    }),
  );

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

  const report: DeveloperDiagnosticsReport = {
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
    checks,
    failingChecks,
    recommendations,
    debugSummaryForChat: [
      `appVersion=${Constants.expoConfig?.version ?? "unknown"}`,
      `sessionId=${context.sessionId}`,
      `platform=${Platform.OS} ${String(Platform.Version)}`,
      `failingChecks=${failingChecks.join("|") || "none"}`,
      `recommendations=${recommendations.join(" | ") || "none"}`,
    ].join("\n"),
  };

  return report;
}
