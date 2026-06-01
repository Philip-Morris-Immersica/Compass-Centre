import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { getScenarioCatalog } from "./scenarios";

export type RouterProfile = {
  origin?: string;
  status?: string;
  age?: string;
  location?: string;
  documents?: string;
  notes?: string;
};

export type RouterResult = {
  /** Slug-ове на активните сценарии (0–2) */
  scenarioIds: string[];
  profile: RouterProfile;
  /** Какво вече е изяснено/казано в разговора (за да не се повтаря) */
  covered: string[];
  reasoning?: string;
};

type Turn = { role: string; content: string };

const ROUTER_SYSTEM = `Ти си рутер/класификатор за чатбота на Компас Център, който помага на бежанци и мигранти в България.
Задачата ти НЕ е да отговаряш на потребителя, а да анализираш разговора по СМИСЪЛ (не по ключови думи):
1) Избери кои СЦЕНАРИИ са релевантни на текущия разговор (0, 1 или максимум 2), по обхвата (scope) им.
2) Извлечи вече известния профил на потребителя.
3) Отбележи какво вече е изяснено/казано, за да не се пита повторно.

Върни САМО валиден JSON (без markdown):
{
  "scenarioIds": string[],   // slug-ове от каталога; празен масив ако нищо не пасва
  "profile": {
    "origin": string|null,    // държава/регион на произход (важно: Украйна => временна закрила; друго => международна)
    "status": string|null,    // търсещ закрила / временна закрила / международна / бежански / хуманитарен / не знае
    "age": string|null,
    "location": string|null,  // град или център
    "documents": string|null, // напр. "има оригинална диплома", "няма документи"
    "notes": string|null
  },
  "covered": string[],        // кратки фрази какво вече е изяснено (напр. "произход: Сирия", "попитан за град")
  "reasoning": string         // 1 кратко изречение
}

Правила:
- Избирай сценарий само ако наистина пасва по смисъл. Поздрав/неясно => празен scenarioIds.
- Максимум 2 сценария, подредени по релевантност. Темите може да се преплитат.
- За липсваща информация използвай null / празен масив.`;

function buildCatalogText(
  catalog: { slug: string; title: string; category: string; scope: string }[]
): string {
  return catalog
    .map((s) => `- slug: ${s.slug}\n  заглавие: ${s.title}\n  категория: ${s.category}\n  обхват: ${s.scope}`)
    .join("\n");
}

function buildTranscript(conversation: Turn[], maxTurns = 10): string {
  return conversation
    .slice(-maxTurns)
    .map((t) => `${t.role === "user" ? "Потребител" : "Асистент"}: ${t.content}`)
    .join("\n");
}

function safeParse(text: string): RouterResult | null {
  try {
    const cleaned = text
      .trim()
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/i, "")
      .trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1) return null;
    const obj = JSON.parse(cleaned.slice(start, end + 1));

    const scenarioIds = Array.isArray(obj.scenarioIds)
      ? obj.scenarioIds.filter((x: unknown): x is string => typeof x === "string").slice(0, 2)
      : [];

    const p = obj.profile ?? {};
    const profile: RouterProfile = {};
    for (const key of ["origin", "status", "age", "location", "documents", "notes"] as const) {
      if (typeof p[key] === "string" && p[key].trim()) profile[key] = p[key].trim();
    }

    const covered = Array.isArray(obj.covered)
      ? obj.covered.filter((x: unknown): x is string => typeof x === "string" && x.trim().length > 0)
      : [];

    return {
      scenarioIds,
      profile,
      covered,
      reasoning: typeof obj.reasoning === "string" ? obj.reasoning : undefined,
    };
  } catch {
    return null;
  }
}

export async function routeScenario(opts: {
  conversation: Turn[];
  model: string;
}): Promise<RouterResult> {
  const { conversation, model } = opts;

  const empty: RouterResult = { scenarioIds: [], profile: {}, covered: [] };

  let catalog: { slug: string; title: string; category: string; scope: string }[];
  try {
    catalog = await getScenarioCatalog();
  } catch {
    return empty;
  }
  if (catalog.length === 0) return empty;

  const prompt = `НАЛИЧНИ СЦЕНАРИИ:\n${buildCatalogText(catalog)}\n\nРАЗГОВОР ДОСЕГА:\n${buildTranscript(conversation)}\n\nВърни JSON според инструкцията.`;

  try {
    const { text } = await generateText({
      model: openai(model),
      temperature: 0,
      system: ROUTER_SYSTEM,
      prompt,
    });
    const parsed = safeParse(text);
    if (parsed) return parsed;
  } catch (err) {
    console.error("Router error:", err);
  }

  return empty;
}
