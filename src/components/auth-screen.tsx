"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/language-context";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type Mode = "login" | "register";

const errorKeyMap: Record<string, string> = {
  email_exists: "errorEmailExists",
  invalid_credentials: "errorInvalidCredentials",
  server_error: "errorServerError",
};

export function AuthScreen() {
  const { t } = useLanguage();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (mode === "register" && !name.trim()) {
      setError(t("errorFieldsRequired"));
      return;
    }
    if (!email.trim() || !password) {
      setError(t("errorFieldsRequired"));
      return;
    }
    if (password.length < 6) {
      setError(t("errorPasswordShort"));
      return;
    }

    setLoading(true);

    let err: string | null;
    if (mode === "register") {
      err = await register(name.trim(), email.trim(), password);
    } else {
      err = await login(email.trim(), password);
    }

    setLoading(false);

    if (err) {
      const translationKey = errorKeyMap[err];
      setError(translationKey ? t(translationKey) : t("errorServerError"));
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md rounded-t-2xl bg-white p-6 shadow-2xl sm:rounded-2xl sm:p-8">
        <h1 className="text-center text-lg font-bold text-slate-800 sm:text-xl">
          {t("authTitle")}
        </h1>
        <p className="mt-1 text-center text-sm text-slate-500">
          {t("authSubtitle")}
        </p>

        {/* Tabs */}
        <div className="mt-5 flex rounded-lg bg-slate-100 p-1 sm:mt-6">
          <button
            onClick={() => {
              setMode("login");
              setError(null);
            }}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              mode === "login"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t("loginTab")}
          </button>
          <button
            onClick={() => {
              setMode("register");
              setError(null);
            }}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              mode === "register"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t("registerTab")}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-3.5 sm:mt-6 sm:space-y-4">
          {mode === "register" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                {t("nameLabel")}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("namePlaceholder")}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                autoComplete="name"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              {t("emailLabel")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              {t("passwordLabel")}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("passwordPlaceholder")}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              autoComplete={mode === "register" ? "new-password" : "current-password"}
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 py-2.5 text-white hover:bg-blue-700"
            size="lg"
          >
            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
            {mode === "login" ? t("loginButton") : t("registerButton")}
          </Button>
        </form>
      </div>
    </div>
  );
}
