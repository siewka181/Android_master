import { View, Text } from "react-native";
import { FeatureScreen } from "@/components/feature-screen";
import { useLanguage } from "@/lib/language-context";
import { getTranslation, translations } from "@/lib/i18n";
import { useFeature } from "@/lib/feature-context";
import { optimizeGPU } from "@/lib/real-termux-commands";

export default function GPUOptimizationScreen() {
const FEATURE_ID = "gpu";

  const { language } = useLanguage();
  const { addLog, setFeatureOperationStatus, setFeatureLastOperationTime } = useFeature();
  const t = (key: keyof typeof translations.EN) => getTranslation(language, key);

  const handleOptimizeGPU = async () => {
    setFeatureOperationStatus(FEATURE_ID, "running");
    addLog("INFO", "Optimizing GPU...");

    try {
      const success = await optimizeGPU(addLog);
      if (success) {
        setFeatureOperationStatus(FEATURE_ID, "success");
        addLog("SUCCESS", "GPU optimization completed");
      } else {
        setFeatureOperationStatus(FEATURE_ID, "error");
        addLog("ERROR", "GPU optimization failed");
      }
      setFeatureLastOperationTime(FEATURE_ID, new Date().toLocaleTimeString());
    } catch (error) {
      setFeatureOperationStatus(FEATURE_ID, "error");
      addLog("ERROR", `GPU failed: ${String(error)}`);
    }
  };

  const CustomContent = (
    <View className="gap-4">
      <View className="gap-3">
        <View className="flex-row gap-3">
          <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
            <Text className="text-xs text-muted mb-1">GPU Driver</Text>
            <Text className="text-sm font-semibold text-cyan-400">
              Adreno
            </Text>
          </View>
          <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
            <Text className="text-xs text-muted mb-1">Refresh Rate</Text>
            <Text className="text-2xl font-bold text-green-400">
              120Hz
            </Text>
          </View>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
            <Text className="text-xs text-muted mb-1">Power Save</Text>
            <Text className="text-sm font-semibold text-yellow-400">
              OFF
            </Text>
          </View>
          <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
            <Text className="text-xs text-muted mb-1">Game Driver</Text>
            <Text className="text-sm font-semibold text-green-400">
              Enabled
            </Text>
          </View>
        </View>
      </View>

      <View className="bg-blue-900/20 rounded-lg p-3 border border-blue-700">
        <Text className="text-xs text-blue-300">
          ℹ️ GPU optimization enables high refresh rates and game driver for smoother gaming experience.
        </Text>
      </View>
    </View>
  );

  return (
    <FeatureScreen
      featureId={FEATURE_ID}
      title={t("gpuOptimization")}
      icon="🎮"
      onActionPress={handleOptimizeGPU}
      actionLabel={t("optimize")}
      customContent={CustomContent}
    />
  );
}
