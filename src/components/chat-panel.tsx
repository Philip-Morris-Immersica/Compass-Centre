"use client";

import { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { X, Send, Square, RotateCcw, Mic, MicOff, Loader2, ArrowDown } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";

const SPEECH_LANG_MAP: Record<string, string> = {
  bg: "bg-BG",
  en: "en-US",
  ua: "uk-UA",
  ru: "ru-RU",
  ar: "ar-SA",
  fa: "fa-IR",
  fr: "fr-FR",
};

const CHAT_WELCOME: Record<string, string> = {
  bg: `Здравейте! Аз съм вашият личен асистент в Компас Център. Мога да ви помогна с информация за живота в България.

Ето основните теми, по които мога да помогна:

1. **Международна и временна закрила** — процедури за убежище, статут, документи, права
2. **Образование** — училище, университет, курсове по български език
3. **Пазар на труда** — работа, договори, права, бизнес, финансови услуги
4. **Здраве** — здравно осигуряване, лекари, лекарства, ТЕЛК
5. **Жилище** — наем, държавна подкрепа, настаняване при нужда
6. **Социално подпомагане** — социални помощи, семейна подкрепа, защита при насилие

Просто напишете въпроса си и ще направя всичко възможно да ви помогна!`,

  en: `Hello! I'm your personal assistant at Compass Centre. I can help you with information about life in Bulgaria as a refugee or migrant.

Here are the main topics I can help with:

1. **International & Temporary Protection** — asylum procedures, status, documents, rights
2. **Education** — school, university, Bulgarian language courses
3. **Labor Market** — employment, contracts, rights, business, financial services
4. **Health** — health insurance, doctors, medication, disability assessment
5. **Housing** — renting, state support, emergency accommodation
6. **Social Support** — social benefits, family support, protection from violence

Simply type your question and I'll do my best to help!`,

  ua: `Вітаю! Я ваш особистий асистент у Центрі Компас. Я можу допомогти вам з інформацією про життя в Болгарії.

Ось основні теми, з якими я можу допомогти:

1. **Міжнародний та тимчасовий захист** — процедури притулку, статус, документи, права
2. **Освіта** — школа, університет, курси болгарської мови
3. **Ринок праці** — робота, договори, права, бізнес, фінансові послуги
4. **Здоров'я** — медичне страхування, лікарі, ліки, оцінка інвалідності
5. **Житло** — оренда, державна підтримка, екстрене розміщення
6. **Соціальна підтримка** — соціальна допомога, сімейна підтримка, захист від насильства

Просто напишіть ваше запитання і я зроблю все можливе, щоб допомогти!`,

  ar: `مرحباً! أنا مساعدك الشخصي في مركز كومباس. يمكنني مساعدتك بمعلومات حول الحياة في بلغاريا.

إليك المواضيع الرئيسية التي يمكنني المساعدة فيها:

1. **الحماية الدولية والمؤقتة** — إجراءات اللجوء، الوضع القانوني، الوثائق، الحقوق
2. **التعليم** — المدرسة، الجامعة، دورات اللغة البلغارية
3. **سوق العمل** — التوظيف، العقود، الحقوق، الأعمال التجارية، الخدمات المالية
4. **الصحة** — التأمين الصحي، الأطباء، الأدوية، تقييم الإعاقة
5. **السكن** — الإيجار، الدعم الحكومي، الإسكان الطارئ
6. **الدعم الاجتماعي** — المساعدات الاجتماعية، دعم الأسرة، الحماية من العنف

ما عليك سوى كتابة سؤالك وسأبذل قصارى جهدي لمساعدتك!`,

  fa: `سلام! من دستیار شخصی شما در مرکز کمپاس هستم. می‌توانم در مورد زندگی در بلغارستان به شما کمک کنم.

موضوعات اصلی که می‌توانم در آنها کمک کنم:

1. **حمایت بین‌المللی و موقت** — روند پناهندگی، وضعیت، مدارک، حقوق
2. **آموزش** — مدرسه، دانشگاه، دوره‌های زبان بلغاری
3. **بازار کار** — استخدام، قراردادها، حقوق، کسب‌وکار، خدمات مالی
4. **بهداشت** — بیمه درمانی، پزشکان، دارو، ارزیابی معلولیت
5. **مسکن** — اجاره، حمایت دولتی، اسکان اضطراری
6. **حمایت اجتماعی** — کمک‌های اجتماعی، حمایت خانواده، حمایت در برابر خشونت

کافیست سؤال خود را بنویسید و من تمام تلاشم را می‌کنم تا به شما کمک کنم!`,

  fr: `Bonjour ! Je suis votre assistant personnel au Centre Compass. Je peux vous aider avec des informations sur la vie en Bulgarie.

Voici les principaux sujets sur lesquels je peux vous aider :

1. **Protection internationale et temporaire** — procédures d'asile, statut, documents, droits
2. **Éducation** — école, université, cours de langue bulgare
3. **Marché du travail** — emploi, contrats, droits, entreprise, services financiers
4. **Santé** — assurance maladie, médecins, médicaments, évaluation du handicap
5. **Logement** — location, aide de l'État, hébergement d'urgence
6. **Aide sociale** — prestations sociales, aide familiale, protection contre les violences

Posez simplement votre question et je ferai de mon mieux pour vous aider !`,

  ru: `Здравствуйте! Я ваш личный ассистент в Центре Компас. Я могу помочь вам с информацией о жизни в Болгарии.

Вот основные темы, по которым я могу помочь:

1. **Международная и временная защита** — процедуры убежища, статус, документы, права
2. **Образование** — школа, университет, курсы болгарского языка
3. **Рынок труда** — трудоустройство, контракты, права, бизнес, финансовые услуги
4. **Здоровье** — медицинское страхование, врачи, лекарства, оценка инвалидности
5. **Жильё** — аренда, государственная поддержка, экстренное размещение
6. **Социальная поддержка** — социальные пособия, семейная поддержка, защита от насилия

Просто напишите ваш вопрос, и я сделаю всё возможное, чтобы помочь!`,
};

const CHAT_LANGUAGES = [
  { code: "bg", flag: "🇧🇬", label: "BG - Български" },
  { code: "ar", flag: "🇸🇦", label: "AR - العربية" },
  { code: "en", flag: "🇬🇧", label: "EN - English" },
  { code: "fa", flag: "🇮🇷", label: "FA - فارسی" },
  { code: "fr", flag: "🇫🇷", label: "FR - Français" },
  { code: "ru", flag: "🇷🇺", label: "RU - Русский" },
  { code: "ua", flag: "🇺🇦", label: "UA - Українська" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getWebSpeechAPI(): any {
  if (typeof window === "undefined") return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition ?? null;
}

type ChatPanelProps = {
  open: boolean;
  onClose: () => void;
};

export function ChatPanel({ open, onClose }: ChatPanelProps) {
  const { language, setLanguage, t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [inputValue, setInputValue] = useState("");
  const [chatLang, setChatLang] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [hasSpeechAPI, setHasSpeechAPI] = useState(false);

  const effectiveLang = chatLang ?? language ?? "en";

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { language: effectiveLang },
      }),
    [effectiveLang]
  );

  const {
    messages,
    status,
    sendMessage,
    stop,
    setMessages,
    error,
  } = useChat({ transport });

  const isStreaming = status === "streaming" || status === "submitted";

  useEffect(() => {
    setHasSpeechAPI(getWebSpeechAPI() !== null);
  }, []);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        const input = document.querySelector<HTMLInputElement>('input[name="message"]');
        input?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, status]);

  useEffect(() => {
    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      recognitionRef.current?.abort();
      mediaRecorderRef.current?.stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function scrollToBottom() {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(distanceFromBottom > 100);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text || isStreaming) return;
    sendMessage({ text });
    setInputValue("");
  }

  function handleReset() {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
    }
    setListening(false);
    setRecording(false);
    setTranscribing(false);
    setInputValue("");
    setChatLang(null);
    stop();
    setMessages([]);
  }

  const startWebSpeech = useCallback(() => {
    const SpeechRecognition = getWebSpeechAPI();
    if (!SpeechRecognition) return false;

    const recognition = new SpeechRecognition();
    recognition.lang = SPEECH_LANG_MAP[effectiveLang] ?? "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    let finalTranscript = "";

    const resetSilenceTimer = () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        recognition.stop();
      }, 3000);
    };

    recognition.onresult = (event: { results: SpeechRecognitionResultList }) => {
      let interim = "";
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }
      setInputValue(finalTranscript + interim);
      resetSilenceTimer();
    };

    recognition.onerror = () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      setListening(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      setListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
    resetSilenceTimer();
    return true;
  }, [effectiveLang]);

  const startWhisperRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        setRecording(false);

        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        if (audioBlob.size < 100) return;

        setTranscribing(true);
        try {
          const formData = new FormData();
          formData.append("audio", audioBlob);
          const res = await fetch("/api/speech", { method: "POST", body: formData });
          const data = await res.json();
          if (data.text) {
            setInputValue((prev) => prev + data.text);
          }
        } catch (err) {
          console.error("Transcription failed:", err);
        } finally {
          setTranscribing(false);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Microphone access denied:", err);
    }
  }, []);

  const toggleMic = useCallback(() => {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    if (recording) {
      mediaRecorderRef.current?.stop();
      return;
    }

    if (hasSpeechAPI) {
      startWebSpeech();
    } else {
      startWhisperRecording();
    }
  }, [listening, recording, hasSpeechAPI, startWebSpeech, startWhisperRecording]);

  function getMessageText(msg: (typeof messages)[number]): string {
    return (
      msg.parts
        ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
        .map((p) => p.text)
        .join("") ?? ""
    );
  }

  if (!open) return null;

  const micActive = listening || recording;
  const micBusy = micActive || transcribing;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white shadow-2xl sm:left-auto sm:w-[55%] sm:min-w-[420px] sm:max-w-2xl">
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
          onClick={handleReset}
          title={t("newChat")}
          className="rounded-full p-1.5 transition-colors hover:bg-white/20"
        >
          <RotateCcw className="size-5" />
        </button>
        <button
          onClick={onClose}
          className="rounded-full p-1.5 transition-colors hover:bg-white/20"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4"
      >
        <div className="flex flex-col gap-3">
          {messages.length === 0 && (
            <div className="py-8 text-center">
              <p className="mb-4 text-sm leading-relaxed text-slate-600">
                {t("chatEmptyGreeting")}
              </p>
              <p className="mb-3 text-xs font-medium text-slate-400">
                {t("chatChooseLanguage")}
              </p>
              <div className="mx-auto inline-flex flex-col gap-1.5 text-left text-sm">
                {CHAT_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setChatLang(lang.code);
                      if (lang.code === "en" || lang.code === "bg" || lang.code === "ua") {
                        setLanguage(lang.code);
                      }
                      const welcome = CHAT_WELCOME[lang.code] ?? CHAT_WELCOME.en;
                      setMessages([{
                        id: `welcome-${Date.now()}`,
                        role: "assistant",
                        parts: [{ type: "text", text: welcome }],
                      }]);
                    }}
                    className="rounded-lg px-3 py-1.5 text-left text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
                  >
                    {lang.flag} {lang.label}
                  </button>
                ))}
              </div>
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
                    <div className="prose prose-sm prose-slate max-w-none [&_a]:text-blue-600 [&_a]:underline [&_a]:break-all [&_strong]:font-semibold [&_h2]:mt-3 [&_h2]:mb-1 [&_h2]:text-sm [&_h2]:font-bold [&_h3]:mt-2 [&_h3]:mb-1 [&_h3]:text-sm [&_h3]:font-semibold [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: ({ href, children }) => (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline hover:text-blue-800"
                            >
                              {children}
                            </a>
                          ),
                        }}
                      >
                        {text}
                      </ReactMarkdown>
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

        {showScrollBtn && (
          <button
            type="button"
            onClick={scrollToBottom}
            className="sticky bottom-2 left-1/2 z-10 mx-auto flex size-8 -translate-x-1/2 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-colors hover:bg-blue-700"
          >
            <ArrowDown className="size-4" />
          </button>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 p-3">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            name="message"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              listening
                ? t("listening")
                : recording
                  ? t("recording")
                  : transcribing
                    ? t("transcribing")
                    : t("typePlaceholder")
            }
            disabled={isStreaming}
            className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
          />
          {!isStreaming && (
            <button
              type="button"
              onClick={toggleMic}
              disabled={transcribing}
              title={micActive ? t("stopRecording") : t("startListening")}
              className={`flex size-10 shrink-0 items-center justify-center rounded-full transition-colors ${
                micActive
                  ? "animate-pulse bg-red-500 text-white hover:bg-red-600"
                  : transcribing
                    ? "bg-slate-200 text-slate-400"
                    : "bg-slate-200 text-slate-600 hover:bg-slate-300"
              }`}
            >
              {transcribing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : micActive ? (
                <MicOff className="size-4" />
              ) : (
                <Mic className="size-4" />
              )}
            </button>
          )}
          {isStreaming ? (
            <button
              type="button"
              onClick={stop}
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600"
            >
              <Square className="size-3.5" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={micBusy || !inputValue.trim()}
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:opacity-40"
            >
              <Send className="size-4" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
