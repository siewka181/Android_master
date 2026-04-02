import { ScreenContainer } from "@/components/screen-container";
import { useFeature } from "@/lib/feature-context";
import { getTranslation, translations } from "@/lib/i18n";
import { useLanguage } from "@/lib/language-context";
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
  const { addLog, logs } = useFeature();
  const { language } = useLanguage();
  const t = (key: keyof typeof translations.EN) => getTranslation(language, key);
  const [report, setReport] = useState<DeveloperDiagnosticsReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addLog("XDR", t("devDiagnosticsStarted"));

    try {
      const result = await runDeveloperDiagnostics(logs);
      setReport(result);
      addLog("SUCCESS", `${t("devDiagnosticsFinished")} session=${result.sessionId}`);
    } catch (error) {
      addLog("ERROR", `${t("devDiagnosticsFailed")}: ${String(error)}`);
      Alert.alert(t("devDiagnosticsErrorTitle"), String(error));
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
            `reportVersion: ${report.reportVersion}`,
            `timestamp: ${report.timestamp}`,
            `sessionId: ${report.sessionId}`,
            `appVersion: ${report.appVersion}`,
            `device: ${report.device.platform} ${report.device.platformVersion} (${report.device.model})`,
            `environment: ownership=${report.environment.appOwnership}, execution=${report.environment.executionEnvironment}`,
            `readiness: ${report.finalReadinessSummary.status} (${report.finalReadinessSummary.score}%)`,
            "",
            "Checks (global):",
            ...report.checks.map(
              (check) =>
                `- ${check.key}: ${check.status} (${check.durationMs}ms) | ${check.details}`,
            ),
            "",
            "Feature checks:",
            ...report.featureChecks.map(
              (check) =>
                `- ${check.key}: ${check.status} (${check.durationMs}ms) | ${check.details}`,
            ),
            "",
            "Recent normalized errors:",
            ...(report.recentNormalizedErrors.length > 0
              ? report.recentNormalizedErrors.map(
                  (item) => `- [${item.timestamp}] ${item.code} | ${item.message}`,
                )
              : ["none"]),
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
      dialogTitle: t("devDiagnosticsShareDialogTitle"),
    });

    if (!ok) {
      Alert.alert(t("errorTitle"), t("devDiagnosticsExportFailed"));
    }
  };

  const copySummary = async () => {
    if (!report) return;

    try {
      const clipboard = globalThis.navigator?.clipboard;
      if (clipboard?.writeText) {
        await clipboard.writeText(report.debugSummaryForChat);
        addLog("SUCCESS", t("devDiagnosticsSummaryCopied"));
        Alert.alert(t("successTitle"), t("devDiagnosticsSummaryCopied"));
        return;
      }

      const shared = await saveAndShareReport(report.debugSummaryForChat, {
        filenamePrefix: "AMB_debug_summary",
        format: "txt",
        dialogTitle: t("devDiagnosticsShareDialogTitle"),
      });
      if (shared) {
        addLog("INFO", t("devDiagnosticsSummaryShared"));
        Alert.alert(t("successTitle"), t("devDiagnosticsSummaryShared"));
      } else {
        throw new Error("summary-share-failed");
      }
    } catch (error) {
      addLog("ERROR", `${t("devDiagnosticsClipboardFailed")}: ${String(error)}`);
      Alert.alert(t("errorTitle"), t("devDiagnosticsClipboardFailed"));
    }
  };

  return (
    <ScreenContainer className="bg-gradient-to-b from-slate-900 to-black">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between px-4 py-4 border-b border-border">
          <Pressable onPress={() => router.back()} className="p-2">
            <Text className="text-2xl">←</Text>
          </Pressable>
          <Text className="text-xl font-bold text-white">🧪 {t("developerDiagnosticsTitle")}</Text>
          <View className="w-10" />
        </View>

        <View className="px-4 py-6 gap-4">
          <Pressable
            onPress={runDiagnostics}
            disabled={isRunning}
            className="bg-cyan-500 rounded-lg py-3 items-center"
          >
            <Text className="text-white font-semibold">
              {isRunning ? t("devDiagnosticsRunning") : t("devDiagnosticsRunFull")}
            </Text>
          </Pressable>

          {report && (
            <>
              <View className="bg-surface rounded-lg p-4 border border-border gap-2">
                <Text className="text-sm text-foreground">sessionId: {report.sessionId}</Text>
                <Text className="text-sm text-foreground">appVersion: {report.appVersion}</Text>
                <Text className="text-sm text-foreground">
                  {t("devDiagnosticsFailingChecks")}: {report.failingChecks.length}
                </Text>
                <Text className="text-sm text-foreground">
                  {t("devDiagnosticsReadiness")} {report.finalReadinessSummary.status} (
                  {report.finalReadinessSummary.score}%)
                </Text>
                <Text className="text-sm text-foreground">
                  {t("devDiagnosticsRecentErrors")}: {report.recentNormalizedErrors.length}
                </Text>
                <Text className="text-xs text-muted">{report.debugSummaryForChat}</Text>
              </View>

              <View className="flex-row gap-2">
                <Pressable
                  onPress={copySummary}
                  className="flex-1 bg-amber-500/20 border border-amber-500 rounded-lg py-3 items-center"
                >
                  <Text className="text-amber-300 font-semibold">{t("devDiagnosticsCopySummary")}</Text>
                </Pressable>
              </View>

              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => exportReport("txt")}
                  className="flex-1 bg-blue-500/20 border border-blue-500 rounded-lg py-3 items-center"
                >
                  <Text className="text-blue-300 font-semibold">{t("devDiagnosticsExportTxt")}</Text>
                </Pressable>
                <Pressable
                  onPress={() => exportReport("json")}
                  className="flex-1 bg-green-500/20 border border-green-500 rounded-lg py-3 items-center"
                >
                  <Text className="text-green-300 font-semibold">{t("devDiagnosticsExportJson")}</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
