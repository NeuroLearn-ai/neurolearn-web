"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function TokenHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 1. Get token from URL (sent by backend)
    const token = searchParams.get("token");

    if (token) {
      // 2. Save it to LocalStorage (The browser's pocket)
      localStorage.setItem("token", token);
      
      // 3. Redirect to the Dashboard
      router.push("/dashboard");
    } else {
      // If no token, something went wrong
      router.push("/login?error=auth_failed");
    }
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mb-4"></div>
        <p className="text-xl">Finalizing Secure Login...</p>
      </div>
    </div>
  );
}

// Next.js requires us to wrap useSearchParams in Suspense
export default function GoogleSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TokenHandler />
    </Suspense>
  );
}