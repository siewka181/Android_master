import { FeatureScreen } from "@/components/feature-screen";
import { useFeature } from "@/lib/feature-context";
import { getTranslation, translations } from "@/lib/i18n";
import { useLanguage } from "@/lib/language-context";
import { checkPermission, openAndroidSettings, permissionRequirements, requestPermission } from "@/lib/permissions";
import { deactivateKeepAwake, activateKeepAwake } from "expo-keep-awake";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

const FEATURE_ID = "system-tools";

export default function SystemToolsScreen() {
  const { language } = useLanguage();
  const t = (key: keyof typeof translations.EN) => getTranslation(language, key);
  const { addLog, setFeatureLastOperationTime, setFeatureOperationStatus } = useFeature();
  const [isKeepAwake, setIsKeepAwake] = useState(false);

  const handleKeepAwakeToggle = async () => {
    setFeatureOperationStatus(FEATURE_ID, "running");

    if (isKeepAwake) {
      deactivateKeepAwake();
      addLog("INFO", t("toolKeepAwakeDisabled"));
      setIsKeepAwake(false);
    } else {
      activateKeepAwake();
      addLog("SUCCESS", t("toolKeepAwakeEnabled"));
      setIsKeepAwake(true);
    }

    setFeatureOperationStatus(FEATURE_ID, "success");
    setFeatureLastOperationTime(FEATURE_ID, new Date().toLocaleTimeString());
  };

  const handleRequestNotification = async () => {
    setFeatureOperationStatus(FEATURE_ID, "running");
    const requirement = permissionRequirements.find((item) => item.id === "notifications");
    if (!requirement) return;

    const beforeState = await checkPermission(requirement);
    if (beforeState !== "granted") {
      const result = await requestPermission(requirement);
      addLog(result === "granted" ? "SUCCESS" : "WARN", `${t("permissionNotificationsTitle")}: ${t((`permissionState_${result}` as keyof typeof translations.EN))}`);
    } else {
      addLog("INFO", t("permissionAlreadyGranted"));
    }

    setFeatureOperationStatus(FEATURE_ID, "success");
    setFeatureLastOperationTime(FEATURE_ID, new Date().toLocaleTimeString());
  };

  const handleOpenPowerSettings = async () => {
    setFeatureOperationStatus(FEATURE_ID, "running");
    await openAndroidSettings("android.settings.IGNORE_BATTERY_OPTIMIZATION_SETTINGS");
    addLog("INFO", t("openedBatterySettings"));
    setFeatureOperationStatus(FEATURE_ID, "success");
    setFeatureLastOperationTime(FEATURE_ID, new Date().toLocaleTimeString());
  };

  const handleOpenAppSettings = async () => {
    setFeatureOperationStatus(FEATURE_ID, "running");
    await openAndroidSettings();
    addLog("INFO", t("openedAppSettings"));
    setFeatureOperationStatus(FEATURE_ID, "success");
    setFeatureLastOperationTime(FEATURE_ID, new Date().toLocaleTimeString());
  };

  return (
    <FeatureScreen
      featureId={FEATURE_ID}
      title={t("systemTools")}
      icon="🧰"
      actionLabel={t("runDiagnostics")}
      onActionPress={async () => {
        addLog("INFO", t("systemToolsActionHint"));
      }}
      customContent={(
        <View className="gap-3">
          <Pressable onPress={handleKeepAwakeToggle} className="bg-surface rounded-lg p-4 border border-border">
            <Text className="text-sm font-semibold text-foreground">{t("toolKeepAwake")}</Text>
            <Text className="text-xs text-muted mt-1">
              {isKeepAwake ? t("toolKeepAwakeOnStatus") : t("toolKeepAwakeOffStatus")}
            </Text>
          </Pressable>

          <Pressable onPress={handleRequestNotification} className="bg-surface rounded-lg p-4 border border-border">
            <Text className="text-sm font-semibold text-foreground">{t("toolNotifications")}</Text>
            <Text className="text-xs text-muted mt-1">{t("toolNotificationsDesc")}</Text>
          </Pressable>

          <Pressable onPress={handleOpenPowerSettings} className="bg-surface rounded-lg p-4 border border-border">
            <Text className="text-sm font-semibold text-foreground">{t("toolBatterySettings")}</Text>
            <Text className="text-xs text-muted mt-1">{t("toolBatterySettingsDesc")}</Text>
          </Pressable>

          <Pressable onPress={handleOpenAppSettings} className="bg-surface rounded-lg p-4 border border-border">
            <Text className="text-sm font-semibold text-foreground">{t("toolAppSettings")}</Text>
            <Text className="text-xs text-muted mt-1">{t("toolAppSettingsDesc")}</Text>
          </Pressable>
        </View>
      )}
    />
  );
}
