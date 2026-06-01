import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { SEED_SCENARIOS } from "../src/lib/scenario-seed-data";
import { parseReviewScenarios, type ParsedScenario } from "./parse-scenarios";

// Ползваме директен URL (без -pooler) за DDL/DML съвместимост
const rawUrl = process.env.DATABASE_URL as string;
const directUrl = rawUrl
  .replace("-pooler.", ".")
  .replace("&channel_binding=require", "")
  .replace("?channel_binding=require&", "?");

const sql = neon(directUrl);

// Двата пилота (01, 06) живеят в код като образец/резерва. Останалите 15 се
// парсват от ревю-файловете в docs/scenarios-review. Номерата дават подредбата.
const PILOT_NN: Record<string, number> = {
  "international-protection": 1,
  education: 6,
};

function buildScenarioList(): ParsedScenario[] {
  const pilots: ParsedScenario[] = SEED_SCENARIOS.map((s) => ({
    ...s,
    nn: PILOT_NN[s.slug] ?? 99,
  }));

  // Пропускаме 01 и 06 при парсването — те идват от кода (по-горе).
  const parsed = parseReviewScenarios([1, 6]);

  return [...pilots, ...parsed].sort((a, b) => a.nn - b.nn);
}

async function main() {
  const scenarios = buildScenarioList();
  console.log(`Seeding ${scenarios.length} scenarios...\n`);

  let order = 0;
  for (const s of scenarios) {
    await sql(
      `INSERT INTO scenarios (slug, title, category, scope, goal, approach, behavior, knowledge, resources, enabled, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (slug) DO UPDATE SET
         title = $2, category = $3, scope = $4, goal = $5, approach = $6,
         behavior = $7, knowledge = $8, resources = $9, enabled = $10,
         sort_order = $11, updated_at = NOW()`,
      [
        s.slug,
        s.title,
        s.category,
        s.scope,
        s.goal,
        s.approach,
        s.behavior,
        s.knowledge,
        s.resources,
        s.enabled,
        order++,
      ]
    );
    console.log(`  Seeded #${s.nn} → ${s.slug} (${s.title.slice(0, 60)}...)`);
  }

  console.log(`\nDone! ${scenarios.length} scenarios seeded to DB.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
