import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/i18n";
import * as Haptics from "expo-haptics";

export default function LanguageSelectorScreen() {
  const router = useRouter();
  const { setLanguage } = useLanguage();

  const handleLanguageSelect = async (lang: "PL" | "EN") => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await setLanguage(lang);
    router.replace("/(tabs)");
  };

  return (
    <ScreenContainer className="bg-gradient-to-b from-slate-900 to-black" edges={["top", "bottom", "left", "right"]}>
      <View className="flex-1 items-center justify-center gap-8 px-6">
        {/* Title */}
        <View className="items-center gap-2">
          <Text className="text-3xl font-bold text-white text-center">
            {translations.EN.selectLanguage}
          </Text>
          <Text className="text-sm text-gray-400">
            {translations.PL.selectLanguage}
          </Text>
        </View>

        {/* Language Buttons */}
        <View className="w-full gap-4">
          {/* Polish Button */}
          <Pressable
            onPress={() => handleLanguageSelect("PL")}
            style={({ pressed }) => [
              {
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            className="bg-cyan-500 rounded-2xl py-6 px-8 items-center"
          >
            <Text className="text-2xl mb-2">🇵🇱</Text>
            <Text className="text-white font-bold text-lg">
              {translations.EN.polish}
            </Text>
            <Text className="text-cyan-100 text-sm mt-1">
              {translations.PL.polish}
            </Text>
          </Pressable>

          {/* English Button */}
          <Pressable
            onPress={() => handleLanguageSelect("EN")}
            style={({ pressed }) => [
              {
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            className="bg-green-500 rounded-2xl py-6 px-8 items-center"
          >
            <Text className="text-2xl mb-2">🇬🇧</Text>
            <Text className="text-white font-bold text-lg">
              {translations.EN.english}
            </Text>
            <Text className="text-green-100 text-sm mt-1">
              {translations.PL.english}
            </Text>
          </Pressable>
        </View>

        {/* Footer */}
        <Text className="text-xs text-gray-500 mt-8">
          by siewkaDesign + Grok
        </Text>
      </View>
    </ScreenContainer>
  );
}
