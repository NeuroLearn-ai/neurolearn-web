"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  email: string;
  name?: string;
  avatar_url?: string;
  provider: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  authFetch: (endpoint: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const fetchUser = useCallback(async (token: string) => {
    try {
      const res = await fetch(`${backendURL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else {
        localStorage.removeItem("token");
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed", error);
      setUser(null);
    }
  }, [backendURL]);

  useEffect(() => {
    async function initAuth() {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      await fetchUser(token);
      setLoading(false);
    }

    initAuth();
  }, [fetchUser]);

  const login = useCallback(async (token: string) => {
    localStorage.setItem("token", token);
    await fetchUser(token);
    router.push("/dashboard");
    router.refresh(); 
  }, [fetchUser, router]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
    router.refresh();
  }, [router]);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (token) await fetchUser(token);
  }, [fetchUser]);

  // Authenticated fetch wrapper ( can be used for API calls requiring auth )
  const authFetch = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("token");
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };

    return fetch(`${backendURL}${endpoint}`, { ...options, headers });
  }, [backendURL]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}