import { View, Text } from "react-native";
import { FeatureScreen } from "@/components/feature-screen";
import { useLanguage } from "@/lib/language-context";
import { getTranslation, translations } from "@/lib/i18n";
import { useFeature } from "@/lib/feature-context";
import { optimizeZRAM } from "@/lib/real-termux-commands";

export default function ZRAMOptimizationScreen() {
const FEATURE_ID = "zram";

  const { language } = useLanguage();
  const { addLog, setFeatureOperationStatus, setFeatureLastOperationTime } = useFeature();
  const t = (key: keyof typeof translations.EN) => getTranslation(language, key);

  const handleOptimizeZRAM = async () => {
    setFeatureOperationStatus(FEATURE_ID, "running");
    addLog("INFO", "Optimizing ZRAM...");

    try {
      const success = await optimizeZRAM(addLog);
      if (success) {
        setFeatureOperationStatus(FEATURE_ID, "success");
        addLog("SUCCESS", "ZRAM optimization completed");
      } else {
        setFeatureOperationStatus(FEATURE_ID, "error");
        addLog("ERROR", "ZRAM optimization failed");
      }
      setFeatureLastOperationTime(FEATURE_ID, new Date().toLocaleTimeString());
    } catch (error) {
      setFeatureOperationStatus(FEATURE_ID, "error");
      addLog("ERROR", `ZRAM failed: ${String(error)}`);
    }
  };

  const CustomContent = (
    <View className="gap-4">
      <View className="gap-3">
        <View className="flex-row gap-3">
          <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
            <Text className="text-xs text-muted mb-1">ZRAM Size</Text>
          <Text className="text-2xl font-bold text-cyan-400">
            2GB
          </Text>
          </View>
          <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
            <Text className="text-xs text-muted mb-1">Swappiness</Text>
          <Text className="text-2xl font-bold text-green-400">
            10
          </Text>
          </View>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
            <Text className="text-xs text-muted mb-1">Memory Usage</Text>
          <Text className="text-sm font-semibold text-blue-400">
            --
          </Text>
          </View>
          <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
            <Text className="text-xs text-muted mb-1">Compressed</Text>
          <Text className="text-sm font-semibold text-yellow-400">
            --
          </Text>
          </View>
        </View>
      </View>

      <View className="bg-blue-900/20 rounded-lg p-3 border border-blue-700">
        <Text className="text-xs text-blue-300">
          ℹ️ ZRAM compresses unused memory, freeing up RAM for apps. Lower swappiness improves responsiveness.
        </Text>
      </View>
    </View>
  );

  return (
    <FeatureScreen
      featureId={FEATURE_ID}
      title={t("zramOptimization")}
      icon="💾"
      onActionPress={handleOptimizeZRAM}
      actionLabel={t("optimize")}
      customContent={CustomContent}
    />
  );
}
