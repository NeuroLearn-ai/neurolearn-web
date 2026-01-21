"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Book, Calendar } from "lucide-react";

interface Note {
  id: number;
  title: string;
  created_at: string;
}

export default function NotesPage() {
  const { authFetch } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await authFetch("/notes");
        if (res.ok) {
          const data = await res.json();
          setNotes(data);
        }
      } catch (error) {
        console.error("Failed to fetch notes", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [authFetch]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[var(--text-main)]">Your Notes</h1>
        <Link 
          href="/notes/create"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 transition"
        >
          + New Note
        </Link>
      </div>

      {notes.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          <p>You have not created any notes yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Link 
              key={note.id} 
              href={`/notes/${note.id}`}
              className="group relative block overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6 transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10"
            >
              <div className="flex items-start justify-between">
                <div className="rounded-lg bg-blue-500/10 p-3 text-blue-500">
                  <Book size={24} />
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-semibold text-[var(--text-main)] group-hover:text-blue-500 transition-colors">
                  {note.title || "Untitled Note"}
                </h3>
                <div className="mt-2 flex items-center text-sm text-[var(--text-muted)]">
                  <Calendar size={14} className="mr-2" />
                  {new Date(note.created_at).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}