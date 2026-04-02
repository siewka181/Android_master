import { ScrollView, View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useLanguage } from "@/lib/language-context";
import { getTranslation, translations } from "@/lib/i18n";
import { FeatureCard } from "@/components/ui/feature-card";
import { useFeature } from "@/lib/feature-context";

export default function MainMenuScreen() {
  const router = useRouter();
  const { language } = useLanguage();
  const { getFeatureState } = useFeature();
  const t = (key: keyof typeof translations.EN) => getTranslation(language, key);

  const features = [
    {
      id: "game-boost",
      icon: "🚀",
      title: t("gameBoost"),
      description: t("gameBoostDesc"),
      route: "/game-boost",
    },
    {
      id: "battery",
      icon: "🔋",
      title: t("batteryDiagnostics"),
      description: t("batteryDesc"),
      route: "/battery-diagnostics",
    },
    {
      id: "network",
      icon: "📡",
      title: t("networkOptimization"),
      description: t("networkDesc"),
      route: "/network-optimization",
    },
    {
      id: "cpu",
      icon: "⚙️",
      title: t("cpuPerformance"),
      description: t("cpuDesc"),
      route: "/cpu-performance",
    },
    {
      id: "zram",
      icon: "💾",
      title: t("zramOptimization"),
      description: t("zramDesc"),
      route: "/zram-optimization",
    },
    {
      id: "gpu",
      icon: "🎮",
      title: t("gpuOptimization"),
      description: t("gpuDesc"),
      route: "/gpu-optimization",
    },
    {
      id: "monitor",
      icon: "📊",
      title: t("resourceMonitor"),
      description: t("monitorDesc"),
      route: "/resource-monitor",
    },
    {
      id: "fingerprint",
      icon: "📱",
      title: t("deviceFingerprint"),
      description: t("fingerprintDesc"),
      route: "/device-fingerprint",
    },
    {
      id: "restore",
      icon: "🔄",
      title: t("restoreNormal"),
      description: t("restoreDesc"),
      route: "/restore-normal",
    },
    {
      id: "aggressive",
      icon: "🔥",
      title: t("aggressiveMode"),
      description: t("aggressiveDesc"),
      route: "/aggressive-mode",
    },
    {
      id: "advanced",
      icon: "🛠️",
      title: t("advancedTools"),
      description: t("advancedDesc"),
      route: "/advanced-tools",
    },
    {
      id: "system-tools",
      icon: "🧰",
      title: t("systemTools"),
      description: t("systemToolsDesc"),
      route: "/system-tools",
    },
    {
      id: "permissions-hub",
      icon: "🛡️",
      title: t("permissionsHub"),
      description: t("permissionsHubDesc"),
      route: "/permissions-onboarding",
    },
    {
      id: "developer-diagnostics",
      icon: "🧪",
      title: "Developer Diagnostics",
      description: "Run full self-test and export deep technical report",
      route: "/developer-diagnostics",
    },
    {
      id: "test",
      icon: "🧪",
      title: t("testFix"),
      description: t("testDesc"),
      route: "/test-fix",
    },
  ];

  return (
    <ScreenContainer className="bg-gradient-to-b from-slate-900 to-black">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header with Log Viewer Button */}
        <View className="px-4 pt-4 pb-6 border-b border-border">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-white mb-1">
                {t("mainMenuTitle")}
              </Text>
              <Text className="text-xs text-gray-400">
                {t("poweredBy")}
              </Text>
            </View>
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => router.push("/log-viewer" as any)}
                style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
                className="bg-cyan-500/20 rounded-lg px-3 py-2 border border-cyan-500"
              >
                <Text className="text-xs font-semibold text-cyan-400">📋</Text>
              </Pressable>
              <Pressable
                onPress={() => router.push("/root-check" as any)}
                style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
                className="bg-red-500/20 rounded-lg px-3 py-2 border border-red-500"
              >
                <Text className="text-xs font-semibold text-red-400">🔐</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Features Grid */}
        <View className="px-4 py-6 gap-3">
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              status={getFeatureState(feature.id).operationStatus}
              onPress={() => router.push(feature.route as any)}
            />
          ))}
        </View>

        {/* Footer */}
        <View className="px-4 py-4 border-t border-border items-center">
          <Text className="text-xs text-gray-500">
            {t("poweredBy")}
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
