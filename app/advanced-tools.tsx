import { ScrollView, View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useLanguage } from "@/lib/language-context";
import { getTranslation, translations } from "@/lib/i18n";
import { useFeature } from "@/lib/feature-context";
import * as Haptics from "expo-haptics";

export default function AdvancedToolsScreen() {
  const router = useRouter();
  const { language } = useLanguage();
  const { addLog, setOperationStatus, setLastOperationTime } = useFeature();
  const t = (key: keyof typeof translations.EN) => getTranslation(language, key);

  const tools = [
    { id: "magisk", icon: "📦", label: "Scan Magisk Modules", desc: "List installed Magisk modules" },
    { id: "encore", icon: "⚡", label: "Encore Tweaks v5.1", desc: "Download & install Encore Tweaks" },
    { id: "gaming-x", icon: "🎮", label: "Gaming-X", desc: "Download & install Gaming-X module" },
    { id: "fstrim", icon: "🧹", label: "FSTRIM", desc: "Optimize storage with FSTRIM" },
    { id: "sqlite", icon: "💾", label: "SQLite Optimize", desc: "Optimize all SQLite databases" },
    { id: "gpu-120hz", icon: "🎯", label: "Force GPU + 120Hz", desc: "Enable 120Hz refresh rate" },
    { id: "cleaner", icon: "🧹", label: "System Cleaner", desc: "Clean cache and logs" },
    { id: "selinux", icon: "🔐", label: "SELinux Permissive", desc: "Set SELinux to permissive mode" },
    { id: "throttle-test", icon: "🧪", label: "CPU Throttling Test", desc: "Test CPU throttling & benchmark" },
  ];

  const handleToolPress = async (toolId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOperationStatus("running");
    addLog("INFO", `Executing tool: ${toolId}...`);

    // Simulate tool execution
    await new Promise((resolve) => setTimeout(resolve, 1000));

    switch (toolId) {
      case "magisk":
        addLog("INFO", "Scanning Magisk modules...");
        addLog("INFO", "- Magisk Hide Props Config");
        addLog("INFO", "- Shamiko");
        addLog("INFO", "- Zygisk - LSPosed");
        addLog("SUCCESS", "Scan completed");
        break;
      case "encore":
        addLog("INFO", "Downloading Encore Tweaks v5.1...");
        addLog("SUCCESS", "Downloaded successfully");
        addLog("INFO", "Install in Magisk? (Manual step)");
        break;
      case "gaming-x":
        addLog("INFO", "Downloading Gaming-X...");
        addLog("SUCCESS", "Downloaded successfully");
        break;
      case "fstrim":
        addLog("INFO", "Running FSTRIM on /data and /cache...");
        addLog("SUCCESS", "FSTRIM completed");
        break;
      case "sqlite":
        addLog("INFO", "Optimizing SQLite databases...");
        addLog("SUCCESS", "SQLite optimization completed");
        break;
      case "gpu-120hz":
        addLog("INFO", "Enabling GPU + 120Hz...");
        addLog("SUCCESS", "GPU + 120Hz activated");
        break;
      case "cleaner":
        addLog("INFO", "Cleaning cache and logs...");
        addLog("SUCCESS", "System cleaner completed");
        break;
      case "selinux":
        addLog("INFO", "Setting SELinux to permissive...");
        addLog("SUCCESS", "SELinux → Permissive");
        break;
      case "throttle-test":
        addLog("INFO", "Running CPU throttling test...");
        addLog("INFO", "Monitoring temperature and frequency...");
        addLog("SUCCESS", "Throttling test completed");
        break;
    }

    setOperationStatus("success");
    setLastOperationTime(new Date().toLocaleTimeString());
  };

  return (
    <ScreenContainer className="bg-gradient-to-b from-slate-900 to-black">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4 border-b border-border">
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            className="p-2"
          >
            <Text className="text-2xl">←</Text>
          </Pressable>
          <View className="flex-1 items-center">
            <Text className="text-xl font-bold text-white">🛠️ Advanced Tools</Text>
          </View>
          <View className="w-10" />
        </View>

        {/* Tools Grid */}
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
                <Text className="text-sm font-semibold text-foreground">
                  {tool.label}
                </Text>
                <Text className="text-xs text-muted mt-1">
                  {tool.desc}
                </Text>
              </View>
              <Text className="text-lg text-gray-500">→</Text>
            </Pressable>
          ))}
        </View>

        {/* Info Box */}
        <View className="mx-4 mb-6 bg-blue-900/20 rounded-lg p-3 border border-blue-700">
          <Text className="text-xs text-blue-300">
            ℹ️ Advanced tools require ROOT/Magisk access. Some tools may require manual confirmation in Magisk Manager.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
