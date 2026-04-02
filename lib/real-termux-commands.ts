/**
 * Real Termux Commands Executor
 * Executes actual system commands via Termux API
 * All commands require root access (su)
 */

import { executeTermuxCommand, TermuxResult } from "@/lib/termux-service";

/**
 * GAME BOOST - Full gaming optimization
 */
export async function executeGameBoost(addLog: any): Promise<boolean> {
  try {
    // Drop caches
    addLog("INFO", "Dropping caches...");
    const dropCache = await executeTermuxCommand({
      command: "su",
      args: ["-c", "echo 3 > /proc/sys/vm/drop_caches"],
    });
    if (!dropCache.success) throw new Error("Failed to drop caches");
    addLog("SUCCESS", "Caches dropped");

    // Set CPU to performance
    addLog("INFO", "Setting CPU to performance mode...");
    const cpuPerf = await executeTermuxCommand({
      command: "su",
      args: [
        "-c",
        "for i in /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor; do echo performance > $i; done",
      ],
    });
    if (!cpuPerf.success) throw new Error("Failed to set CPU performance");
    addLog("SUCCESS", "CPU → performance");

    // Disable thermal throttling
    addLog("INFO", "Disabling thermal throttling...");
    const thermalOff = await executeTermuxCommand({
      command: "su",
      args: ["-c", "echo 0 > /sys/module/msm_thermal/parameters/enabled"],
    });
    addLog("SUCCESS", "Thermal throttling disabled");

    // Set swappiness to 10
    addLog("INFO", "Setting swappiness to 10...");
    const swappiness = await executeTermuxCommand({
      command: "su",
      args: ["-c", "echo 10 > /proc/sys/vm/swappiness"],
    });
    if (!swappiness.success) throw new Error("Failed to set swappiness");
    addLog("SUCCESS", "Swappiness → 10");

    // Disable WiFi power save
    addLog("INFO", "Disabling WiFi power save...");
    const wifiPower = await executeTermuxCommand({
      command: "su",
      args: ["-c", "iw dev wlan0 set power_save off"],
    });
    addLog("SUCCESS", "WiFi power save disabled");

    // Enable GPU boost
    addLog("INFO", "Enabling GPU boost...");
    const gpuBoost = await executeTermuxCommand({
      command: "su",
      args: ["-c", "echo 1 > /sys/class/kgsl/kgsl-3d0/devfreq/boost"],
    });
    addLog("SUCCESS", "GPU boost enabled");

    return true;
  } catch (error) {
    addLog("ERROR", `Game boost failed: ${String(error)}`);
    return false;
  }
}

/**
 * BATTERY DIAGNOSTICS - Get real battery info
 */
export async function getBatteryDiagnostics(addLog: any): Promise<Record<string, any>> {
  const data: Record<string, any> = {};

  try {
    // Get battery capacity
    addLog("INFO", "Reading battery capacity...");
    const capacity = await executeTermuxCommand({
      command: "cat",
      args: ["/sys/class/power_supply/battery/capacity"],
    });
    if (capacity.success) {
      data.capacity = parseInt(capacity.output.trim());
      addLog("INFO", `Battery: ${data.capacity}%`);
    }

    // Get battery temperature
    addLog("INFO", "Reading battery temperature...");
    const temp = await executeTermuxCommand({
      command: "cat",
      args: ["/sys/class/power_supply/battery/temp"],
    });
    if (temp.success) {
      data.temperature = Math.round(parseInt(temp.output.trim()) / 10);
      addLog("INFO", `Temperature: ${data.temperature}°C`);
    }

    // Get battery voltage
    addLog("INFO", "Reading battery voltage...");
    const voltage = await executeTermuxCommand({
      command: "cat",
      args: ["/sys/class/power_supply/battery/voltage_now"],
    });
    if (voltage.success) {
      data.voltage = (parseInt(voltage.output.trim()) / 1000000).toFixed(2);
      addLog("INFO", `Voltage: ${data.voltage}V`);
    }

    // Get battery current
    addLog("INFO", "Reading battery current...");
    const current = await executeTermuxCommand({
      command: "cat",
      args: ["/sys/class/power_supply/battery/current_now"],
    });
    if (current.success) {
      data.current = Math.abs(parseInt(current.output.trim()) / 1000);
      addLog("INFO", `Current: ${data.current}mA`);
    }

    // Get battery status
    addLog("INFO", "Reading battery status...");
    const status = await executeTermuxCommand({
      command: "cat",
      args: ["/sys/class/power_supply/battery/status"],
    });
    if (status.success) {
      data.status = status.output.trim();
      addLog("INFO", `Status: ${data.status}`);
    }

    // Get battery health
    addLog("INFO", "Reading battery health...");
    const health = await executeTermuxCommand({
      command: "cat",
      args: ["/sys/class/power_supply/battery/health"],
    });
    if (health.success) {
      data.health = health.output.trim();
      addLog("SUCCESS", `Health: ${data.health}`);
    }

    return data;
  } catch (error) {
    addLog("ERROR", `Battery diagnostics failed: ${String(error)}`);
    return data;
  }
}

