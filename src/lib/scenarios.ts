import { db } from "@/db";
import { scenariosTable } from "@/db/schema";
import { asc } from "drizzle-orm";
import type { Scenario } from "./scenario-types";
import { SEED_SCENARIOS } from "./scenario-seed-data";

// Сценарии (playbook-ове). Източник на истина = таблицата `scenarios` в БД,
// редактируема от админ панела. Ако БД е недостъпна/празна, ползваме вградените
// SEED_SCENARIOS (двата пилота), за да работи ботът и преди seed.
//
// Структурата на полетата е описана в docs/scenarios-review/README.md:
//   scope · goal · approach · behavior · knowledge · resources

export type { Scenario };

const CACHE_TTL_MS = 60_000;
let cached: Scenario[] | null = null;
let cacheTime = 0;

async function loadScenarios(): Promise<Scenario[]> {
  const now = Date.now();
  if (cached && now - cacheTime < CACHE_TTL_MS) return cached;

  try {
    const rows = await db.select().from(scenariosTable).orderBy(asc(scenariosTable.sortOrder));
    if (rows.length > 0) {
      cached = rows.map((r) => ({
        slug: r.slug,
        title: r.title,
        category: r.category,
        scope: r.scope,
        goal: r.goal,
        approach: r.approach,
        behavior: r.behavior,
        knowledge: r.knowledge,
        resources: r.resources,
        enabled: r.enabled,
      }));
    } else {
      cached = SEED_SCENARIOS;
    }
  } catch {
    cached = SEED_SCENARIOS;
  }
  cacheTime = now;
  return cached;
}

export function invalidateScenariosCache() {
  cached = null;
  cacheTime = 0;
}

export async function getScenariosBySlugs(slugs: string[]): Promise<Scenario[]> {
  const all = await loadScenarios();
  const bySlug = new Map(all.filter((s) => s.enabled).map((s) => [s.slug, s]));
  return slugs.map((s) => bySlug.get(s)).filter((s): s is Scenario => Boolean(s));
}

/** Компактен каталог за рутера — само обхватът (scope), без тежкото съдържание. */
export async function getScenarioCatalog(): Promise<
  { slug: string; title: string; category: string; scope: string }[]
> {
  const all = await loadScenarios();
  return all
    .filter((s) => s.enabled)
    .map((s) => ({ slug: s.slug, title: s.title, category: s.category, scope: s.scope }));
}

/** Форматира избраните сценарии за вмъкване в системния промпт (tier-1). */
export function formatScenariosForPrompt(scenarios: Scenario[]): string {
  if (scenarios.length === 0) return "";

  const blocks = scenarios.map((s) => {
    const parts = [`### СЦЕНАРИЙ: ${s.title}`, `Категория: ${s.category}`];
    if (s.goal.trim()) parts.push(`\nЦЕЛ:\n${s.goal.trim()}`);
    if (s.approach.trim()) parts.push(`\nПРЕПОРЪЧИТЕЛЕН ПОДХОД (адаптирай се към разговора, не повтаряй изяснено):\n${s.approach.trim()}`);
    if (s.behavior.trim()) parts.push(`\nПОВЕДЕНИЕ И ТОН (как да звучи):\n${s.behavior.trim()}`);
    if (s.knowledge.trim()) parts.push(`\nИНФОРМАЦИЯ ПО СЪЩЕСТВО:\n${s.knowledge.trim()}`);
    if (s.resources.trim()) parts.push(`\nНАСОЧВАЩИ РЕСУРСИ (tier-1; води по съдържанието, давай само къси линкове „[тук](url)" при нужда):\n${s.resources.trim()}`);
    return parts.join("\n");
  });

  return blocks.join("\n\n──────────\n\n");
}
