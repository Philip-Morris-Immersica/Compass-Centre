import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { openai } from "@ai-sdk/openai";
import { searchKnowledge, formatChunksForPrompt } from "@/lib/knowledge";
import { buildSystemPrompt } from "@/lib/system-prompt";
import { db } from "@/db";
import { conversationsTable, messagesTable } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

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

    const relevantChunks = searchKnowledge(userText, 8);
    const knowledgeContext = formatChunksForPrompt(relevantChunks);
    const systemPrompt = buildSystemPrompt(language, knowledgeContext);

    let conversationId = chatId;
    if (!conversationId) {
      const [conv] = await db
        .insert(conversationsTable)
        .values({ language })
        .returning({ id: conversationsTable.id });
      conversationId = conv.id;
    }

    if (userText) {
      await db.insert(messagesTable).values({
        conversationId,
        role: "user",
        content: userText,
      });
    }

    const modelMessages = await convertToModelMessages(uiMessages);

    const result = streamText({
      model: openai("gpt-5.4-mini"),
      temperature: 0.2,
      maxOutputTokens: 2000,
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
