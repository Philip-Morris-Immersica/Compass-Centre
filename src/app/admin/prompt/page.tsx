"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getConfigValue, updateConfig } from "../actions";

export default function PromptPage() {
  const [prompt, setPrompt] = useState("");
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getConfigValue("system_prompt").then((v) => {
      if (v) setPrompt(v);
    });
  }, []);

  function handleSave() {
    startTransition(async () => {
      await updateConfig("system_prompt", prompt);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  }

  return (
    <div className="p-6 max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">System Prompt</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Edit the system prompt used by the chatbot. Changes take effect within 60 seconds.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="prompt">Prompt Text</Label>
        <Textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={24}
          className="font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground">{prompt.length} characters</p>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving..." : "Save Prompt"}
        </Button>
        {saved && <span className="text-sm text-green-600">Saved successfully!</span>}
      </div>
    </div>
  );
}
