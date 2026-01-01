"use client";  
// Using this makes this a Client Component which allows us to use hooks like useState and useSearchParams
// Client Component - code runs in the browser, not on the server
// Server Components - code runs on the server (cannot use hooks like useState or useSearchParams)

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";

// ----------------------------------------------------------------------
// 1. THE INTERNAL COMPONENT (Uses useSearchParams)
// ----------------------------------------------------------------------
function LoginForm() {
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const searchParams = useSearchParams(); // <--- This hook causes the build error if not suspended
  
  // Logic: Check URL for "?mode=register"
  const isRegisterMode = searchParams.get("mode") === "register";
  
  // State
  const [isLogin, setIsLogin] = useState(!isRegisterMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        // --- LOGIN LOGIC (Unchanged) ---
        const formData = new URLSearchParams();
        formData.append("username", email);
        formData.append("password", password);

        const res = await fetch(`${backendURL}/auth/login`, {
          credentials: "include",
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.detail || "Login failed");
        }

        const data = await res.json();
        login(data.access_token);

      } else {
        // --- REGISTER LOGIC (Updated) ---
        const res = await fetch(`${backendURL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
          const data = await res.json();
          const errorMsg = data.detail || "";

          // 👇 FIXED: Use .includes() for safer matching
          if (errorMsg.includes("already registered")) {
            setError("Account exists! Switching you to Log In...");
            
            // Wait 1.5s then switch tabs
            setTimeout(() => {
              setIsLogin(true); // Switch to Login Tab
              setError("");     // Clear the error message
              setPassword("");  // Clear password for security (keep email)
            }, 1500);
            
            return; // <--- Stop here! Don't throw an error.
          }
          
          // Only throw if it's a REAL error (not just a duplicate user)
          throw new Error(errorMsg || "Registration failed");
        }

        alert("Account created! Please log in.");
        setIsLogin(true);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md space-y-8 bg-[var(--bg-card)]/80 backdrop-blur-md border-[var(--border)]">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-[var(--text-main)]">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          {isLogin ? "Access your NeuroLearn graph" : "Start building your second brain"}
        </p>
      </div>

      <div className="space-y-6">
        {/* Google OAuth Login */}
        <a href={`${backendURL}/auth/login/google`} className="block w-full">
          <Button variant="outline" type="button" className="w-full justify-center py-4 border-gray-600 hover:bg-gray-700 text-main" icon={<span>G</span>}>
            Continue with Google
          </Button>
        </a>

        {/* Normal Email/Password Login */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[var(--border)]"></span>
          </div>
          <div className="relative bg-[var(--bg-card)] px-2 text-xs uppercase text-[var(--text-muted)]">
            Or continue with email
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
              {error}
            </div>
          )}

          <Input 
            type="email" 
            placeholder="name@example.com" 
            label="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input 
            type="password" 
            placeholder="••••••••" 
            label="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 mt-4" 
            isLoading={loading}
            type="submit"
          >
            {isLogin ? "Sign In" : "Create Account"}
          </Button>

          <div className="text-center text-sm">
            <span className="text-[var(--text-muted)]">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button 
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(""); 
              }}
              className="text-blue-400 hover:text-blue-300 font-semibold"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </div>
        </form>
      </div>
    </Card>
  );
}

// ----------------------------------------------------------------------
// 2. THE MAIN EXPORT (Wraps logic in Suspense)
// ----------------------------------------------------------------------
export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[var(--bg-main)]">
      {/* Background Blob */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[120px]" />

      <Suspense fallback={<div className="text-white">Loading login form...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}