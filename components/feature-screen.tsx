import { ScrollView, View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useLanguage } from "@/lib/language-context";
import { getTranslation, translations } from "@/lib/i18n";
import { LogEntryComponent } from "@/components/ui/log-entry";
import { useFeature } from "@/lib/feature-context";
import * as Haptics from "expo-haptics";

interface FeatureScreenProps {
  title: string;
  icon: string;
  children?: React.ReactNode;
  onActionPress?: () => Promise<void>;
  actionLabel?: string;
  showLogs?: boolean;
  customContent?: React.ReactNode;
}

export function FeatureScreen({
  title,
  icon,
  onActionPress,
  actionLabel = "Start",
  showLogs = true,
  customContent,
}: FeatureScreenProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const { logs, operationStatus, lastOperationTime } = useFeature();
  const t = (key: keyof typeof translations.EN) => getTranslation(language, key);

  const handleActionPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onActionPress) {
      await onActionPress();
    }
  };

  return (
    <ScreenContainer className="bg-gradient-to-b from-slate-900 to-black">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4 border-b border-border">
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            className="p-2"
          >
            <Text className="text-2xl">←</Text>
          </Pressable>
          <View className="flex-1 items-center">
            <Text className="text-xl font-bold text-white">{icon} {title}</Text>
          </View>
          <View className="w-10" />
        </View>

        {/* Status Card */}
        <View className="mx-4 mt-4 p-4 bg-surface rounded-xl border border-border">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-sm text-muted">{t("idle")}</Text>
            <View
              className={`px-3 py-1 rounded-full ${
                operationStatus === "running"
                  ? "bg-blue-500"
                  : operationStatus === "success"
                    ? "bg-green-500"
                    : operationStatus === "error"
                      ? "bg-red-500"
                      : "bg-gray-600"
              }`}
            >
              <Text className="text-xs font-semibold text-white">
                {operationStatus.toUpperCase()}
              </Text>
            </View>
          </View>
          {lastOperationTime && (
            <Text className="text-xs text-gray-400">
              {t("lastUpdated")}: {lastOperationTime}
            </Text>
          )}
        </View>

        {/* Custom Content */}
        {customContent && <View className="px-4 mt-4">{customContent}</View>}

        {/* Action Button */}
        {onActionPress && (
          <Pressable
            onPress={handleActionPress}
            disabled={operationStatus === "running"}
            style={({ pressed }) => [
              {
                transform: [{ scale: pressed && operationStatus !== "running" ? 0.97 : 1 }],
                opacity: operationStatus === "running" ? 0.5 : pressed ? 0.8 : 1,
              },
            ]}
            className="mx-4 mt-6 bg-cyan-500 rounded-lg py-3 px-4 items-center"
          >
            <Text className="text-white font-semibold">
              {operationStatus === "running" ? "Running..." : actionLabel}
            </Text>
          </Pressable>
        )}

        {/* Logs Section */}
        {showLogs && logs.length > 0 && (
          <View className="mx-4 mt-6 mb-6">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm font-semibold text-gray-300">Logs</Text>
              <Pressable
                onPress={() => {
                  // Clear logs functionality
                }}
                className="px-2 py-1"
              >
                <Text className="text-xs text-gray-400">Clear</Text>
              </Pressable>
            </View>
            <View className="bg-black/50 rounded-lg p-3 border border-gray-700">
              {logs.map((log) => (
                <LogEntryComponent key={log.id} entry={log} />
              ))}
            </View>
          </View>
        )}

        {/* Empty Logs Message */}
        {showLogs && logs.length === 0 && onActionPress && (
          <View className="mx-4 mt-6 mb-6 p-4 bg-surface rounded-lg border border-border items-center">
            <Text className="text-sm text-muted text-center">
              Tap the button above to start
            </Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
