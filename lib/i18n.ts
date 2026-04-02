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
    systemTools: "Narzędzia Systemowe",
    permissionsHub: "Centrum Uprawnień",
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
    systemToolsDesc: "Realne akcje systemowe: ekran, ustawienia, powiadomienia",
    permissionsHubDesc: "Sprawdź i nadaj wymagane uprawnienia aplikacji",
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

    // Log Viewer
    logViewerTitle: "Podgląd Logów",
    noLogsYet: "Brak logów",
    runFeatureToSeeLogs: "Uruchom funkcję, aby zobaczyć logi",
    exportLogsLabel: "Eksport Logów",
    totalEntries: "Wpisy łącznie",
    clear: "Wyczyść",
    delete: "Usuń",
    clearLogsTitle: "Wyczyść logi",
    clearLogsMessage: "Czy na pewno chcesz usunąć wszystkie logi?",
    logsExportSuccess: "Logi wyeksportowane jako {format} i gotowe do udostępnienia!",
    exportFailed: "Nie udało się wyeksportować logów",
    successTitle: "Sukces",
    errorTitle: "Błąd",

    // Root Check
    rootStatusTitle: "Status Root",
    checkingRootAccess: "Sprawdzanie dostępu ROOT...",
    waitVerifying: "Poczekaj, weryfikuję uprawnienia",
    permissions: "Uprawnienia",
    superuserAccess: "Dostęp superuser",
    magiskManager: "Menedżer Magisk",
    termuxIntegration: "Integracja Termux",
    enabled: "Włączone",
    disabled: "Wyłączone",
    installed: "Zainstalowano",
    notFound: "Nie znaleziono",
    connected: "Połączono",
    notAvailable: "Niedostępne",
    limitedFunctionality: "Ograniczona funkcjonalność",
    limitedFunctionalityDesc:
      "Bez uprawnień root część funkcji będzie tylko do odczytu. Dla pełnej funkcjonalności zainstaluj Magisk lub użyj Termux z sudo.",
    retryCheck: "Ponów sprawdzenie",
    requestRootAccess: "Poproś o dostęp ROOT",
    checkFailed: "Sprawdzenie nieudane",
    unableDetermineRoot: "Nie udało się określić statusu root",
    tryAgain: "Spróbuj ponownie",
    requestRootTitle: "Poproś o dostęp ROOT",
    requestRootMessage:
      "Aby używać wszystkich funkcji, aplikacja wymaga dostępu root.\n\nOpcje:\n1. Zainstaluj Magisk\n2. Użyj Termux z sudo\n3. Nadaj uprawnienia superuser",
    installMagisk: "Zainstaluj Magisk",
    useTermux: "Użyj Termux",

    // Advanced tools
    advancedToolsTitle: "Zaawansowane Narzędzia",
    advancedToolsInfo:
      "Zaawansowane narzędzia wymagają ROOT/Magisk. Część narzędzi może wymagać ręcznego potwierdzenia w Magisk Manager.",
    permissionsOnboardingTitle: "Konfiguracja uprawnień",
    permissionsOnboardingSubtitle:
      "Aplikacja sprawdza niezbędne dostępy i prowadzi Cię krok po kroku do ich nadania.",
    permissionsReady: "Przyznane",
    permissionBlockedHint:
      "Uprawnienie zostało trwale odrzucone. Wejdź do ustawień aplikacji i włącz je ręcznie.",
    permissionNotificationsTitle: "Powiadomienia",
    permissionNotificationsReason:
      "Potrzebne do alertów diagnostycznych i statusów działania narzędzi.",
    permissionMicrophoneTitle: "Mikrofon",
    permissionMicrophoneReason:
      "Wymagany do komend głosowych i nagrań diagnostycznych audio.",
    permissionLocationTitle: "Lokalizacja",
    permissionLocationReason:
      "Android wymaga tej zgody do pełnego skanowania sieci Wi-Fi i parametrów połączenia.",
    permissionBatteryOptimizationTitle: "Optymalizacja baterii",
    permissionBatteryOptimizationReason:
      "Wyłącz optymalizację baterii dla aplikacji, aby zadania monitoringu działały stabilnie w tle.",
    permissionBatteryOptimizationInstruction:
      "W ustawieniach znajdź aplikację i ustaw tryb: bez ograniczeń / unrestricted.",
    permissionState_granted: "Przyznane",
    permissionState_denied: "Odrzucone",
    permissionState_blocked: "Trwale odrzucone",
    permissionState_unavailable: "Niedostępne",
    permissionState_needs_settings: "Wymaga ustawień",
    grantPermission: "Nadaj uprawnienie",
    openSettings: "Otwórz ustawienia",
    continueToApp: "Przejdź do aplikacji",
    permissionAlreadyGranted: "Uprawnienie jest już przyznane.",
    toolKeepAwake: "Tryb sesji (ekran włączony)",
    toolKeepAwakeOnStatus: "Aktywny: ekran pozostaje włączony podczas sesji.",
    toolKeepAwakeOffStatus: "Nieaktywny: system może wygasić ekran.",
    toolKeepAwakeEnabled: "Włączono tryb sesji - ekran nie będzie wygaszany.",
    toolKeepAwakeDisabled: "Wyłączono tryb sesji - przywrócono normalne wygaszanie.",
    toolNotifications: "Powiadomienia aplikacji",
    toolNotificationsDesc: "Poproś o zgodę na powiadomienia diagnostyczne.",
    toolBatterySettings: "Ustawienia baterii",
    toolBatterySettingsDesc:
      "Otwórz ustawienia oszczędzania energii i ustaw aplikację bez ograniczeń.",
    toolAppSettings: "Ustawienia aplikacji",
    toolAppSettingsDesc: "Przejdź do ekranu aplikacji, aby ręcznie zmienić uprawnienia.",
    systemToolsActionHint: "Wybierz jedną z akcji systemowych poniżej.",
    openedBatterySettings: "Otwarto ustawienia optymalizacji baterii.",
    openedAppSettings: "Otwarto ustawienia aplikacji.",
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
    systemTools: "System Tools",
    permissionsHub: "Permissions Hub",
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
    systemToolsDesc: "Real system actions: screen, settings, notifications",
    permissionsHubDesc: "Check and grant all required app permissions",
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

    // Log Viewer
    logViewerTitle: "Log Viewer",
    noLogsYet: "No logs yet",
    runFeatureToSeeLogs: "Run a feature to see operation logs here",
    exportLogsLabel: "Export Logs",
    totalEntries: "Total Entries",
    clear: "Clear",
    delete: "Delete",
    clearLogsTitle: "Clear Logs",
    clearLogsMessage: "Are you sure you want to delete all logs?",
    logsExportSuccess: "Logs exported as {format} and ready to share!",
    exportFailed: "Failed to export logs",
    successTitle: "Success",
    errorTitle: "Error",

    // Root Check
    rootStatusTitle: "Root Status",
    checkingRootAccess: "Checking Root Access...",
    waitVerifying: "Please wait while we verify permissions",
    permissions: "Permissions",
    superuserAccess: "Superuser Access",
    magiskManager: "Magisk Manager",
    termuxIntegration: "Termux Integration",
    enabled: "Enabled",
    disabled: "Disabled",
    installed: "Installed",
    notFound: "Not Found",
    connected: "Connected",
    notAvailable: "Not Available",
    limitedFunctionality: "Limited Functionality",
    limitedFunctionalityDesc:
      "Without root access, some features will be read-only. For full functionality, install Magisk or use Termux with sudo.",
    retryCheck: "Retry Check",
    requestRootAccess: "Request Root Access",
    checkFailed: "Check Failed",
    unableDetermineRoot: "Unable to determine root status",
    tryAgain: "Try Again",
    requestRootTitle: "Request Root Access",
    requestRootMessage:
      "To use all features, this app requires root access.\n\nOptions:\n1. Install Magisk\n2. Use Termux with sudo\n3. Grant superuser permission",
    installMagisk: "Install Magisk",
    useTermux: "Use Termux",

    // Advanced tools
    advancedToolsTitle: "Advanced Tools",
    advancedToolsInfo:
      "Advanced tools require ROOT/Magisk access. Some tools may require manual confirmation in Magisk Manager.",
    permissionsOnboardingTitle: "Permissions setup",
    permissionsOnboardingSubtitle:
      "The app checks required access and guides you through granting it step by step.",
    permissionsReady: "Granted",
    permissionBlockedHint:
      "Permission was permanently denied. Open app settings and enable it manually.",
    permissionNotificationsTitle: "Notifications",
    permissionNotificationsReason:
      "Required for diagnostics alerts and tool status notifications.",
    permissionMicrophoneTitle: "Microphone",
    permissionMicrophoneReason:
      "Required for voice commands and audio diagnostics recording.",
    permissionLocationTitle: "Location",
    permissionLocationReason:
      "Android requires this permission for full Wi-Fi scan and network signal details.",
    permissionBatteryOptimizationTitle: "Battery optimization",
    permissionBatteryOptimizationReason:
      "Disable battery optimization for this app so monitoring tasks can run reliably in background.",
    permissionBatteryOptimizationInstruction:
      "In settings, find this app and set battery mode to unrestricted.",
    permissionState_granted: "Granted",
    permissionState_denied: "Denied",
    permissionState_blocked: "Permanently denied",
    permissionState_unavailable: "Unavailable",
    permissionState_needs_settings: "Needs settings",
    grantPermission: "Grant permission",
    openSettings: "Open settings",
    continueToApp: "Continue to app",
    permissionAlreadyGranted: "Permission is already granted.",
    toolKeepAwake: "Session mode (screen awake)",
    toolKeepAwakeOnStatus: "Enabled: screen stays awake during sessions.",
    toolKeepAwakeOffStatus: "Disabled: system can dim the screen.",
    toolKeepAwakeEnabled: "Session mode enabled - screen will stay awake.",
    toolKeepAwakeDisabled: "Session mode disabled - normal screen timeout restored.",
    toolNotifications: "App notifications",
    toolNotificationsDesc: "Request access for diagnostics notifications.",
    toolBatterySettings: "Battery settings",
    toolBatterySettingsDesc:
      "Open battery optimization settings and set this app to unrestricted.",
    toolAppSettings: "App settings",
    toolAppSettingsDesc: "Open app settings to change permissions manually.",
    systemToolsActionHint: "Select one of the system actions below.",
    openedBatterySettings: "Opened battery optimization settings.",
    openedAppSettings: "Opened app settings.",
  },
};

export function getTranslation(language: Language, key: keyof typeof translations.EN): string {
  return (translations[language] as any)[key] || key;
}
