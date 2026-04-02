import { View, Text } from "react-native";
import { LogEntry } from "@/lib/feature-context";

const levelColors: Record<LogEntry["level"], string> = {
  SUCCESS: "text-green-400",
  WARN: "text-yellow-400",
  ERROR: "text-red-400",
  INFO: "text-blue-400",
  XDR: "text-purple-400",
};

const levelBgColors: Record<LogEntry["level"], string> = {
  SUCCESS: "bg-green-900/20",
  WARN: "bg-yellow-900/20",
  ERROR: "bg-red-900/20",
  INFO: "bg-blue-900/20",
  XDR: "bg-purple-900/20",
};

interface LogEntryComponentProps {
  entry: LogEntry;
}

export function LogEntryComponent({ entry }: LogEntryComponentProps) {
  return (
    <View className={`flex-row gap-2 p-2 rounded mb-1 ${levelBgColors[entry.level]}`}>
      {/* Timestamp */}
      <Text className="text-xs text-gray-500 font-mono w-16">
        {entry.timestamp}
      </Text>

      {/* Level */}
      <Text className={`text-xs font-bold font-mono w-12 ${levelColors[entry.level]}`}>
        [{entry.level}]
      </Text>

      {/* Message */}
      <Text className="text-xs text-gray-300 font-mono flex-1">
        {entry.message}
      </Text>
    </View>
  );
}
