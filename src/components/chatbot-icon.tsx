"use client";

import Image from "next/image";

type ChatbotIconProps = {
  onClick: () => void;
};

export function ChatbotIcon({ onClick }: ChatbotIconProps) {
  return (
    <button
      onClick={onClick}
      className="group fixed right-5 bottom-5 z-40 flex size-16 items-center justify-center overflow-hidden rounded-full border-[3px] border-white/80 bg-slate-200 shadow-xl transition-transform hover:scale-105 sm:right-6 sm:bottom-6 sm:size-[72px]"
      aria-label="Open chatbot"
    >
      {/* Fallback chat icon */}
      <svg
        className="absolute size-7 text-slate-500 sm:size-8"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
        />
      </svg>
      {/* Assistant photo overlay */}
      <Image
        src="/compass-assistant.png"
        alt=""
        width={72}
        height={72}
        className="relative z-10 size-full rounded-full object-cover object-top"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    </button>
  );
}
