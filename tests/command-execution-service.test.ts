import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  classifyTermuxError,
  collectRecentNormalizedErrors,
  createOperationContext,
  executeCommandWithGuards,
  summarizeOutput,
} from "../lib/command-execution-service";
import type { LogEntry } from "../lib/feature-context";

const checkTermuxConnectionMock = vi.fn();
const executeTermuxCommandMock = vi.fn();

vi.mock("../lib/termux-service", () => ({
  checkTermuxConnection: (...args: unknown[]) => checkTermuxConnectionMock(...args),
  executeTermuxCommand: (...args: unknown[]) => executeTermuxCommandMock(...args),
}));

describe("command-execution-service helpers", () => {
  it("classifies timeout errors", () => {
    const result = classifyTermuxError({
      success: false,
      output: "",
      error: "command timed out",
    });

    expect(result).toBe("TIMEOUT");
  });

  it("classifies permission denied errors", () => {
    const result = classifyTermuxError({
      success: false,
      output: "",
      error: "Permission denied",
    });

    expect(result).toBe("PERMISSION_DENIED");
  });

  it("returns compact output summary", () => {
    const summary = summarizeOutput("line1\nline2\nline3");
    expect(summary).toBe("line1 line2 line3");
  });

  it("creates operation context with shared session id when provided", () => {
    const context = createOperationContext("advanced", "session-abc");
    expect(context.featureId).toBe("advanced");
    expect(context.sessionId).toBe("session-abc");
    expect(context.operationId).toContain("advanced-");
    expect(context.timestamp).toContain("T");
  });

  it("collects recent normalized errors from logs", () => {
    const logs: LogEntry[] = [
      { id: "1", level: "INFO", message: "ok", timestamp: "10:00:00" },
      {
        id: "2",
        level: "ERROR",
        message: "[op-1] FAILED (TIMEOUT): command timed out",
        timestamp: "10:01:00",
      },
      {
        id: "3",
        level: "ERROR",
        message: "[op-2] FAILED (ROOT_REQUIRED): root-required",
        timestamp: "10:02:00",
      },
    ];

    const result = collectRecentNormalizedErrors(logs, 2);

    expect(result).toEqual([
      {
        code: "ROOT_REQUIRED",
        message: "[op-2] FAILED (ROOT_REQUIRED): root-required",
        timestamp: "10:02:00",
      },
      {
        code: "TIMEOUT",
        message: "[op-1] FAILED (TIMEOUT): command timed out",
        timestamp: "10:01:00",
      },
    ]);
  });
});

describe("executeCommandWithGuards", () => {
  const addLog = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns missing-termux when connection is not available", async () => {
    checkTermuxConnectionMock.mockResolvedValue("disconnected");
    const context = createOperationContext("test-feature", "session-1");

    const result = await executeCommandWithGuards(
      {
        id: "cmd",
        command: "echo",
        successMessage: "done",
      },
      addLog,
      context,
    );

    expect(result.status).toBe("missing-termux");
    expect(result.errorCode).toBe("TERMUX_UNAVAILABLE");
    expect(result.attempts).toBe(0);
  });

  it("returns missing-root when command requires root and su check fails", async () => {
    checkTermuxConnectionMock.mockResolvedValue("connected");
    executeTermuxCommandMock.mockResolvedValueOnce({
      success: false,
      output: "",
      error: "permission denied",
    });

    const context = createOperationContext("test-feature", "session-2");
    const result = await executeCommandWithGuards(
      {
        id: "cmd",
        command: "echo",
        requiresRoot: true,
        successMessage: "done",
      },
      addLog,
      context,
    );

    expect(result.status).toBe("missing-root");
    expect(result.errorCode).toBe("ROOT_REQUIRED");
    expect(result.attempts).toBe(0);
  });

  it("returns timeout and preserves metadata", async () => {
    checkTermuxConnectionMock.mockResolvedValue("connected");
    executeTermuxCommandMock
      .mockResolvedValueOnce({ success: true, output: "uid=0(root)" })
      .mockResolvedValueOnce({ success: false, output: "", error: "command timed out" });

    const context = createOperationContext("test-feature", "session-timeout");
    const result = await executeCommandWithGuards(
      {
        id: "cmd",
        command: "slow-cmd",
        requiresRoot: true,
        successMessage: "done",
      },
      addLog,
      context,
    );

    expect(result.status).toBe("timeout");
    expect(result.errorCode).toBe("TIMEOUT");
    expect(result.operationId).toBe(context.operationId);
    expect(result.sessionId).toBe("session-timeout");
    expect(result.timestamp).toBe(context.timestamp);
    expect(result.outputSummary).toBe("(no output)");
    expect(result.attempts).toBe(1);
  });

  it("retries until retry-exhaust and returns command failed", async () => {
    checkTermuxConnectionMock.mockResolvedValue("connected");
    executeTermuxCommandMock.mockResolvedValue({
      success: false,
      output: "failed run",
      error: "exit code 1",
    });

    const context = createOperationContext("test-feature", "session-retry");
    const result = await executeCommandWithGuards(
      {
        id: "cmd",
        command: "unstable",
        retries: 2,
        successMessage: "done",
      },
      addLog,
      context,
    );

    expect(result.status).toBe("failed");
    expect(result.errorCode).toBe("COMMAND_FAILED");
    expect(result.attempts).toBe(3);
    expect(result.outputSummary).toContain("failed run");
  });
});
