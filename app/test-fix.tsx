import { View, Text } from "react-native";
import { FeatureScreen } from "@/components/feature-screen";
import { useLanguage } from "@/lib/language-context";
import { getTranslation, translations } from "@/lib/i18n";
import { useFeature } from "@/lib/feature-context";
import { mockTestLogs, simulateOperation } from "@/lib/mock-data";

export default function TestFixScreen() {
  const { language } = useLanguage();
  const { addLog, setOperationStatus, setLastOperationTime } = useFeature();
  const t = (key: keyof typeof translations.EN) => getTranslation(language, key);

  const handleRunFullTest = async () => {
    setOperationStatus("running");
    addLog("XDR", "=== FULL XDR AUTOMATED TEST ===");

    try {
      await simulateOperation(mockTestLogs, addLog, 400);
      setOperationStatus("success");
      addLog("SUCCESS", t("testCompleted"));
      setLastOperationTime(new Date().toLocaleTimeString());
    } catch (error) {
      setOperationStatus("error");
      addLog("ERROR", t("operationFailed"));
    }
  };

  const CustomContent = (
    <View className="gap-4">
      {/* Test Stages */}
      <View className="bg-surface rounded-lg p-4 border border-border">
        <Text className="text-sm font-semibold text-foreground mb-3">
          Test Stages:
        </Text>
        <View className="gap-2">
          <View className="flex-row items-center gap-2">
            <Text className="text-lg">🔋</Text>
            <View className="flex-1">
              <Text className="text-xs font-semibold text-foreground">
                Battery Diagnostics
              </Text>
              <Text className="text-xs text-muted">
                Check battery health, temp, voltage
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-2">
            <Text className="text-lg">🚀</Text>
            <View className="flex-1">
              <Text className="text-xs font-semibold text-foreground">
                Game Boost
              </Text>
              <Text className="text-xs text-muted">
                Apply all optimizations
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-2">
            <Text className="text-lg">📊</Text>
            <View className="flex-1">
              <Text className="text-xs font-semibold text-foreground">
                Resource Monitor
              </Text>
              <Text className="text-xs text-muted">
                Monitor CPU, memory, temperature
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-2">
            <Text className="text-lg">📱</Text>
            <View className="flex-1">
              <Text className="text-xs font-semibold text-foreground">
                Device Fingerprint
              </Text>
              <Text className="text-xs text-muted">
                Dump system specifications
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-2">
            <Text className="text-lg">🧪</Text>
            <View className="flex-1">
              <Text className="text-xs font-semibold text-foreground">
                CPU Throttling Test
              </Text>
              <Text className="text-xs text-muted">
                Test CPU performance under load
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Duration Info */}
      <View className="bg-blue-900/20 rounded-lg p-3 border border-blue-700">
        <Text className="text-xs text-blue-300">
          ℹ️ Full test takes approximately 2-3 minutes. Keep the app open during testing.
        </Text>
      </View>

      {/* What You'll Get */}
      <View className="bg-green-900/20 rounded-lg p-3 border border-green-700">
        <Text className="text-xs text-green-300 font-semibold mb-1">
          Results Include:
        </Text>
        <Text className="text-xs text-green-200">
          • Battery health report{"\n"}
          • Performance metrics{"\n"}
          • Thermal analysis{"\n"}
          • Device specifications{"\n"}
          • Optimization recommendations
        </Text>
      </View>
    </View>
  );

  return (
    <FeatureScreen
      title={t("testFix")}
      icon="🧪"
      onActionPress={handleRunFullTest}
      actionLabel="Run Full Test"
      customContent={CustomContent}
    />
  );
}
