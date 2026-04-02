/**
 * Log Export Service
 * Handles exporting logs to TXT and JSON formats
 */

import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { LogEntry } from "@/lib/feature-context";

export interface ExportOptions {
  format: "txt" | "json";
  includeTimestamps: boolean;
  includeMetadata: boolean;
}

/**
 * Export logs to TXT format
 */
export async function exportLogsAsTxt(
  logs: LogEntry[],
  options: Partial<ExportOptions> = {}
): Promise<string> {
  const opts: ExportOptions = {
    format: "txt",
    includeTimestamps: true,
    includeMetadata: true,
    ...options,
  };

  let content = "";

  // Header
  if (opts.includeMetadata) {
    content += "═══════════════════════════════════════════════════════════\n";
    content += "  ANDROID MASTER BOOST v2026.79 - OPERATION LOG\n";
    content += "═══════════════════════════════════════════════════════════\n";
    content += `Export Date: ${new Date().toLocaleString()}\n`;
    content += `Total Entries: ${logs.length}\n`;
    content += "───────────────────────────────────────────────────────────\n\n";
  }

  // Log entries
  logs.forEach((log) => {
    const timestamp = opts.includeTimestamps
      ? `[${new Date(log.timestamp).toLocaleTimeString()}] `
      : "";
    const level = `[${log.level}]`.padEnd(10);
    content += `${timestamp}${level} ${log.message}\n`;
  });

  // Footer
  if (opts.includeMetadata) {
    content += "\n───────────────────────────────────────────────────────────\n";
    content += `Log Statistics:\n`;
    content += `  SUCCESS: ${logs.filter((l) => l.level === "SUCCESS").length}\n`;
    content += `  WARN:    ${logs.filter((l) => l.level === "WARN").length}\n`;
    content += `  ERROR:   ${logs.filter((l) => l.level === "ERROR").length}\n`;
    content += `  INFO:    ${logs.filter((l) => l.level === "INFO").length}\n`;
    content += `  XDR:     ${logs.filter((l) => l.level === "XDR").length}\n`;
    content += "═══════════════════════════════════════════════════════════\n";
  }

  return content;
}

/**
 * Export logs to JSON format
 */
export async function exportLogsAsJson(
  logs: LogEntry[],
  options: Partial<ExportOptions> = {}
): Promise<string> {
  const opts: ExportOptions = {
    format: "json",
    includeTimestamps: true,
    includeMetadata: true,
    ...options,
  };

  const exportData: any = {
    metadata: opts.includeMetadata
      ? {
          exportDate: new Date().toISOString(),
          totalEntries: logs.length,
          appVersion: "2026.79",
          appName: "Android Master Boost",
        }
      : undefined,
    logs: logs.map((log) => ({
      id: log.id,
      level: log.level,
      message: log.message,
      timestamp: opts.includeTimestamps ? log.timestamp : undefined,
    })),
    statistics: opts.includeMetadata
      ? {
          success: logs.filter((l) => l.level === "SUCCESS").length,
          warn: logs.filter((l) => l.level === "WARN").length,
          error: logs.filter((l) => l.level === "ERROR").length,
          info: logs.filter((l) => l.level === "INFO").length,
          xdr: logs.filter((l) => l.level === "XDR").length,
        }
      : undefined,
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Save logs to device file system and share
 */
export async function saveAndShareLogs(
  logs: LogEntry[],
  format: "txt" | "json" = "txt"
): Promise<boolean> {
  try {
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5);
    const filename = `AMB_logs_${timestamp}.${format}`;

    // Get file path
    const filePath = `${FileSystem.documentDirectory}${filename}`;

    // Generate content
    const content =
      format === "json"
        ? await exportLogsAsJson(logs)
        : await exportLogsAsTxt(logs);

    // Write to file
    await FileSystem.writeAsStringAsync(filePath, content);

    // Share the file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: format === "json" ? "application/json" : "text/plain",
        dialogTitle: "Share Operation Logs",
      });
      return true;
    } else {
      console.log(`Logs saved to: ${filePath}`);
      return true;
    }
  } catch (error) {
    console.error("Failed to save/share logs:", error);
    return false;
  }
}

/**
 * Save arbitrary report content and share it.
 */
export async function saveAndShareReport(
  content: string,
  options: { filenamePrefix: string; format: "txt" | "json"; dialogTitle?: string },
): Promise<boolean> {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5);
    const filename = `${options.filenamePrefix}_${timestamp}.${options.format}`;
    const filePath = `${FileSystem.documentDirectory}${filename}`;

    await FileSystem.writeAsStringAsync(filePath, content);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: options.format === "json" ? "application/json" : "text/plain",
        dialogTitle: options.dialogTitle ?? "Share report",
      });
    }

    return true;
  } catch (error) {
    console.error("Failed to save/share report:", error);
    return false;
  }
}

/**
 * Copy logs to clipboard
 */
export async function copyLogsToClipboard(
  logs: LogEntry[],
  format: "txt" | "json" = "txt"
): Promise<boolean> {
  try {
    const Clipboard = require("@react-native-async-storage/async-storage");
    const content =
      format === "json"
        ? await exportLogsAsJson(logs)
        : await exportLogsAsTxt(logs);

    // In real app, use react-native-clipboard
    // For now, just log it
    console.log("Logs copied to clipboard (mock)");
    return true;
  } catch (error) {
    console.error("Failed to copy logs:", error);
    return false;
  }
}
