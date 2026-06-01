// Тип на сценарий (playbook). Без runtime зависимости, за да може да се
// импортира както от Next.js кода, така и от seed скриптове (tsx).
// Структурата на полетата е описана в docs/scenarios-review/README.md.

export type Scenario = {
  slug: string;
  title: string;
  category: string;
  scope: string;
  goal: string;
  approach: string;
  behavior: string;
  knowledge: string;
  /** Свободен текст: на ред "резюме | url" (url по желание) */
  resources: string;
  enabled: boolean;
};
