"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { Link } from "lucide-react";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-text-main">Knowledge Graph</h1>
          <p className="text-text-muted">Manage your learning nodes</p>
        </div>
        <Link href="/notes/create">
          <Button variant="primary" icon={<span>+</span>}>
            New Note
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example Note Card 1 */}
        <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
          <h3 className="text-xl font-semibold text-text-main group-hover:text-primary transition-colors">
            Python Basics
          </h3>
          <p className="text-text-muted mt-2 line-clamp-3">
            Variables are containers for storing data values. Python has no command for declaring a variable.
          </p>
          <div className="mt-4 flex gap-2">
            <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-xs">Coding</span>
            <span className="px-2 py-1 rounded bg-green-500/10 text-green-400 text-xs">Easy</span>
          </div>
        </Card>

        {/* Example Note Card 2 */}
        <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
          <h3 className="text-xl font-semibold text-text-main group-hover:text-primary transition-colors">
            Cognitive Dissonance
          </h3>
          <p className="text-text-muted mt-2 line-clamp-3">
            The mental discomfort experienced by a person who holds two or more contradictory beliefs, ideas, or values.
          </p>
          <div className="mt-4 flex gap-2">
            <span className="px-2 py-1 rounded bg-purple-500/10 text-purple-400 text-xs">Psychology</span>
          </div>
        </Card>
      </div>
    </div>
  );
}