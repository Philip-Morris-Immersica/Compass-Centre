"use client";

import { ArrowLeft, X } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { services, type ServiceId } from "@/lib/services-data";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type ServiceDetailProps = {
  serviceId: ServiceId;
  onBack: () => void;
  onClose: () => void;
  onAskChatbot: () => void;
};

export function ServiceDetail({
  serviceId,
  onBack,
  onClose,
  onAskChatbot,
}: ServiceDetailProps) {
  const { t, language } = useLanguage();
  const service = services.find((s) => s.id === serviceId);
  if (!service || !language) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-t-2xl bg-white shadow-2xl sm:max-h-[85vh] sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 pt-5 pb-3 sm:px-8 sm:pt-6 sm:pb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
          >
            <ArrowLeft className="size-4" />
            {t("backToCategories")}
          </button>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <ScrollArea className="flex-1 px-5 py-4 sm:px-8 sm:py-6">
          <h2 className="mb-3 text-lg font-bold text-slate-800 sm:mb-4 sm:text-xl">
            {service.title[language]}
          </h2>

          <p className="mb-4 text-sm leading-relaxed text-slate-600 sm:mb-6">
            {service.description[language]}
          </p>

          {service.subcategories.map((sub, si) => (
            <div key={si} className="mb-5 sm:mb-6">
              <h3 className="mb-2 text-sm font-semibold text-slate-700 sm:mb-3 sm:text-base">
                {sub.title[language]}
              </h3>
              <ul className="space-y-1.5 sm:space-y-2">
                {sub.questions.map((q, qi) => (
                  <li
                    key={qi}
                    className="flex items-start gap-2 text-[13px] text-slate-600 sm:text-sm"
                  >
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-blue-500 sm:size-2" />
                    <span>{q[language]}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </ScrollArea>

        {/* Footer */}
        <div className="border-t border-slate-100 px-5 py-3 text-center sm:px-8 sm:py-4">
          <Button
            onClick={onAskChatbot}
            className="bg-blue-600 px-5 py-2 text-sm text-white hover:bg-blue-700 sm:px-6"
            size="lg"
          >
            {t("askChatbot")}
          </Button>
        </div>
      </div>
    </div>
  );
}
