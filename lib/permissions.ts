import { Linking, PermissionsAndroid, Platform } from "react-native";
import type { Permission } from "react-native";

export type PermissionState =
  | "granted"
  | "denied"
  | "blocked"
  | "unavailable"
  | "needs_settings";

export type PermissionRequirement = {
  id: string;
  titleKey: string;
  reasonKey: string;
  permission?: Permission;
  settingsAction?: string;
  settingsInstructionKey?: string;
};

export const permissionRequirements: PermissionRequirement[] = [
  {
    id: "notifications",
    titleKey: "permissionNotificationsTitle",
    reasonKey: "permissionNotificationsReason",
    permission:
      Platform.OS === "android"
        ? PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        : undefined,
  },
  {
    id: "microphone",
    titleKey: "permissionMicrophoneTitle",
    reasonKey: "permissionMicrophoneReason",
    permission: PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  },
  {
    id: "location",
    titleKey: "permissionLocationTitle",
    reasonKey: "permissionLocationReason",
    permission: PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  },
  {
    id: "battery-optimization",
    titleKey: "permissionBatteryOptimizationTitle",
    reasonKey: "permissionBatteryOptimizationReason",
    settingsAction: "android.settings.IGNORE_BATTERY_OPTIMIZATION_SETTINGS",
    settingsInstructionKey: "permissionBatteryOptimizationInstruction",
  },
];

export function mapAndroidPermissionResult(result: string): PermissionState {
  if (result === PermissionsAndroid.RESULTS.GRANTED) return "granted";
  if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) return "blocked";
  return "denied";
}

export async function checkPermission(requirement: PermissionRequirement): Promise<PermissionState> {
  if (Platform.OS !== "android") {
    return "unavailable";
  }

  if (!requirement.permission) {
    return requirement.settingsAction ? "needs_settings" : "unavailable";
  }

  const granted = await PermissionsAndroid.check(requirement.permission );
  return granted ? "granted" : "denied";
}

export async function requestPermission(requirement: PermissionRequirement): Promise<PermissionState> {
  if (Platform.OS !== "android") return "unavailable";
  if (!requirement.permission) {
    return requirement.settingsAction ? "needs_settings" : "unavailable";
  }

  const result = await PermissionsAndroid.request(requirement.permission );
  return mapAndroidPermissionResult(result);
}

export async function openAndroidSettings(action?: string): Promise<boolean> {
  if (Platform.OS !== "android") return false;

  try {
    if (action) {
      await Linking.sendIntent(action);
      return true;
    }
    await Linking.openSettings();
    return true;
  } catch {
    try {
      await Linking.openSettings();
      return true;
    } catch {
      return false;
    }
  }
}
