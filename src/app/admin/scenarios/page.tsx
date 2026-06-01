"use client";

import { useEffect, useState, useTransition, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  listScenarios,
  getScenario,
  createScenario,
  updateScenario,
  deleteScenario,
} from "../actions";
import { Pencil, Trash2, Plus, X } from "lucide-react";

type ScenarioRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  enabled: boolean;
  sortOrder: number;
  updatedAt: Date;
};

type EditingScenario = {
  id?: string;
  slug: string;
  title: string;
  category: string;
  scope: string;
  goal: string;
  approach: string;
  behavior: string;
  knowledge: string;
  resources: string;
  enabled: boolean;
  sortOrder: number;
};

const EMPTY: EditingScenario = {
  slug: "",
  title: "",
  category: "",
  scope: "",
  goal: "",
  approach: "",
  behavior: "",
  knowledge: "",
  resources: "",
  enabled: true,
  sortOrder: 0,
};

const FIELD_HELP: Record<string, string> = {
  scope: "С какво се занимава сценарият — за класификатора (НЕ ключови думи). На естествен език.",
  goal: "Какво трябва да постигне ботът / как изглежда успех за човека.",
  approach: "Препоръчителен, адаптивен подход + примерни уточняващи въпроси.",
  behavior: "Как да се държи и да звучи (тон/стил/емпатия) — описателно, без примерни реплики.",
  knowledge: "Факти и разклонения по същество.",
  resources: 'Насочващи ресурси, на ред: "резюме | url" (url по желание).',
};

export default function ScenariosPage() {
  const [rows, setRows] = useState<ScenarioRow[]>([]);
  const [editing, setEditing] = useState<EditingScenario | null>(null);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const load = useCallback(() => {
    listScenarios().then((r) => setRows(r as ScenarioRow[]));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function handleNew() {
    setEditing({ ...EMPTY, sortOrder: rows.length });
  }

  function handleEdit(id: string) {
    startTransition(async () => {
      const s = await getScenario(id);
      if (s) {
        setEditing({
          id: s.id,
          slug: s.slug,
          title: s.title,
          category: s.category,
          scope: s.scope,
          goal: s.goal,
          approach: s.approach,
          behavior: s.behavior,
          knowledge: s.knowledge,
          resources: s.resources,
          enabled: s.enabled,
          sortOrder: s.sortOrder,
        });
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Да изтрия ли този сценарий?")) return;
    startTransition(async () => {
      await deleteScenario(id);
      load();
    });
  }

  function handleSave() {
    if (!editing) return;
    startTransition(async () => {
      const { id, ...data } = editing;
      if (id) {
        await updateScenario(id, data);
      } else {
        await createScenario(data);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setEditing(null);
      load();
    });
  }

  function field(
    key: keyof EditingScenario,
    label: string,
    rowsCount: number
  ) {
    if (!editing) return null;
    return (
      <div className="space-y-2">
        <Label htmlFor={key}>{label}</Label>
        {FIELD_HELP[key] && (
          <p className="text-xs text-muted-foreground">{FIELD_HELP[key]}</p>
        )}
        <Textarea
          id={key}
          value={editing[key] as string}
          onChange={(e) => setEditing({ ...editing, [key]: e.target.value })}
          rows={rowsCount}
          className="text-sm"
        />
      </div>
    );
  }

  if (editing) {
    return (
      <div className="p-6 max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {editing.id ? "Редакция на сценарий" : "Нов сценарий"}
          </h1>
          <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>
            <X className="h-4 w-4 mr-1" /> Отказ
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="slug">Slug (стабилен идентификатор)</Label>
            <Input
              id="slug"
              value={editing.slug}
              onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
              placeholder="напр. international-protection"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Заглавие</Label>
            <Input
              id="title"
              value={editing.title}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              placeholder="напр. Международна закрила"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 items-end">
          <div className="space-y-2 col-span-1">
            <Label htmlFor="category">Категория</Label>
            <Input
              id="category"
              value={editing.category}
              onChange={(e) => setEditing({ ...editing, category: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sortOrder">Подредба</Label>
            <Input
              id="sortOrder"
              type="number"
              value={editing.sortOrder}
              onChange={(e) =>
                setEditing({ ...editing, sortOrder: Number(e.target.value) || 0 })
              }
            />
          </div>
          <label className="flex items-center gap-2 text-sm pb-2">
            <input
              type="checkbox"
              checked={editing.enabled}
              onChange={(e) => setEditing({ ...editing, enabled: e.target.checked })}
              className="h-4 w-4"
            />
            Активен
          </label>
        </div>

        <Separator />

        {field("scope", "Обхват (scope)", 4)}
        {field("goal", "Цел (goal)", 3)}
        {field("approach", "Подход (approach)", 6)}
        {field("behavior", "Поведение и тон (behavior)", 7)}
        {field("knowledge", "Информация (knowledge)", 12)}
        {field("resources", "Ресурси (resources)", 8)}

        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? "Запазване..." : editing.id ? "Запази промените" : "Създай сценарий"}
          </Button>
          {saved && <span className="text-sm text-green-600">Запазено!</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Сценарии</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {rows.length} сценария · редактируеми playbook-ове за поведение по тема
          </p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="h-4 w-4 mr-2" /> Нов сценарий
        </Button>
      </div>

      <Separator />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Подредба</TableHead>
            <TableHead>Заглавие</TableHead>
            <TableHead>Категория</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((s) => (
            <TableRow key={s.id}>
              <TableCell>{s.sortOrder}</TableCell>
              <TableCell>{s.title}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{s.category}</TableCell>
              <TableCell className="font-mono text-xs">{s.slug}</TableCell>
              <TableCell>
                {s.enabled ? (
                  <span className="text-green-600 text-sm">Активен</span>
                ) : (
                  <span className="text-muted-foreground text-sm">Изключен</span>
                )}
              </TableCell>
              <TableCell className="text-right space-x-1">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(s.id)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                Все още няма сценарии. Стартирай seed скрипта или създай нов.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