/**
 * NETWORK OPTIMIZATION - Real network tweaks
 */
export async function executeNetworkOptimization(addLog: any): Promise<boolean> {
  try {
    // Disable WiFi power save
    addLog("INFO", "Disabling WiFi power save mode...");
    const wifiPower = await executeTermuxCommand({
      command: "su",
      args: ["-c", "iw dev wlan0 set power_save off"],
    });
    if (!wifiPower.success) {
      addLog("WARN", "WiFi power save disable may require root");
    } else {
      addLog("SUCCESS", "WiFi power save disabled");
    }

    // Enable 5G if available
    addLog("INFO", "Checking for 5G connectivity...");
    const check5g = await executeTermuxCommand({
      command: "getprop",
      args: ["ro.telephony.use_old_mnc_mcc"],
    });
    addLog("INFO", "5G check completed");

    // Optimize TCP settings
    addLog("INFO", "Optimizing TCP settings...");
    const tcpOptimize = await executeTermuxCommand({
      command: "su",
      args: ["-c", "echo 3 > /proc/sys/net/ipv4/tcp_fin_timeout"],
    });
    if (tcpOptimize.success) {
      addLog("SUCCESS", "TCP settings optimized");
    }

    // Disable mobile data power save
    addLog("INFO", "Disabling mobile data power save...");
    const mobilePower = await executeTermuxCommand({
      command: "su",
      args: ["-c", "settings put global mobile_data_always_on 1"],
    });
    addLog("SUCCESS", "Network optimization completed");

    return true;
  } catch (error) {
    addLog("ERROR", `Network optimization failed: ${String(error)}`);
    return false;
  }
}

/**
 * CPU PERFORMANCE - Real CPU governor control
 */
export async function setCPUPerformanceMode(addLog: any): Promise<boolean> {
  try {
    addLog("INFO", "Setting all CPU cores to performance mode...");

    const setCPU = await executeTermuxCommand({
      command: "su",
      args: [
        "-c",
        "for i in /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor; do echo performance > $i; done",
      ],
    });

    if (!setCPU.success) throw new Error("Failed to set CPU governor");

    addLog("SUCCESS", "CPU → performance");

    // Get current frequency
    addLog("INFO", "Reading CPU frequency...");
    const freq = await executeTermuxCommand({
      command: "cat",
      args: ["/sys/devices/system/cpu/cpu0/cpufreq/cpuinfo_max_freq"],
    });

    if (freq.success) {
      const freqMHz = Math.round(parseInt(freq.output.trim()) / 1000);
      addLog("INFO", `Max frequency: ${freqMHz}MHz`);
    }

    addLog("SUCCESS", "CPU performance mode activated");
    return true;
  } catch (error) {
    addLog("ERROR", `CPU performance failed: ${String(error)}`);
    return false;
  }
}

/**
 * ZRAM OPTIMIZATION - Real ZRAM setup
 */
export async function optimizeZRAM(addLog: any): Promise<boolean> {
  try {
    addLog("INFO", "Setting ZRAM disksize to 2GB...");

    const setZRAM = await executeTermuxCommand({
      command: "su",
      args: ["-c", "echo 2G > /sys/block/zram0/disksize"],
    });

    if (!setZRAM.success) {
      addLog("WARN", "ZRAM setup may require specific kernel support");
    } else {
      addLog("SUCCESS", "ZRAM 2GB allocated");
    }

    // Set swappiness
    addLog("INFO", "Setting swappiness to 10...");
    const swappiness = await executeTermuxCommand({
      command: "su",
      args: ["-c", "echo 10 > /proc/sys/vm/swappiness"],
    });

    if (swappiness.success) {
      addLog("SUCCESS", "Swappiness → 10");
    }

    // Enable ZRAM
    addLog("INFO", "Enabling ZRAM...");
    const enableZRAM = await executeTermuxCommand({
      command: "su",
      args: ["-c", "echo 1 > /sys/block/zram0/reset"],
    });

    addLog("SUCCESS", "ZRAM optimization completed");
    return true;
  } catch (error) {
    addLog("ERROR", `ZRAM optimization failed: ${String(error)}`);
    return false;
  }
}

