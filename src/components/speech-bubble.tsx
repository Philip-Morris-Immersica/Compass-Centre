"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export function SpeechBubble() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const lines = t("welcomeMessage").split("\n");

  return (
    <div className="relative w-[280px] sm:w-[360px] md:w-[420px] lg:w-[460px]">
      {/* Bubble body */}
      <div className="relative rounded-2xl bg-white/95 px-5 py-4 text-[13px] leading-relaxed text-slate-700 shadow-xl backdrop-blur-sm sm:px-6 sm:py-5 sm:text-sm md:text-[15px]">
        <button
          onClick={() => setVisible(false)}
          className="absolute top-2 right-2 z-10 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="size-4" />
        </button>
        <div className="space-y-2 pr-5">
          {lines.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </div>

      {/* Comic tail — points to the right (toward the girl) */}
      <div
        className="absolute -right-4 top-1/2 size-0 -translate-y-1/2 border-y-[12px] border-l-[20px] border-y-transparent border-l-white/95 sm:-right-5 sm:border-y-[14px] sm:border-l-[24px]"
        aria-hidden
      />
    </div>
  );
}
