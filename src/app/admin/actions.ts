"use server";

import { db } from "@/db";
import {
  configTable,
  knowledgeFilesTable,
  conversationsTable,
  messagesTable,
  usersTable,
} from "@/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { invalidateCache } from "@/lib/knowledge";
import { invalidatePromptCache } from "@/lib/system-prompt";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await getSession();
  if (!session) throw new Error("Not authenticated");

  const [user] = await db
    .select({ role: usersTable.role })
    .from(usersTable)
    .where(eq(usersTable.id, session.userId))
    .limit(1);

  if (!user || user.role !== "admin") throw new Error("Not authorized");
  return session;
}

// ─── Config CRUD ─────────────────────────────────────────────

export async function getConfigValue(key: string): Promise<string | null> {
  await requireAdmin();
  const [row] = await db.select().from(configTable).where(eq(configTable.key, key)).limit(1);
  return row?.value ?? null;
}

export async function getAllConfig(): Promise<Record<string, string>> {
  await requireAdmin();
  const rows = await db.select().from(configTable);
  const map: Record<string, string> = {};
  for (const r of rows) map[r.key] = r.value;
  return map;
}

export async function updateConfig(key: string, value: string) {
  await requireAdmin();
  await db
    .insert(configTable)
    .values({ key, value })
    .onConflictDoUpdate({ target: configTable.key, set: { value, updatedAt: new Date() } });

  if (key === "system_prompt") invalidatePromptCache();
  invalidateCache();
  revalidatePath("/admin");
}

// ─── Knowledge CRUD ──────────────────────────────────────────

export async function listKnowledgeFiles() {
  await requireAdmin();
  return db
    .select({
      id: knowledgeFilesTable.id,
      filename: knowledgeFilesTable.filename,
      title: knowledgeFilesTable.title,
      tags: knowledgeFilesTable.tags,
      sourceType: knowledgeFilesTable.sourceType,
      createdAt: knowledgeFilesTable.createdAt,
      updatedAt: knowledgeFilesTable.updatedAt,
      contentLength: knowledgeFilesTable.content,
    })
    .from(knowledgeFilesTable)
    .orderBy(desc(knowledgeFilesTable.updatedAt));
}

export async function getKnowledgeFile(id: string) {
  await requireAdmin();
  const [row] = await db
    .select()
    .from(knowledgeFilesTable)
    .where(eq(knowledgeFilesTable.id, id))
    .limit(1);
  return row ?? null;
}

export async function createKnowledgeFile(data: {
  filename: string;
  title: string;
  tags: string;
  content: string;
  sourceType: string;
}) {
  await requireAdmin();
  const [row] = await db
    .insert(knowledgeFilesTable)
    .values(data)
    .returning({ id: knowledgeFilesTable.id });
  invalidateCache();
  revalidatePath("/admin/knowledge");
  return row;
}

export async function updateKnowledgeFile(
  id: string,
  data: { filename?: string; title?: string; tags?: string; content?: string }
) {
  await requireAdmin();
  await db
    .update(knowledgeFilesTable)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(knowledgeFilesTable.id, id));
  invalidateCache();
  revalidatePath("/admin/knowledge");
}

export async function deleteKnowledgeFile(id: string) {
  await requireAdmin();
  await db.delete(knowledgeFilesTable).where(eq(knowledgeFilesTable.id, id));
  invalidateCache();
  revalidatePath("/admin/knowledge");
}

// ─── Conversations / History ─────────────────────────────────

export async function listConversations() {
  await requireAdmin();
  const convos = await db
    .select({
      id: conversationsTable.id,
      userId: conversationsTable.userId,
      language: conversationsTable.language,
      createdAt: conversationsTable.createdAt,
      updatedAt: conversationsTable.updatedAt,
    })
    .from(conversationsTable)
    .orderBy(desc(conversationsTable.updatedAt));

  const userIds = [...new Set(convos.filter((c) => c.userId).map((c) => c.userId!))];
  const users =
    userIds.length > 0
      ? await db
          .select({ id: usersTable.id, name: usersTable.name, email: usersTable.email })
          .from(usersTable)
      : [];

  const userMap = new Map(users.map((u) => [u.id, u]));

  return convos.map((c) => ({
    ...c,
    user: c.userId ? userMap.get(c.userId) ?? null : null,
  }));
}

export async function getConversationMessages(conversationId: string) {
  await requireAdmin();
  return db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, conversationId))
    .orderBy(asc(messagesTable.createdAt));
}
