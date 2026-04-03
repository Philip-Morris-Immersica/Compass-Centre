"use client";

import { useRef, useEffect, useMemo } from "react";
import { X, Send, Square } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";

type ChatPanelProps = {
  open: boolean;
  onClose: () => void;
};

export function ChatPanel({ open, onClose }: ChatPanelProps) {
  const { language, t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { language: language ?? "bg" },
      }),
    [language]
  );

  const {
    messages,
    status,
    sendMessage,
    stop,
    error,
  } = useChat({ transport });

  const isStreaming = status === "streaming" || status === "submitted";

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("message") as HTMLInputElement;
    const text = input.value.trim();
    if (!text || isStreaming) return;
    sendMessage({ text });
    input.value = "";
  }

  function getMessageText(msg: (typeof messages)[number]): string {
    return (
      msg.parts
        ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
        .map((p) => p.text)
        .join("") ?? ""
    );
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white shadow-2xl sm:left-auto sm:w-[45%] sm:min-w-[380px] sm:max-w-xl">
      {/* Header */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-4 text-white">
        <div className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-white/20">
          <Image
            src="/compass-assistant.png"
            alt=""
            width={40}
            height={40}
            className="size-10 rounded-full object-cover object-top"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">{t("chatbotName")}</p>
          <p className="text-xs opacity-80">{t("chatbotSubtitle")}</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-1.5 transition-colors hover:bg-white/20"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="flex flex-col gap-3">
          {messages.length === 0 && (
            <div className="py-12 text-center text-sm text-slate-400">
              {t("welcomeMessage")}
            </div>
          )}

          {messages.map((msg) => {
            const text = getMessageText(msg);
            return (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm prose-slate max-w-none [&_a]:text-blue-600 [&_a]:underline [&_strong]:font-semibold [&_h2]:mt-3 [&_h2]:mb-1 [&_h2]:text-sm [&_h2]:font-bold [&_h3]:mt-2 [&_h3]:mb-1 [&_h3]:text-sm [&_h3]:font-semibold [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5">
                      <ReactMarkdown>{text}</ReactMarkdown>
                    </div>
                  ) : (
                    text
                  )}
                </div>
              </div>
            );
          })}

          {status === "submitted" && (
            <div className="flex justify-start">
              <div className="flex gap-1 rounded-2xl bg-slate-100 px-4 py-3">
                <span className="size-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
                <span className="size-2 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                <span className="size-2 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
              {error.message || "An error occurred. Please try again."}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-slate-200 p-3">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            ref={inputRef}
            name="message"
            type="text"
            placeholder={t("typePlaceholder")}
            disabled={isStreaming}
            className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
          />
          {isStreaming ? (
            <button
              type="button"
              onClick={stop}
              className="flex size-10 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600"
            >
              <Square className="size-3.5" />
            </button>
          ) : (
            <button
              type="submit"
              className="flex size-10 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:opacity-40"
            >
              <Send className="size-4" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
