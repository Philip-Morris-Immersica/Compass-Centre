"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { languages, type Language } from "@/lib/translations";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = languages.find((l) => l.code === language);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative z-40">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 rounded-lg bg-white/90 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-md backdrop-blur-sm transition-colors hover:bg-white"
      >
        {current?.flag ?? "EN"}
        <ChevronDown className="size-3.5" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-44 rounded-lg bg-white py-1 shadow-lg ring-1 ring-slate-200">
          {languages
            .filter((l) => l.available)
            .map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code as Language);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-slate-100 ${
                  lang.code === language
                    ? "font-semibold text-slate-900"
                    : "text-slate-600"
                }`}
              >
                <span className="font-bold">{lang.flag}</span>
                <span>{lang.nativeLabel}</span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
