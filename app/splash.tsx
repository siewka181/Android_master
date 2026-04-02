import { useEffect } from "react";
import { View, Text, Image } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Auto-navigate to language selector after 2.5 seconds
    const timer = setTimeout(() => {
      router.replace("/language-selector");
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <ScreenContainer className="bg-gradient-to-b from-slate-900 to-black" edges={["top", "bottom", "left", "right"]}>
      <View className="flex-1 items-center justify-center gap-6">
        {/* Logo */}
        <Image
          source={require("@/assets/images/icon.png")}
          style={{ width: 120, height: 120 }}
          className="rounded-2xl"
        />

        {/* Title */}
        <View className="items-center gap-2">
          <Text className="text-4xl font-bold text-white text-center">
            Android Master Boost
          </Text>
          <Text className="text-lg text-cyan-400 font-semibold">
            v2026.79 Ultimate
          </Text>
        </View>

        {/* Subtitle */}
        <Text className="text-sm text-gray-400 text-center px-6">
          by siewkaDesign + Grok
        </Text>

        {/* Loading indicator */}
        <View className="mt-8">
          <Text className="text-cyan-300 text-sm animate-pulse">
            Initializing...
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}
