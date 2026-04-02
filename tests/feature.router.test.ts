import { beforeEach, describe, expect, it } from "vitest";
import { TRPCError } from "@trpc/server";
import { appRouter } from "../server/routers";
import type { TrpcContext } from "../server/_core/context";
import { __resetOperationLogsForTests } from "../server/db";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      hostname: "app.manuspre.computer",
      headers: {
        "user-agent": "Mozilla/5.0 (Linux; Android 14; SM-A136B) AppleWebKit/537.36",
      },
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createAuthContext(): TrpcContext {
  return {
    ...createPublicContext(),
    user: {
      id: 1,
      openId: "tester-open-id",
      name: "Tester",
      email: "tester@example.com",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
  };
}

describe("feature router", () => {
  beforeEach(() => {
    __resetOperationLogsForTests();
  });

  it("returns device fingerprint payload", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.feature.deviceFingerprint();

    expect(result.model).toBeTruthy();
    expect(result.androidVersion).toBeTruthy();
    expect(result.source).toBe("server-android-profile");
  });

  it("stores and lists operation logs", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await caller.feature.logs.add({
      featureKey: "fingerprint",
      level: "INFO",
      message: "first message",
    });
    await caller.feature.logs.add({
      featureKey: "fingerprint",
      level: "SUCCESS",
      message: "second message",
    });

    const list = await caller.feature.logs.list({
      featureKey: "fingerprint",
      limit: 10,
    });

    expect(list.length).toBeGreaterThanOrEqual(2);
    expect(list[0]?.featureKey).toBe("fingerprint");
  });

  it("rejects diagnostics.run for unauthenticated callers", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.feature.diagnostics.run({
        featureKey: "battery",
      }),
    ).rejects.toBeInstanceOf(TRPCError);
  });

  it("accepts diagnostics.run for authenticated callers", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.feature.diagnostics.run({
      featureKey: "battery",
    });

    expect(result.ok).toBe(true);
    expect(result.message).toContain("battery");
  });

  it("validates logs.add payload", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(
      caller.feature.logs.add({
        featureKey: "x",
        level: "INFO",
        message: "",
      }),
    ).rejects.toBeInstanceOf(TRPCError);
  });
});
