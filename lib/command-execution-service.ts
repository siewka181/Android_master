import {
  checkTermuxConnection,
  executeTermuxCommand,
  type TermuxCommand,
  type TermuxResult,
} from "./termux-service";
import type { LogEntry } from "./feature-context";

export type AddLogFn = (
  level: "SUCCESS" | "WARN" | "ERROR" | "INFO" | "XDR",
  message: string,
) => void;

export type CommandExecutionStatus =
  | "success"
  | "failed"
  | "missing-termux"
  | "missing-root"
  | "timeout";

export type NormalizedErrorCode =
  | "NONE"
  | "TERMUX_UNAVAILABLE"
  | "ROOT_REQUIRED"
  | "TIMEOUT"
  | "PERMISSION_DENIED"
  | "COMMAND_FAILED"
  | "UNKNOWN";

export type OperationContext = {
  featureId: string;
  operationId: string;
  sessionId: string;
  timestamp: string;
};

export type CommandExecutionResult = {
  status: CommandExecutionStatus;
  output?: string;
  outputSummary?: string;
  error?: string;
  errorCode: NormalizedErrorCode;
  operationId: string;
  sessionId: string;
  timestamp: string;
  attempts: number;
};

export type RecentNormalizedError = {
  code: NormalizedErrorCode;
  message: string;
  timestamp: string;
};

export type CommandDefinition = {
  id: string;
  command: string;
  args?: readonly string[];
  requiresRoot?: boolean;
  timeout?: number;
  retries?: number;
  successMessage: string;
  manualStepHint?: string;
};

export function createOperationContext(featureId: string, sessionId?: string): OperationContext {
  const now = new Date();
  const finalSessionId = sessionId ?? `session-${now.getTime()}`;
  return {
    featureId,
    operationId: `${featureId}-${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
    sessionId: finalSessionId,
    timestamp: now.toISOString(),
  };
}

async function hasRootAccess(): Promise<boolean> {
  const result = await executeTermuxCommand({
    command: "su",
    args: ["-c", "id"],
    timeout: 4000,
  });

  return result.success && result.output.includes("uid=0");
}

export function summarizeOutput(output?: string): string {
  if (!output || !output.trim()) return "(no output)";
  const singleLine = output.replace(/\s+/g, " ").trim();
  return singleLine.length > 220 ? `${singleLine.slice(0, 220)}...` : singleLine;
}

export function classifyTermuxError(result: TermuxResult): NormalizedErrorCode {
  if (result.success) return "NONE";

  const merged = `${result.error ?? ""} ${result.output ?? ""}`.toLowerCase();
  if (merged.includes("timeout") || merged.includes("timed out")) return "TIMEOUT";
  if (merged.includes("permission denied") || merged.includes("operation not permitted")) {
    return "PERMISSION_DENIED";
  }
  if (merged.trim().length > 0) return "COMMAND_FAILED";
  return "UNKNOWN";
}

export function extractNormalizedErrorCodeFromMessage(
  message: string,
): NormalizedErrorCode | null {
  const match = message.match(/\(([^)]+)\):/);
  if (!match) return null;

  const code = match[1] as NormalizedErrorCode;
  const valid: NormalizedErrorCode[] = [
    "NONE",
    "TERMUX_UNAVAILABLE",
    "ROOT_REQUIRED",
    "TIMEOUT",
    "PERMISSION_DENIED",
    "COMMAND_FAILED",
    "UNKNOWN",
  ];

  return valid.includes(code) ? code : null;
}

export function collectRecentNormalizedErrors(
  logs: LogEntry[],
  limit = 10,
): RecentNormalizedError[] {
  const result: RecentNormalizedError[] = [];

  for (let index = logs.length - 1; index >= 0; index -= 1) {
    const log = logs[index];
    if (log.level !== "ERROR") continue;

    const code = extractNormalizedErrorCodeFromMessage(log.message);
    if (!code) continue;

    result.push({
      code,
      message: log.message,
      timestamp: log.timestamp,
    });

    if (result.length >= limit) break;
  }

  return result;
}

function buildResult(
  partial: Omit<CommandExecutionResult, "outputSummary"> & { outputSummary?: string },
): CommandExecutionResult {
  return {
    ...partial,
    outputSummary: partial.outputSummary ?? summarizeOutput(partial.output),
  };
}

export async function executeCommandWithGuards(
  definition: CommandDefinition,
  addLog: AddLogFn,
  context: OperationContext,
): Promise<CommandExecutionResult> {
  const connection = await checkTermuxConnection();
  if (connection !== "connected") {
    addLog("WARN", "Termux API is not reachable. Install/configure Termux:API first.");
    return buildResult({
      status: "missing-termux",
      error: "termux-not-connected",
      errorCode: "TERMUX_UNAVAILABLE",
      operationId: context.operationId,
      sessionId: context.sessionId,
      timestamp: context.timestamp,
      attempts: 0,
    });
  }

  if (definition.requiresRoot) {
    const rootGranted = await hasRootAccess();
    if (!rootGranted) {
      addLog("WARN", "Root access is required for this action (Magisk/su).");
      return buildResult({
        status: "missing-root",
        error: "root-required",
        errorCode: "ROOT_REQUIRED",
        operationId: context.operationId,
        sessionId: context.sessionId,
        timestamp: context.timestamp,
        attempts: 0,
      });
    }
  }

  const termuxCommand: TermuxCommand = {
    command: definition.command,
    args: definition.args ? [...definition.args] : undefined,
    timeout: definition.timeout ?? 12000,
  };

  const maxAttempts = Math.max(1, 1 + (definition.retries ?? 0));
  let attempt = 0;
  let lastResult: TermuxResult = { success: false, output: "", error: "unknown" };

  while (attempt < maxAttempts) {
    attempt += 1;
    addLog(
      "INFO",
      `[${context.operationId}] attempt ${attempt}/${maxAttempts}: ${definition.command} ${(definition.args ?? []).join(" ")}`.trim(),
    );

    lastResult = await executeTermuxCommand(termuxCommand);
    if (lastResult.success) break;
  }

  const errorCode = classifyTermuxError(lastResult);
  const outputSummary = summarizeOutput(lastResult.output);

  if (lastResult.success) {
    addLog("SUCCESS", `${definition.successMessage} (op=${context.operationId})`);
    if (definition.manualStepHint) {
      addLog("INFO", definition.manualStepHint);
    }
    if (outputSummary !== "(no output)") {
      addLog("INFO", outputSummary);
    }

    return buildResult({
      status: "success",
      output: lastResult.output,
      outputSummary,
      errorCode,
      operationId: context.operationId,
      sessionId: context.sessionId,
      timestamp: context.timestamp,
      attempts: attempt,
    });
  }

  const status: CommandExecutionStatus = errorCode === "TIMEOUT" ? "timeout" : "failed";
  const normalizedError = lastResult.error ?? lastResult.output ?? "unknown error";
  addLog(
    "ERROR",
    `[${context.operationId}] ${status.toUpperCase()} (${errorCode}): ${normalizedError}`,
  );

  return buildResult({
    status,
    output: lastResult.output,
    error: normalizedError,
    errorCode,
    operationId: context.operationId,
    sessionId: context.sessionId,
    timestamp: context.timestamp,
    attempts: attempt,
  });
}
