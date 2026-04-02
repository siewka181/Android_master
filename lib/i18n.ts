export type Language = "PL" | "EN";

export const translations = {
  PL: {
    // Splash & Language
    appTitle: "Android Master Boost",
    appVersion: "v2026.79 Ultimate",
    selectLanguage: "Wybierz język",
    polish: "Polski",
    english: "English",

    // Main Menu
    mainMenuTitle: "Android Master Boost v2026.79 Ultimate",
    poweredBy: "Powered by siewkaDesign + Grok",

    // Feature Names
    gameBoost: "Pełny Gaming Boost",
    batteryDiagnostics: "Diagnostyka Baterii",
    networkOptimization: "Optymalizacja Sieci",
    cpuPerformance: "CPU Performance Mode",
    zramOptimization: "ZRAM + VM + LMK",
    gpuOptimization: "GPU Optimization",
    resourceMonitor: "Monitor Zasobów",
    deviceFingerprint: "Device Fingerprint",
    restoreNormal: "Restore Normal Mode",
    aggressiveMode: "AGGRESSIVE MODE",
    advancedTools: "Zaawansowane Narzędzia",
    testFix: "Test + Fix",

    // Feature Descriptions
    gameBoostDesc: "Bezpieczny pełny gaming boost - CPU, ZRAM, sieć, GPU",
    batteryDesc: "Zaawansowana diagnostyka baterii i temperatury",
    networkDesc: "Optymalizacja sieci 5G/WiFi",
    cpuDesc: "Zmiana CPU na performance mode",
    zramDesc: "ZRAM 2GB + VM + LMK Tweaks",
    gpuDesc: "GPU Optimization i driver settings",
    monitorDesc: "Monitor zasobów (5s interwały)",
    fingerprintDesc: "Device Fingerprint + Specyfikacja",
    restoreDesc: "Pełny rollback do stanu fabrycznego",
    aggressiveDesc: "AGGRESSIVE MODE - Thermal Killer",
    advancedDesc: "Magisk, Encore Tweaks, Gaming-X, itp.",
    testDesc: "Pełny test + benchmarki + diagnostyka",

    // Status
    idle: "Gotowy",
    running: "Uruchomiony",
    success: "Sukces",
    error: "Błąd",
    unknown: "Nieznany",

    // Buttons
    startBoost: "Uruchom Boost",
    runDiagnostics: "Uruchom Diagnostykę",
    optimize: "Optymalizuj",
    restore: "Przywróć",
    runTest: "Uruchom Test",
    back: "Wróć",
    confirm: "Potwierdź",
    cancel: "Anuluj",
    clearLogs: "Wyczyść Logi",
    exportLogs: "Eksportuj Logi",
    viewLog: "Pokaż Log",

    // Log Levels
    logSuccess: "SUKCES",
    logWarn: "OSTRZEŻENIE",
    logError: "BŁĄD",
    logInfo: "INFO",
    logXdr: "XDR",

    // Messages
    boostStarted: "Boost uruchomiony...",
    boostCompleted: "Boost zakończony! 🚀",
    diagnosticsRunning: "Uruchamiam diagnostykę...",
    diagnosticsCompleted: "Diagnostyka zakończona",
    restoreWarning: "Czy na pewno chcesz przywrócić system do stanu fabrycznego? Wszystkie optymalizacje zostaną wycofane.",
    restoreConfirmed: "System przywrócony do stanu fabrycznego ✅",
    aggressiveWarning: "UWAGA: Wyłącza ochronę termiczną – używaj tylko na chwilę!",
    testStarted: "Uruchamiam pełny test XDR...",
    testCompleted: "Test XDR zakończony",

    // Battery Info
    batteryCapacity: "Pojemność",
    batteryTemperature: "Temperatura",
    batteryVoltage: "Napięcie",
    batteryCurrent: "Prąd",
    batteryStatus: "Status",
    batteryHealth: "Stan Zdrowia",

    // CPU Info
    cpuGovernor: "Governor",
    cpuFrequency: "Częstotliwość",
    cpuCores: "Rdzenie",
    cpuTemp: "Temperatura",

    // Network Info
    wifiStatus: "WiFi",
    networkType: "Typ Sieci",
    signalStrength: "Siła Sygnału",
    dataUsage: "Użycie Danych",

    // Device Info
    deviceModel: "Model",
    deviceSoC: "SoC",
    androidVersion: "Android",
    kernelVersion: "Kernel",
    fingerprint: "Fingerprint",
    buildNumber: "Build",

    // Advanced Tools
    magiskModules: "Scan Modułów Magisk",
    encoreTweaks: "Encore Tweaks v5.1",
    gamingX: "Gaming-X",
    fstrim: "FSTRIM",
    sqliteOptimize: "SQLite Optimize",
    forceGpu: "Force GPU + 120Hz",
    systemCleaner: "System Cleaner",
    selinuxPermissive: "SELinux → Permissive",
    cpuThrottlingTest: "CPU Throttling Test",

    // Timestamps
    lastUpdated: "Ostatnia aktualizacja",
    timestamp: "Czas",

    // Errors & Warnings
    highTemperature: "Wysoka temperatura!",
    lowBattery: "Niska bateria",
    noRoot: "Wymagany ROOT (Magisk)!",
    operationFailed: "Operacja nie powiodła się",
  },

  EN: {
    // Splash & Language
    appTitle: "Android Master Boost",
    appVersion: "v2026.79 Ultimate",
    selectLanguage: "Select Language",
    polish: "Polski",
    english: "English",

    // Main Menu
    mainMenuTitle: "Android Master Boost v2026.79 Ultimate",
    poweredBy: "Powered by siewkaDesign + Grok",

    // Feature Names
    gameBoost: "Full Gaming Boost",
    batteryDiagnostics: "Battery Diagnostics",
    networkOptimization: "Network Optimization",
    cpuPerformance: "CPU Performance Mode",
    zramOptimization: "ZRAM + VM + LMK",
    gpuOptimization: "GPU Optimization",
    resourceMonitor: "Resource Monitor",
    deviceFingerprint: "Device Fingerprint",
    restoreNormal: "Restore Normal Mode",
    aggressiveMode: "AGGRESSIVE MODE",
    advancedTools: "Advanced Tools",
    testFix: "Test + Fix",

    // Feature Descriptions
    gameBoostDesc: "Safe full gaming boost - CPU, ZRAM, network, GPU",
    batteryDesc: "Advanced battery and temperature diagnostics",
    networkDesc: "5G/WiFi network optimization",
    cpuDesc: "Switch CPU to performance mode",
    zramDesc: "ZRAM 2GB + VM + LMK Tweaks",
    gpuDesc: "GPU Optimization and driver settings",
    monitorDesc: "Resource monitor (5s intervals)",
    fingerprintDesc: "Device Fingerprint + Specifications",
    restoreDesc: "Full rollback to factory state",
    aggressiveDesc: "AGGRESSIVE MODE - Thermal Killer",
    advancedDesc: "Magisk, Encore Tweaks, Gaming-X, etc.",
    testDesc: "Full test + benchmarks + diagnostics",

    // Status
    idle: "Ready",
    running: "Running",
    success: "Success",
    error: "Error",
    unknown: "Unknown",

    // Buttons
    startBoost: "Start Boost",
    runDiagnostics: "Run Diagnostics",
    optimize: "Optimize",
    restore: "Restore",
    runTest: "Run Test",
    back: "Back",
    confirm: "Confirm",
    cancel: "Cancel",
    clearLogs: "Clear Logs",
    exportLogs: "Export Logs",
    viewLog: "View Log",

    // Log Levels
    logSuccess: "SUCCESS",
    logWarn: "WARN",
    logError: "ERROR",
    logInfo: "INFO",
    logXdr: "XDR",

    // Messages
    boostStarted: "Boost started...",
    boostCompleted: "Boost completed! 🚀",
    diagnosticsRunning: "Running diagnostics...",
    diagnosticsCompleted: "Diagnostics completed",
    restoreWarning: "Are you sure you want to restore the system to factory state? All optimizations will be reverted.",
    restoreConfirmed: "System restored to factory state ✅",
    aggressiveWarning: "WARNING: Disables thermal protection – use only briefly!",
    testStarted: "Running full XDR test...",
    testCompleted: "XDR test completed",

    // Battery Info
    batteryCapacity: "Capacity",
    batteryTemperature: "Temperature",
    batteryVoltage: "Voltage",
    batteryCurrent: "Current",
    batteryStatus: "Status",
    batteryHealth: "Health",

    // CPU Info
    cpuGovernor: "Governor",
    cpuFrequency: "Frequency",
    cpuCores: "Cores",
    cpuTemp: "Temperature",

    // Network Info
    wifiStatus: "WiFi",
    networkType: "Network Type",
    signalStrength: "Signal Strength",
    dataUsage: "Data Usage",

    // Device Info
    deviceModel: "Model",
    deviceSoC: "SoC",
    androidVersion: "Android",
    kernelVersion: "Kernel",
    fingerprint: "Fingerprint",
    buildNumber: "Build",

    // Advanced Tools
    magiskModules: "Scan Magisk Modules",
    encoreTweaks: "Encore Tweaks v5.1",
    gamingX: "Gaming-X",
    fstrim: "FSTRIM",
    sqliteOptimize: "SQLite Optimize",
    forceGpu: "Force GPU + 120Hz",
    systemCleaner: "System Cleaner",
    selinuxPermissive: "SELinux → Permissive",
    cpuThrottlingTest: "CPU Throttling Test",

    // Timestamps
    lastUpdated: "Last Updated",
    timestamp: "Time",

    // Errors & Warnings
    highTemperature: "High temperature!",
    lowBattery: "Low battery",
    noRoot: "ROOT (Magisk) required!",
    operationFailed: "Operation failed",
  },
};

export function getTranslation(language: Language, key: keyof typeof translations.EN): string {
  return (translations[language] as any)[key] || key;
}
