import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import "dotenv/config";

const __dir = dirname(fileURLToPath(import.meta.url));

const url = process.env.DATABASE_URL
  .replace("-pooler.", ".")
  .replace("&channel_binding=require", "");
const sql = neon(url);

// Извличаме DEFAULT_SYSTEM_PROMPT от system-prompt.ts
const src = readFileSync(join(__dir, "../src/lib/system-prompt.ts"), "utf-8");
const match = src.match(/const DEFAULT_SYSTEM_PROMPT = `([\s\S]*?)`;/);
if (!match) { console.error("Cannot find DEFAULT_SYSTEM_PROMPT"); process.exit(1); }
const prompt = match[1];

const configs = [
  ["system_prompt", prompt],
  ["model", "gpt-5.4-mini"],
  ["router_model", "gpt-5.4-mini"],
  ["temperature", "0.2"],
  ["max_output_tokens", "2000"],
];

for (const [key, value] of configs) {
  await sql`
    INSERT INTO config (key, value)
    VALUES (${key}, ${value})
    ON CONFLICT (key) DO UPDATE SET value = ${value}, updated_at = now()
  `;
  console.log(`✓ ${key} = ${key === "system_prompt" ? `(${value.length} chars)` : value}`);
}

console.log("\nDone.");
