import { View, Text } from "react-native";
import { FeatureScreen } from "@/components/feature-screen";
import { useLanguage } from "@/lib/language-context";
import { getTranslation, translations } from "@/lib/i18n";
import { useFeature } from "@/lib/feature-context";
import { executeGameBoost } from "@/lib/real-termux-commands";
import { trpc } from "@/lib/trpc";

export default function GameBoostScreen() {
const FEATURE_ID = "game-boost";

  const { language } = useLanguage();
  const { addLog, setFeatureOperationStatus, setFeatureLastOperationTime } = useFeature();
  const t = (key: keyof typeof translations.EN) => getTranslation(language, key);
  const queueBoostMutation = trpc.feature.boost.run.useMutation();

  const handleStartBoost = async () => {
    setFeatureOperationStatus(FEATURE_ID, "running");
    addLog("INFO", t("boostStarted"));

    try {
      const queued = await queueBoostMutation.mutateAsync({
        profile: "safe",
        source: "mobile-ui",
      });
      addLog("INFO", queued.message);

      const success = await executeGameBoost(addLog);
      if (success) {
        setFeatureOperationStatus(FEATURE_ID, "success");
        addLog("SUCCESS", t("boostCompleted"));
      } else {
        setFeatureOperationStatus(FEATURE_ID, "error");
        addLog("ERROR", t("operationFailed"));
      }
      setFeatureLastOperationTime(FEATURE_ID, new Date().toLocaleTimeString());
    } catch (error) {
      setFeatureOperationStatus(FEATURE_ID, "error");
      addLog("ERROR", `${t("operationFailed")}: ${String(error)}`);
    }
  };

  const CustomContent = (
    <View className="gap-4">
      {/* Features List */}
      <View className="bg-surface rounded-lg p-4 border border-border">
        <Text className="text-sm font-semibold text-foreground mb-3">
          Optimization Features:
        </Text>
        <View className="gap-2">
          <View className="flex-row items-center gap-2">
            <Text className="text-lg">⚙️</Text>
            <Text className="text-sm text-muted">CPU Performance Mode</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-lg">💾</Text>
            <Text className="text-sm text-muted">ZRAM 2GB + Swappiness 10</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-lg">📡</Text>
            <Text className="text-sm text-muted">Network Optimization</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-lg">🎮</Text>
            <Text className="text-sm text-muted">GPU Optimization</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-lg">🔧</Text>
            <Text className="text-sm text-muted">I/O & Kernel Tweaks</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-lg">🌡️</Text>
            <Text className="text-sm text-muted">Thermal Monitoring</Text>
          </View>
        </View>
      </View>

      {/* Info Box */}
      <View className="bg-blue-900/20 rounded-lg p-3 border border-blue-700">
        <Text className="text-xs text-blue-300">
          ℹ️ This is a safe gaming boost that applies multiple optimizations simultaneously. All changes are reversible.
        </Text>
      </View>
    </View>
  );

  return (
    <FeatureScreen
      featureId={FEATURE_ID}
      title={t("gameBoost")}
      icon="🚀"
      onActionPress={handleStartBoost}
      actionLabel={t("startBoost")}
      customContent={CustomContent}
    />
  );
}
