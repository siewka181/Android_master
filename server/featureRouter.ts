import { z } from "zod";
import { createOperationLog, listOperationLogs } from "./db";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

const levelEnum = z.enum(["SUCCESS", "WARN", "ERROR", "INFO", "XDR"]);

const staticDeviceFallback = {
  model: "SM-A136B",
  soc: "Exynos 850",
  androidVersion: "14",
  kernelVersion: "5.15.41",
  buildNumber: "A136BXXS9DYL1",
  fingerprint:
    "samsung/a13xnseea/a13x:14/UP1A.231005.007/A136BXXS9DYL1:user/release-keys",
} as const;

export const featureRouter = router({
  boost: router({
    run: publicProcedure
      .input(
        z.object({
          profile: z.enum(["safe", "aggressive"]).default("safe"),
          source: z.string().min(1).max(64).default("mobile"),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const message = `Boost queued (${input.profile}) from ${input.source}`;
        const log = await createOperationLog({
          featureKey: "game-boost",
          level: "INFO",
          message,
          userId: ctx.user?.id,
        });

        return {
          ok: true,
          queued: true,
          mode: input.profile,
          logId: log.id,
          message,
        } as const;
      }),
  }),

  deviceFingerprint: publicProcedure.query(async ({ ctx }) => {
    const userAgent = ctx.req.headers["user-agent"] ?? "";
    const isAndroid = userAgent.toLowerCase().includes("android");

    const payload = {
      ...staticDeviceFallback,
      source: isAndroid ? "server-android-profile" : "server-fallback-profile",
    };

    await createOperationLog({
      featureKey: "fingerprint",
      level: "INFO",
      message: `Fingerprint snapshot served (${payload.source})`,
      userId: ctx.user?.id,
    });

    return payload;
  }),

  diagnostics: router({
    run: protectedProcedure
      .input(
        z.object({
          featureKey: z.string().min(2).max(64),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const message = `Diagnostics queued for ${input.featureKey}`;
        const log = await createOperationLog({
          featureKey: input.featureKey,
          level: "INFO",
          message,
          userId: ctx.user?.id,
        });
        return {
          ok: true,
          logId: log.id,
          message,
        } as const;
      }),
  }),

  logs: router({
    add: publicProcedure
      .input(
        z.object({
          featureKey: z.string().min(2).max(64),
          level: levelEnum,
          message: z.string().min(1).max(2000),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const created = await createOperationLog({
          featureKey: input.featureKey,
          level: input.level,
          message: input.message,
          userId: ctx.user?.id,
        });
        return created;
      }),

    list: publicProcedure
      .input(
        z
          .object({
            featureKey: z.string().min(2).max(64).optional(),
            limit: z.number().int().min(1).max(200).optional(),
          })
          .optional(),
      )
      .query(async ({ input }) => {
        return listOperationLogs({
          featureKey: input?.featureKey,
          limit: input?.limit,
        });
      }),
  }),
});
