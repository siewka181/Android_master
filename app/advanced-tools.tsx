import { ScrollView, View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useFeature } from "@/lib/feature-context";
import * as Haptics from "expo-haptics";
import { useLanguage } from "@/lib/language-context";
import { getTranslation, translations } from "@/lib/i18n";
import {
  executeCommandWithGuards,
  type CommandDefinition,
} from "@/lib/command-execution-service";
import { openAndroidSettings } from "@/lib/permissions";

export default function AdvancedToolsScreen() {
  const FEATURE_ID = "advanced";

  const router = useRouter();
  const { addLog, setFeatureOperationStatus, setFeatureLastOperationTime } = useFeature();
  const { language } = useLanguage();
  const t = (key: keyof typeof translations.EN) => getTranslation(language, key);

  const tools: {
    id: string;
    icon: string;
    label: string;
    desc: string;
    command?: CommandDefinition;
    settingsAction?: string;
  }[] = [
    {
      id: "magisk",
      icon: "📦",
      label: t("magiskModules"),
      desc: "List installed Magisk modules",
      command: {
        id: "magisk",
        command: "sh",
        args: ["-c", "ls -1 /data/adb/modules | head -n 20"],
        requiresRoot: true,
        successMessage: "Magisk modules scan completed",
      },
    },
    {
      id: "fstrim",
      icon: "🧹",
      label: t("fstrim"),
      desc: "Run fstrim on /data",
      command: {
        id: "fstrim",
        command: "su",
        args: ["-c", "fstrim -v /data"],
        requiresRoot: true,
        timeout: 20000,
        successMessage: "FSTRIM executed on /data",
      },
    },
    {
      id: "sqlite",
      icon: "💾",
      label: t("sqliteOptimize"),
      desc: "Run sqlite VACUUM on app DBs",
      command: {
        id: "sqlite",
        command: "sh",
        args: [
          "-c",
          "for db in $(find /data/data -name '*.db' 2>/dev/null | head -n 5); do sqlite3 \"$db\" 'VACUUM;'; done",
        ],
        requiresRoot: true,
        timeout: 20000,
        successMessage: "SQLite vacuum batch finished",
        manualStepHint: "Some databases can be locked while apps are running.",
      },
    },
    {
      id: "cleaner",
      icon: "🗑️",
      label: t("systemCleaner"),
      desc: "Trim cache and old logs",
      command: {
        id: "cleaner",
        command: "su",
        args: ["-c", "pm trim-caches 512M && logcat -c"],
        requiresRoot: true,
        successMessage: "System cache cleanup completed",
      },
    },
    {
      id: "selinux",
      icon: "🔐",
      label: t("selinuxPermissive"),
      desc: "Read current SELinux mode",
      command: {
        id: "selinux",
        command: "getenforce",
        successMessage: "SELinux status checked",
      },
    },
    {
      id: "throttle-test",
      icon: "🧪",
      label: t("cpuThrottlingTest"),
      desc: "Read current thermal and CPU state",
      command: {
        id: "throttle-test",
        command: "sh",
        args: [
          "-c",
          "echo 'Temp:' $(cat /sys/class/thermal/thermal_zone0/temp 2>/dev/null); echo 'CPU:' $(cat /proc/loadavg)",
        ],
        successMessage: "Thermal and CPU snapshot collected",
      },
    },
    {
      id: "gpu-120hz",
      icon: "🎯",
      label: t("forceGpu"),
      desc: "Open display settings for refresh-rate",
      settingsAction: "android.settings.DISPLAY_SETTINGS",
    },
  ];

  const handleToolPress = async (toolId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFeatureOperationStatus(FEATURE_ID, "running");

    const tool = tools.find((item) => item.id === toolId);
    if (!tool) return;

    try {
      if (tool.settingsAction) {
        await openAndroidSettings(tool.settingsAction);
        addLog("INFO", "Opened system settings. Apply changes manually and return to app.");
        setFeatureOperationStatus(FEATURE_ID, "success");
      } else if (tool.command) {
        const result = await executeCommandWithGuards(tool.command, addLog);
        setFeatureOperationStatus(FEATURE_ID, result.status === "success" ? "success" : "error");
      }
    } catch (error) {
      addLog("ERROR", `Tool execution failed: ${String(error)}`);
      setFeatureOperationStatus(FEATURE_ID, "error");
    } finally {
      setFeatureLastOperationTime(FEATURE_ID, new Date().toLocaleTimeString());
    }
  };

  return (
    <ScreenContainer className="bg-gradient-to-b from-slate-900 to-black">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between px-4 py-4 border-b border-border">
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            className="p-2"
          >
            <Text className="text-2xl">←</Text>
          </Pressable>
          <View className="flex-1 items-center">
            <Text className="text-xl font-bold text-white">🛠️ {t("advancedToolsTitle")}</Text>
          </View>
          <View className="w-10" />
        </View>

        <View className="px-4 py-6 gap-3">
          {tools.map((tool) => (
            <Pressable
              key={tool.id}
              onPress={() => handleToolPress(tool.id)}
              style={({ pressed }) => [
                {
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              className="bg-surface rounded-lg p-4 border border-border flex-row items-center gap-3"
            >
              <Text className="text-2xl">{tool.icon}</Text>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-foreground">{tool.label}</Text>
                <Text className="text-xs text-muted mt-1">{tool.desc}</Text>
              </View>
              <Text className="text-lg text-gray-500">→</Text>
            </Pressable>
          ))}
        </View>

        <View className="mx-4 mb-6 bg-blue-900/20 rounded-lg p-3 border border-blue-700">
          <Text className="text-xs text-blue-300">ℹ️ {t("advancedToolsInfo")}</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
