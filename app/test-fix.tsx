import { View, Text } from "react-native";
import { FeatureScreen } from "@/components/feature-screen";
import { useLanguage } from "@/lib/language-context";
import { getTranslation, translations } from "@/lib/i18n";
import { useFeature } from "@/lib/feature-context";
import { executeCommandWithGuards } from "@/lib/command-execution-service";

export default function TestFixScreen() {
  const FEATURE_ID = "test";

  const { language } = useLanguage();
  const { addLog, setFeatureOperationStatus, setFeatureLastOperationTime } = useFeature();
  const t = (key: keyof typeof translations.EN) => getTranslation(language, key);

  const handleRunFullTest = async () => {
    setFeatureOperationStatus(FEATURE_ID, "running");
    addLog("XDR", "=== FULL DEVICE TEST START ===");

    const checks = [
      {
        id: "battery",
        command: "cat",
        args: ["/sys/class/power_supply/battery/capacity"],
        successMessage: "Battery capacity read",
      },
      {
        id: "thermal",
        command: "cat",
        args: ["/sys/class/thermal/thermal_zone0/temp"],
        successMessage: "Thermal sensor read",
      },
      {
        id: "cpu-load",
        command: "cat",
        args: ["/proc/loadavg"],
        successMessage: "CPU load read",
      },
      {
        id: "memory",
        command: "free",
        args: ["-h"],
        successMessage: "Memory snapshot collected",
      },
      {
        id: "network",
        command: "ip",
        args: ["route"],
        successMessage: "Network route table read",
      },
    ] as const;

    let hasFailure = false;

    for (const check of checks) {
      const result = await executeCommandWithGuards(check, addLog);
      if (result.status !== "success") {
        hasFailure = true;
      }
    }

    if (hasFailure) {
      addLog("WARN", "Some diagnostics failed. Check missing root/Termux requirements.");
      setFeatureOperationStatus(FEATURE_ID, "error");
    } else {
      addLog("SUCCESS", t("testCompleted"));
      setFeatureOperationStatus(FEATURE_ID, "success");
    }

    setFeatureLastOperationTime(FEATURE_ID, new Date().toLocaleTimeString());
  };

  const CustomContent = (
    <View className="gap-4">
      <View className="bg-surface rounded-lg p-4 border border-border">
        <Text className="text-sm font-semibold text-foreground mb-3">Test Stages:</Text>
        <View className="gap-2">
          <Text className="text-xs text-muted">• Battery capacity + thermal sensors</Text>
          <Text className="text-xs text-muted">• CPU load and memory snapshot</Text>
          <Text className="text-xs text-muted">• Network route diagnostics</Text>
          <Text className="text-xs text-muted">• Structured logs for each command step</Text>
        </View>
      </View>

      <View className="bg-blue-900/20 rounded-lg p-3 border border-blue-700">
        <Text className="text-xs text-blue-300">
          ℹ️ This test uses real shell diagnostics via Termux API and will report missing permissions.
        </Text>
      </View>
    </View>
  );

  return (
    <FeatureScreen
      featureId={FEATURE_ID}
      title={t("testFix")}
      icon="🧪"
      onActionPress={handleRunFullTest}
      actionLabel="Run Full Test"
      customContent={CustomContent}
    />
  );
}
