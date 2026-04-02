import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertOperationLog, InsertUser, operationLogs, OperationLog, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;
const inMemoryOperationLogs: OperationLog[] = [];

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createOperationLog(
  input: Pick<InsertOperationLog, "featureKey" | "level" | "message" | "userId">,
): Promise<OperationLog> {
  const db = await getDb();
  const now = new Date();

  if (!db) {
    const inMemoryLog: OperationLog = {
      id: inMemoryOperationLogs.length + 1,
      featureKey: input.featureKey,
      level: input.level,
      message: input.message,
      userId: input.userId ?? null,
      createdAt: now,
    };
    inMemoryOperationLogs.push(inMemoryLog);
    return inMemoryLog;
  }

  const values: InsertOperationLog = {
    featureKey: input.featureKey,
    level: input.level,
    message: input.message,
    userId: input.userId,
  };

  await db.insert(operationLogs).values(values);
  const created = await db.select().from(operationLogs).orderBy(desc(operationLogs.id)).limit(1);
  if (!created[0]) {
    throw new Error("Failed to fetch created operation log");
  }
  return created[0];
}

export async function listOperationLogs(options?: {
  featureKey?: string;
  limit?: number;
}): Promise<OperationLog[]> {
  const limit = Math.max(1, Math.min(options?.limit ?? 50, 200));
  const db = await getDb();

  if (!db) {
    const filtered = options?.featureKey
      ? inMemoryOperationLogs.filter((log) => log.featureKey === options.featureKey)
      : inMemoryOperationLogs;
    return [...filtered].slice(-limit).reverse();
  }

  const whereClause = options?.featureKey
    ? and(eq(operationLogs.featureKey, options.featureKey))
    : undefined;
  const query = db.select().from(operationLogs).orderBy(desc(operationLogs.id)).limit(limit);
  const rows = whereClause ? await query.where(whereClause) : await query;
  return rows;
}

export function __resetOperationLogsForTests() {
  inMemoryOperationLogs.length = 0;
}
