import { ScreenContainer } from "@/components/screen-container";
import { useLanguage } from "@/lib/language-context";
import { getTranslation, translations } from "@/lib/i18n";
import {
  checkPermission,
  openAndroidSettings,
  permissionRequirements,
  PermissionState,
  requestPermission,
} from "@/lib/permissions";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

type PermissionStateMap = Record<string, PermissionState>;

function statusColor(status: PermissionState): string {
  switch (status) {
    case "granted":
      return "text-green-400";
    case "blocked":
      return "text-red-400";
    case "needs_settings":
      return "text-yellow-300";
    case "unavailable":
      return "text-gray-400";
    default:
      return "text-orange-300";
  }
}

export default function PermissionsOnboardingScreen() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = (key: keyof typeof translations.EN) => getTranslation(language, key);

  const [states, setStates] = useState<PermissionStateMap>({});

  const loadStates = async () => {
    const entries = await Promise.all(
      permissionRequirements.map(async (requirement) => {
        const status = await checkPermission(requirement);
        return [requirement.id, status] as const;
      }),
    );

    setStates(Object.fromEntries(entries));
  };

  useEffect(() => {
    loadStates();
  }, []);

  const readyCount = useMemo(
    () => Object.values(states).filter((state) => state === "granted").length,
    [states],
  );

  const handleRequest = async (requirementId: string) => {
    const requirement = permissionRequirements.find((item) => item.id === requirementId);
    if (!requirement) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (requirement.settingsAction) {
      await openAndroidSettings(requirement.settingsAction);
      return;
    }

    const result = await requestPermission(requirement);
    setStates((prev) => ({ ...prev, [requirement.id]: result }));
  };

  const handleContinue = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace("/(tabs)");
  };

  return (
    <ScreenContainer className="bg-gradient-to-b from-slate-900 to-black" edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4 pb-6 border-b border-border">
          <Text className="text-2xl font-bold text-white">🛡️ {t("permissionsOnboardingTitle")}</Text>
          <Text className="text-sm text-gray-300 mt-2">{t("permissionsOnboardingSubtitle")}</Text>
          <Text className="text-xs text-gray-400 mt-2">
            {t("permissionsReady")}: {readyCount}/{permissionRequirements.length}
          </Text>
        </View>

        <View className="px-4 py-6 gap-3">
          {permissionRequirements.map((requirement) => {
            const state = states[requirement.id] ?? "denied";
            return (
              <View key={requirement.id} className="bg-surface rounded-lg p-4 border border-border">
                <View className="flex-row items-start justify-between gap-3">
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-foreground">{t(requirement.titleKey as keyof typeof translations.EN)}</Text>
                    <Text className="text-xs text-muted mt-1">{t(requirement.reasonKey as keyof typeof translations.EN)}</Text>
                    {state === "blocked" && (
                      <Text className="text-xs text-red-300 mt-2">{t("permissionBlockedHint")}</Text>
                    )}
                    {requirement.settingsInstructionKey && (
                      <Text className="text-xs text-yellow-300 mt-2">
                        {t(requirement.settingsInstructionKey as keyof typeof translations.EN)}
                      </Text>
                    )}
                  </View>
                  <Text className={`text-xs font-semibold ${statusColor(state)}`}>
                    {t((`permissionState_${state}` as keyof typeof translations.EN))}
                  </Text>
                </View>

                <Pressable
                  onPress={() => handleRequest(requirement.id)}
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                  className="mt-3 bg-cyan-500/20 border border-cyan-500 rounded-lg py-2 px-3 items-center"
                >
                  <Text className="text-xs font-semibold text-cyan-300">
                    {requirement.settingsAction ? t("openSettings") : t("grantPermission")}
                  </Text>
                </Pressable>
              </View>
            );
          })}

          <Pressable
            onPress={handleContinue}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            className="mt-4 bg-green-500 rounded-lg py-3 items-center"
          >
            <Text className="text-sm font-semibold text-white">{t("continueToApp")}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
