"use client";

import Image from "next/image";
import { LanguageProvider, useLanguage } from "@/lib/language-context";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { LanguageSelector } from "@/components/language-selector";
import { AuthScreen } from "@/components/auth-screen";
import { Lobby } from "@/components/lobby";

function AppContent() {
  const { language } = useLanguage();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  // Step 1: Choose language
  if (!language) {
    return <LanguageSelector />;
  }

  // Step 2: Login / Register (skip if already logged in)
  if (!user) {
    return <AuthScreen />;
  }

  // Step 3: Main lobby
  return <Lobby />;
}

export default function Home() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <div className="relative h-screen w-full overflow-hidden">
          {/* Office background — always visible */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/compass-reception.png"
              alt=""
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-300 via-slate-100 to-amber-50" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" />
          </div>

          <AppContent />
        </div>
      </AuthProvider>
    </LanguageProvider>
  );
}
