"use client";

import * as React from "react";
import { UserProfile } from "@/types";

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string; user?: UserProfile }>;
  register: (data: { name: string; email: string; phone: string; password?: string }) => Promise<{ success: boolean; error?: string; user?: UserProfile }>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = "apex_auth_user_v1";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Read initial user from localStorage immediately
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore parsing error
    }

    // Sync with server session
    async function syncUser() {
      try {
        const res = await fetch("/api/auth");
        const data = await res.json();
        if (data.success && data.data) {
          setUser(data.data);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.data));
        } else if (!data.data) {
          const stored = localStorage.getItem(USER_STORAGE_KEY);
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              if (parsed && parsed.email) {
                // Re-sync server store with active client user
                await fetch("/api/auth", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email: parsed.email }),
                });
                setUser(parsed);
              }
            } catch {
              localStorage.removeItem(USER_STORAGE_KEY);
            }
          }
        }
      } catch {
        // network error
      } finally {
        setIsLoading(false);
      }
    }

    syncUser();
  }, []);

  const login = async (email: string, password?: string) => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setUser(data.data);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.data));
        return { success: true, user: data.data };
      }
      return { success: false, error: data.error || "Login failed" };
    } catch {
      return { success: false, error: "Network error during authentication" };
    }
  };

  const register = async (data: { name: string; email: string; phone: string; password?: string }) => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
        }),
      });
      const resData = await res.json();
      if (resData.success && resData.data) {
        setUser(resData.data);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(resData.data));
        return { success: true, user: resData.data };
      }
      return { success: false, error: resData.error || "Registration failed" };
    } catch {
      return { success: false, error: "Network error during registration" };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth", { method: "DELETE" });
    } catch {
      // ignore
    } finally {
      setUser(null);
      localStorage.removeItem(USER_STORAGE_KEY);
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
