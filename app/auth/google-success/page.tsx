"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

function GoogleSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      login(token).catch((err) => {
        console.error("Google login failed", err);
        router.push("/login?error=google_failed");
      });
    } else {
      router.push("/login?error=no_token");
    }
  }, [searchParams, login, router]);

  return (
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="text-text-muted">Finalizing secure login...</p>
    </div>
  );
}

export default function GoogleSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-main">
      <Suspense fallback={<div className="text-text-muted">Loading authentication...</div>}>
        <GoogleSuccessContent />
      </Suspense>
    </div>
  );
}