import { integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer(),
  email: varchar({ length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 512 }),
  role: varchar({ length: 20 }).notNull().default("user"),
  preferredLanguage: varchar("preferred_language", { length: 10 }).default("en"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const conversationsTable = pgTable("conversations", {
  id: uuid().primaryKey().defaultRandom(),
  userId: integer("user_id").references(() => usersTable.id),
  language: varchar({ length: 10 }).notNull().default("en"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const messagesTable = pgTable("messages", {
  id: uuid().primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id")
    .notNull()
    .references(() => conversationsTable.id, { onDelete: "cascade" }),
  role: varchar({ length: 20 }).notNull(),
  content: text().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const configTable = pgTable("config", {
  key: varchar({ length: 100 }).primaryKey(),
  value: text().notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const knowledgeFilesTable = pgTable("knowledge_files", {
  id: uuid().primaryKey().defaultRandom(),
  filename: varchar({ length: 255 }).notNull().unique(),
  title: varchar({ length: 500 }).notNull(),
  tags: text().notNull().default("[]"),
  content: text().notNull(),
  sourceType: varchar("source_type", { length: 20 }).notNull().default("sitemap"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
