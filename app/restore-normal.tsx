import { View, Text, Pressable, Alert } from "react-native";
import { FeatureScreen } from "@/components/feature-screen";
import { useLanguage } from "@/lib/language-context";
import { getTranslation, translations } from "@/lib/i18n";
import { useFeature } from "@/lib/feature-context";
import { restoreNormalMode } from "@/lib/real-termux-commands";
import * as Haptics from "expo-haptics";

export default function RestoreNormalScreen() {
  const { language } = useLanguage();
  const { addLog, setOperationStatus, setLastOperationTime } = useFeature();
  const t = (key: keyof typeof translations.EN) => getTranslation(language, key);

  const handleRestore = async () => {
    setOperationStatus("running");
    addLog("XDR", "=== RESTORE NORMAL MODE (FULL ROLLBACK) ===");

    try {
      const success = await restoreNormalMode(addLog);
      if (success) {
        setOperationStatus("success");
        addLog("SUCCESS", t("restoreConfirmed"));
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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

  const handleRestoreWithConfirmation = async () => {
    Alert.alert(
      "Restore System",
      t("restoreWarning"),
      [
        { text: "Cancel", onPress: () => {}, style: "cancel" },
        {
          text: "Restore",
          onPress: handleRestore,
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  const CustomContent = (
    <View className="gap-4">
      {/* Warning Box */}
      <View className="bg-red-900/30 rounded-lg p-4 border border-red-700">
        <View className="flex-row gap-3">
          <Text className="text-2xl">⚠️</Text>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-red-300 mb-2">
              Full System Rollback
            </Text>
            <Text className="text-xs text-red-200 leading-relaxed">
              This will revert all optimizations and restore the system to its factory state. All boost settings will be removed.
            </Text>
          </View>
        </View>
      </View>

      {/* Info Box */}
      <View className="bg-blue-900/20 rounded-lg p-3 border border-blue-700">
        <Text className="text-xs text-blue-300">
          ℹ️ Restore is safe and reversible. You can apply optimizations again after restoring.
        </Text>
      </View>

      {/* What Will Be Restored */}
      <View className="bg-surface rounded-lg p-4 border border-border">
        <Text className="text-sm font-semibold text-foreground mb-3">
          Will be restored:
        </Text>
        <View className="gap-2">
          <View className="flex-row items-center gap-2">
            <Text className="text-green-400">✓</Text>
            <Text className="text-xs text-muted">CPU governors to schedutil</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-green-400">✓</Text>
            <Text className="text-xs text-muted">Memory swappiness to 60</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-green-400">✓</Text>
            <Text className="text-xs text-muted">Thermal protection enabled</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-green-400">✓</Text>
            <Text className="text-xs text-muted">Network settings to default</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <FeatureScreen
      title={t("restoreNormal")}
      icon="🔄"
      onActionPress={handleRestoreWithConfirmation}
      actionLabel={t("restore")}
      customContent={CustomContent}
    />
  );
}
