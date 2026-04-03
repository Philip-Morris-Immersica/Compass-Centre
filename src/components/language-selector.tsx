"use client";

import { useLanguage } from "@/lib/language-context";
import { languages, type Language } from "@/lib/translations";

export function LanguageSelector() {
  const { setLanguage } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-xl rounded-t-2xl bg-white p-6 shadow-2xl sm:rounded-2xl sm:p-8">
        <h1 className="text-center text-xl font-bold text-slate-800 sm:text-2xl">
          Compass Centre – Virtual Support Station
        </h1>
        <p className="mt-2 text-center text-sm text-slate-500">
          Choose your language to continue.
        </p>

        <div className="mt-6 grid grid-cols-3 gap-2.5 sm:mt-8 sm:gap-3">
          {languages.map((lang) => (
            <button
              key={lang.code}
              disabled={!lang.available}
              onClick={() => {
                if (lang.available) setLanguage(lang.code as Language);
              }}
              className={`group relative flex flex-col items-center gap-1 rounded-xl border-2 px-3 py-4 text-center transition-all sm:px-4 sm:py-5 ${
                lang.available
                  ? "border-slate-200 bg-white hover:border-slate-400 hover:shadow-md cursor-pointer"
                  : "border-slate-100 bg-slate-50/50 cursor-not-allowed"
              }`}
            >
              <span
                className={`text-base font-bold sm:text-lg ${
                  lang.available ? "text-slate-700" : "text-slate-400"
                }`}
              >
                {lang.flag}
              </span>
              <span
                className={`text-xs sm:text-sm ${
                  lang.available ? "text-slate-600" : "text-slate-400"
                }`}
              >
                {lang.nativeLabel}
              </span>
              {!lang.available && (
                <span className="text-[10px] font-medium text-blue-400 sm:text-xs">
                  Coming soon
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
