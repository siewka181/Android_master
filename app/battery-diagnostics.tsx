import { View, Text } from "react-native";
import { useState } from "react";
import { FeatureScreen } from "@/components/feature-screen";
import { useLanguage } from "@/lib/language-context";
import { getTranslation, translations } from "@/lib/i18n";
import { useFeature } from "@/lib/feature-context";
import { getBatteryDiagnostics } from "@/lib/real-termux-commands";

export default function BatteryDiagnosticsScreen() {
const FEATURE_ID = "battery";

  const { language } = useLanguage();
  const { addLog, setFeatureOperationStatus, setFeatureLastOperationTime } = useFeature();
  const t = (key: keyof typeof translations.EN) => getTranslation(language, key);
  const [batteryData, setBatteryData] = useState<Record<string, any>>({
    capacity: "--",
    temperature: 0,
    voltage: "--",
    current: "--",
    status: "--",
    health: "--",
  });

  const handleRunDiagnostics = async () => {
    setFeatureOperationStatus(FEATURE_ID, "running");
    addLog("INFO", t("diagnosticsRunning"));

    try {
      const data = await getBatteryDiagnostics(addLog);
      setBatteryData(data);
      setFeatureOperationStatus(FEATURE_ID, "success");
      addLog("SUCCESS", t("diagnosticsCompleted"));
      setFeatureLastOperationTime(FEATURE_ID, new Date().toLocaleTimeString());
    } catch (error) {
      setFeatureOperationStatus(FEATURE_ID, "error");
      addLog("ERROR", `${t("operationFailed")}: ${String(error)}`);
    }
  };

  const isHighTemp = batteryData.temperature > 40;

  const CustomContent = (
    <View className="gap-4">
      {/* Battery Stats Grid */}
      <View className="gap-3">
        {/* Capacity & Temperature Row */}
        <View className="flex-row gap-3">
          <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
            <Text className="text-xs text-muted mb-1">{t("batteryCapacity")}</Text>
            <Text className="text-2xl font-bold text-green-400">
              {batteryData.capacity}%
            </Text>
          </View>
          <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
            <Text className="text-xs text-muted mb-1">{t("batteryTemperature")}</Text>
            <Text className={`text-2xl font-bold ${isHighTemp ? "text-red-400" : "text-green-400"}`}>
              {batteryData.temperature}°C
            </Text>
          </View>
        </View>

        {/* Voltage & Current Row */}
        <View className="flex-row gap-3">
          <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
            <Text className="text-xs text-muted mb-1">{t("batteryVoltage")}</Text>
            <Text className="text-2xl font-bold text-blue-400">
              {batteryData.voltage}V
            </Text>
          </View>
          <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
            <Text className="text-xs text-muted mb-1">{t("batteryCurrent")}</Text>
            <Text className="text-2xl font-bold text-cyan-400">
              {batteryData.current}mA
            </Text>
          </View>
        </View>

        {/* Status & Health Row */}
        <View className="flex-row gap-3">
          <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
            <Text className="text-xs text-muted mb-1">{t("batteryStatus")}</Text>
            <Text className="text-sm font-semibold text-foreground">
              {batteryData.status}
            </Text>
          </View>
          <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
            <Text className="text-xs text-muted mb-1">{t("batteryHealth")}</Text>
            <Text className="text-sm font-semibold text-green-400">
              {batteryData.health}
            </Text>
          </View>
        </View>
      </View>

      {/* Warning Box */}
      {isHighTemp && (
        <View className="bg-red-900/20 rounded-lg p-3 border border-red-700">
          <Text className="text-xs text-red-300">
            Warning: High temperature! Consider cooling down the device.
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <FeatureScreen
      featureId={FEATURE_ID}
      title={t("batteryDiagnostics")}
      icon="🔋"
      onActionPress={handleRunDiagnostics}
      actionLabel={t("runDiagnostics")}
      customContent={CustomContent}
    />
  );
}
