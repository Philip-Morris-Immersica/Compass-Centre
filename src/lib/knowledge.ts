import fs from "fs";
import path from "path";

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

let cachedChunks: KnowledgeChunk[] | null = null;

function stripQuotes(s: string): string {
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  return s;
}

function parseFrontmatter(raw: string): { meta: Record<string, unknown>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };

  const meta: Record<string, unknown> = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value: unknown = line.slice(idx + 1).trim();
    if (typeof value === "string" && value.startsWith("[") && value.endsWith("]")) {
      value = value
        .slice(1, -1)
        .split(",")
        .map((s) => stripQuotes(s.trim()));
    } else if (typeof value === "string") {
      value = stripQuotes(value as string);
    }
    meta[key] = value;
  }
  return { meta, body: match[2] };
}

function loadFiles(): FileMeta[] {
  const knowledgeDir = path.join(process.cwd(), "src", "knowledge");
  if (!fs.existsSync(knowledgeDir)) return [];

  const files = fs.readdirSync(knowledgeDir).filter((f) => f.endsWith(".md"));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(knowledgeDir, file), "utf-8");
    const { meta, body } = parseFrontmatter(raw);
    return {
      id: (meta.id as string) || file.replace(".md", ""),
      title: (meta.title as string) || file.replace(".md", ""),
      tags: (meta.tags as string[]) || [],
      body: body.trim(),
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

export function getAllChunks(): KnowledgeChunk[] {
  if (cachedChunks) return cachedChunks;
  const files = loadFiles();
  cachedChunks = files.flatMap(splitIntoChunks);
  return cachedChunks;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

export function searchKnowledge(query: string, maxChunks = 8): KnowledgeChunk[] {
  const chunks = getAllChunks();
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
}
