import { db } from "@/db";
import { knowledgeFilesTable } from "@/db/schema";

export type KnowledgeChunk = {
  fileId: string;
  title: string;
  tags: string[];
  content: string;
};

type FileMeta = {
  id: string;
  title: string;
  tags: string[];
  body: string;
};

const CHUNK_SIZE = 1500;
const CHUNK_OVERLAP = 200;
const CACHE_TTL_MS = 60_000;

let cachedChunks: KnowledgeChunk[] | null = null;
let cacheTimestamp = 0;

async function loadFiles(): Promise<FileMeta[]> {
  const rows = await db.select().from(knowledgeFilesTable);
  return rows.map((row) => {
    let tags: string[] = [];
    try {
      tags = JSON.parse(row.tags);
    } catch {
      tags = [];
    }
    return {
      id: row.filename,
      title: row.title,
      tags,
      body: row.content,
    };
  });
}

function splitIntoChunks(file: FileMeta): KnowledgeChunk[] {
  const text = file.body;
  if (!text || text.length < 50) return [];

  if (text.length <= CHUNK_SIZE) {
    return [{ fileId: file.id, title: file.title, tags: file.tags, content: text }];
  }

  const chunks: KnowledgeChunk[] = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + CHUNK_SIZE, text.length);
    let sliceEnd = end;

    if (end < text.length) {
      const lastNewline = text.lastIndexOf("\n", end);
      if (lastNewline > start + CHUNK_SIZE / 2) {
        sliceEnd = lastNewline;
      }
    }

    chunks.push({
      fileId: file.id,
      title: file.title,
      tags: file.tags,
      content: text.slice(start, sliceEnd).trim(),
    });

    start = sliceEnd - CHUNK_OVERLAP;
    if (start < 0) start = 0;
    if (sliceEnd >= text.length) break;
  }

  return chunks;
}

export async function getAllChunks(): Promise<KnowledgeChunk[]> {
  const now = Date.now();
  if (cachedChunks && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedChunks;
  }
  const files = await loadFiles();
  cachedChunks = files.flatMap(splitIntoChunks);
  cacheTimestamp = now;
  return cachedChunks;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

export async function searchKnowledge(query: string, maxChunks = 8): Promise<KnowledgeChunk[]> {
  const chunks = await getAllChunks();
  if (chunks.length === 0) return [];

  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return chunks.slice(0, maxChunks);

  const scored = chunks.map((chunk) => {
    const contentTokens = new Set(tokenize(chunk.content));
    const tagTokens = new Set(chunk.tags.flatMap((t) => tokenize(t)));

    let score = 0;
    for (const qt of queryTokens) {
      for (const ct of contentTokens) {
        if (ct === qt) { score += 2; break; }
        if (ct.includes(qt) || qt.includes(ct)) { score += 1; break; }
      }
      for (const tt of tagTokens) {
        if (tt === qt) { score += 3; break; }
        if (tt.includes(qt) || qt.includes(tt)) { score += 1.5; break; }
      }
    }

    return { chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const topChunks = scored.filter((s) => s.score > 0).slice(0, maxChunks);

  if (topChunks.length < 3) {
    const remaining = scored
      .filter((s) => s.score === 0)
      .slice(0, maxChunks - topChunks.length);
    topChunks.push(...remaining);
  }

  return topChunks.map((s) => s.chunk);
}

export function formatChunksForPrompt(chunks: KnowledgeChunk[]): string {
  if (chunks.length === 0) return "";

  const sections = chunks.map(
    (c) => `[${c.title}]\n${c.content}`
  );

  return `[РЕСУРСИ / RESOURCES]\n\n${sections.join("\n\n---\n\n")}`;
}

export function invalidateCache() {
  cachedChunks = null;
  cacheTimestamp = 0;
}
