import {
  checkTermuxConnection,
  executeTermuxCommand,
  type TermuxCommand,
  type TermuxResult,
} from "@/lib/termux-service";

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

export type CommandExecutionResult = {
  status: CommandExecutionStatus;
  output?: string;
  error?: string;
};

export type CommandDefinition = {
  id: string;
  command: string;
  args?: readonly string[];
  requiresRoot?: boolean;
  timeout?: number;
  successMessage: string;
  manualStepHint?: string;
};

async function hasRootAccess(): Promise<boolean> {
  const result = await executeTermuxCommand({
    command: "su",
    args: ["-c", "id"],
    timeout: 4000,
  });

  return result.success && result.output.includes("uid=0");
}

function normalizeResult(result: TermuxResult): CommandExecutionResult {
  if (result.success) {
    return { status: "success", output: result.output };
  }

  if ((result.error ?? "").toLowerCase().includes("timeout")) {
    return { status: "timeout", error: result.error };
  }

  return {
    status: "failed",
    error: result.error ?? result.output ?? "Command failed",
  };
}

export async function executeCommandWithGuards(
  definition: CommandDefinition,
  addLog: AddLogFn,
): Promise<CommandExecutionResult> {
  const connection = await checkTermuxConnection();
  if (connection !== "connected") {
    addLog("WARN", "Termux API is not reachable. Install/configure Termux:API first.");
    return { status: "missing-termux", error: "termux-not-connected" };
  }

  if (definition.requiresRoot) {
    const rootGranted = await hasRootAccess();
    if (!rootGranted) {
      addLog("WARN", "Root access is required for this action (Magisk/su)." );
      return { status: "missing-root", error: "root-required" };
    }
  }

  const termuxCommand: TermuxCommand = {
    command: definition.command,
    args: definition.args ? [...definition.args] : undefined,
    timeout: definition.timeout ?? 12000,
  };

  addLog("INFO", `Executing: ${definition.command} ${(definition.args ?? []).join(" ")}`.trim());
  const result = await executeTermuxCommand(termuxCommand);
  const normalized = normalizeResult(result);

  if (normalized.status === "success") {
    addLog("SUCCESS", definition.successMessage);
    if (definition.manualStepHint) {
      addLog("INFO", definition.manualStepHint);
    }
    if (normalized.output?.trim()) {
      addLog("INFO", normalized.output.trim().slice(0, 220));
    }
  } else if (normalized.status === "timeout") {
    addLog("ERROR", "Operation timed out. Try again when device load is lower.");
  } else {
    addLog("ERROR", `Operation failed: ${normalized.error ?? "unknown error"}`);
  }

  return normalized;
}
