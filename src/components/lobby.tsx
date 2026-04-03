"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { useAuth } from "@/lib/auth-context";
import { type ServiceId } from "@/lib/services-data";
import { LanguageSwitcher } from "./language-switcher";
import { SpeechBubble } from "./speech-bubble";
import { WallPictures } from "./wall-pictures";
import { ServicesModal } from "./services-modal";
import { ServiceDetail } from "./service-detail";
import { ChatPanel } from "./chat-panel";
import { ChatbotIcon } from "./chatbot-icon";

type ModalView =
  | { type: "none" }
  | { type: "services" }
  | { type: "detail"; serviceId: ServiceId };

export function Lobby() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const [modalView, setModalView] = useState<ModalView>({ type: "none" });
  const [chatOpen, setChatOpen] = useState(false);

  function handleWallClick(id: ServiceId) {
    setModalView({ type: "detail", serviceId: id });
  }

  return (
    <div className="relative z-10 flex h-full flex-col">
      {/* Top bar: language switcher + user info */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between sm:top-4 sm:left-4 sm:right-4">
        <LanguageSwitcher />
        {user && (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="hidden rounded-lg bg-white/90 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-md backdrop-blur-sm sm:block">
              {user.name}
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-1 rounded-lg bg-white/90 px-2.5 py-1.5 text-sm text-slate-500 shadow-md backdrop-blur-sm transition-colors hover:bg-white hover:text-slate-700"
              title={t("logoutButton")}
            >
              <LogOut className="size-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Speech bubble — positioned center-left, at face height */}
      <div className="absolute top-[30%] left-4 z-20 sm:top-[25%] sm:left-8 md:left-[5%] lg:left-[8%]">
        <SpeechBubble />
      </div>

      {/* Categories — right side, full height */}
      <div className="absolute top-12 right-3 bottom-12 z-20 sm:top-12 sm:right-4 sm:bottom-12 md:right-6">
        <WallPictures onServiceClick={handleWallClick} />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom title — floating white text, no bar */}
      <div className="pb-4 text-center sm:pb-5">
        <h1 className="text-base font-bold tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] sm:text-xl md:text-2xl">
          {t("appTitle")}
        </h1>
      </div>

      {/* Chatbot FAB */}
      {!chatOpen && <ChatbotIcon onClick={() => setChatOpen(true)} />}

      {/* Modals */}
      <ServicesModal
        open={modalView.type === "services"}
        onClose={() => setModalView({ type: "none" })}
        onSelectService={(id) => setModalView({ type: "detail", serviceId: id })}
      />

      {modalView.type === "detail" && (
        <ServiceDetail
          serviceId={modalView.serviceId}
          onBack={() => setModalView({ type: "services" })}
          onClose={() => setModalView({ type: "none" })}
          onAskChatbot={() => {
            setModalView({ type: "none" });
            setChatOpen(true);
          }}
        />
      )}

      {/* Chat panel */}
      <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
