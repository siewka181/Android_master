import {
  checkTermuxConnection,
  executeTermuxCommand as executeTermuxApiCommand,
} from "@/lib/termux-service";

/**
 * Root Permission Detection Service
 * Detects if the device has root access and Magisk/Termux integration
 */

export type RootStatus = "checking" | "root" | "no-root" | "error";

export interface RootCheckResult {
  status: RootStatus;
  hasRoot: boolean;
  hasMagisk: boolean;
  hasTermux: boolean;
  message: string;
  timestamp: number;
}

export async function checkRootAccess(): Promise<RootCheckResult> {
  try {
    const termuxState = await checkTermuxConnection();
    const hasTermux = termuxState === "connected";

    const suCheck = hasTermux
      ? await executeTermuxApiCommand({ command: "su", args: ["-c", "id"], timeout: 4000 })
      : null;
    const hasRoot = Boolean(suCheck?.success && suCheck.output.includes("uid=0"));

    const magiskCheck = hasTermux
      ? await executeTermuxApiCommand({
          command: "sh",
          args: ["-c", "which magisk"],
          timeout: 4000,
        })
      : null;
    const hasMagisk = Boolean(magiskCheck?.success && magiskCheck.output.trim().length > 0);

    return {
      status: hasRoot ? "root" : "no-root",
      hasRoot,
      hasMagisk,
      hasTermux,
      message: hasRoot
        ? "✅ Root access detected"
        : hasTermux
          ? "❌ Termux available but root access denied"
          : "❌ Termux API not available",
      timestamp: Date.now(),
    };
  } catch {
    return {
      status: "error",
      hasRoot: false,
      hasMagisk: false,
      hasTermux: false,
      message: "Error checking root access",
      timestamp: Date.now(),
    };
  }
}

export async function checkTermuxAccess(): Promise<boolean> {
  try {
    return (await checkTermuxConnection()) === "connected";
  } catch {
    return false;
  }
}

export async function executeTermuxCommand(command: string): Promise<string> {
  try {
    const result = await executeTermuxApiCommand({
      command: "sh",
      args: ["-c", command],
      timeout: 10000,
    });

    if (!result.success) {
      throw new Error(result.error ?? "Unknown Termux error");
    }

    return result.output;
  } catch {
    throw new Error(`Failed to execute Termux command: ${command}`);
  }
}

export async function checkMagiskInstalled(): Promise<boolean> {
  try {
    const connection = await checkTermuxConnection();
    if (connection !== "connected") return false;
    const result = await executeTermuxApiCommand({
      command: "sh",
      args: ["-c", "which magisk"],
      timeout: 4000,
    });
    return result.success && result.output.trim().length > 0;
  } catch {
    return false;
  }
}

export async function getRootStatusSummary(): Promise<string> {
  const result = await checkRootAccess();

  if (result.hasRoot && result.hasMagisk) {
    return "🔓 Root + Magisk (Full Access)";
  }

  if (result.hasRoot) {
    return "🔓 Root (Limited Access)";
  }

  if (result.hasTermux) {
    return "🟡 Termux (Sandboxed Access)";
  }

  return "🔒 No Root (Read-Only)";
}
