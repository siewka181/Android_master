import { View, Text, Alert } from "react-native";
import { FeatureScreen } from "@/components/feature-screen";
import { useLanguage } from "@/lib/language-context";
import { getTranslation, translations } from "@/lib/i18n";
import { useFeature } from "@/lib/feature-context";
import { activateAggressiveMode } from "@/lib/real-termux-commands";
import * as Haptics from "expo-haptics";

export default function AggressiveModeScreen() {
  const { language } = useLanguage();
  const { addLog, setOperationStatus, setLastOperationTime } = useFeature();
  const t = (key: keyof typeof translations.EN) => getTranslation(language, key);

  const handleActivateAggressive = async () => {
    setOperationStatus("running");
    addLog("WARN", "=== AGGRESSIVE MODE (Thermal Killer) ===");

    try {
      const success = await activateAggressiveMode(addLog);
      if (success) {
        setOperationStatus("success");
        addLog("SUCCESS", "Aggressive mode activated");
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } else {
        setOperationStatus("error");
        addLog("ERROR", t("operationFailed"));
      }
      setLastOperationTime(new Date().toLocaleTimeString());
    } catch (error) {
      setOperationStatus("error");
      addLog("ERROR", `${t("operationFailed")}: ${String(error)}`);
    }
  };

  const handleActivateWithWarning = async () => {
    Alert.alert(
      "AGGRESSIVE MODE - Thermal Killer",
      t("aggressiveWarning"),
      [
        { text: "Cancel", onPress: () => {}, style: "cancel" },
        {
          text: "Activate",
          onPress: () => handleActivateAggressive(),
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  const CustomContent = (
    <View className="gap-4">
      {/* Danger Warning */}
      <View className="bg-red-900/40 rounded-lg p-4 border-2 border-red-600">
        <View className="flex-row gap-3">
          <Text className="text-3xl">🔥</Text>
          <View className="flex-1">
            <Text className="text-sm font-bold text-red-300 mb-2">
              DANGER: Thermal Killer Mode
            </Text>
            <Text className="text-xs text-red-200 leading-relaxed">
              This mode disables thermal protection. Device may overheat. Use ONLY for brief periods during gaming or benchmarking. Monitor temperature closely!
            </Text>
          </View>
        </View>
      </View>

      {/* What It Does */}
      <View className="bg-surface rounded-lg p-4 border border-border">
        <Text className="text-sm font-semibold text-foreground mb-3">
          What Aggressive Mode Does:
        </Text>
        <View className="gap-2">
          <View className="flex-row items-center gap-2">
            <Text className="text-red-400">⚡</Text>
            <Text className="text-xs text-muted">Disables thermal mitigation</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-red-400">⚡</Text>
            <Text className="text-xs text-muted">Maximizes CPU/GPU performance</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-red-400">⚡</Text>
            <Text className="text-xs text-muted">Increases power consumption</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-red-400">⚡</Text>
            <Text className="text-xs text-muted">Extreme heat generation</Text>
          </View>
        </View>
      </View>

      {/* Safety Tips */}
      <View className="bg-yellow-900/20 rounded-lg p-3 border border-yellow-700">
        <Text className="text-xs text-yellow-300 font-semibold mb-2">
          Safety Tips:
        </Text>
        <Text className="text-xs text-yellow-200">
          • Use only for 5-10 minutes maximum{"\n"}
          • Keep device in well-ventilated area{"\n"}
          • Monitor temperature constantly{"\n"}
          • Stop immediately if too hot{"\n"}
          • Use cooling pad if available
        </Text>
      </View>
    </View>
  );

  return (
    <FeatureScreen
      title={t("aggressiveMode")}
      icon="🔥"
      onActionPress={handleActivateWithWarning}
      actionLabel="Activate (DANGEROUS)"
      customContent={CustomContent}
    />
  );
}
