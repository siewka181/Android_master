import { ScreenContainer } from "@/components/screen-container";
import { useFeature } from "@/lib/feature-context";
import {
  type DeveloperDiagnosticsReport,
  runDeveloperDiagnostics,
} from "@/lib/developer-diagnostics-service";
import { saveAndShareReport } from "@/lib/log-export-service";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

export default function DeveloperDiagnosticsScreen() {
  const router = useRouter();
  const { addLog } = useFeature();
  const [report, setReport] = useState<DeveloperDiagnosticsReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addLog("XDR", "Developer diagnostics started");

    try {
      const result = await runDeveloperDiagnostics();
      setReport(result);
      addLog("SUCCESS", `Developer diagnostics finished. session=${result.sessionId}`);
    } catch (error) {
      addLog("ERROR", `Developer diagnostics failed: ${String(error)}`);
      Alert.alert("Diagnostics error", String(error));
    } finally {
      setIsRunning(false);
    }
  };

  const exportReport = async (format: "txt" | "json") => {
    if (!report) return;

    const content =
      format === "json"
        ? JSON.stringify(report, null, 2)
        : [
            "=== ANDROID MASTER BOOST — DEVELOPER DIAGNOSTICS ===",
            `timestamp: ${report.timestamp}`,
            `sessionId: ${report.sessionId}`,
            `appVersion: ${report.appVersion}`,
            `device: ${report.device.platform} ${report.device.platformVersion} (${report.device.model})`,
            "",
            "Checks:",
            ...report.checks.map(
              (check) =>
                `- ${check.key}: ${check.status} (${check.durationMs}ms) | ${check.details}`,
            ),
            "",
            "Failing checks:",
            ...(report.failingChecks.length > 0 ? report.failingChecks : ["none"]),
            "",
            "Recommendations:",
            ...(report.recommendations.length > 0 ? report.recommendations : ["none"]),
            "",
            "Debug summary for chat:",
            report.debugSummaryForChat,
          ].join("\n");

    const ok = await saveAndShareReport(content, {
      filenamePrefix: "AMB_dev_diagnostics",
      format,
      dialogTitle: "Share Developer Diagnostics",
    });

    if (!ok) {
      Alert.alert("Export error", "Failed to export diagnostics report.");
    }
  };

  return (
    <ScreenContainer className="bg-gradient-to-b from-slate-900 to-black">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between px-4 py-4 border-b border-border">
          <Pressable onPress={() => router.back()} className="p-2">
            <Text className="text-2xl">←</Text>
          </Pressable>
          <Text className="text-xl font-bold text-white">🧪 Developer Diagnostics</Text>
          <View className="w-10" />
        </View>

        <View className="px-4 py-6 gap-4">
          <Pressable
            onPress={runDiagnostics}
            disabled={isRunning}
            className="bg-cyan-500 rounded-lg py-3 items-center"
          >
            <Text className="text-white font-semibold">
              {isRunning ? "Running diagnostics..." : "Run Full Self-Test"}
            </Text>
          </Pressable>

          {report && (
            <>
              <View className="bg-surface rounded-lg p-4 border border-border gap-2">
                <Text className="text-sm text-foreground">sessionId: {report.sessionId}</Text>
                <Text className="text-sm text-foreground">appVersion: {report.appVersion}</Text>
                <Text className="text-sm text-foreground">
                  failing checks: {report.failingChecks.length}
                </Text>
                <Text className="text-xs text-muted">{report.debugSummaryForChat}</Text>
              </View>

              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => exportReport("txt")}
                  className="flex-1 bg-blue-500/20 border border-blue-500 rounded-lg py-3 items-center"
                >
                  <Text className="text-blue-300 font-semibold">Export TXT</Text>
                </Pressable>
                <Pressable
                  onPress={() => exportReport("json")}
                  className="flex-1 bg-green-500/20 border border-green-500 rounded-lg py-3 items-center"
                >
                  <Text className="text-green-300 font-semibold">Export JSON</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
