import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import fs from "fs";
import path from "path";

const sql = neon(process.env.DATABASE_URL);

const systemPromptFile = fs.readFileSync(
  path.join(process.cwd(), "src", "lib", "system-prompt.ts"),
  "utf-8"
);
const match = systemPromptFile.match(/export const SYSTEM_PROMPT = `([\s\S]*?)`;/);
const systemPrompt = match ? match[1] : "";

const configs = [
  ["system_prompt", systemPrompt],
  ["temperature", "0.2"],
  ["model", "gpt-5.4-mini"],
  ["max_output_tokens", "2000"],
];

for (const [key, value] of configs) {
  await sql(
    "INSERT INTO config (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING",
    [key, value]
  );
  console.log(`Config: ${key} = ${key === "system_prompt" ? `(${value.length} chars)` : value}`);
}

console.log("\nDone!");
