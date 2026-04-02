import { View, Text } from "react-native";
import { FeatureScreen } from "@/components/feature-screen";
import { useLanguage } from "@/lib/language-context";
import { getTranslation, translations } from "@/lib/i18n";
import { useFeature } from "@/lib/feature-context";
import { getRealTimeStats } from "@/lib/real-termux-commands";
import { useState } from "react";

export default function ResourceMonitorScreen() {
  const { language } = useLanguage();
  const { addLog, setOperationStatus, setLastOperationTime } = useFeature();
  const t = (key: keyof typeof translations.EN) => getTranslation(language, key);

  const [stats, setStats] = useState<Record<string, any>>({
    cpuUsage: 0,
    memoryUsage: "--",
    temperature: 0,
  });

  const handleStartMonitoring = async () => {
    setOperationStatus("running");
    addLog("INFO", "=== REAL-TIME RESOURCE MONITOR (5s) ===");

    try {
      for (let i = 0; i < 5; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const currentStats = await getRealTimeStats(addLog);
        setStats(currentStats);
      }
      setOperationStatus("success");
      addLog("SUCCESS", "Resource monitoring completed");
    } catch (error) {
      setOperationStatus("error");
      addLog("ERROR", `Monitoring failed: ${String(error)}`);
    }
    setLastOperationTime(new Date().toLocaleTimeString());
  };

  const CustomContent = (
    <View className="gap-4">
      {/* Current Stats */}
      <View className="bg-surface rounded-lg p-4 border border-border">
        <Text className="text-sm font-semibold text-foreground mb-3">Current Status:</Text>
        <View className="gap-2">
          {/* CPU Usage */}
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-muted">CPU Usage</Text>
            <View className="flex-row items-center gap-2">
              <View className="flex-1 h-1 bg-gray-700 rounded w-20">
                <View
                  className="h-1 bg-cyan-500 rounded"
                  style={{ width: `${Math.min(stats.cpuUsage || 0, 100)}%` }}
                />
              </View>
              <Text className="text-xs text-cyan-400 w-8">
                {Math.round(stats.cpuUsage || 0)}%
              </Text>
            </View>
          </View>

          {/* Memory Usage */}
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-muted">Memory Usage</Text>
            <View className="flex-row items-center gap-2">
              <View className="flex-1 h-1 bg-gray-700 rounded w-20">
                <View className="h-1 bg-green-500 rounded" style={{ width: "45%" }} />
              </View>
              <Text className="text-xs text-green-400 w-8">
                {stats.memoryUsage}
              </Text>
            </View>
          </View>

          {/* Temperature */}
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-muted">Temperature</Text>
            <View className="flex-row items-center gap-2">
              <View className="flex-1 h-1 bg-gray-700 rounded w-20">
                <View
                  className="h-1 bg-yellow-500 rounded"
                  style={{
                    width: `${Math.min((stats.temperature || 0) / 100 * 100, 100)}%`,
                  }}
                />
              </View>
              <Text className="text-xs text-yellow-400 w-8">
                {stats.temperature}°C
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Info Box */}
      <View className="bg-blue-900/20 rounded-lg p-3 border border-blue-700">
        <Text className="text-xs text-blue-300">
          ℹ️ Monitoring runs for 5 seconds with 1-second intervals. Tap button to start real-time monitoring.
        </Text>
      </View>
    </View>
  );

  return (
    <FeatureScreen
      title={t("resourceMonitor")}
      icon="📊"
      onActionPress={handleStartMonitoring}
      actionLabel="Start Monitor"
      customContent={CustomContent}
    />
  );
}
