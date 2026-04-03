import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import "dotenv/config";
import fs from "fs";
import path from "path";

const sql = neon(process.env.DATABASE_URL);
const db = drizzle({ client: sql });

function stripQuotes(s) {
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  return s;
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (value.startsWith("[") && value.endsWith("]")) {
      value = value.slice(1, -1).split(",").map((s) => stripQuotes(s.trim()));
    } else {
      value = stripQuotes(value);
    }
    meta[key] = value;
  }
  return { meta, body: match[2] };
}

const knowledgeDir = path.join(process.cwd(), "src", "knowledge");
const files = fs.readdirSync(knowledgeDir).filter((f) => f.endsWith(".md"));

console.log(`Found ${files.length} knowledge files to seed\n`);

for (const file of files) {
  const raw = fs.readFileSync(path.join(knowledgeDir, file), "utf-8");
  const { meta, body } = parseFrontmatter(raw);

  const filename = file;
  const title = meta.title || file.replace(".md", "");
  const tags = JSON.stringify(Array.isArray(meta.tags) ? meta.tags : []);
  const content = body.trim();

  await sql(
    "INSERT INTO knowledge_files (filename, title, tags, content, source_type) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (filename) DO UPDATE SET title = $2, tags = $3, content = $4, updated_at = NOW()",
    [filename, title, tags, content, "sitemap"]
  );

  console.log(`  Seeded: ${filename} (${content.length} chars)`);
}

console.log("\nDone! All knowledge files seeded to DB.");
