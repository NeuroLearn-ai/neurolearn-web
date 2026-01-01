"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function GoogleSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    // 1. Grab the token from the URL (sent by backend)
    const token = searchParams.get("token");

    if (token) {
      // 2. Log the user in using our AuthContext
      // This saves it to localStorage and fetches the user data
      login(token)
        .catch((err) => {
            console.error("Failed to verify Google token", err);
            router.push("/login?error=google_failed");
        });
    } else {
      // If no token found, something went wrong
      router.push("/login?error=no_token");
    }
  }, [searchParams, login, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg-main)]">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent"></div>
      <p className="mt-4 text-[var(--text-muted)]">Finalizing secure login...</p>
    </div>
  );
}