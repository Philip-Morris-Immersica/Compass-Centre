"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { getAllConfig, updateConfig } from "../actions";

const MODEL_OPTIONS = [
  "gpt-5.4-mini",
  "gpt-4.1-mini",
  "gpt-4.1-nano",
  "gpt-4o-mini",
  "gpt-4o",
];

export default function ConfigPage() {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getAllConfig().then(setConfig);
  }, []);

  function handleChange(key: string, value: string) {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    startTransition(async () => {
      await Promise.all([
        updateConfig("temperature", config.temperature ?? "0.2"),
        updateConfig("model", config.model ?? "gpt-5.4-mini"),
        updateConfig("max_output_tokens", config.max_output_tokens ?? "2000"),
      ]);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  }

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Chatbot Configuration</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Adjust model settings. Changes take effect within 60 seconds.
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Select value={config.model ?? "gpt-5.4-mini"} onValueChange={(v) => { if (v) handleChange("model", v); }}>
            <SelectTrigger>
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {MODEL_OPTIONS.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="temperature">Temperature</Label>
          <div className="flex items-center gap-3">
            <Input
              id="temperature"
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={config.temperature ?? "0.2"}
              onChange={(e) => handleChange("temperature", e.target.value)}
              className="flex-1"
            />
            <span className="text-sm font-mono w-10 text-right">
              {config.temperature ?? "0.2"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Lower = more precise/deterministic. Higher = more creative.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="max_output_tokens">Max Output Tokens</Label>
          <Input
            id="max_output_tokens"
            type="number"
            min="100"
            max="16000"
            step="100"
            value={config.max_output_tokens ?? "2000"}
            onChange={(e) => handleChange("max_output_tokens", e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving..." : "Save Configuration"}
        </Button>
        {saved && <span className="text-sm text-green-600">Saved successfully!</span>}
      </div>
    </div>
  );
}