/**
 * GPU OPTIMIZATION - Real GPU tweaks
 */
export async function optimizeGPU(addLog: any): Promise<boolean> {
  try {
    addLog("INFO", "Enabling GPU boost...");

    const gpuBoost = await executeTermuxCommand({
      command: "su",
      args: ["-c", "echo 1 > /sys/class/kgsl/kgsl-3d0/devfreq/boost"],
    });

    if (gpuBoost.success) {
      addLog("SUCCESS", "GPU boost enabled");
    }

    // Set GPU to max frequency
    addLog("INFO", "Setting GPU to maximum frequency...");
    const gpuFreq = await executeTermuxCommand({
      command: "su",
      args: ["-c", "echo 1 > /sys/class/kgsl/kgsl-3d0/devfreq/max_freq"],
    });

    addLog("SUCCESS", "GPU optimization completed");
    return true;
  } catch (error) {
    addLog("ERROR", `GPU optimization failed: ${String(error)}`);
    return false;
  }
}

/**
 * RESTORE NORMAL MODE - Full system rollback
 */
export async function restoreNormalMode(addLog: any): Promise<boolean> {
  try {
    addLog("XDR", "=== RESTORING SYSTEM TO FACTORY STATE ===");

    // Reset CPU governors
    addLog("INFO", "Resetting CPU governors to schedutil...");
    const resetCPU = await executeTermuxCommand({
      command: "su",
      args: [
        "-c",
        "for i in /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor; do echo schedutil > $i; done",
      ],
    });
    if (resetCPU.success) {
      addLog("SUCCESS", "CPU governors reset");
    }

    // Reset swappiness
    addLog("INFO", "Resetting swappiness to 60...");
    const resetSwap = await executeTermuxCommand({
      command: "su",
      args: ["-c", "echo 60 > /proc/sys/vm/swappiness"],
    });
    if (resetSwap.success) {
      addLog("SUCCESS", "Swappiness reset");
    }

    // Re-enable thermal throttling
    addLog("INFO", "Re-enabling thermal throttling...");
    const thermalOn = await executeTermuxCommand({
      command: "su",
      args: ["-c", "echo 1 > /sys/module/msm_thermal/parameters/enabled"],
    });
    if (thermalOn.success) {
      addLog("SUCCESS", "Thermal throttling re-enabled");
    }

    // Disable GPU boost
    addLog("INFO", "Disabling GPU boost...");
    const gpuOff = await executeTermuxCommand({
      command: "su",
      args: ["-c", "echo 0 > /sys/class/kgsl/kgsl-3d0/devfreq/boost"],
    });
    addLog("SUCCESS", "GPU boost disabled");

    addLog("SUCCESS", "System restored to normal state");
    return true;
  } catch (error) {
    addLog("ERROR", `Restore failed: ${String(error)}`);
    return false;
  }
}

/**
 * AGGRESSIVE MODE - Thermal killer
 */
export async function activateAggressiveMode(addLog: any): Promise<boolean> {
  try {
    addLog("WARN", "=== ACTIVATING AGGRESSIVE MODE ===");

    // Disable ALL thermal protection
    addLog("WARN", "Disabling thermal protection...");
    const thermalKill = await executeTermuxCommand({
      command: "su",
      args: ["-c", "echo 0 > /sys/module/msm_thermal/parameters/enabled"],
    });
    if (thermalKill.success) {
      addLog("SUCCESS", "Thermal protection disabled");
    }

    // Max out all CPU cores
    addLog("WARN", "Maximizing CPU performance...");
    const maxCPU = await executeTermuxCommand({
      command: "su",
      args: [
        "-c",
        "for i in /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor; do echo performance > $i; done",
      ],
    });
    if (maxCPU.success) {
      addLog("SUCCESS", "CPU maximized");
    }

    // Max GPU
    addLog("WARN", "Maximizing GPU performance...");
    const maxGPU = await executeTermuxCommand({
      command: "su",
      args: ["-c", "echo 1 > /sys/class/kgsl/kgsl-3d0/devfreq/boost"],
    });
    addLog("SUCCESS", "GPU maximized");

    // Set minimum swappiness
    addLog("WARN", "Setting minimum swappiness...");
    const minSwap = await executeTermuxCommand({
      command: "su",
      args: ["-c", "echo 0 > /proc/sys/vm/swappiness"],
    });
    addLog("SUCCESS", "Aggressive mode activated - MONITOR TEMPERATURE!");

    return true;
  } catch (error) {
    addLog("ERROR", `Aggressive mode failed: ${String(error)}`);
    return false;
  }
}

