import { View, Text } from "react-native";
import { FeatureScreen } from "@/components/feature-screen";
import { useLanguage } from "@/lib/language-context";
import { getTranslation, translations } from "@/lib/i18n";
import { useFeature } from "@/lib/feature-context";
import { setCPUPerformanceMode } from "@/lib/real-termux-commands";

export default function CPUPerformanceScreen() {
const FEATURE_ID = "cpu";

  const { language } = useLanguage();
  const { addLog, setFeatureOperationStatus, setFeatureLastOperationTime } = useFeature();
  const t = (key: keyof typeof translations.EN) => getTranslation(language, key);

  const handleSetPerformance = async () => {
    setFeatureOperationStatus(FEATURE_ID, "running");
    addLog("INFO", "Switching CPU to performance mode...");

    try {
      const success = await setCPUPerformanceMode(addLog);
      if (success) {
        setFeatureOperationStatus(FEATURE_ID, "success");
        addLog("SUCCESS", "CPU performance mode activated");
      } else {
        setFeatureOperationStatus(FEATURE_ID, "error");
        addLog("ERROR", "Failed to set CPU performance");
      }
      setFeatureLastOperationTime(FEATURE_ID, new Date().toLocaleTimeString());
    } catch (error) {
      setFeatureOperationStatus(FEATURE_ID, "error");
      addLog("ERROR", `CPU performance failed: ${String(error)}`);
    }
  };

  const CustomContent = (
    <View className="gap-4">
      <View className="gap-3">
        <View className="flex-row gap-3">
          <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
            <Text className="text-xs text-muted mb-1">{t("cpuGovernor")}</Text>
            <Text className="text-sm font-semibold text-cyan-400">
              performance
            </Text>
          </View>
          <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
            <Text className="text-xs text-muted mb-1">{t("cpuFrequency")}</Text>
            <Text className="text-sm font-semibold text-green-400">
              Max Freq
            </Text>
          </View>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
            <Text className="text-xs text-muted mb-1">{t("cpuCores")}</Text>
            <Text className="text-2xl font-bold text-blue-400">
              8
            </Text>
          </View>
          <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
            <Text className="text-xs text-muted mb-1">{t("cpuTemp")}</Text>
            <Text className="text-2xl font-bold text-yellow-400">
              45°C
            </Text>
          </View>
        </View>
      </View>

      <View className="bg-yellow-900/20 rounded-lg p-3 border border-yellow-700">
        <Text className="text-xs text-yellow-300">
          ⚠️ Performance mode increases power consumption and heat. Use for gaming or heavy tasks only.
        </Text>
      </View>
    </View>
  );

  return (
    <FeatureScreen
      featureId={FEATURE_ID}
      title={t("cpuPerformance")}
      icon="⚙️"
      onActionPress={handleSetPerformance}
      actionLabel="Set Performance"
      customContent={CustomContent}
    />
  );
}
