"use client";

import { X } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { services, type ServiceId } from "@/lib/services-data";

type ServicesModalProps = {
  open: boolean;
  onClose: () => void;
  onSelectService: (id: ServiceId) => void;
};

export function ServicesModal({ open, onClose, onSelectService }: ServicesModalProps) {
  const { t, language } = useLanguage();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between sm:mb-6">
          <h2 className="text-lg font-bold text-slate-800 sm:text-xl">{t("servicesTitle")}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => onSelectService(service.id)}
              className="flex items-center justify-center rounded-xl border-2 border-slate-200 bg-white px-3 py-4 text-center text-xs font-medium text-slate-700 transition-all hover:border-slate-400 hover:shadow-md sm:px-4 sm:py-6 sm:text-sm"
            >
              {language ? service.title[language] : service.title.en}
            </button>
          ))}
        </div>

        <p className="mt-4 text-center text-xs text-blue-500 sm:mt-5">
          {t("servicesTip")}
        </p>
      </div>
    </div>
  );
}
