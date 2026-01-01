"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  email: string;
  provider: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // 1. Check Token on Load
  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Validate with Backend
        const res = await fetch(`${backendURL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          // Token invalid/expired
          localStorage.removeItem("token");
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check failed", error);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [backendURL]);

  // 2. Login Helper
  const login = (token: string) => {
    localStorage.setItem("token", token);
    // We could fetch user details here immediately, 
    // but for now let's just reload or redirect
    router.push("/dashboard");
    router.refresh(); 
  };

  // 3. Logout Helper
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
    router.refresh();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook for easy access
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}