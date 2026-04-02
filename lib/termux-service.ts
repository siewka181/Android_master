/**
 * Termux Integration Service
 * Handles communication with Termux and execution of shell commands
 */

export type TermuxConnectionStatus = "connected" | "disconnected" | "error";

export interface TermuxCommand {
  command: string;
  args?: string[];
  timeout?: number;
}

export interface TermuxResult {
  success: boolean;
  output: string;
  error?: string;
  exitCode?: number;
}

const TERMUX_API_URL = "http://localhost:8080";

/**
 * Check if Termux is available and connected
 */
export async function checkTermuxConnection(): Promise<TermuxConnectionStatus> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(`${TERMUX_API_URL}/api/ping`, {
      method: "GET",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      return "connected";
    } else {
      return "disconnected";
    }
  } catch (error) {
    console.error("Termux connection check failed:", error);
    return "disconnected";
  }
}

/**
 * Execute a shell command via Termux
 * Requires Termux:API app to be installed and running
 */
export async function executeTermuxCommand(
  command: TermuxCommand
): Promise<TermuxResult> {
  try {
    const response = await fetch(`${TERMUX_API_URL}/api/shell`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        command: command.command,
        args: command.args || [],
        timeout: command.timeout || 30000,
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        output: "",
        error: `HTTP ${response.status}`,
      };
    }

    const data = await response.json();

    return {
      success: data.exitCode === 0,
      output: data.stdout || "",
      error: data.stderr || undefined,
      exitCode: data.exitCode,
    };
  } catch (error) {
    return {
      success: false,
      output: "",
      error: `Failed to execute command: ${String(error)}`,
    };
  }
}

/**
 * Check if device has root access via Termux
 */
export async function checkRootViaTermux(): Promise<boolean> {
  try {
    const result = await executeTermuxCommand({
      command: "id",
      timeout: 5000,
    });

    if (result.success && result.output.includes("uid=0")) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Get system information via Termux
 */
export async function getSystemInfoViaTermux(): Promise<Record<string, string>> {
  const info: Record<string, string> = {};

  try {
    // Get Android version
    const androidVersion = await executeTermuxCommand({
      command: "getprop",
      args: ["ro.build.version.release"],
    });
    if (androidVersion.success) {
      info.androidVersion = androidVersion.output.trim();
    }

    // Get device model
    const model = await executeTermuxCommand({
      command: "getprop",
      args: ["ro.product.model"],
    });
    if (model.success) {
      info.model = model.output.trim();
    }

    // Get kernel version
    const kernel = await executeTermuxCommand({
      command: "uname",
      args: ["-r"],
    });
    if (kernel.success) {
      info.kernel = kernel.output.trim();
    }

    // Get CPU info
    const cpuInfo = await executeTermuxCommand({
      command: "cat",
      args: ["/proc/cpuinfo"],
    });
    if (cpuInfo.success) {
      const processors = (cpuInfo.output.match(/processor/g) || []).length;
      info.cpuCores = processors.toString();
    }
  } catch (error) {
    console.error("Failed to get system info via Termux:", error);
  }

  return info;
}

/**
 * Execute boost command via Termux with su (superuser)
 */
export async function executeBoostViaTermux(
  boostType: string
): Promise<TermuxResult> {
  try {
    // This would execute the actual boost command via Termux
    // For now, it's a mock
    const commands: Record<string, string> = {
      gameBoost: "su -c 'echo 1 > /proc/sys/vm/drop_caches'",
      cpuPerformance: "su -c 'echo performance > /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor'",
      zramOptimize: "su -c 'echo 2G > /sys/block/zram0/disksize'",
      restore: "su -c 'echo schedutil > /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor'",
    };

    const command = commands[boostType];
    if (!command) {
      return {
        success: false,
        output: "",
        error: `Unknown boost type: ${boostType}`,
      };
    }

    return await executeTermuxCommand({
      command: "sh",
      args: ["-c", command],
      timeout: 10000,
    });
  } catch (error) {
    return {
      success: false,
      output: "",
      error: `Failed to execute boost: ${String(error)}`,
    };
  }
}

/**
 * Get real-time system stats via Termux
 */
export async function getSystemStatsViaTermux(): Promise<Record<string, string>> {
  const stats: Record<string, string> = {};

  try {
    // Get CPU usage
    const cpuUsage = await executeTermuxCommand({
      command: "top",
      args: ["-bn", "1"],
    });
    if (cpuUsage.success) {
      const match = cpuUsage.output.match(/CPU:\s*([\d.]+)%/);
      if (match) {
        stats.cpuUsage = match[1];
      }
    }

    // Get memory usage
    const memUsage = await executeTermuxCommand({
      command: "free",
      args: ["-h"],
    });
    if (memUsage.success) {
      stats.memoryUsage = memUsage.output;
    }

    // Get temperature
    const temp = await executeTermuxCommand({
      command: "cat",
      args: ["/sys/class/thermal/thermal_zone0/temp"],
    });
    if (temp.success) {
      const tempValue = parseInt(temp.output.trim()) / 1000;
      stats.temperature = `${tempValue}°C`;
    }
  } catch (error) {
    console.error("Failed to get system stats via Termux:", error);
  }

  return stats;
}