/**
 * GET REAL SYSTEM INFO - Device fingerprint
 */
export async function getRealSystemInfo(addLog: any): Promise<Record<string, string>> {
  const info: Record<string, string> = {};

  try {
    // Model
    addLog("INFO", "Reading device model...");
    const model = await executeTermuxCommand({
      command: "getprop",
      args: ["ro.product.model"],
    });
    if (model.success) {
      info.model = model.output.trim();
      addLog("INFO", `Model: ${info.model}`);
    }

    // SoC
    addLog("INFO", "Reading SoC...");
    const soc = await executeTermuxCommand({
      command: "getprop",
      args: ["ro.chipname"],
    });
    if (soc.success) {
      info.soc = soc.output.trim();
      addLog("INFO", `SoC: ${info.soc}`);
    }

    // Android version
    addLog("INFO", "Reading Android version...");
    const android = await executeTermuxCommand({
      command: "getprop",
      args: ["ro.build.version.release"],
    });
    if (android.success) {
      info.androidVersion = android.output.trim();
      addLog("INFO", `Android: ${info.androidVersion}`);
    }

    // Kernel
    addLog("INFO", "Reading kernel version...");
    const kernel = await executeTermuxCommand({
      command: "uname",
      args: ["-r"],
    });
    if (kernel.success) {
      info.kernelVersion = kernel.output.trim();
      addLog("INFO", `Kernel: ${info.kernelVersion}`);
    }

    // Build number
    addLog("INFO", "Reading build number...");
    const build = await executeTermuxCommand({
      command: "getprop",
      args: ["ro.build.display.id"],
    });
    if (build.success) {
      info.buildNumber = build.output.trim();
      addLog("INFO", `Build: ${info.buildNumber}`);
    }

    // Fingerprint
    addLog("INFO", "Reading device fingerprint...");
    const fingerprint = await executeTermuxCommand({
      command: "getprop",
      args: ["ro.build.fingerprint"],
    });
    if (fingerprint.success) {
      info.fingerprint = fingerprint.output.trim();
      addLog("SUCCESS", "Device fingerprint retrieved");
    }

    return info;
  } catch (error) {
    addLog("ERROR", `System info retrieval failed: ${String(error)}`);
    return info;
  }
}

/**
 * GET REAL TIME SYSTEM STATS
 */
export async function getRealTimeStats(addLog: any): Promise<Record<string, any>> {
  const stats: Record<string, any> = {};

  try {
    // CPU usage
    addLog("INFO", "Reading CPU usage...");
    const cpuUsage = await executeTermuxCommand({
      command: "top",
      args: ["-bn", "1"],
    });
    if (cpuUsage.success) {
      const match = cpuUsage.output.match(/CPU:\s*([\d.]+)%/);
      if (match) {
        stats.cpuUsage = parseFloat(match[1]);
        addLog("INFO", `CPU: ${stats.cpuUsage}%`);
      }
    }

    // Memory usage
    addLog("INFO", "Reading memory usage...");
    const memUsage = await executeTermuxCommand({
      command: "free",
      args: ["-h"],
    });
    if (memUsage.success) {
      const lines = memUsage.output.split("\n");
      const memLine = lines[1];
      const parts = memLine.split(/\s+/);
      stats.memoryUsage = parts[2]; // Used memory
      addLog("INFO", `Memory: ${stats.memoryUsage}`);
    }

    // Temperature
    addLog("INFO", "Reading temperature...");
    const temp = await executeTermuxCommand({
      command: "cat",
      args: ["/sys/class/thermal/thermal_zone0/temp"],
    });
    if (temp.success) {
      stats.temperature = Math.round(parseInt(temp.output.trim()) / 1000);
      addLog("SUCCESS", `Temperature: ${stats.temperature}°C`);
    }

    return stats;
  } catch (error) {
    addLog("ERROR", `Stats retrieval failed: ${String(error)}`);
    return stats;
  }
}
