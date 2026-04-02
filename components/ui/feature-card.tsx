import { View, Text, Pressable } from "react-native";
import { OperationStatus } from "@/lib/feature-context";
import * as Haptics from "expo-haptics";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  status: OperationStatus;
  onPress: () => void;
}

const statusColors: Record<OperationStatus, string> = {
  idle: "bg-gray-600",
  running: "bg-blue-500",
  success: "bg-green-500",
  error: "bg-red-500",
};

const statusLabels: Record<OperationStatus, string> = {
  idle: "Ready",
  running: "Running",
  success: "Success",
  error: "Error",
};

export function FeatureCard({
  icon,
  title,
  description,
  status,
  onPress,
}: FeatureCardProps) {
  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        {
          transform: [{ scale: pressed ? 0.97 : 1 }],
          opacity: pressed ? 0.8 : 1,
        },
      ]}
      className="bg-surface rounded-xl p-4 mb-3 border border-border"
    >
      <View className="flex-row items-start gap-3">
        {/* Icon */}
        <Text className="text-3xl">{icon}</Text>

        {/* Content */}
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-base font-semibold text-foreground flex-1">
              {title}
            </Text>
            <View className={`${statusColors[status]} rounded-full px-2 py-1`}>
              <Text className="text-xs font-semibold text-white">
                {statusLabels[status]}
              </Text>
            </View>
          </View>
          <Text className="text-sm text-muted">{description}</Text>
        </View>
      </View>
    </Pressable>
  );
}
