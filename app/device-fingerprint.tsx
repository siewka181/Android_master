import { View, Text } from "react-native";
import { FeatureScreen } from "@/components/feature-screen";
import { useLanguage } from "@/lib/language-context";
import { getTranslation, translations } from "@/lib/i18n";
import { useFeature } from "@/lib/feature-context";
import { getRealSystemInfo } from "@/lib/real-termux-commands";
import { useState } from "react";

export default function DeviceFingerprintScreen() {
const FEATURE_ID = "fingerprint";

  const { language } = useLanguage();
  const { addLog, setFeatureOperationStatus, setFeatureLastOperationTime } = useFeature();
  const t = (key: keyof typeof translations.EN) => getTranslation(language, key);

  const [deviceInfo, setDeviceInfo] = useState<Record<string, string>>({
    model: "--",
    soc: "--",
    androidVersion: "--",
    kernelVersion: "--",
    buildNumber: "--",
    fingerprint: "--",
  });

  const handleGetFingerprint = async () => {
    setFeatureOperationStatus(FEATURE_ID, "running");
    addLog("INFO", "=== DEVICE FINGERPRINT + SYSTEM INFO ===");

    try {
      const info = await getRealSystemInfo(addLog);
      setDeviceInfo(info);
      addLog("SUCCESS", "Device fingerprint retrieved");
      setFeatureOperationStatus(FEATURE_ID, "success");
    } catch (error) {
      addLog("ERROR", `Failed to get fingerprint: ${String(error)}`);
      setFeatureOperationStatus(FEATURE_ID, "error");
    }
    setFeatureLastOperationTime(FEATURE_ID, new Date().toLocaleTimeString());
  };

  const CustomContent = (
    <View className="gap-4">
      <View className="gap-2">
        {/* Model */}
        <View className="bg-surface rounded-lg p-4 border border-border">
          <Text className="text-xs text-muted mb-1">{t("deviceModel")}</Text>
          <Text className="text-lg font-semibold text-foreground">
            {deviceInfo.model}
          </Text>
        </View>

        {/* SoC */}
        <View className="bg-surface rounded-lg p-4 border border-border">
          <Text className="text-xs text-muted mb-1">{t("deviceSoC")}</Text>
          <Text className="text-lg font-semibold text-cyan-400">
            {deviceInfo.soc}
          </Text>
        </View>

        {/* Android Version */}
        <View className="flex-row gap-3">
          <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
            <Text className="text-xs text-muted mb-1">{t("androidVersion")}</Text>
            <Text className="text-lg font-semibold text-green-400">
              {deviceInfo.androidVersion}
            </Text>
          </View>
          <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
            <Text className="text-xs text-muted mb-1">{t("kernelVersion")}</Text>
            <Text className="text-lg font-semibold text-blue-400">
              {deviceInfo.kernelVersion}
            </Text>
          </View>
        </View>

        {/* Build Number */}
        <View className="bg-surface rounded-lg p-4 border border-border">
          <Text className="text-xs text-muted mb-1">{t("buildNumber")}</Text>
          <Text className="text-sm font-mono text-gray-400">
            {deviceInfo.buildNumber}
          </Text>
        </View>

        {/* Fingerprint */}
        <View className="bg-surface rounded-lg p-4 border border-border">
          <Text className="text-xs text-muted mb-1">{t("fingerprint")}</Text>          <Text className="text-sm font-semibold text-yellow-400 break-words">
            {deviceInfo.fingerprint}
          </Text>        </View>
      </View>

      <View className="bg-blue-900/20 rounded-lg p-3 border border-blue-700">
        <Text className="text-xs text-blue-300">
          ℹ️ Device fingerprint is a unique identifier for your device used for security and identification purposes.
        </Text>
      </View>
    </View>
  );

  return (
    <FeatureScreen
      featureId={FEATURE_ID}
      title={t("deviceFingerprint")}
      icon="📱"
      onActionPress={handleGetFingerprint}
      actionLabel="Get Fingerprint"
      customContent={CustomContent}
    />
  );
}
