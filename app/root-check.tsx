import { ScrollView, View, Text, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useLanguage } from "@/lib/language-context";
import { getTranslation, translations } from "@/lib/i18n";
import { checkRootAccess, getRootStatusSummary, RootCheckResult } from "@/lib/root-service";
import * as Haptics from "expo-haptics";

export default function RootCheckScreen() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = (key: keyof typeof translations.EN) => getTranslation(language, key);
  const [rootStatus, setRootStatus] = useState<RootCheckResult | null>(null);
  const [statusSummary, setStatusSummary] = useState<string>("");
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    performRootCheck();
  }, []);

  const performRootCheck = async () => {
    setIsChecking(true);
    try {
      const result = await checkRootAccess();
      setRootStatus(result);
      const summary = await getRootStatusSummary();
      setStatusSummary(summary);
    } catch (error) {
      console.error("Root check failed:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleRetryCheck = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    performRootCheck();
  };

  const handleRequestRoot = () => {
    Alert.alert(
      "Request Root Access",
      "To use all features, this app requires root access.\n\nOptions:\n1. Install Magisk\n2. Use Termux with sudo\n3. Grant superuser permission",
      [
        { text: "Cancel", onPress: () => {}, style: "cancel" },
        {
          text: "Install Magisk",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          },
        },
        {
          text: "Use Termux",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer className="bg-gradient-to-b from-slate-900 to-black">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 pt-4 pb-6 border-b border-border">
          <View className="flex-row items-center justify-between">
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
              className="p-2"
            >
              <Text className="text-2xl">←</Text>
            </Pressable>
            <Text className="text-xl font-bold text-white">🔐 Root Status</Text>
            <View className="w-10" />
          </View>
        </View>

        {/* Content */}
        <View className="flex-1 px-4 py-6 gap-4">
          {isChecking ? (
            // Loading State
            <View className="items-center justify-center py-12">
              <Text className="text-3xl mb-3">🔍</Text>
              <Text className="text-lg font-semibold text-foreground mb-2">
                Checking Root Access...
              </Text>
              <Text className="text-sm text-muted">
                Please wait while we verify permissions
              </Text>
            </View>
          ) : rootStatus ? (
            <>
              {/* Status Card */}
              <View
                className={`rounded-lg p-6 border-2 ${
                  rootStatus.hasRoot
                    ? "bg-green-900/20 border-green-600"
                    : "bg-red-900/20 border-red-600"
                }`}
              >
                <View className="items-center gap-3">
                  <Text className="text-5xl">
                    {rootStatus.hasRoot ? "🔓" : "🔒"}
                  </Text>
                  <Text className="text-2xl font-bold text-foreground text-center">
                    {statusSummary}
                  </Text>
                  <Text
                    className={`text-sm text-center ${
                      rootStatus.hasRoot ? "text-green-300" : "text-red-300"
                    }`}
                  >
                    {rootStatus.message}
                  </Text>
                </View>
              </View>

              {/* Detailed Status */}
              <View className="bg-surface rounded-lg p-4 border border-border gap-3">
                <Text className="text-sm font-semibold text-foreground mb-2">
                  Permissions:
                </Text>

                {/* Root */}
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2 flex-1">
                    <Text className="text-lg">
                      {rootStatus.hasRoot ? "✅" : "❌"}
                    </Text>
                    <Text className="text-sm text-foreground">
                      Superuser Access
                    </Text>
                  </View>
                  <Text className="text-xs text-muted">
                    {rootStatus.hasRoot ? "Enabled" : "Disabled"}
                  </Text>
                </View>

                {/* Magisk */}
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2 flex-1">
                    <Text className="text-lg">
                      {rootStatus.hasMagisk ? "✅" : "❌"}
                    </Text>
                    <Text className="text-sm text-foreground">
                      Magisk Manager
                    </Text>
                  </View>
                  <Text className="text-xs text-muted">
                    {rootStatus.hasMagisk ? "Installed" : "Not Found"}
                  </Text>
                </View>

                {/* Termux */}
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2 flex-1">
                    <Text className="text-lg">
                      {rootStatus.hasTermux ? "✅" : "❌"}
                    </Text>
                    <Text className="text-sm text-foreground">
                      Termux Integration
                    </Text>
                  </View>
                  <Text className="text-xs text-muted">
                    {rootStatus.hasTermux ? "Connected" : "Not Available"}
                  </Text>
                </View>
              </View>

              {/* Info Box */}
              {!rootStatus.hasRoot && (
                <View className="bg-yellow-900/20 rounded-lg p-4 border border-yellow-700">
                  <Text className="text-sm font-semibold text-yellow-300 mb-2">
                    ⚠️ Limited Functionality
                  </Text>
                  <Text className="text-xs text-yellow-200 leading-relaxed">
                    Without root access, some features will be read-only. For full functionality, install Magisk or use Termux with sudo.
                  </Text>
                </View>
              )}

              {/* Action Buttons */}
              <View className="gap-3 mt-4">
                <Pressable
                  onPress={handleRetryCheck}
                  style={({ pressed }) => [
                    {
                      transform: [{ scale: pressed ? 0.97 : 1 }],
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                  className="bg-cyan-500/20 border border-cyan-500 rounded-lg py-3 items-center"
                >
                  <Text className="text-sm font-semibold text-cyan-400">
                    🔄 Retry Check
                  </Text>
                </Pressable>

                {!rootStatus.hasRoot && (
                  <Pressable
                    onPress={handleRequestRoot}
                    style={({ pressed }) => [
                      {
                        transform: [{ scale: pressed ? 0.97 : 1 }],
                        opacity: pressed ? 0.8 : 1,
                      },
                    ]}
                    className="bg-red-500/20 border border-red-500 rounded-lg py-3 items-center"
                  >
                    <Text className="text-sm font-semibold text-red-400">
                      🔓 Request Root Access
                    </Text>
                  </Pressable>
                )}
              </View>
            </>
          ) : (
            <View className="items-center justify-center py-12">
              <Text className="text-3xl mb-3">❌</Text>
              <Text className="text-lg font-semibold text-foreground mb-2">
                Check Failed
              </Text>
              <Text className="text-sm text-muted mb-4">
                Unable to determine root status
              </Text>
              <Pressable
                onPress={handleRetryCheck}
                className="bg-cyan-500/20 border border-cyan-500 rounded-lg px-4 py-2"
              >
                <Text className="text-sm font-semibold text-cyan-400">
                  Try Again
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
