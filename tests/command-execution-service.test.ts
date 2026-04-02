import { describe, expect, it } from "vitest";

import {
  classifyTermuxError,
  createOperationContext,
  summarizeOutput,
} from "../lib/command-execution-service";

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
  });
});
