"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import {
  login as loginAction,
  register as registerAction,
  logout as logoutAction,
  getSession,
} from "@/app/actions/auth";

export type User = {
  userId: number;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (name: string, email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession().then((session) => {
      if (session) setUser(session);
      setLoading(false);
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginAction(email, password);
    if (result.success) {
      setUser(result.user);
      return null;
    }
    return result.error;
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const result = await registerAction(name, email, password);
      if (result.success) {
        setUser(result.user);
        return null;
      }
      return result.error;
    },
    []
  );

  const logout = useCallback(async () => {
    await logoutAction();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
