import { ScrollView, View, Text, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useLanguage } from "@/lib/language-context";
import { getTranslation, translations } from "@/lib/i18n";
import { LogEntryComponent } from "@/components/ui/log-entry";
import { useFeature } from "@/lib/feature-context";
import { saveAndShareLogs } from "@/lib/log-export-service";
import * as Haptics from "expo-haptics";

export default function LogViewerScreen() {
  const router = useRouter();
  const { language } = useLanguage();
  const { logs, clearLogs } = useFeature();
  const t = (key: keyof typeof translations.EN) => getTranslation(language, key);

  const handleClearLogs = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      "Clear Logs",
      "Are you sure you want to delete all logs?",
      [
        { text: "Cancel", onPress: () => {}, style: "cancel" },
        {
          text: "Delete",
          onPress: () => clearLogs(),
          style: "destructive",
        },
      ]
    );
  };

  const handleExportLogs = async (format: "txt" | "json") => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const success = await saveAndShareLogs(logs, format);
    if (success) {
      Alert.alert(
        "Success",
        `Logs exported as ${format.toUpperCase()} and ready to share!`
      );
    } else {
      Alert.alert("Error", "Failed to export logs");
    }
  };

  return (
    <ScreenContainer className="bg-gradient-to-b from-slate-900 to-black">
      <View className="flex-1">
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
            <Text className="text-xl font-bold text-white">📋 Log Viewer</Text>
          </View>
          <Pressable
            onPress={handleClearLogs}
            disabled={logs.length === 0}
            style={({ pressed }) => [
              {
                opacity: logs.length === 0 ? 0.4 : pressed ? 0.6 : 1,
              },
            ]}
            className="p-2"
          >
            <Text className="text-sm text-cyan-400">Clear</Text>
          </Pressable>
        </View>

        {/* Logs Content */}
        {logs.length > 0 ? (
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            className="flex-1"
          >
            <View className="px-4 py-4 gap-1">
              {logs.map((log) => (
                <LogEntryComponent key={log.id} entry={log} />
              ))}
            </View>
          </ScrollView>
        ) : (
          <View className="flex-1 items-center justify-center px-4">
            <Text className="text-2xl mb-2">📭</Text>
            <Text className="text-base font-semibold text-foreground text-center mb-2">
              No logs yet
            </Text>
            <Text className="text-sm text-muted text-center">
              Run a feature to see operation logs here
            </Text>
          </View>
        )}

        {/* Export & Stats Footer */}
        {logs.length > 0 && (
          <View className="border-t border-border bg-surface/50">
            {/* Export Buttons */}
            <View className="px-4 py-3 gap-2 border-b border-border">
              <Text className="text-xs font-semibold text-muted mb-2">
                Export Logs:
              </Text>
              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => handleExportLogs("txt")}
                  style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
                  className="flex-1 bg-blue-500/20 border border-blue-500 rounded-lg py-2 items-center"
                >
                  <Text className="text-xs font-semibold text-blue-400">
                    📄 TXT
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => handleExportLogs("json")}
                  style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
                  className="flex-1 bg-green-500/20 border border-green-500 rounded-lg py-2 items-center"
                >
                  <Text className="text-xs font-semibold text-green-400">
                    📋 JSON
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Stats */}
            <View className="px-4 py-3">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-xs text-muted">
                  Total Entries: {logs.length}
                </Text>
              </View>
              <View className="flex-row gap-3">
                <View className="flex-row items-center gap-1">
                  <Text className="text-xs text-green-400">●</Text>
                  <Text className="text-xs text-muted">
                    {logs.filter((l) => l.level === "SUCCESS").length}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Text className="text-xs text-yellow-400">●</Text>
                  <Text className="text-xs text-muted">
                    {logs.filter((l) => l.level === "WARN").length}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Text className="text-xs text-red-400">●</Text>
                  <Text className="text-xs text-muted">
                    {logs.filter((l) => l.level === "ERROR").length}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}
