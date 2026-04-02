import { View, Text } from "react-native";
import { FeatureScreen } from "@/components/feature-screen";
import { useLanguage } from "@/lib/language-context";
import { getTranslation, translations } from "@/lib/i18n";
import { useFeature } from "@/lib/feature-context";
import { executeNetworkOptimization } from "@/lib/real-termux-commands";

export default function NetworkOptimizationScreen() {
  const { language } = useLanguage();
  const { addLog, setOperationStatus, setLastOperationTime } = useFeature();
  const t = (key: keyof typeof translations.EN) => getTranslation(language, key);

  const handleOptimize = async () => {
    setOperationStatus("running");
    addLog("INFO", "Starting network optimization...");

    try {
      const success = await executeNetworkOptimization(addLog);
      if (success) {
        setOperationStatus("success");
        addLog("SUCCESS", "Network optimization completed");
      } else {
        setOperationStatus("error");
        addLog("ERROR", "Network optimization failed");
      }
      setLastOperationTime(new Date().toLocaleTimeString());
    } catch (error) {
      setOperationStatus("error");
      addLog("ERROR", `Network failed: ${String(error)}`);
    }
  };

  const CustomContent = (
    <View className="gap-4">
      <View className="gap-3">
        <View className="flex-row gap-3">
          <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
            <Text className="text-xs text-muted mb-1">{t("wifiStatus")}</Text>
            <Text className="text-sm font-semibold text-green-400">
              Optimized
            </Text>
          </View>
          <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
            <Text className="text-xs text-muted mb-1">{t("networkType")}</Text>
            <Text className="text-sm font-semibold text-cyan-400">
              5G/WiFi
            </Text>
          </View>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
            <Text className="text-xs text-muted mb-1">Signal Strength</Text>
            <Text className="text-sm font-semibold text-blue-400">
              Strong
            </Text>
          </View>
          <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
            <Text className="text-xs text-muted mb-1">{t("dataUsage")}</Text>
            <Text className="text-sm font-semibold text-foreground">
              --
            </Text>
          </View>
        </View>
      </View>

      <View className="bg-blue-900/20 rounded-lg p-3 border border-blue-700">
        <Text className="text-xs text-blue-300">
          ℹ️ Network optimization disables WiFi power save mode for better performance and reduces latency.
        </Text>
      </View>
    </View>
  );

  return (
    <FeatureScreen
      title={t("networkOptimization")}
      icon="📡"
      onActionPress={handleOptimize}
      actionLabel={t("optimize")}
      customContent={CustomContent}
    />
  );
}
