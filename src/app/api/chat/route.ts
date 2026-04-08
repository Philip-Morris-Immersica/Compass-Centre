import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { openai } from "@ai-sdk/openai";
import { searchKnowledge, formatChunksForPrompt } from "@/lib/knowledge";
import { getSystemPromptText, buildSystemPrompt } from "@/lib/system-prompt";
import { db } from "@/db";
import { configTable, conversationsTable, messagesTable } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

let configCache: Record<string, string> = {};
let configCacheTime = 0;
const CONFIG_CACHE_TTL = 60_000;

// Map SDK chat IDs (nanoid) to DB conversation UUIDs
const chatToConversation = new Map<string, string>();

async function getConfig(key: string, fallback: string): Promise<string> {
  const now = Date.now();
  if (now - configCacheTime < CONFIG_CACHE_TTL && configCache[key] !== undefined) {
    return configCache[key];
  }
  try {
    const rows = await db.select().from(configTable);
    configCache = {};
    for (const row of rows) configCache[row.key] = row.value;
    configCacheTime = now;
  } catch {
    // fall through to fallback
  }
  return configCache[key] ?? fallback;
}

async function getOrCreateConversation(chatId: string | undefined, language: string): Promise<string> {
  if (chatId && chatToConversation.has(chatId)) {
    return chatToConversation.get(chatId)!;
  }

  const [conv] = await db
    .insert(conversationsTable)
    .values({ language })
    .returning({ id: conversationsTable.id });

  if (chatId) {
    chatToConversation.set(chatId, conv.id);
  }

  return conv.id;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      id: chatId,
      messages: uiMessages,
      language = "bg",
    } = body as {
      id?: string;
      messages: UIMessage[];
      language?: string;
    };

    const lastUserMessage = [...uiMessages]
      .reverse()
      .find((m) => m.role === "user");

    const userText = extractText(lastUserMessage);
    const responseLanguage = detectResponseLanguage(userText, language);

    const [relevantChunks, basePrompt, temperature, model, maxOutputTokens] = await Promise.all([
      searchKnowledge(userText, 8),
      getSystemPromptText(),
      getConfig("temperature", "0.2").then(Number),
      getConfig("model", "gpt-4.1-mini"),
      getConfig("max_output_tokens", "2000").then(Number),
    ]);

    const knowledgeContext = formatChunksForPrompt(relevantChunks);
    const systemPrompt = buildSystemPrompt(basePrompt, responseLanguage, knowledgeContext);

    const conversationId = await getOrCreateConversation(chatId, responseLanguage);

    if (userText) {
      await db.insert(messagesTable).values({
        conversationId,
        role: "user",
        content: userText,
      });
    }

    const modelMessages = await convertToModelMessages(uiMessages);

    const result = streamText({
      model: openai(model),
      temperature,
      maxOutputTokens: maxOutputTokens,
      system: systemPrompt,
      messages: modelMessages,
      onFinish: async ({ text }) => {
        try {
          if (text && conversationId) {
            await db.insert(messagesTable).values({
              conversationId,
              role: "assistant",
              content: text,
            });
            await db
              .update(conversationsTable)
              .set({ updatedAt: new Date() })
              .where(eq(conversationsTable.id, conversationId));
          }
        } catch (dbError) {
          console.error("Failed to save assistant message:", dbError);
        }
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

function extractText(msg: UIMessage | undefined): string {
  if (!msg) return "";
  return (
    msg.parts
      ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join(" ") ?? ""
  );
}

function detectResponseLanguage(text: string, fallback: string): string {
  const trimmed = text.trim();
  if (!trimmed) return fallback;

  if (/[іїєґІЇЄҐ]/u.test(trimmed)) return "ua";

  if (/[\u0600-\u06FF]/u.test(trimmed)) {
    return /[پچژکگی]/u.test(trimmed) ? "fa" : "ar";
  }

  const cyrillicChars = trimmed.match(/[А-Яа-яЁё]/g)?.length ?? 0;
  const latinChars = trimmed.match(/[A-Za-z]/g)?.length ?? 0;

  if (cyrillicChars > latinChars && cyrillicChars > 0) return "bg";
  if (latinChars > 0) return "en";

  return fallback;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId");

  if (!conversationId) {
    return Response.json({ messages: [] });
  }

  const dbMessages = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, conversationId))
    .orderBy(asc(messagesTable.createdAt));

  return Response.json({ messages: dbMessages });
}
