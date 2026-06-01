import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import type { Scenario } from "../src/lib/scenario-types";

// Парсва ревю-файловете в docs/scenarios-review/NN-slug.md в Scenario обекти.
// Източник на истина за съдържанието на сценариите. Секциите се разпознават по
// markdown заглавия `## `field``; секцията "Въпроси/бележки за теб" се игнорира.

const REVIEW_DIR = join(process.cwd(), "docs", "scenarios-review");

const KNOWN_FIELDS = [
  "title",
  "category",
  "scope",
  "goal",
  "approach",
  "behavior",
  "knowledge",
  "resources",
] as const;

type Field = (typeof KNOWN_FIELDS)[number];

export type ParsedScenario = Scenario & { nn: number };

function cleanBody(lines: string[]): string {
  // Махаме хоризонталните разделители (---), които са между секциите.
  const kept = lines.filter((l) => !/^-{3,}\s*$/.test(l.trim()));
  return kept.join("\n").trim();
}

export function parseScenarioMd(content: string, nn: number): ParsedScenario | null {
  const slugMatch = content.match(/\*\*id:\*\*\s*`([^`]+)`/);
  if (!slugMatch) return null;
  const slug = slugMatch[1].trim();

  const lines = content.split(/\r?\n/);
  const sections = new Map<Field, string[]>();
  let current: Field | null = null;

  for (const line of lines) {
    // Заглавие от ниво 2 ("## ..."), но НЕ "### ..." (\s след точно две решетки).
    const h = line.match(/^##\s+(.*)$/);
    if (h && !line.startsWith("###")) {
      const inBackticks = h[1].match(/`([^`]+)`/);
      const key = (inBackticks ? inBackticks[1] : h[1]).trim().toLowerCase();
      if ((KNOWN_FIELDS as readonly string[]).includes(key)) {
        current = key as Field;
        sections.set(current, []);
      } else {
        current = null; // напр. "Въпроси/бележки за теб" — игнорира се
      }
      continue;
    }
    if (current) sections.get(current)!.push(line);
  }

  const get = (f: Field) => cleanBody(sections.get(f) ?? []);

  return {
    nn,
    slug,
    title: get("title"),
    category: get("category"),
    scope: get("scope"),
    goal: get("goal"),
    approach: get("approach"),
    behavior: get("behavior"),
    knowledge: get("knowledge"),
    resources: get("resources"),
    enabled: true,
  };
}

/** Парсва избрани ревю-файлове. excludeNn пропуска номера (напр. пилотите 01/06). */
export function parseReviewScenarios(excludeNn: number[] = []): ParsedScenario[] {
  const files = readdirSync(REVIEW_DIR).filter((f) => /^\d{2}-.*\.md$/.test(f));
  const out: ParsedScenario[] = [];

  for (const file of files) {
    const nn = parseInt(file.slice(0, 2), 10);
    if (excludeNn.includes(nn)) continue;
    const content = readFileSync(join(REVIEW_DIR, file), "utf8");
    const parsed = parseScenarioMd(content, nn);
    if (parsed) out.push(parsed);
    else console.warn(`  ! Пропуснат (липсва id): ${file}`);
  }

  return out.sort((a, b) => a.nn - b.nn);
}
