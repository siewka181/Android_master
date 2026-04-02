// Mock data generator for simulating system operations
// Since we can't run actual system commands in the browser, we generate realistic mock data

export const mockBatteryData = {
  capacity: 85,
  temperature: 32,
  voltage: 4.15,
  current: 150,
  status: "Charging",
  health: "Good",
  technology: "Li-ion",
};

export const mockCPUData = {
  governor: "schedutil",
  frequency: "2.4 GHz",
  cores: 8,
  temperature: 45,
  usage: 28,
};

export const mockNetworkData = {
  wifi: "Connected",
  signalStrength: -45,
  networkType: "5G",
  dataUsage: "2.3 GB",
  carrier: "Orange",
};

export const mockDeviceInfo = {
  model: "SM-A136B",
  soc: "Exynos 850",
  androidVersion: "14",
  kernelVersion: "5.15.41",
  fingerprint: "samsung/a12naxx/a12:14/UP1A.201005.007/A125FXXU2AUK1:user/release-keys",
  buildNumber: "A125FXXU2AUK1",
  buildDate: "2024-01-15",
};

export const mockZRAMData = {
  disksize: "2GB",
  swappiness: 10,
  memoryUsage: 3.2,
  compressedSize: 1.8,
};

export const mockGPUData = {
  driver: "Mali-G72",
  refreshRate: 120,
  powerSave: "disabled",
  gameDriver: "enabled",
};

export const mockResourceMonitor = {
  cpu: [28, 32, 25, 35, 22],
  memory: [2.8, 3.1, 2.9, 3.3, 3.0],
  temperature: [45, 46, 44, 47, 45],
};

export const mockMagiskModules = [
  "Magisk Hide Props Config",
  "Shamiko",
  "Zygisk - LSPosed",
];

export const mockBoostLogs = [
  { level: "INFO" as const, message: "Initializing Android Master Boost v2026.79 Ultimate" },
  { level: "INFO" as const, message: "Detected: SM-A136B (Exynos) | Android 14" },
  { level: "SUCCESS" as const, message: "ROOT + MAGISK DETECTED" },
  { level: "INFO" as const, message: "=== XDR FULL SAFE GAME BOOST ===" },
  { level: "INFO" as const, message: "Saving system state BEFORE" },
  { level: "INFO" as const, message: "Switching CPU to performance mode" },
  { level: "SUCCESS" as const, message: "CPU → performance" },
  { level: "INFO" as const, message: "Optimizing ZRAM (2GB + swappiness 10)" },
  { level: "SUCCESS" as const, message: "ZRAM 2GB + swappiness 10" },
  { level: "INFO" as const, message: "Optimizing network (WiFi power save disabled)" },
  { level: "SUCCESS" as const, message: "Sieć 5G/WiFi zoptymalizowana" },
  { level: "WARN" as const, message: "Exynos A13 – brak standardowych ścieżek GPU (pominięto)" },
  { level: "INFO" as const, message: "Applying I/O + kernel tweaks" },
  { level: "SUCCESS" as const, message: "I/O + kernel tweaks" },
  { level: "INFO" as const, message: "Monitoring thermal protection" },
  { level: "INFO" as const, message: "Saving system state AFTER" },
  { level: "SUCCESS" as const, message: "🚀 BOOST ZAKOŃCZONY" },
];

export const mockBatteryDiagnostics = [
  { level: "INFO" as const, message: "=== XDR BATTERY DIAGNOSTICS ===" },
  { level: "INFO" as const, message: "Capacity: 85%" },
  { level: "INFO" as const, message: "Temperature: 32°C" },
  { level: "INFO" as const, message: "Voltage: 4.15V" },
  { level: "INFO" as const, message: "Current: 150mA" },
  { level: "INFO" as const, message: "Status: Charging" },
  { level: "SUCCESS" as const, message: "Battery diagnostics completed" },
];

export const mockRestoreLogs = [
  { level: "XDR" as const, message: "=== RESTORE NORMAL MODE (FULL ROLLBACK) ===" },
  { level: "INFO" as const, message: "Restoring CPU governors to schedutil" },
  { level: "SUCCESS" as const, message: "CPU restored" },
  { level: "INFO" as const, message: "Restoring swappiness to 60" },
  { level: "SUCCESS" as const, message: "Memory settings restored" },
  { level: "INFO" as const, message: "Re-enabling thermal protection" },
  { level: "SUCCESS" as const, message: "✅ System przywrócony do stanu fabrycznego" },
];

export const mockAggressiveLogs = [
  { level: "WARN" as const, message: "=== AGGRESSIVE MODE (Thermal Killer) ===" },
  { level: "WARN" as const, message: "UWAGA: Wyłącza ochronę termiczną – używaj tylko na chwilę!" },
  { level: "INFO" as const, message: "Disabling thermal mitigation" },
  { level: "INFO" as const, message: "Running full game boost" },
  { level: "SUCCESS" as const, message: "Aggressive mode activated - use with caution!" },
];

export const mockTestLogs = [
  { level: "XDR" as const, message: "=== FULL XDR AUTOMATED TEST ===" },
  { level: "INFO" as const, message: "Running battery diagnostics..." },
  { level: "SUCCESS" as const, message: "Battery diagnostics completed" },
  { level: "INFO" as const, message: "Running game boost..." },
  { level: "SUCCESS" as const, message: "Game boost completed" },
  { level: "INFO" as const, message: "Monitoring resources (5s intervals)..." },
  { level: "INFO" as const, message: "CPU: 28% | Memory: 2.8GB | Temp: 45°C" },
  { level: "INFO" as const, message: "CPU: 32% | Memory: 3.1GB | Temp: 46°C" },
  { level: "INFO" as const, message: "CPU: 25% | Memory: 2.9GB | Temp: 44°C" },
  { level: "INFO" as const, message: "Dumping device fingerprint..." },
  { level: "INFO" as const, message: "Model: SM-A136B | SoC: Exynos 850 | Android: 14" },
  { level: "INFO" as const, message: "Running CPU throttling test..." },
  { level: "SUCCESS" as const, message: "Test throttling completed" },
  { level: "SUCCESS" as const, message: "FULL TEST ZAKOŃCZONY – all checks passed" },
];

// Simulate async operation with delays
export async function simulateOperation(
  logs: Array<{ level: "SUCCESS" | "WARN" | "ERROR" | "INFO" | "XDR"; message: string }>,
  onLog: (level: "SUCCESS" | "WARN" | "ERROR" | "INFO" | "XDR", message: string) => void,
  delayMs: number = 300,
) {
  for (const log of logs) {
    onLog(log.level, log.message);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
}
